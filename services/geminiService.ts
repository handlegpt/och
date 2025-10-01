import { GoogleGenAI, Modality } from '@google/genai'
import type { GeneratedContent } from '../types'
import { generationRateLimiter, getUserIdentifier } from '../src/services/rateLimiter'
import { withCostControl } from '../src/services/costControl'

// 支持多种环境变量名称
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY

// 延迟初始化AI实例，只在需要时检查API密钥
let ai: GoogleGenAI | null = null

const getAI = () => {
  if (!ai) {
    if (!apiKey) {
      throw new Error('API_KEY or GEMINI_API_KEY environment variable is not set.')
    }
    ai = new GoogleGenAI({ apiKey })
  }
  return ai
}

export async function editImage(
  base64ImageData: string,
  mimeType: string,
  prompt: string,
  maskBase64: string | null,
  secondaryImage: { base64: string; mimeType: string } | null,
  userId?: string
): Promise<GeneratedContent> {
  // 速率限制检查
  const identifier = getUserIdentifier(userId)
  const limitResult = await generationRateLimiter.checkLimit(identifier)

  if (!limitResult.allowed) {
    const error = new Error(`Rate limit exceeded. Try again in ${limitResult.retryAfter} seconds.`)
    ;(error as any).statusCode = 429
    ;(error as any).retryAfter = limitResult.retryAfter
    throw error
  }

  // 成本控制检查
  if (userId) {
    const costResult = await withCostControl(userId, 'IMAGE_EDIT', async () => {
      // 实际的API调用逻辑将在下面执行
      return null
    })

    if (!costResult.success) {
      const error = new Error(`Cost limit exceeded: ${costResult.error}`)
      ;(error as any).statusCode = 402 // Payment Required
      throw error
    }
  }

  try {
    let fullPrompt = prompt
    const parts: any[] = [
      {
        inlineData: {
          data: base64ImageData,
          mimeType: mimeType,
        },
      },
    ]

    if (maskBase64) {
      parts.push({
        inlineData: {
          data: maskBase64,
          mimeType: 'image/png',
        },
      })
      fullPrompt = `Apply the following instruction only to the masked area of the image: "${prompt}". Preserve the unmasked area.`
    }

    if (secondaryImage) {
      parts.push({
        inlineData: {
          data: secondaryImage.base64,
          mimeType: secondaryImage.mimeType,
        },
      })
    }

    parts.push({ text: fullPrompt })

    // 添加超时机制 (5分钟)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout after 5 minutes')), 5 * 60 * 1000)
    )

    const response = (await Promise.race([
      getAI().models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      }),
      timeoutPromise,
    ])) as any

    const result: GeneratedContent = { imageUrl: null, text: null }
    const responseParts = response.candidates?.[0]?.content?.parts

    if (responseParts) {
      for (const part of responseParts) {
        if (part.text) {
          result.text = (result.text ? result.text + '\n' : '') + part.text
        } else if (part.inlineData) {
          result.imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
        }
      }
    }

    if (!result.imageUrl) {
      let errorMessage
      if (result.text) {
        errorMessage = `The model responded: "${result.text}"`
      } else {
        const finishReason = response.candidates?.[0]?.finishReason
        const safetyRatings = response.candidates?.[0]?.safetyRatings
        errorMessage =
          'The model did not return an image. It might have refused the request. Please try a different image or prompt.'

        if (finishReason === 'SAFETY') {
          const blockedCategories = safetyRatings
            ?.filter(r => r.blocked)
            .map(r => r.category)
            .join(', ')
          errorMessage = `The request was blocked for safety reasons. Categories: ${blockedCategories || 'Unknown'}. Please modify your prompt or image.`
        }
      }
      throw new Error(errorMessage)
    }

    // 记录成功的请求
    await generationRateLimiter.recordRequest(identifier)

    return result
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    if (error instanceof Error) {
      let errorMessage = error.message
      try {
        const parsedError = JSON.parse(errorMessage)
        if (parsedError.error && parsedError.error.message) {
          if (parsedError.error.status === 'RESOURCE_EXHAUSTED') {
            errorMessage =
              "You've likely exceeded the request limit. Please wait a moment before trying again."
          } else if (parsedError.error.code === 500 || parsedError.error.status === 'UNKNOWN') {
            errorMessage =
              'An unexpected server error occurred. This might be a temporary issue. Please try again in a few moments.'
          } else {
            errorMessage = parsedError.error.message
          }
        }
      } catch {
        // Ignore parsing errors
      }
      throw new Error(errorMessage)
    }
    throw new Error('An unknown error occurred while communicating with the API.')
  }
}

export async function generateVideo(
  prompt: string,
  image: { base64: string; mimeType: string } | null,
  aspectRatio: '16:9' | '9:16',
  onProgress: (message: string) => void,
  userId?: string
): Promise<string> {
  // 视频生成权限检查
  if (userId) {
    const { VideoPermissionService } = await import('../src/services/videoPermissionService')
    const permission = await VideoPermissionService.checkVideoPermission(userId)

    if (!permission.allowed) {
      const error = new Error(permission.reason || 'Video generation not allowed')
      ;(error as any).statusCode = 403
      throw error
    }
  }

  // 速率限制检查
  const identifier = getUserIdentifier(userId)
  const limitResult = await generationRateLimiter.checkLimit(identifier)

  if (!limitResult.allowed) {
    const error = new Error(`Rate limit exceeded. Try again in ${limitResult.retryAfter} seconds.`)
    ;(error as any).statusCode = 429
    ;(error as any).retryAfter = limitResult.retryAfter
    throw error
  }
  try {
    onProgress('Initializing video generation...')

    // FIX: The `request` object was explicitly typed as `any`, which caused a loss of type
    // information for the `operation` variable returned by `generateVideos`. This could lead
    // to a TypeScript error. By allowing TypeScript to infer the type, we ensure
    // `operation` is correctly typed, resolving the error.
    const request = {
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        aspectRatio: aspectRatio,
      },
      ...(image && {
        image: {
          imageBytes: image.base64,
          mimeType: image.mimeType,
        },
      }),
    }

    let operation = await getAI().models.generateVideos(request)

    onProgress('Polling for results, this may take a few minutes...')

    // 添加超时机制 (15分钟)
    const startTime = Date.now()
    const maxWaitTime = 15 * 60 * 1000 // 15分钟

    while (!operation.done) {
      // 检查是否超时
      if (Date.now() - startTime > maxWaitTime) {
        throw new Error('Video generation timeout after 15 minutes')
      }

      await new Promise(resolve => setTimeout(resolve, 10000))
      operation = await getAI().operations.getVideosOperation({ operation: operation })
    }

    if (operation.error) {
      throw new Error(
        String(operation.error.message) || 'Video generation failed during operation.'
      )
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri

    if (!downloadLink) {
      throw new Error('Video generation completed, but no download link was found.')
    }

    // 记录成功的请求
    await generationRateLimiter.recordRequest(identifier)

    return `${downloadLink}&key=${apiKey}`
  } catch (error) {
    console.error('Error calling Video Generation API:', error)
    if (error instanceof Error) {
      let errorMessage = error.message
      try {
        const parsedError = JSON.parse(errorMessage)
        if (parsedError.error && parsedError.error.message) {
          errorMessage = parsedError.error.message
        }
      } catch {
        // Ignore parsing errors
      }
      throw new Error(errorMessage)
    }
    throw new Error('An unknown error occurred during video generation.')
  }
}

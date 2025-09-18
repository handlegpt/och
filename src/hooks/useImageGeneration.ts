import { useCallback } from 'react'
import { editImage } from '../../services/geminiService'
import { DataPersistenceService } from '../services/dataPersistence'
import { validatePrompt, generationRateLimiter } from '../utils/security'
import { loadImage, resizeImageToMatch, embedWatermark } from '../../utils/fileUtils'
// import type { GeneratedContent, Transformation } from '../../types';
import type { GenerationState, GenerationActions } from './useGenerationState'

interface UseImageGenerationProps {
  state: GenerationState
  actions: GenerationActions
  user: any
  t: (key: string) => string
}

export const useImageGeneration = ({ state, actions, user, t }: UseImageGenerationProps) => {
  const { primaryImageUrl, secondaryImageUrl, selectedTransformation, maskDataUrl, customPrompt } =
    state

  const { setError, setIsLoading, setLoadingMessage, setGeneratedContent, addToHistory } = actions

  const handleGenerateImage = useCallback(async () => {
    if (!primaryImageUrl || !selectedTransformation) {
      setError(t('app.error.uploadAndSelect'))
      return
    }

    if (
      selectedTransformation.isMultiImage &&
      !selectedTransformation.isSecondaryOptional &&
      !secondaryImageUrl
    ) {
      setError(t('app.error.uploadBoth'))
      return
    }

    const promptToUse =
      selectedTransformation.prompt === 'CUSTOM' ? customPrompt : selectedTransformation.prompt

    // 验证提示词
    const promptValidation = validatePrompt(promptToUse)
    if (!promptValidation.isValid) {
      setError(promptValidation.error || '提示词验证失败')
      return
    }

    // 速率限制检查
    const userIdentifier = user?.id || 'anonymous'
    if (!generationRateLimiter.isAllowed(userIdentifier)) {
      setError('生成请求过于频繁，请稍后再试')
      return
    }

    setIsLoading(true)
    setError(null)
    setGeneratedContent(null)
    setLoadingMessage('')
    const startTime = Date.now()

    try {
      const primaryMimeType = (primaryImageUrl || '').split(';')[0].split(':')[1] ?? 'image/png'
      const primaryBase64 = (primaryImageUrl || '').split(',')[1]
      const maskBase64 = maskDataUrl ? maskDataUrl.split(',')[1] : null

      // 使用验证后的提示词
      const sanitizedPrompt = promptValidation.sanitizedValue || promptToUse

      if (selectedTransformation.isTwoStep) {
        setLoadingMessage(t('app.loading.step1'))
        const stepOneResult = await editImage(
          primaryBase64,
          primaryMimeType,
          sanitizedPrompt,
          null,
          null,
          user?.id
        )

        if (!stepOneResult.imageUrl)
          throw new Error('Step 1 (line art) failed to generate an image.')

        setLoadingMessage(t('app.loading.step2'))
        const stepOneImageBase64 = stepOneResult.imageUrl.split(',')[1]
        const stepOneImageMimeType =
          stepOneResult.imageUrl.split(';')[0].split(':')[1] ?? 'image/png'

        let secondaryImagePayload = null
        if (secondaryImageUrl) {
          const primaryImage = await loadImage(primaryImageUrl)
          const resizedSecondaryImageUrl = await resizeImageToMatch(secondaryImageUrl, primaryImage)
          const secondaryMimeType =
            resizedSecondaryImageUrl.split(';')[0].split(':')[1] ?? 'image/png'
          const secondaryBase64 = resizedSecondaryImageUrl.split(',')[1]
          secondaryImagePayload = { base64: secondaryBase64, mimeType: secondaryMimeType }
        }

        const stepTwoResult = await editImage(
          stepOneImageBase64,
          stepOneImageMimeType,
          sanitizedPrompt,
          null,
          secondaryImagePayload,
          user?.id
        )

        if (stepTwoResult.imageUrl) {
          stepTwoResult.imageUrl = await embedWatermark(stepTwoResult.imageUrl, 'Och AI')
        }

        const finalResult = { ...stepTwoResult, secondaryImageUrl: stepOneResult.imageUrl }
        setGeneratedContent(finalResult)
        addToHistory(finalResult)

        // 保存生成记录到数据库
        if (user) {
          await DataPersistenceService.saveGenerationRecord(
            user.id,
            selectedTransformation.key,
            primaryImageUrl,
            finalResult.imageUrl,
            sanitizedPrompt,
            customPrompt || null,
            1, // tokens_used
            Date.now() - startTime, // processing_time_ms
            'completed'
          )
        }
      } else {
        let secondaryImagePayload = null
        if (selectedTransformation.isMultiImage && secondaryImageUrl) {
          const secondaryMimeType = secondaryImageUrl.split(';')[0].split(':')[1] ?? 'image/png'
          const secondaryBase64 = secondaryImageUrl.split(',')[1]
          secondaryImagePayload = { base64: secondaryBase64, mimeType: secondaryMimeType }
        }

        setLoadingMessage(t('app.loading.default'))
        const result = await editImage(
          primaryBase64,
          primaryMimeType,
          sanitizedPrompt,
          maskBase64,
          secondaryImagePayload,
          user?.id
        )

        if (result.imageUrl) result.imageUrl = await embedWatermark(result.imageUrl, 'Och AI')

        setGeneratedContent(result)
        addToHistory(result)

        // 保存生成记录到数据库
        if (user) {
          await DataPersistenceService.saveGenerationRecord(
            user.id,
            selectedTransformation.key,
            primaryImageUrl,
            result.imageUrl,
            sanitizedPrompt,
            customPrompt || null,
            1, // tokens_used
            Date.now() - startTime, // processing_time_ms
            'completed'
          )
        }
      }
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : t('app.error.unknown'))
    } finally {
      setIsLoading(false)
      setLoadingMessage('')
    }
  }, [
    primaryImageUrl,
    secondaryImageUrl,
    selectedTransformation,
    maskDataUrl,
    customPrompt,
    user,
    t,
    setError,
    setIsLoading,
    setLoadingMessage,
    setGeneratedContent,
    addToHistory,
  ])

  return {
    handleGenerateImage,
  }
}

import { useCallback } from 'react'
import { generateVideo } from '../../services/geminiService'
import { VideoPermissionService } from '../services/videoPermissionService'
import type { GeneratedContent } from '../../types'
import type { GenerationState, GenerationActions } from './useGenerationState'

interface UseVideoGenerationProps {
  state: GenerationState
  actions: GenerationActions
  user: any
  t: (key: string) => string
}

export const useVideoGeneration = ({ state, actions, user, t }: UseVideoGenerationProps) => {
  const { selectedTransformation, customPrompt, primaryImageUrl, aspectRatio } = state

  const { setError, setIsLoading, setLoadingMessage, setGeneratedContent, addToHistory } = actions

  const handleGenerateVideo = useCallback(async () => {
    if (!selectedTransformation) return

    const promptToUse = customPrompt
    if (!promptToUse.trim()) {
      setError(t('app.error.enterPrompt'))
      return
    }

    // 检查视频生成权限
    if (user?.id) {
      try {
        const permission = await VideoPermissionService.checkVideoPermission(user.id)
        if (!permission.allowed) {
          setError(permission.reason || t('app.error.videoNotAllowed'))
          return
        }
      } catch (error) {
        console.error('Permission check failed:', error)
        setError(t('app.error.permissionCheckFailed'))
        return
      }
    }

    setIsLoading(true)
    setError(null)
    setGeneratedContent(null)

    try {
      let imagePayload = null
      if (primaryImageUrl) {
        const primaryMimeType = (primaryImageUrl || '').split(';')[0]?.split(':')[1] ?? 'image/png'
        const primaryBase64 = (primaryImageUrl || '').split(',')[1]
        imagePayload = { base64: primaryBase64, mimeType: primaryMimeType }
      }

      const videoDownloadUrl = await generateVideo(
        promptToUse,
        imagePayload,
        aspectRatio,
        message => setLoadingMessage(message), // Progress callback
        user?.id
      )

      setLoadingMessage(t('app.loading.videoFetching'))
      const response = await fetch(videoDownloadUrl)
      if (!response.ok) {
        throw new Error(`Failed to download video file. Status: ${response.statusText}`)
      }
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)

      const result: GeneratedContent = {
        imageUrl: null,
        text: null,
        videoUrl: objectUrl,
      }

      setGeneratedContent(result)
      addToHistory(result)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : t('app.error.unknown'))
    } finally {
      setIsLoading(false)
      setLoadingMessage('')
    }
  }, [
    selectedTransformation,
    customPrompt,
    primaryImageUrl,
    aspectRatio,
    user,
    t,
    setError,
    setIsLoading,
    setLoadingMessage,
    setGeneratedContent,
    addToHistory,
  ])

  return {
    handleGenerateVideo,
  }
}

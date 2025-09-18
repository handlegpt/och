import React from 'react'
import type { GenerationState } from '../hooks/useGenerationState'

interface GenerationControlsProps {
  state: GenerationState
  onGenerate: () => void
  onBackToSelection: () => void
  t: (key: string) => string
}

export const GenerationControls: React.FC<GenerationControlsProps> = ({
  state,
  onGenerate,
  onBackToSelection,
  t,
}) => {
  const { selectedTransformation, customPrompt, primaryImageUrl, secondaryImageUrl, isLoading } =
    state

  if (!selectedTransformation) return null

  const isCustomPromptEmpty = selectedTransformation.prompt === 'CUSTOM' && !customPrompt.trim()

  let isGenerateDisabled = true
  if (selectedTransformation.isVideo) {
    isGenerateDisabled = isLoading || !customPrompt.trim()
  } else {
    let imagesReady = false
    if (selectedTransformation.isMultiImage) {
      if (selectedTransformation.isSecondaryOptional) {
        imagesReady = !!primaryImageUrl
      } else {
        imagesReady = !!primaryImageUrl && !!secondaryImageUrl
      }
    } else {
      imagesReady = !!primaryImageUrl
    }
    isGenerateDisabled = isLoading || isCustomPromptEmpty || !imagesReady
  }

  return (
    <>
      {/* Back button */}
      <div className='mb-8'>
        <button
          onClick={onBackToSelection}
          className='flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-[rgba(107,114,128,0.1)]'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
              clipRule='evenodd'
            />
          </svg>
          {t('app.chooseAnotherEffect')}
        </button>
      </div>

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={isGenerateDisabled}
        className='w-full mt-6 py-3 px-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[var(--text-on-accent)] font-semibold rounded-lg shadow-lg shadow-[var(--accent-shadow)] hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)] disabled:bg-[var(--bg-disabled)] disabled:from-[var(--bg-disabled)] disabled:to-[var(--bg-disabled)] disabled:text-[var(--text-disabled)] disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2'
      >
        {isLoading ? (
          <>
            <svg
              className='animate-spin -ml-1 mr-2 h-5 w-5'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
            <span>{t('app.generating')}</span>
          </>
        ) : (
          <>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </svg>
            <span>{t('app.generateImage')}</span>
          </>
        )}
      </button>
    </>
  )
}

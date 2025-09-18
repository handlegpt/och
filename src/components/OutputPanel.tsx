import React from 'react'
import ResultDisplay from '../../components/ResultDisplay'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import type { GenerationState } from '../hooks/useGenerationState'

interface OutputPanelProps {
  state: GenerationState
  onUseImageAsInput: (imageUrl: string) => void
  onImageClick: (url: string) => void
  t: (key: string) => string
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  state,
  onUseImageAsInput,
  onImageClick,
  t,
}) => {
  const { isLoading, loadingMessage, error, generatedContent, primaryImageUrl } = state

  return (
    <div className='flex flex-col p-6 bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] shadow-2xl shadow-black/20'>
      <h2 className='text-xl font-semibold mb-4 text-[var(--accent-primary)] self-start'>
        {t('app.result')}
      </h2>

      {isLoading && (
        <div className='flex-grow flex items-center justify-center'>
          <LoadingSpinner message={loadingMessage} />
        </div>
      )}

      {error && (
        <div className='flex-grow flex items-center justify-center w-full'>
          <ErrorMessage message={error} />
        </div>
      )}

      {!isLoading && !error && generatedContent && (
        <ResultDisplay
          content={generatedContent}
          onUseImageAsInput={onUseImageAsInput}
          onImageClick={onImageClick}
          originalImageUrl={primaryImageUrl}
        />
      )}

      {!isLoading && !error && !generatedContent && (
        <div className='flex-grow flex flex-col items-center justify-center text-center text-[var(--text-tertiary)]'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='mx-auto h-12 w-12'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
          <p className='mt-2'>{t('app.yourImageWillAppear')}</p>
        </div>
      )}
    </div>
  )
}

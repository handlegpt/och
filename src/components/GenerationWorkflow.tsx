import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TransformationSelectorEnhanced } from './TransformationSelectorEnhanced';
import { InputPanel } from './InputPanel';
import { OutputPanel } from './OutputPanel';
// import { GenerationControls } from './GenerationControls';
import ImagePreviewModal from '../../components/ImagePreviewModal';
import { useImageGeneration } from '../hooks/useImageGeneration';
import { useVideoGeneration } from '../hooks/useVideoGeneration';
import { DotsLoader } from './ui/LoadingSpinner';
import type { GenerationState, GenerationActions } from '../hooks/useGenerationState';

interface GenerationWorkflowProps {
  state: GenerationState;
  actions: GenerationActions;
  user: any;
  t: (key: string) => string;
  onLoginRequired: () => void;
}

export const GenerationWorkflow: React.FC<GenerationWorkflowProps> = ({
  state,
  actions,
  user,
  t,
  onLoginRequired,
}) => {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { handleGenerateImage } = useImageGeneration({ state, actions, user, t });
  const { handleGenerateVideo } = useVideoGeneration({ state, actions, user, t });

  const handleGenerate = useCallback(() => {
    // 检查用户是否已登录
    if (!user) {
      onLoginRequired();
      return;
    }
    
    if (state.selectedTransformation?.isVideo) {
      handleGenerateVideo();
    } else {
      handleGenerateImage();
    }
  }, [user, onLoginRequired, state.selectedTransformation, handleGenerateVideo, handleGenerateImage]);

  const handleBackToSelection = useCallback(() => {
    actions.setSelectedTransformation(null);
  }, [actions]);

  const handleSelectTransformation = useCallback((transformation: any) => {
    actions.setSelectedTransformation(transformation);
    // 更新URL参数
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('view', 'create');
    newSearchParams.set('feature', transformation.key);
    setSearchParams(newSearchParams, { replace: false });
  }, [actions, searchParams, setSearchParams]);

  const handleOpenPreview = useCallback((url: string) => {
    setPreviewImageUrl(url);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewImageUrl(null);
  }, []);

  // Generate button disabled logic
  const isGenerateDisabled = (() => {
    if (!state.selectedTransformation) return true;
    
    const isCustomPromptEmpty = state.selectedTransformation.prompt === 'CUSTOM' && !state.customPrompt.trim();
    
    if (state.selectedTransformation.isVideo) {
      return state.isLoading || !state.customPrompt.trim();
    } else {
      let imagesReady = false;
      if (state.selectedTransformation.isMultiImage) {
        if (state.selectedTransformation.isSecondaryOptional) {
          imagesReady = !!state.primaryImageUrl;
        } else {
          imagesReady = !!state.primaryImageUrl && !!state.secondaryImageUrl;
        }
      } else {
        imagesReady = !!state.primaryImageUrl;
      }
      return state.isLoading || isCustomPromptEmpty || !imagesReady;
    }
  })();

  if (!state.selectedTransformation) {
    return (
      <TransformationSelectorEnhanced 
        transformations={state.transformations} 
        onSelect={handleSelectTransformation} 
        hasPreviousResult={!!state.primaryImageUrl}
        onOrderChange={actions.setTransformations}
        activeCategory={state.activeCategory}
        setActiveCategory={actions.setActiveCategory}
      />
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 animate-fade-in">
      {/* Back button */}
      <div className="mb-8">
        <button
          onClick={handleBackToSelection}
          className="flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-[rgba(107,114,128,0.1)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {t('app.chooseAnotherEffect')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="flex flex-col gap-6 p-6 bg-[var(--bg-card-alpha)] backdrop-blur-lg rounded-xl border border-[var(--border-primary)] shadow-2xl shadow-black/20">
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-1 text-[var(--accent-primary)] flex items-center gap-3">
                <span className="text-3xl">{state.selectedTransformation.emoji}</span>
                {t(state.selectedTransformation.titleKey)}
              </h2>
              {state.selectedTransformation.prompt !== 'CUSTOM' ? (
                <p className="text-[var(--text-secondary)]">{t(state.selectedTransformation.descriptionKey)}</p>
              ) : (
                !state.selectedTransformation.isVideo && <p className="text-[var(--text-secondary)]">{t(state.selectedTransformation.descriptionKey)}</p>
              )}
            </div>
            
            {state.selectedTransformation.prompt === 'CUSTOM' && !state.selectedTransformation.isVideo && (
              <textarea
                value={state.customPrompt}
                onChange={(e) => actions.setCustomPrompt(e.target.value)}
                placeholder="e.g., 'make the sky a vibrant sunset' or 'add a small red boat on the water'"
                rows={3}
                className="w-full -mt-2 mb-4 p-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition-colors placeholder-[var(--text-tertiary)]"
              />
            )}
            
            <InputPanel state={state} actions={actions} t={t} />
            
            {/* Generate button - moved inside input panel */}
            <button
              onClick={handleGenerate}
              disabled={isGenerateDisabled}
              className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[var(--text-on-accent)] font-semibold rounded-lg shadow-lg shadow-[var(--accent-shadow)] hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)] disabled:bg-[var(--bg-disabled)] disabled:from-[var(--bg-disabled)] disabled:to-[var(--bg-disabled)] disabled:text-[var(--text-disabled)] disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {state.isLoading ? (
                <DotsLoader text={t('app.generating')} color="white" />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{t('app.generateImage')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Column */}
        <OutputPanel
          state={state}
          onUseImageAsInput={actions.useImageAsInput}
          onImageClick={handleOpenPreview}
          t={t}
        />
      </div>

      <ImagePreviewModal imageUrl={previewImageUrl} onClose={handleClosePreview} />
    </div>
  );
};

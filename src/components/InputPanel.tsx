import React from 'react';
import ImageEditorCanvas from '../../components/ImageEditorCanvas';
import MultiImageUploader from '../../components/MultiImageUploader';
import type { Transformation } from '../../types';
import type { GenerationState, GenerationActions } from '../hooks/useGenerationState';

interface InputPanelProps {
  state: GenerationState;
  actions: GenerationActions;
  t: (key: string) => string;
}

export const InputPanel: React.FC<InputPanelProps> = ({ state, actions, t }) => {
  const {
    selectedTransformation,
    primaryImageUrl,
    secondaryImageUrl,
    customPrompt,
    aspectRatio,
    activeTool,
  } = state;

  const {
    setPrimaryImage,
    setSecondaryImage,
    clearPrimaryImage,
    clearSecondaryImage,
    setCustomPrompt,
    setAspectRatio,
    setMaskData,
    setActiveTool,
  } = actions;

  if (!selectedTransformation) return null;

  const toggleMaskTool = () => {
    setActiveTool(current => (current === 'mask' ? 'none' : 'mask'));
  };

  // Video generation UI
  if (selectedTransformation.isVideo) {
    return (
      <>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder={t('transformations.video.promptPlaceholder')}
          rows={4}
          className="w-full mt-2 p-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition-colors placeholder-[var(--text-tertiary)]"
        />
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{t('transformations.video.aspectRatio')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {(['16:9', '9:16'] as const).map(ratio => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`py-2 px-3 text-sm font-semibold rounded-md transition-colors duration-200 ${
                  aspectRatio === ratio ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[var(--text-on-accent)]' : 'bg-[rgba(107,114,128,0.2)] hover:bg-[rgba(107,114,128,0.4)]'
                }`}
              >
                {t(ratio === '16:9' ? 'transformations.video.landscape' : 'transformations.video.portrait')}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{t('transformations.effects.customPrompt.uploader2Title')}</h3>
          <ImageEditorCanvas
            onImageSelect={setPrimaryImage}
            initialImageUrl={primaryImageUrl}
            onMaskChange={() => {}}
            onClearImage={clearPrimaryImage}
            isMaskToolActive={false}
          />
        </div>
      </>
    );
  }

  // Multi-image UI
  if (selectedTransformation.isMultiImage) {
    return (
      <MultiImageUploader
        onPrimarySelect={setPrimaryImage}
        onSecondarySelect={setSecondaryImage}
        primaryImageUrl={primaryImageUrl}
        secondaryImageUrl={secondaryImageUrl}
        onClearPrimary={clearPrimaryImage}
        onClearSecondary={clearSecondaryImage}
        primaryTitle={selectedTransformation.primaryUploaderTitle ? t(selectedTransformation.primaryUploaderTitle) : undefined}
        primaryDescription={selectedTransformation.primaryUploaderDescription ? t(selectedTransformation.primaryUploaderDescription) : undefined}
        secondaryTitle={selectedTransformation.secondaryUploaderTitle ? t(selectedTransformation.secondaryUploaderTitle) : undefined}
        secondaryDescription={selectedTransformation.secondaryUploaderDescription ? t(selectedTransformation.secondaryUploaderDescription) : undefined}
      />
    );
  }

  // Single image UI
  return (
    <>
      <ImageEditorCanvas
        onImageSelect={setPrimaryImage}
        initialImageUrl={primaryImageUrl}
        onMaskChange={setMaskData}
        onClearImage={clearPrimaryImage}
        isMaskToolActive={activeTool === 'mask'}
      />
      {primaryImageUrl && (
        <div className="mt-4">
          <button
            onClick={toggleMaskTool}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 text-sm font-semibold rounded-md transition-colors duration-200 ${
              activeTool === 'mask' ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[var(--text-on-accent)]' : 'bg-[rgba(107,114,128,0.2)] hover:bg-[rgba(107,114,128,0.4)]'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
            <span>{t('imageEditor.drawMask')}</span>
          </button>
        </div>
      )}
    </>
  );
};

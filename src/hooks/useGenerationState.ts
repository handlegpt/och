import { useState, useCallback, useEffect } from 'react';
import { TRANSFORMATIONS } from '../../constants';
import type { GeneratedContent, Transformation } from '../../types';

type ActiveTool = 'mask' | 'none';

export interface GenerationState {
  // Transformation state
  transformations: Transformation[];
  selectedTransformation: Transformation | null;
  activeCategory: Transformation | null;
  
  // Image state
  primaryImageUrl: string | null;
  primaryFile: File | null;
  secondaryImageUrl: string | null;
  secondaryFile: File | null;
  maskDataUrl: string | null;
  
  // Generation state
  generatedContent: GeneratedContent | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  
  // UI state
  customPrompt: string;
  aspectRatio: '16:9' | '9:16';
  activeTool: ActiveTool;
  history: GeneratedContent[];
}

export interface GenerationActions {
  // Transformation actions
  setTransformations: (transformations: Transformation[]) => void;
  setSelectedTransformation: (transformation: Transformation | null) => void;
  setActiveCategory: (category: Transformation | null) => void;
  
  // Image actions
  setPrimaryImage: (file: File, dataUrl: string) => void;
  setSecondaryImage: (file: File, dataUrl: string) => void;
  setMaskData: (dataUrl: string | null) => void;
  clearPrimaryImage: () => void;
  clearSecondaryImage: () => void;
  
  // Generation actions
  setGeneratedContent: (content: GeneratedContent | null) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingMessage: (message: string) => void;
  setError: (error: string | null) => void;
  
  // UI actions
  setCustomPrompt: (prompt: string) => void;
  setAspectRatio: (ratio: '16:9' | '9:16') => void;
  setActiveTool: (tool: ActiveTool) => void;
  addToHistory: (content: GeneratedContent) => void;
  
  // Utility actions
  resetApp: () => void;
  useImageAsInput: (imageUrl: string) => Promise<void>;
}

export const useGenerationState = (): [GenerationState, GenerationActions] => {
  // Initialize transformations with localStorage
  const [transformations, setTransformations] = useState<Transformation[]>(() => {
    try {
      const savedOrder = localStorage.getItem('transformationOrder');
      if (savedOrder) {
        const orderedKeys = JSON.parse(savedOrder) as string[];
        const transformationMap = new Map(TRANSFORMATIONS.map(t => [t.key, t]));
        
        const orderedTransformations = orderedKeys
          .map(key => transformationMap.get(key))
          .filter((t): t is Transformation => !!t);

        const savedKeysSet = new Set(orderedKeys);
        const newTransformations = TRANSFORMATIONS.filter(t => !savedKeysSet.has(t.key));
        
        return [...orderedTransformations, ...newTransformations];
      }
    } catch (e) {
      console.error("Failed to load or parse transformation order from localStorage", e);
    }
    return TRANSFORMATIONS;
  });

  const [selectedTransformation, setSelectedTransformation] = useState<Transformation | null>(null);
  const [activeCategory, setActiveCategory] = useState<Transformation | null>(null);
  
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string | null>(null);
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [secondaryImageUrl, setSecondaryImageUrl] = useState<string | null>(null);
  const [secondaryFile, setSecondaryFile] = useState<File | null>(null);
  const [maskDataUrl, setMaskDataUrl] = useState<string | null>(null);
  
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [activeTool, setActiveTool] = useState<ActiveTool>('none');
  const [history, setHistory] = useState<GeneratedContent[]>([]);

  // Save transformation order to localStorage
  useEffect(() => {
    try {
      const orderToSave = transformations.map(t => t.key);
      localStorage.setItem('transformationOrder', JSON.stringify(orderToSave));
    } catch (e) {
      console.error("Failed to save transformation order to localStorage", e);
    }
  }, [transformations]);
  
  // Cleanup blob URLs on unmount or when dependencies change
  useEffect(() => {
    return () => {
      history.forEach(item => {
        if (item.videoUrl) {
          URL.revokeObjectURL(item.videoUrl);
        }
      });
      if (generatedContent?.videoUrl) {
        URL.revokeObjectURL(generatedContent.videoUrl);
      }
    };
  }, [history, generatedContent]);

  // Actions
  const setPrimaryImage = useCallback((file: File, dataUrl: string) => {
    setPrimaryFile(file);
    setPrimaryImageUrl(dataUrl);
    setGeneratedContent(null);
    setError(null);
    setMaskDataUrl(null);
    setActiveTool('none');
  }, []);

  const setSecondaryImage = useCallback((file: File, dataUrl: string) => {
    setSecondaryFile(file);
    setSecondaryImageUrl(dataUrl);
    setGeneratedContent(null);
    setError(null);
  }, []);

  const clearPrimaryImage = useCallback(() => {
    setPrimaryImageUrl(null);
    setPrimaryFile(null);
    setGeneratedContent(null);
    setError(null);
    setMaskDataUrl(null);
    setActiveTool('none');
  }, []);

  const clearSecondaryImage = useCallback(() => {
    setSecondaryImageUrl(null);
    setSecondaryFile(null);
  }, []);

  const addToHistory = useCallback((content: GeneratedContent) => {
    setHistory(prev => [content, ...prev]);
  }, []);

  const resetApp = useCallback(() => {
    setSelectedTransformation(null);
    setPrimaryImageUrl(null);
    setPrimaryFile(null);
    setSecondaryImageUrl(null);
    setSecondaryFile(null);
    setGeneratedContent(null);
    setError(null);
    setIsLoading(false);
    setMaskDataUrl(null);
    setCustomPrompt('');
    setActiveTool('none');
    setActiveCategory(null);
  }, []);

  const useImageAsInput = useCallback(async (imageUrl: string) => {
    if (!imageUrl) return;

    try {
      const { dataUrlToFile } = await import('../../utils/fileUtils');
      const newFile = await dataUrlToFile(imageUrl, `edited-${Date.now()}.png`);
      setPrimaryFile(newFile);
      setPrimaryImageUrl(imageUrl);
      setGeneratedContent(null);
      setError(null);
      setMaskDataUrl(null);
      setActiveTool('none');
      setSecondaryFile(null);
      setSecondaryImageUrl(null);
      setSelectedTransformation(null); 
      setActiveCategory(null);
    } catch (err) {
      console.error("Failed to use image as input:", err);
      setError('Failed to use image as input');
    }
  }, []);

  const state: GenerationState = {
    transformations,
    selectedTransformation,
    activeCategory,
    primaryImageUrl,
    primaryFile,
    secondaryImageUrl,
    secondaryFile,
    maskDataUrl,
    generatedContent,
    isLoading,
    loadingMessage,
    error,
    customPrompt,
    aspectRatio,
    activeTool,
    history,
  };

  const actions: GenerationActions = {
    setTransformations,
    setSelectedTransformation,
    setActiveCategory,
    setPrimaryImage,
    setSecondaryImage,
    setMaskData: setMaskDataUrl,
    clearPrimaryImage,
    clearSecondaryImage,
    setGeneratedContent,
    setIsLoading,
    setLoadingMessage,
    setError,
    setCustomPrompt,
    setAspectRatio,
    setActiveTool,
    addToHistory,
    resetApp,
    useImageAsInput,
  };

  return [state, actions];
};

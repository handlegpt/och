import React, { useState, useCallback } from 'react';
import { validatePrompt, validateUsername, validateDisplayName, validateUrl, type InputValidationResult } from '../utils/security';

interface SecureInputProps {
  type: 'prompt' | 'username' | 'displayName' | 'url';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  error?: string;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  type,
  value,
  onChange,
  placeholder,
  className = '',
  maxLength,
  required = false,
  disabled = false,
  label,
  error: externalError
}) => {
  const [validationError, setValidationError] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);

  const validateInput = useCallback((inputValue: string): InputValidationResult => {
    switch (type) {
      case 'prompt':
        return validatePrompt(inputValue);
      case 'username':
        return validateUsername(inputValue);
      case 'displayName':
        return validateDisplayName(inputValue);
      case 'url':
        return validateUrl(inputValue);
      default:
        return { isValid: true, sanitizedValue: inputValue };
    }
  }, [type]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    
    // 实时验证
    setIsValidating(true);
    const validation = validateInput(inputValue);
    
    if (validation.isValid) {
      setValidationError('');
      onChange(validation.sanitizedValue || inputValue);
    } else {
      setValidationError(validation.error || '');
      // 即使验证失败，也允许用户继续输入（在失焦时显示错误）
      onChange(inputValue);
    }
    
    setIsValidating(false);
  }, [onChange, validateInput]);

  const handleBlur = useCallback(() => {
    const validation = validateInput(value);
    if (!validation.isValid) {
      setValidationError(validation.error || '');
    } else {
      setValidationError('');
    }
  }, [value, validateInput]);

  const getInputType = () => {
    switch (type) {
      case 'url':
        return 'url';
      default:
        return 'text';
    }
  };

  const getDefaultMaxLength = () => {
    switch (type) {
      case 'prompt':
        return 1000;
      case 'username':
        return 50;
      case 'displayName':
        return 100;
      case 'url':
        return 500;
      default:
        return maxLength;
    }
  };

  const displayError = externalError || validationError;
  const hasError = !!displayError;

  const inputClasses = `
    w-full px-3 py-2 
    bg-[var(--bg-secondary)] 
    border rounded-lg 
    text-[var(--text-primary)]
    focus:ring-2 focus:ring-[var(--accent-primary)] 
    focus:border-[var(--accent-primary)]
    transition-colors duration-200
    ${hasError 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-[var(--border-primary)]'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  const InputComponent = type === 'prompt' ? 'textarea' : 'input';

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-primary)]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <InputComponent
        type={getInputType()}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={maxLength || getDefaultMaxLength()}
        required={required}
        disabled={disabled}
        className={inputClasses}
        rows={type === 'prompt' ? 3 : undefined}
        style={{ resize: type === 'prompt' ? 'vertical' : 'none' }}
      />
      
      {hasError && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {displayError}
        </p>
      )}
      
      {!hasError && value && (
        <p className="text-xs text-[var(--text-tertiary)]">
          {value.length} / {getDefaultMaxLength()} 字符
        </p>
      )}
      
      {isValidating && (
        <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
          <div className="w-3 h-3 border border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
          验证中...
        </div>
      )}
    </div>
  );
};

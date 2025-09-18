import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from '../../../i18n/context';
import { useAuth } from '../../hooks/useAuth';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange?: (avatarUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  size = 'md'
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // 创建预览URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // 这里可以添加上传到服务器的逻辑
      // 暂时使用预览URL作为头像
      if (onAvatarChange) {
        onAvatarChange(preview);
      }

      // 模拟上传延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      setError('上传失败，请重试');
      console.error('Avatar upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }, [onAvatarChange]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback(() => {
    setPreviewUrl(null);
    if (onAvatarChange) {
      onAvatarChange('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onAvatarChange]);

  const displayAvatar = previewUrl || currentAvatar || user?.user_metadata?.avatar_url;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* 头像显示区域 */}
      <div className="relative group">
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-[var(--border-primary)] bg-[var(--bg-secondary)] flex items-center justify-center`}>
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt="用户头像"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-4xl text-[var(--text-secondary)]">
              {user?.email?.charAt(0).toUpperCase() || '👤'}
            </div>
          )}
        </div>

        {/* 上传覆盖层 */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          onClick={handleClick}
        >
          <div className="text-white text-center">
            <div className="text-2xl mb-1">📷</div>
            <div className="text-xs">点击上传</div>
          </div>
        </div>

        {/* 加载指示器 */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-2">
        <button
          onClick={handleClick}
          disabled={isUploading}
          className="px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isUploading ? '上传中...' : '选择头像'}
        </button>
        
        {displayAvatar && (
          <button
            onClick={handleRemove}
            disabled={isUploading}
            className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            移除
          </button>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      {/* 文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 提示信息 */}
      <div className="text-xs text-[var(--text-secondary)] text-center max-w-xs">
        支持 JPG、PNG、GIF 格式，文件大小不超过 5MB
      </div>
    </div>
  );
};

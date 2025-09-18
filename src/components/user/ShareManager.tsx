import React, { useState, useCallback } from 'react';
import { useTranslation } from '../../../i18n/context';
import { useAuth } from '../../hooks/useAuth';

interface ShareManagerProps {
  contentUrl?: string;
  title?: string;
  description?: string;
}

export const ShareManager: React.FC<ShareManagerProps> = ({
  contentUrl,
  title = '我的AI生成作品',
  description = '使用Och AI生成的创意作品'
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // 生成分享链接
  const generateShareUrl = useCallback(() => {
    const baseUrl = window.location.origin;
    const shareId = Math.random().toString(36).substring(2, 15);
    const url = `${baseUrl}/share/${shareId}`;
    setShareUrl(url);
    return url;
  }, []);

  // 生成二维码
  const generateQRCode = useCallback(async (url: string) => {
    try {
      // 使用 qr-server.com API 生成二维码
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
      setQrCodeUrl(qrUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  }, []);

  // 复制到剪贴板
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('已复制到剪贴板');
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('已复制到剪贴板');
    }
  }, []);

  // 分享到社交媒体
  const shareToSocial = useCallback((platform: string) => {
    const url = shareUrl || generateShareUrl();
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'weibo':
        shareUrl = `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`;
        break;
      case 'qq':
        shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  }, [shareUrl, title, description, generateShareUrl]);

  // 原生分享API
  const nativeShare = useCallback(async () => {
    if (!navigator.share) {
      alert('您的浏览器不支持原生分享功能');
      return;
    }

    try {
      await navigator.share({
        title,
        text: description,
        url: shareUrl || generateShareUrl()
      });
    } catch (err) {
      console.log('Share cancelled');
    }
  }, [title, description, shareUrl, generateShareUrl]);

  // 下载二维码
  const downloadQRCode = useCallback(async () => {
    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error downloading QR code:', err);
    }
  }, [qrCodeUrl]);

  const handleOpenShareModal = useCallback(() => {
    const url = generateShareUrl();
    generateQRCode(url);
    setShowShareModal(true);
  }, [generateShareUrl, generateQRCode]);

  return (
    <div className="space-y-4">
      {/* 分享按钮 */}
      <button
        onClick={handleOpenShareModal}
        className="w-full px-6 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <span>🔗</span>
        <span>分享作品</span>
      </button>

      {/* 分享模态框 */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* 标题 */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  分享作品
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200"
                >
                  ✕
                </button>
              </div>

              {/* 分享链接 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  分享链接
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-sm text-[var(--text-primary)]"
                  />
                  <button
                    onClick={() => copyToClipboard(shareUrl)}
                    className="px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors duration-200 text-sm"
                  >
                    复制
                  </button>
                </div>
              </div>

              {/* 二维码 */}
              {qrCodeUrl && (
                <div className="mb-6 text-center">
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    二维码
                  </label>
                  <div className="inline-block p-4 bg-white rounded-lg">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-32 h-32"
                    />
                  </div>
                  <button
                    onClick={downloadQRCode}
                    className="mt-2 px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors duration-200 text-sm"
                  >
                    下载二维码
                  </button>
                </div>
              )}

              {/* 社交媒体分享 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                  分享到社交媒体
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => shareToSocial('twitter')}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                  >
                    <span>🐦</span>
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => shareToSocial('facebook')}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                  >
                    <span>📘</span>
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => shareToSocial('weibo')}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
                  >
                    <span>📱</span>
                    <span>微博</span>
                  </button>
                  <button
                    onClick={() => shareToSocial('qq')}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm"
                  >
                    <span>💬</span>
                    <span>QQ</span>
                  </button>
                </div>
              </div>

              {/* 原生分享 */}
              {navigator.share && (
                <button
                  onClick={nativeShare}
                  className="w-full px-4 py-3 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>📤</span>
                  <span>系统分享</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

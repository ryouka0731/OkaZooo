// src/components/OkaZoooLogo.tsx
import React from 'react';

interface OkaZoooLogoProps {
  size?: 'sm' | 'md' | 'lg'; // サイズ指定（レスポンシブ）
  align?: 'center' | 'left' | 'right'; // 配置
  show?: boolean; // 表示切替
  className?: string; // カスタムクラス
}

const sizeMap = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

const OkaZoooLogo = ({ size = 'md', align = 'center', show = true, className = '' }: OkaZoooLogoProps) => {
  if (!show) return null;
  const alignClass = align === 'center' ? 'justify-center mx-auto' : align === 'left' ? 'justify-start' : 'justify-end';
  return (
    <div className={`flex items-center w-full max-w-xs md:max-w-sm lg:max-w-md p-2 ${alignClass} ${className}`}>
    <svg
      className={`${sizeMap[size]} md:${sizeMap[size]} lg:${sizeMap[size]}`}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="OkaZooo Logo"
    >
      {/* ゾウ本体 */}
      <ellipse cx="32" cy="36" rx="22" ry="18" fill="#FF69B4" />
      {/* 耳 */}
      <ellipse cx="14" cy="36" rx="7" ry="9" fill="#FFB6C1" />
      <ellipse cx="50" cy="36" rx="7" ry="9" fill="#FFB6C1" />
      {/* 鼻（再生ボタン） */}
      <polygon points="32,44 32,60 46,52" fill="#fff" stroke="#FF69B4" strokeWidth="2" />
      {/* 目 */}
      <circle cx="26" cy="32" r="2.5" fill="#fff" />
      <circle cx="38" cy="32" r="2.5" fill="#fff" />
      <circle cx="26" cy="32" r="1.2" fill="#333" />
      <circle cx="38" cy="32" r="1.2" fill="#333" />
      {/* 頬 */}
      <ellipse cx="22" cy="38" rx="2" ry="1.2" fill="#fff" opacity="0.5" />
      <ellipse cx="42" cy="38" rx="2" ry="1.2" fill="#fff" opacity="0.5" />
    </svg>
  </div>
    );
};

export default OkaZoooLogo;

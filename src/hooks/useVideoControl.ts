// src/hooks/useVideoControl.ts
import { useRef, useCallback } from 'react';

interface UseVideoControlOptions {
  videoUrl: string;
}

export function useVideoControl({ videoUrl }: UseVideoControlOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasTappedRef = useRef(false);

  // メタデータロード時の40秒ジャンプ
  const handleLoadedMetadata = useCallback(() => {
    if (videoUrl.endsWith('#t=40') && videoRef.current) {
      videoRef.current.currentTime = 40;
    }
  }, [videoUrl]);

  // 初回タップ時ミュート解除＆再生開始
  const handleTap = useCallback(() => {
    if (!hasTappedRef.current && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
      hasTappedRef.current = true;
    }
  }, []);

  return {
    videoRef,
    handleLoadedMetadata,
    handleTap,
  };
}

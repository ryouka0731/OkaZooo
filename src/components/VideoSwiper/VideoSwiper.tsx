// src/components/VideoSwiper.tsx
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/virtual";
import { Virtual } from "swiper/modules";
import { useVideoControl } from "../../hooks/useVideoControl";
import { useWindowSize } from "../../hooks/useWindowSize";

interface VideoData {
  id: string;
  title: string;
  actress: string;
  video_url: string;
  poster_url: string;
  thumbnail_url: string;
  affiliate_url: string;
  hunted_at: string;
}

interface VideoSwiperProps {
  videos: VideoData[];
  onSlideChange?: (idx: number) => void;
  slidesPerView?: number;
  show?: boolean;
  className?: string;
}

const STORAGE_KEY = 'videoSwiperIndex';
const STORAGE_DATE_KEY = 'videoSwiperDate';

// toLocaleDateString はブラウザ・OS環境によって結果が変わるため
// ISO形式（YYYY-MM-DD）で固定して保存/復元時の不一致を防ぐ
function getTodayStr(): string {
  const d = new Date();
  const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().slice(0, 10); // "2026-02-14"
}

function getInitialIndex(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const todayStr = getTodayStr();
    const savedDate = localStorage.getItem(STORAGE_DATE_KEY);
    const savedIndex = localStorage.getItem(STORAGE_KEY);
    console.log('[VideoSwiper] restore check — savedDate:', savedDate, 'today:', todayStr, 'savedIndex:', savedIndex);
    if (savedDate === todayStr && savedIndex !== null) {
      return parseInt(savedIndex, 10) || 0;
    }
  } catch (e) {
    console.warn('[VideoSwiper] localStorage read error:', e);
  }
  return 0;
}

function saveIndex(index: number): void {
  try {
    const todayStr = getTodayStr();
    localStorage.setItem(STORAGE_KEY, String(index));
    localStorage.setItem(STORAGE_DATE_KEY, todayStr);
    console.log('[VideoSwiper] saved index:', index, 'date:', todayStr);
  } catch (e) {
    console.warn('[VideoSwiper] localStorage write error:', e);
  }
}

export default function VideoSwiper({
  videos,
  onSlideChange,
  slidesPerView = 1,
  show = true,
  className = '',
}: VideoSwiperProps) {
  if (!show) return null;

  const [activeIndex, setActiveIndex] = useState<number>(getInitialIndex);

  const swiperRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPc = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const prevMediaRefs = useRef<(HTMLVideoElement | HTMLIFrameElement | null)[]>([]);

  const pauseAllExcept = (activeIdx: number) => {
    prevMediaRefs.current.forEach((media, idx) => {
      if (!media) return;
      if (idx !== activeIdx) {
        if (media instanceof HTMLVideoElement) {
          media.pause();
          media.currentTime = 0;
          media.loop = false;
        } else if (media instanceof HTMLIFrameElement) {
          media.src = '';
        }
      } else {
        if (media instanceof HTMLVideoElement) {
          media.loop = true;
        }
      }
    });
  };

  // プリロード
  useEffect(() => {
    const preloadIndex = activeIndex + 1;
    const nextVideo = videos[preloadIndex];
    if (!nextVideo) return;
    const video = document.createElement('video');
    video.src = nextVideo.video_url;
    video.preload = 'auto';
    video.style.display = 'none';
    document.body.appendChild(video);
    const timer = setTimeout(() => video.remove(), 5000);
    return () => {
      clearTimeout(timer);
      if (video.parentNode) video.remove();
    };
  }, [activeIndex, videos]);

  // PCホイール操作
  useEffect(() => {
    if (!isPc || !containerRef.current) return;
    const container = containerRef.current;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const swiper = swiperRef.current?.swiper;
      if (!swiper) return;
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      let nextIndex = swiper.activeIndex;
      if (e.deltaY > 0 && swiper.activeIndex < videos.length - 1) {
        nextIndex = swiper.activeIndex + 1;
      } else if (e.deltaY < 0 && swiper.activeIndex > 0) {
        nextIndex = swiper.activeIndex - 1;
      }

      if (nextIndex !== swiper.activeIndex) {
        swiper.slideTo(nextIndex);
        saveIndex(nextIndex);
        setActiveIndex(nextIndex);
        pauseAllExcept(nextIndex);
        if (onSlideChange) onSlideChange(nextIndex);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [isPc, videos.length, onSlideChange]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={{
        margin: 0,
        padding: 0,
      }}
    >
      <Swiper
        modules={[Virtual]}
        virtual
        slidesPerView={slidesPerView}
        direction="vertical"
        initialSlide={activeIndex}
        onSwiper={(swiper) => {
          swiperRef.current = { swiper };
        }}
        onSlideChange={(swiper) => {
          pauseAllExcept(swiper.activeIndex);
          setActiveIndex(swiper.activeIndex);
          saveIndex(swiper.activeIndex);

          // mp4のみpreloadタグを追加（"video"はサポート外ブラウザがあるため"fetch"を使用）
          const nextVideo = videos[swiper.activeIndex + 1];
          if (nextVideo?.video_url.endsWith('.mp4')) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'fetch';
            link.href = nextVideo.video_url;
            document.head.appendChild(link);
          }

          if (onSlideChange) onSlideChange(swiper.activeIndex);
        }}
        className="w-full h-full video-swiper-inner bg-black"
      >
        {videos.map((video, idx) => (
          <SwiperSlide key={video.id} virtualIndex={idx}>
            <VideoSlide
              video={video}
              mediaRef={(el) => (prevMediaRefs.current[idx] = el)}
              isActive={activeIndex === idx}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function VideoSlide({
  video,
  mediaRef,
  isActive,
}: {
  video: VideoData;
  mediaRef?: (el: HTMLVideoElement | HTMLIFrameElement | null) => void;
  isActive?: boolean;
}) {
  const { videoRef, handleLoadedMetadata, handleTap } = useVideoControl({ videoUrl: video.video_url });
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  // FANZAの litevideo ページレイアウト:
  // ヘッダー(~20px) + 動画(720x480 = 3:2) + コントロール(~20px)
  // → ページ全体の高さ ≈ 動画幅 × 0.667 + 40px
  // 画面高さに全て収めるために、iframeの幅を制限する:
  // maxWidth = (screenHeight - overhead) × (720/480)
  const PAGE_OVERHEAD = 40;
  const VIDEO_RATIO = 720 / 480; // 3:2 = 1.5
  const maxIframeWidth = Math.floor((windowHeight - PAGE_OVERHEAD) * VIDEO_RATIO);
  // 画面幅より小さければその値を使用、そうでなければ画面幅
  const iframeWidth = Math.min(windowWidth, maxIframeWidth);

  function isValidVideoUrl(url: any): boolean {
    return typeof url === 'string' && url.startsWith('http');
  }

  useEffect(() => {
    if (videoRef.current && isValidVideoUrl(video.video_url)) {
      videoRef.current.currentTime = 40;
    }
  }, [video.video_url]);

  return (
    <div
      className="video-slide-outer bg-black"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
          {video.video_url.endsWith('.mp4') ? (
            <video
              src={video.video_url}
              crossOrigin="anonymous"
              controls={isActive}
              autoPlay={isActive}
              muted
              playsInline
              ref={(el) => {
                videoRef.current = el;
                if (mediaRef) mediaRef(el);
              }}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={handleTap}
              loop={isActive}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                background: '#000',
                display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                width: iframeWidth,
                height: '100%',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <iframe
                src={isActive ? video.video_url : undefined}
                allowFullScreen
                className="video-iframe"
                title={video.title}
                ref={(el) => {
                  if (mediaRef) mediaRef(el);
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  border: 'none',
                  width: '100%',
                  height: '100%',
                  display: 'block',
                }}
                scrolling="no"
              />
            </div>
          )}
    </div>
  );
}

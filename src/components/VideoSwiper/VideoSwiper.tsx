// src/components/VideoSwiper.tsx
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/virtual";
import { Virtual } from "swiper/modules";
import { useVideoControl } from "../../hooks/useVideoControl";

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
      className={
        isPc
          ? `fixed inset-0 z-50 bg-black flex flex-col items-center justify-center video-swiper-pc ${className}`
          : `w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto video-swiper-wrapper ${className}`
      }
      style={
        isPc
          ? { width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }
          : { width: '100%', height: '100%', overflow: 'hidden', display: 'block' }
      }
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
        className={isPc ? 'w-full h-full video-swiper-inner' : 'w-full h-full'}
        style={isPc ? { width: '100vw', height: '100vh' } : { width: '100%', height: '100%' }}
      >
        {videos.map((video, idx) => (
          <SwiperSlide key={video.id} virtualIndex={idx}>
            <VideoSlide
              video={video}
              index={idx}
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
  index,
  mediaRef,
  isActive,
}: {
  video: VideoData;
  index: number;
  mediaRef?: (el: HTMLVideoElement | HTMLIFrameElement | null) => void;
  isActive?: boolean;
}) {
  const { videoRef, handleLoadedMetadata, handleTap } = useVideoControl({ videoUrl: video.video_url });

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
      className="flex flex-col items-center p-4 md:p-6 lg:p-8 video-slide-outer justify-center"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
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
                width: '100%',
                height: '100%',
                maxWidth: '100vw',
                maxHeight: '100vh',
                objectFit: 'contain',
                background: '#000',
                display: 'block',
              }}
            />
          ) : (
            <iframe
              src={isActive ? video.video_url : undefined}
              width="100%"
              allowFullScreen
              className="w-full max-w-lg md:max-w-xl lg:max-w-2xl rounded shadow-lg video-iframe"
              title={video.title}
              ref={(el) => {
                if (mediaRef) mediaRef(el);
              }}
              style={{
                border: 'none',
                width: '100%',
                height: 'calc(100vw * 9 / 16)',
                overflow: 'hidden',
                display: 'block',
              }}
              scrolling="no"
            />
          )}
        </div>
      </div>
    </div>
  );
}
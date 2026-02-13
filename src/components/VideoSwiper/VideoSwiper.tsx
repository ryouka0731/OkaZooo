// src/components/VideoSwiper.tsx
import { useEffect, useRef } from "react";
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
  slidesPerView?: number; // レスポンシブ用
  show?: boolean; // 表示切替
  className?: string;
}

export default function VideoSwiper({ videos, onSlideChange, slidesPerView = 1, show = true, className = '' }: VideoSwiperProps) {
  // データ構造・値を詳細にログ出力
  console.log('VideoSwiper videos:', videos);
  if (!Array.isArray(videos)) {
    console.warn('videos propsが配列ではありません:', videos);
  } else {
    // dmm_contentsスキーマ準拠: video_urlのみ利用
  }
  if (!show) return null;
  // SwiperのactiveIndex管理
  const swiperRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPc = typeof window !== 'undefined' && window.innerWidth >= 1024;

  // プリロード用
  useEffect(() => {
    if (!swiperRef.current) return;
    const swiper = swiperRef.current.swiper;
    const preloadIndex = swiper.activeIndex + 1;
    const nextVideo = videos[preloadIndex];
    if (nextVideo) {
      const video = document.createElement("video");
      video.src = nextVideo.video_url;
      video.preload = "auto";
      video.style.display = "none";
      document.body.appendChild(video);
      setTimeout(() => {
        video.remove();
      }, 5000);
    }
    return () => {
      // クリーンアップ
      // 追加したvideo要素を削除
      const videos = document.querySelectorAll('video[preload="auto"]');
      videos.forEach(v => v.parentNode?.removeChild(v));
    };
  }, [videos]);

  // PC時は全画面化＋マウスホイール切り替え（縦方向のみ対応、横スクロール無視）
  useEffect(() => {
    if (!isPc || !swiperRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    const swiper = swiperRef.current.swiper;
    const handleWheel = (e: WheelEvent) => {
      if (!swiper) return;
      // 横スクロールは無視
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      if (e.deltaY > 0) {
        // 次へ（端でループしない）
        if (swiper.activeIndex < videos.length - 1) {
          swiper.slideTo(swiper.activeIndex + 1);
        }
      } else if (e.deltaY < 0) {
        // 前へ（端でループしない）
        if (swiper.activeIndex > 0) {
          swiper.slideTo(swiper.activeIndex - 1);
        }
      }
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isPc, videos.length]);

  return (
    <div
      ref={containerRef}
      className={isPc ? `fixed inset-0 z-50 bg-black flex flex-col items-center justify-center video-swiper-pc ${className}` : `w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto video-swiper-wrapper ${className}`}
      style={isPc ? { width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' } : { width: '100%', height: '100%', overflow: 'hidden', display: 'block' }}
    >
      <Swiper
        modules={[Virtual]}
        virtual
        slidesPerView={slidesPerView}
        direction="vertical"
        onSwiper={swiper => (swiperRef.current = { swiper })}
        onSlideChange={(swiper) => {
          // スワイプ時プリロード
          const preloadIndex = swiper.activeIndex + 1;
          const nextVideo = videos[preloadIndex];
          if (nextVideo) {
            const link = document.createElement("link");
            link.rel = "preload";
            link.as = "video";
            link.href = nextVideo.video_url;
            document.head.appendChild(link);
          }
          if (onSlideChange) onSlideChange(swiper.activeIndex);
        }}
        className={isPc ? 'w-full h-full video-swiper-inner' : 'w-full h-full'}
        style={isPc ? { width: '100vw', height: '100vh' } : { width: '100%', height: '100%' }}
      >
        {videos.map((video, idx) => {
          console.log('[VideoSwiper.map] idx:', idx, 'key:', video.id, 'video_url:', video.video_url);
          return (
            <SwiperSlide key={video.id} virtualIndex={idx}>
              <VideoSlide video={video} index={idx} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

function VideoSlide({ video, index }: { video: VideoData; index: number }) {
  const { videoRef, handleLoadedMetadata, handleTap } = useVideoControl({ videoUrl: video.video_url });

  // URL検証関数
  // video_urlはSupabaseから正しい形式で渡される前提
  function isValidVideoUrl(url: any): boolean {
    return typeof url === 'string' && url.startsWith('http'); // dmm_contentsスキーマ video_url
  }

  // 自動再生抑止: 初回タップ時のみplay()を呼ぶため、useEffectでのplay()呼び出しを削除
  useEffect(() => {
    console.log('VideoSlide video:', video);
    if (!isValidVideoUrl(video.video_url)) {
      console.warn(`動画${index}のvideo_urlが不正です`, video);
    }
    if (videoRef.current && isValidVideoUrl(video.video_url)) {
      videoRef.current.currentTime = 40;
      // videoRef.current.play(); // 自動再生抑止のため削除
    }
  }, [video.video_url]);

  return (
    <div
      className="flex flex-col items-center p-4 md:p-6 lg:p-8 video-slide-outer"
      style={{ width: '100%', height: '100%', overflow: 'hidden', boxSizing: 'border-box', display: 'block' }}
    >
      <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 text-center">{video.title}</h2>
      <div className="text-sm md:text-base text-gray-300 mb-2 text-center">{video.actress}</div>
      <img src={video.poster_url} alt={video.title + ' poster'} className="mb-2 max-h-48 rounded shadow" />
      {/*
        DMM litevideoページの埋め込み例。
        <iframe src="https://www.dmm.co.jp/litevideo/-/part/=/cid=..." width="100%" height="360" allowFullScreen></iframe>
        ※DMM側がX-Frame-OptionsやCSPで埋め込みを禁止している場合、
          ブラウザでエラーやblank表示になる可能性があります。
      */}
      {/* DMM litevideo のURLの場合は <iframe> で埋め込み、それ以外は <a> でリンク表示 */}
      {video.video_url.endsWith('.mp4') ? (
        <video
          src={video.video_url}
          crossOrigin="anonymous"
          controls
          autoPlay
          muted
          playsInline
          ref={videoRef}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={handleTap}
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
          src={video.video_url}
          width="100%"
          height="360"
          allowFullScreen
          className="w-full max-w-lg md:max-w-xl lg:max-w-2xl rounded shadow-lg video-iframe"
          title={video.title}
          style={{
            border: 'none',
            width: '100%',
            height: 'calc(100vw * 9 / 16)', // 16:9比率でSP/PC両対応
            overflow: 'hidden',
            display: 'block',
          }}
          scrolling="no"
        />
      )}
    </div>
  );
}

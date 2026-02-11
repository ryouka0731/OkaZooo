// src/components/VideoSwiper.tsx
import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/virtual";
import { Virtual } from "swiper/modules";
import { useVideoControl } from "../hooks/useVideoControl";

interface VideoData {
  id: string;
  title: string;
  url: string;
}

interface VideoSwiperProps {
  videos: VideoData[];
}

export default function VideoSwiper({ videos }: VideoSwiperProps) {
  // SwiperのactiveIndex管理
  const swiperRef = useRef<any>(null);

  // プリロード用
  useEffect(() => {
    if (!swiperRef.current) return;
    const swiper = swiperRef.current.swiper;
    const preloadIndex = swiper.activeIndex + 1;
    const nextVideo = videos[preloadIndex];
    if (nextVideo) {
      const video = document.createElement("video");
      video.src = nextVideo.url;
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

  return (
    <Swiper
      modules={[Virtual]}
      virtual
      slidesPerView={1}
      onSwiper={swiper => (swiperRef.current = { swiper })}
      onSlideChange={() => {
        // スワイプ時プリロード
        const swiper = swiperRef.current.swiper;
        const preloadIndex = swiper.activeIndex + 1;
        const nextVideo = videos[preloadIndex];
        if (nextVideo) {
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "video";
          link.href = nextVideo.url;
          document.head.appendChild(link);
        }
      }}
      virtual
      style={{ width: "480px" }}
    >
      {videos.map((video, idx) => (
        <SwiperSlide key={video.id} virtualIndex={idx}>
          <VideoSlide video={video} index={idx} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function VideoSlide({ video, index }: { video: VideoData; index: number }) {
  const { videoRef, handleLoadedMetadata, handleTap } = useVideoControl({ videoUrl: video.url });

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 40;
      videoRef.current.play();
    }
  }, [video.url]);

  return (
    <div>
      <h2>{video.title}</h2>
      <video
        ref={videoRef}
        src={video.url}
        controls
        width={480}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={handleTap}
        preload="auto"
      />
    </div>
  );
}

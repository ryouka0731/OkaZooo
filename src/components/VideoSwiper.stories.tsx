// src/components/VideoSwiper.stories.tsx
import React from "react";
import VideoSwiper from "./VideoSwiper";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof VideoSwiper> = {
  title: "Components/VideoSwiper",
  component: VideoSwiper,
} satisfies Meta<typeof VideoSwiper>;
export default meta;

type Story = StoryObj<typeof VideoSwiper>;

const sampleVideos = [
  { id: "1", title: "サンプル動画1", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: "2", title: "サンプル動画2", url: "https://www.w3schools.com/html/movie.mp4" },
];

export const Default: Story = {
  render: () => <VideoSwiper videos={sampleVideos} />,
};

// src/components/OkaZoooLogo.stories.tsx
import React from "react";
import OkaZoooLogo from "./OkaZoooLogo";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof OkaZoooLogo> = {
  title: "Components/OkaZoooLogo",
  component: OkaZoooLogo,
} satisfies Meta<typeof OkaZoooLogo>;
export default meta;

type Story = StoryObj<typeof OkaZoooLogo>;

export const Default: Story = {
  render: () => <OkaZoooLogo size="md" align="center" show={true} />, // 新propsテスト
};

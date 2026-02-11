// src/components/TutorialPopup.stories.tsx
import React, { useState } from "react";
import TutorialPopup from "./TutorialPopup";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TutorialPopup> = {
  title: "Components/TutorialPopup",
  component: TutorialPopup,
} satisfies Meta<typeof TutorialPopup>;
export default meta;

type Story = StoryObj<typeof TutorialPopup>;

export const Open: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return <TutorialPopup open={open} onClose={() => setOpen(false)} />;
  },
};

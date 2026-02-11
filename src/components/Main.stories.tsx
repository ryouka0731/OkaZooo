import type { Meta, StoryObj } from "@storybook/react";

// Main コンポーネントがまだ実装されていないため、プレースホルダーを作成
const Main = () => <div className="p-4">Main Component</div>;

const meta = {
  title: "Components/Main",
  component: Main,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Main>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Main />,
};

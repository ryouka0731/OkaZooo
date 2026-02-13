// src/components/HuntCounter.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import HuntCounter from './HuntCounter';

const meta: Meta<typeof HuntCounter> = {
  title: 'Components/HuntCounter',
  component: HuntCounter,
};
export default meta;

export const Basic: StoryObj<typeof HuntCounter> = {
  render: () => <HuntCounter position="fixed" align="right" show={true} />, // 新propsテスト
  name: '基本表示',
};

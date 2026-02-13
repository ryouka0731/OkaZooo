import type { Meta, StoryObj } from '@storybook/react'
import CloseButtons from './CloseButtons'

const meta = {
  title: 'Components/CloseButtons',
  component: CloseButtons,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CloseButtons>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <CloseButtons />,
}

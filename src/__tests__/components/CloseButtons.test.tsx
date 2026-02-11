import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CloseButtons from '../../components/CloseButtons'

describe('CloseButtons コンポーネント', () => {
  beforeEach(() => {
    // window.electron のモックをリセット
    vi.clearAllMocks()
  })

  it('3つのボタンがレンダリングされること', () => {
    render(<CloseButtons />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
  })

  it('最小化ボタンをクリックすると minimize が呼ばれること', async () => {
    const user = userEvent.setup()
    render(<CloseButtons />)

    const buttons = screen.getAllByRole('button')
    await user.click(buttons[0])

    expect(window.electron.minimize).toHaveBeenCalled()
  })

  it('最大化ボタンをクリックすると maximize が呼ばれること', async () => {
    const user = userEvent.setup()
    render(<CloseButtons />)

    const buttons = screen.getAllByRole('button')
    await user.click(buttons[1])

    expect(window.electron.maximize).toHaveBeenCalled()
  })

  it('閉じるボタンをクリックすると close が呼ばれること', async () => {
    const user = userEvent.setup()
    render(<CloseButtons />)

    const buttons = screen.getAllByRole('button')
    await user.click(buttons[2])

    expect(window.electron.close).toHaveBeenCalled()
  })

  it('コンポーネント内に SVG が含まれること', () => {
    render(<CloseButtons />)
    const svgs = document.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })
})

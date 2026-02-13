import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '../../components/Header/Header'

describe('Header コンポーネント', () => {
  beforeEach(() => {
    // window.electron のモックをリセット
    vi.clearAllMocks()
  })

  it('ナビゲーション要素がレンダリングされること', () => {
    render(<Header />)
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('electron が利用可能な場合、CloseButtons がレンダリングされること', () => {
    render(<Header />)
    // CloseButtons 内のボタンが存在することを確認
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('nav 要素が正しいクラスを持つこと', () => {
    render(<Header />)
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('dark:bg-main-dark')
  })
})

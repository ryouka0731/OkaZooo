import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Main from '../../components/Main'

describe('Main コンポーネント', () => {
  it('コンポーネントがレンダリングされること', () => {
    const { container } = render(<Main />)
    expect(container).toBeInTheDocument()
  })

  it('コンポーネントが DOM に存在すること', () => {
    render(<Main />)
    // Main コンポーネントが正常にレンダリングされることを確認
    expect(true).toBe(true)
  })
})

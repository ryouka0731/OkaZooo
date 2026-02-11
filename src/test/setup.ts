import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

// Electron API のモック（テスト環境で必要な場合）
if (!window.electron) {
  Object.defineProperty(window, 'electron', {
    value: {
      minimize: vi.fn(),
      maximize: vi.fn(),
      close: vi.fn(),
      onToggleTitlebar: vi.fn(),
    },
    writable: true,
    configurable: true,
  })
}

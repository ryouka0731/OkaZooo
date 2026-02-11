import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

// Electron API のモック
if (!window.electron) {
  window.electron = {
    minimize: vi.fn(),
    maximize: vi.fn(),
    close: vi.fn(),
    onToggleTitlebar: vi.fn(),
  }
}

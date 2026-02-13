import { useEffect, useRef } from 'react'
import CloseButtons from '../CloseButtons/CloseButtons'

const Header = () => {
  const header = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.electron) {
      window.electron.onToggleTitlebar((show: boolean) => {
        if (show) {
          header.current?.classList.remove('hidden')
        } else {
          header.current?.classList.add('hidden')
        }
      })
    }
  }, [])

  return (
    <nav ref={header} className="h-11 dark:bg-main-dark bg-white z-10 drag p-1 rounded-t-2xl shadow-md border-b border-main-dark/10">
      {window.electron && <CloseButtons />}
    </nav>
  )
}

export default Header

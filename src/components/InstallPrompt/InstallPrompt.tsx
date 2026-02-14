import { useState, useEffect, useRef } from 'react';

const DISMISSED_KEY = 'pwa_install_prompt_dismissed';

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
}

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const promptRef = useRef<any>(null);

  useEffect(() => {
    // 既にインストール済み or PCなら表示しない
    if (isStandalone()) return;
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) return;

    // 過去にdismissedなら表示しない
    try {
      if (localStorage.getItem(DISMISSED_KEY) === 'true') return;
    } catch { /* ignore */ }

    // Android: beforeinstallprompt を利用
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      promptRef.current = e;
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 少し遅延してから表示（UXのため）
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleDismiss = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      try {
        localStorage.setItem(DISMISSED_KEY, 'true');
      } catch { /* ignore */ }
    }, 400);
  };

  const handleInstall = async () => {
    if (promptRef.current) {
      promptRef.current.prompt();
      const result = await promptRef.current.userChoice;
      if (result.outcome === 'accepted') {
        handleDismiss();
      }
    }
  };

  if (!visible) return null;

  const ios = isIOS();
  const android = isAndroid();
  const hasNativePrompt = !!deferredPrompt;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100000,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        className={`install-prompt-banner ${closing ? 'install-prompt-closing' : 'install-prompt-enter'}`}
        style={{
          pointerEvents: 'auto',
          maxWidth: 420,
          width: '94%',
          margin: '0 auto 12px',
          borderRadius: 18,
          background: 'linear-gradient(135deg, rgba(30,30,40,0.92) 0%, rgba(50,30,60,0.95) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,105,180,0.3)',
          boxShadow: '0 -4px 32px rgba(255,105,180,0.25), 0 2px 16px rgba(0,0,0,0.5)',
          padding: '16px 18px 14px',
          color: '#fff',
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        {/* ヘッダー行 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>📲</span>
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              background: 'linear-gradient(90deg, #FF69B4, #ff9ed8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.02em',
            }}>
              アプリとして使おう！
            </span>
          </div>
          <button
            onClick={handleDismiss}
            aria-label="閉じる"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#aaa',
              fontSize: 16,
              lineHeight: 1,
              transition: 'all 0.2s',
            }}
          >
            ✕
          </button>
        </div>

        {/* iOS 用の手順 */}
        {ios && (
          <div style={{ fontSize: 13, lineHeight: 1.7, color: '#e0e0e0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                borderRadius: 6,
                background: 'rgba(255,105,180,0.2)',
                fontSize: 12,
                fontWeight: 700,
                color: '#FF69B4',
                flexShrink: 0,
              }}>1</span>
              <span>
                下の <span style={{ display: 'inline-flex', alignItems: 'center', padding: '1px 6px', background: 'rgba(0,122,255,0.15)', borderRadius: 6, fontSize: 15 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
                    <polyline points="16 6 12 2 8 6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                </span> 共有ボタンをタップ
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                borderRadius: 6,
                background: 'rgba(255,105,180,0.2)',
                fontSize: 12,
                fontWeight: 700,
                color: '#FF69B4',
                flexShrink: 0,
              }}>2</span>
              <span>「<strong style={{ color: '#fff' }}>ホーム画面に追加</strong>」を選択</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                borderRadius: 6,
                background: 'rgba(255,105,180,0.2)',
                fontSize: 12,
                fontWeight: 700,
                color: '#FF69B4',
                flexShrink: 0,
              }}>3</span>
              <span>右上の「<strong style={{ color: '#fff' }}>追加</strong>」をタップ！</span>
            </div>
          </div>
        )}

        {/* Android: ネイティブインストールプロンプトが使える場合 */}
        {android && hasNativePrompt && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#e0e0e0', margin: '0 0 10px', lineHeight: 1.6 }}>
              ホーム画面に追加すると<br />
              いつでもすぐにアクセスできます！
            </p>
            <button
              onClick={handleInstall}
              style={{
                background: 'linear-gradient(135deg, #FF69B4, #ff3c8e)',
                border: 'none',
                borderRadius: 12,
                padding: '10px 28px',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(255,105,180,0.4)',
                transition: 'all 0.2s',
                letterSpacing: '0.04em',
              }}
            >
              ホーム画面に追加する 🚀
            </button>
          </div>
        )}

        {/* Android: ネイティブプロンプトが使えない場合の手動手順 */}
        {android && !hasNativePrompt && (
          <div style={{ fontSize: 13, lineHeight: 1.7, color: '#e0e0e0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                borderRadius: 6,
                background: 'rgba(255,105,180,0.2)',
                fontSize: 12,
                fontWeight: 700,
                color: '#FF69B4',
                flexShrink: 0,
              }}>1</span>
              <span>
                右上の <span style={{ display: 'inline-flex', alignItems: 'center', padding: '1px 6px', background: 'rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 15 }}>⋮</span> メニューをタップ
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                borderRadius: 6,
                background: 'rgba(255,105,180,0.2)',
                fontSize: 12,
                fontWeight: 700,
                color: '#FF69B4',
                flexShrink: 0,
              }}>2</span>
              <span>「<strong style={{ color: '#fff' }}>ホーム画面に追加</strong>」を選択！</span>
            </div>
          </div>
        )}

        {/* iOS/Android以外のモバイル（フォールバック） */}
        {!ios && !android && (
          <div style={{ fontSize: 13, lineHeight: 1.7, color: '#e0e0e0' }}>
            <p style={{ margin: 0 }}>
              ブラウザのメニューから<br />
              「<strong style={{ color: '#fff' }}>ホーム画面に追加</strong>」を選択してください！
            </p>
          </div>
        )}

        {/* フッターメッセージ */}
        <div style={{
          marginTop: 10,
          paddingTop: 8,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontSize: 11,
          color: '#888',
          textAlign: 'center',
          letterSpacing: '0.02em',
        }}>
          🐘 アプリ版ならもっと快適にズーれるゾウ！
        </div>
      </div>
    </div>
  );
}

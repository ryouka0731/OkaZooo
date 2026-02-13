import { useEffect } from "react";

interface TutorialPopupProps {
  open: boolean;
  onClose: () => void;
}

const TutorialPopup = ({ open, onClose }: TutorialPopupProps) => {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs text-center">
        <div className="text-2xl font-bold mb-2">ホーム画面に追加すれば、<br/>いつでもすぐにズー（Zooo）れるゾウ！🐘</div>
        <button
          className="mt-4 px-4 py-2 bg-[#00bcd4] text-white rounded-full font-bold shadow hover:bg-[#0097a7] transition"
          onClick={onClose}
        >閉じる</button>
      </div>
    </div>
  );
};

export default TutorialPopup;

import { useGameStore } from '../../store/gameStore';

export function Toasts() {
  const toasts = useGameStore((s) => s.toasts);
  if (toasts.length === 0) return null;
  return (
    <div className="absolute top-12 right-2 flex flex-col gap-1 pointer-events-none" dir="rtl">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-3 py-1 border-4 font-body text-base ${
            t.kind === 'item'
              ? 'bg-gbc-yellow text-gbc-frame border-gbc-frame'
              : t.kind === 'quest'
              ? 'bg-gbc-red text-gbc-cream border-gbc-frame'
              : 'bg-gbc-cream text-gbc-frame border-gbc-frame'
          }`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}

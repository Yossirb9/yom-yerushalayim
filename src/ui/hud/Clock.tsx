import { useGameStore } from '../../store/gameStore';

export function Clock() {
  const minutes = useGameStore((s) => s.gameMinutes);
  const day = useGameStore((s) => s.dayCount);
  // game minutes since 06:00
  const total = (6 * 60 + minutes) % (24 * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  return (
    <div className="absolute top-2 left-2 bg-gbc-frame/80 text-gbc-cream border-4 border-gbc-cream/40 px-2 py-1 font-body text-lg pointer-events-none" dir="ltr">
      <span className="text-gbc-yellow">יום {day}</span> · {time}
    </div>
  );
}

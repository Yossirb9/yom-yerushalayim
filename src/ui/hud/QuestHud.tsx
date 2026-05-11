import { useGameStore } from '../../store/gameStore';
import { questById } from '../../game/quests/questRegistry';

export function QuestHud() {
  const quests = useGameStore((s) => s.quests);
  const flags = useGameStore((s) => s.flags);
  const active = quests.find((q) => q.status === 'active');
  if (!active) return null;
  const def = questById(active.id);
  if (!def) return null;
  const nextObj = def.objectives.find((o) => !flags[o.flag]);
  if (!nextObj) return null;
  return (
    <div
      className="absolute -top-12 right-0 bg-gbc-frame/90 text-gbc-cream border-4 border-gbc-yellow px-3 py-1 max-w-[16rem] pointer-events-none"
      dir="rtl"
    >
      <div className="font-rubik font-bold text-base text-gbc-yellow leading-tight">{def.title}</div>
      <div className="font-rubik text-sm text-gbc-cream/90 leading-tight">{nextObj.description}</div>
    </div>
  );
}

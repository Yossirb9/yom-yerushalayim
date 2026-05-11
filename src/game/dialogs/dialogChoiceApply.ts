import { useGameStore } from '../../store/gameStore';
import type { DialogChoice } from '../../types';

export function applyDialogChoice(c: DialogChoice) {
  const s = useGameStore.getState();
  if (c.setFlags) s.setFlags(c.setFlags);
  if (c.giveItems) {
    for (const it of c.giveItems) {
      s.addItem({ id: it.id, name: it.name, description: it.description, icon: it.icon, count: it.count ?? 1 });
    }
  }
}

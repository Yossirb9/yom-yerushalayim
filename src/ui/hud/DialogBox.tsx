import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { findDialog } from '../../game/dialogs/dialogues';
import { audio } from '../../engine/audio';
import { npcById } from '../../game/npcs/npcDefinitions';

const SPEED_MS: Record<string, number> = { slow: 60, normal: 30, fast: 15 };

export function DialogBox() {
  const dialog = useGameStore((s) => s.dialog);
  const setDialogReveal = useGameStore((s) => s.setDialogReveal);
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const textSpeed = useGameStore((s) => s.textSpeed);
  const flags = useGameStore((s) => s.flags);
  const [_, force] = useState(0);

  // Typewriter
  useEffect(() => {
    if (!dialog.active) return;
    const ds = findDialog(dialog.stateId!);
    if (!ds) return;
    const line = ds.lines[dialog.lineIndex];
    if (!line) return;
    if (dialog.charsRevealed >= line.text.length) return;
    const interval = setInterval(() => {
      const cur = useGameStore.getState().dialog;
      const cs = useGameStore.getState();
      if (!cur.active || cur.stateId !== dialog.stateId) {
        clearInterval(interval);
        return;
      }
      const lineNow = ds.lines[cur.lineIndex];
      if (!lineNow) return;
      if (cur.charsRevealed < lineNow.text.length) {
        setDialogReveal(cur.charsRevealed + 1);
        // beep every 3 chars
        if (cs.audioEnabled && cur.charsRevealed % 3 === 0) audio.beep();
      } else {
        clearInterval(interval);
      }
    }, SPEED_MS[textSpeed] ?? 30);
    return () => clearInterval(interval);
  }, [dialog.active, dialog.stateId, dialog.lineIndex, audioEnabled, textSpeed, setDialogReveal]);

  if (!dialog.active || !dialog.stateId) return null;
  const ds = findDialog(dialog.stateId);
  if (!ds) return null;
  const line = ds.lines[dialog.lineIndex];
  if (!line) return null;

  const speakerName = line.speaker ?? npcById(ds.npcId)?.name ?? '';
  const text = line.text.substring(0, dialog.charsRevealed);
  const lineDone = dialog.charsRevealed >= line.text.length;

  // Visible choices when last line is fully shown
  const isLast = dialog.lineIndex >= ds.lines.length - 1;
  const visibleChoices = (ds.choices ?? []).filter((c) => {
    if (c.requireFlag && !flags[c.requireFlag]) return false;
    if (c.excludeFlag && flags[c.excludeFlag]) return false;
    return true;
  });
  const showChoices = dialog.awaitingChoice && isLast && visibleChoices.length > 0;

  return (
    <div className="absolute inset-x-0 bottom-0 px-2 pb-2 pointer-events-none" dir="rtl">
      <div className="bg-gbc-cream text-gbc-frame border-4 border-gbc-frame relative" style={{ boxShadow: 'inset 0 0 0 2px #f7f5e6' }}>
        {speakerName && (
          <div className="absolute -top-7 right-2 bg-gbc-cream text-gbc-frame border-4 border-gbc-frame px-3 py-0.5 font-body text-lg">
            {speakerName}
          </div>
        )}
        <div className="px-4 py-3 min-h-[5.5rem] font-body text-xl md:text-2xl leading-tight">
          {text}
          {!lineDone && <span className="inline-block w-2 ml-1 bg-gbc-frame animate-pulse" />}
        </div>
        {lineDone && !showChoices && !isLast && (
          <div className="absolute bottom-1 left-2 text-gbc-frame text-xl animate-blink-arrow">▼</div>
        )}
        {showChoices && (
          <div className="px-4 pb-3 flex flex-col gap-1">
            {visibleChoices.map((c, i) => (
              <div key={i} className={`font-body text-lg ${i === dialog.choiceIndex ? 'text-gbc-red font-bold' : 'text-gbc-frame'}`}>
                {i === dialog.choiceIndex && '◀ '}
                {c.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { TRACK_INFO, TRACK_ORDER } from '../../game/npcs/npcDefinitions';
import { CHARACTER_PALETTES, getCharacterSprite } from '../../engine/sprites';
import { TILE_PX } from '../../constants/palette';
import { audio } from '../../engine/audio';

const ITEM_REFS: Record<number, HTMLDivElement | null> = {};

const PORTRAIT_SCALE = 8;

function PortraitCanvas({ paletteKey }: { paletteKey: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, c.width, c.height);
    const sprite = getCharacterSprite(paletteKey, CHARACTER_PALETTES[paletteKey], 'down', 0);
    ctx.drawImage(sprite, 0, 0, TILE_PX * PORTRAIT_SCALE, TILE_PX * PORTRAIT_SCALE);
  }, [paletteKey]);
  return (
    <canvas
      ref={ref}
      width={TILE_PX * PORTRAIT_SCALE}
      height={TILE_PX * PORTRAIT_SCALE}
      className="border-4 border-gbc-cream/60 bg-gbc-darkest"
      style={{ width: TILE_PX * PORTRAIT_SCALE, height: TILE_PX * PORTRAIT_SCALE }}
    />
  );
}

export function CharacterSelect() {
  const startNewGame = useGameStore((s) => s.startNewGame);
  const setScreen = useGameStore((s) => s.setScreen);
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const [idx, setIdx] = useState(0);
  const trackId = TRACK_ORDER[idx];
  const info = TRACK_INFO[trackId];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') { setIdx((i) => (i + 1) % TRACK_ORDER.length); audioEnabled && audio.beep(); }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') { setIdx((i) => (i - 1 + TRACK_ORDER.length) % TRACK_ORDER.length); audioEnabled && audio.beep(); }
      if (e.code === 'Enter' || e.code === 'KeyZ' || e.code === 'Space') { audioEnabled && audio.confirm(); startNewGame(trackId); }
      if (e.code === 'Escape' || e.code === 'KeyX') { setScreen('title'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [audioEnabled, idx, startNewGame, setScreen, trackId]);

  // Whenever the selection changes, scroll the focused portrait into view
  // so the user always sees who they have selected (vital on mobile where
  // the row is wider than the screen).
  useEffect(() => {
    const el = ITEM_REFS[idx];
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
  }, [idx]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gbc-dark to-gbc-darkest p-4">
      <div className="font-body text-3xl text-gbc-cream mb-6 pixel-shadow">בחר/י דמות</div>

      {/* Row of 5 sprites - RTL: first item is rightmost */}
      <div
        className="flex flex-row-reverse gap-3 md:gap-6 mb-6 max-w-full px-2 hide-scrollbar"
        style={{ overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none' as any }}
      >
        {TRACK_ORDER.map((id, i) => (
          <div
            key={id}
            ref={(el) => { ITEM_REFS[i] = el; }}
            onClick={() => setIdx(i)}
            className={`cursor-pointer transition-all flex-shrink-0 ${
              idx === i ? 'scale-110' : 'opacity-60'
            }`}
          >
            <div className={`p-1 ${idx === i ? 'bg-gbc-yellow' : ''}`}>
              <PortraitCanvas paletteKey={id} />
            </div>
            <div className={`font-body text-base text-center mt-1 ${idx === i ? 'text-gbc-yellow' : 'text-gbc-cream/60'}`}>
              {TRACK_INFO[id].name}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gbc-frame/80 border-4 border-gbc-cream/60 p-4 max-w-lg w-full">
        <div className="font-body text-2xl text-gbc-yellow mb-2">{info.name}</div>
        <div className="font-body text-lg text-gbc-cream/90 mb-3">{info.oneLine}</div>
        <div className="font-body text-base text-gbc-cream/70 border-t border-gbc-cream/30 pt-2">
          <span className="text-gbc-yellow">המשימה:</span> {info.goal}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => { audioEnabled && audio.confirm(); startNewGame(trackId); }}
          className="font-body text-xl bg-gbc-cream text-gbc-frame px-6 py-2 border-4 border-gbc-yellow"
        >
          ▶ התחל
        </button>
        <button
          onClick={() => setScreen('title')}
          className="font-body text-xl bg-gbc-frame/70 text-gbc-cream px-6 py-2 border-4 border-gbc-cream/30"
        >
          חזרה
        </button>
      </div>
    </div>
  );
}

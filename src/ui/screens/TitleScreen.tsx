import { useGameStore } from '../../store/gameStore';
import { useEffect, useState } from 'react';
import { audio } from '../../engine/audio';

export function TitleScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const continueGame = useGameStore((s) => s.continueGame);
  const player = useGameStore((s) => s.player);
  const resetSave = useGameStore((s) => s.resetSave);
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const [selected, setSelected] = useState(0);

  const options = [
    { label: 'התחל משחק חדש', action: () => { resetSave(); setScreen('characterSelect'); } },
    ...(player ? [{ label: 'המשך', action: () => continueGame() }] : []),
    { label: audioEnabled ? '🔊 צליל פועל' : '🔇 צליל כבוי', action: () => useGameStore.getState().toggleAudio() },
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') { setSelected((s) => (s - 1 + options.length) % options.length); audioEnabled && audio.beep(); }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') { setSelected((s) => (s + 1) % options.length); audioEnabled && audio.beep(); }
      if (e.code === 'Enter' || e.code === 'KeyZ' || e.code === 'Space') { audioEnabled && audio.confirm(); options[selected].action(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, options, audioEnabled]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(26,58,110,0.0) 0%, rgba(26,58,110,0.0) 55%, rgba(0,0,0,0.6) 100%), url(/sprites/title_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated' as any,
      }}
    >
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      <div className="relative w-full flex flex-col items-center mt-6 mb-auto px-4">
        <div className="font-title text-5xl md:text-7xl text-gbc-cream leading-none mb-2" style={{ textShadow: '4px 4px 0 #000, 0 0 14px rgba(0,0,0,0.7)' }}>
          יום ירושלים
        </div>
        <div className="font-rubik font-black text-2xl md:text-3xl text-gbc-yellow mt-2 mb-1 tracking-wide" style={{ textShadow: '2px 2px 0 #000' }}>
          מסע בעיר הקודש
        </div>
        <div className="font-rubik text-base md:text-xl text-gbc-cream/95 mt-2" style={{ textShadow: '2px 2px 0 #000' }}>
          ✦ משחק חינוכי לכיתות ד׳-ו׳ ✦
        </div>
        <div className="font-rubik text-sm md:text-base text-gbc-cream mt-3 leading-tight" style={{ textShadow: '2px 2px 0 #000' }}>
          לבית הספר "צליל למצוינות" ע״ש לילה חלילי
        </div>
        <div className="font-rubik text-xs md:text-sm text-gbc-cream/80 mt-1" style={{ textShadow: '1px 1px 0 #000' }}>
          פותח ע"י יוסי רבינוביץ׳
        </div>
      </div>

      <div className="relative flex flex-col gap-3 w-full max-w-xs">
        {options.map((opt, i) => (
          <button
            key={i}
            onMouseEnter={() => setSelected(i)}
            onClick={() => opt.action()}
            className={`font-rubik font-bold text-xl py-3 px-6 border-4 transition-transform ${
              selected === i
                ? 'bg-gbc-yellow text-gbc-frame border-gbc-frame scale-105'
                : 'bg-gbc-frame/85 text-gbc-cream border-gbc-cream/40'
            }`}
            style={{ textShadow: selected === i ? 'none' : '1px 1px 0 #000' }}
          >
            {selected === i && <span className="ml-2">▶</span>}
            {opt.label}
          </button>
        ))}
      </div>

      <div className="relative font-rubik text-sm text-gbc-cream mt-5 mb-2" style={{ textShadow: '1px 1px 0 #000' }}>
        חצים = תנועה · Z / Space = אישור · Esc = תפריט
      </div>
    </div>
  );
}

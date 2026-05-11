import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { TitleScreen } from './ui/screens/TitleScreen';
import { CharacterSelect } from './ui/screens/CharacterSelect';
import { GameScreen } from './ui/screens/GameScreen';
import { MenuScreen } from './ui/screens/MenuScreen';
import { EndingScreen } from './ui/screens/EndingScreen';

const FADE_OUT_MS = 800;
const BLACK_HOLD_MS = 700;
const FADE_IN_MS = 800;

export default function App() {
  const screen = useGameStore((s) => s.screen);
  const flags = useGameStore((s) => s.flags);
  const setScreen = useGameStore((s) => s.setScreen);
  const sleepFade = useGameStore((s) => s.sleepFade);
  const setSleepFade = useGameStore((s) => s.setSleepFade);
  const [, force] = useState(0);

  // Transition to the ending after the ceremony has finished.
  useEffect(() => {
    if ((screen === 'game' || screen === 'menu') && flags.ceremony_finished) {
      const t = setTimeout(() => setScreen('ending'), 1500);
      return () => clearTimeout(t);
    }
  }, [screen, flags.ceremony_finished, setScreen]);

  // Optional fade transition (not used by Yom Yerushalayim core flow but kept
  // for parity with the engine).
  useEffect(() => {
    if (!sleepFade) return;
    let id = 0;
    const tick = () => {
      const elapsed = performance.now() - sleepFade.startedAt;
      if (sleepFade.phase === 'fade-out' && elapsed >= FADE_OUT_MS) {
        setSleepFade({ phase: 'black', startedAt: performance.now() });
        return;
      }
      if (sleepFade.phase === 'black' && elapsed >= BLACK_HOLD_MS) {
        setSleepFade({ phase: 'fade-in', startedAt: performance.now() });
        return;
      }
      if (sleepFade.phase === 'fade-in' && elapsed >= FADE_IN_MS) {
        setSleepFade(null);
        return;
      }
      force((x) => x + 1);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [sleepFade, setSleepFade]);

  let overlayAlpha = 0;
  if (sleepFade) {
    const elapsed = performance.now() - sleepFade.startedAt;
    if (sleepFade.phase === 'fade-out') overlayAlpha = Math.min(1, elapsed / FADE_OUT_MS);
    else if (sleepFade.phase === 'black') overlayAlpha = 1;
    else if (sleepFade.phase === 'fade-in') overlayAlpha = Math.max(0, 1 - elapsed / FADE_IN_MS);
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden font-body" dir="rtl">
      {screen === 'title' && <TitleScreen />}
      {screen === 'characterSelect' && <CharacterSelect />}
      {screen === 'game' && <GameScreen />}
      {screen === 'menu' && <MenuScreen />}
      {screen === 'ending' && <EndingScreen />}
      {overlayAlpha > 0 && (
        <div
          className="absolute inset-0 pointer-events-none z-50"
          style={{ background: `rgba(0,0,0,${overlayAlpha})` }}
        />
      )}
    </div>
  );
}

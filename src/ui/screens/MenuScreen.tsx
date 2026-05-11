import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { questById } from '../../game/quests/questRegistry';
import { TRACK_INFO } from '../../game/npcs/npcDefinitions';
import { audio } from '../../engine/audio';

type Tab = 'quests' | 'inventory' | 'settings';

export function MenuScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const quests = useGameStore((s) => s.quests);
  const inventory = useGameStore((s) => s.inventory);
  const player = useGameStore((s) => s.player);
  const flags = useGameStore((s) => s.flags);
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const textSpeed = useGameStore((s) => s.textSpeed);
  const setTextSpeed = useGameStore((s) => s.setTextSpeed);
  const toggleAudio = useGameStore((s) => s.toggleAudio);
  const resetSave = useGameStore((s) => s.resetSave);
  const [tab, setTab] = useState<Tab>('quests');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'Tab' || e.code === 'KeyX') {
        audio.cancel();
        setScreen('game');
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        const order: Tab[] = ['quests', 'inventory', 'settings'];
        setTab(order[(order.indexOf(tab) + 1) % order.length]);
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        const order: Tab[] = ['quests', 'inventory', 'settings'];
        setTab(order[(order.indexOf(tab) - 1 + order.length) % order.length]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [tab, setScreen]);

  const trackInfo = player ? TRACK_INFO[player.trackId] : null;

  return (
    <div className="absolute inset-0 bg-gbc-darkest text-gbc-cream font-body p-4 overflow-auto" dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-3xl text-gbc-yellow">תפריט</div>
          {trackInfo && <div className="text-base text-gbc-cream/70">{trackInfo.name} · {trackInfo.goal}</div>}
        </div>
        <button
          onClick={() => setScreen('game')}
          className="bg-gbc-frame/70 border-4 border-gbc-cream/40 px-4 py-1 text-xl"
        >
          ✕ סגור
        </button>
      </div>

      <div className="flex flex-row-reverse gap-2 mb-4">
        {(['quests', 'inventory', 'settings'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-xl border-4 ${tab === t ? 'bg-gbc-yellow text-gbc-frame border-gbc-frame' : 'bg-gbc-frame/70 text-gbc-cream border-gbc-cream/30'}`}
          >
            {t === 'quests' ? 'משימות' : t === 'inventory' ? 'תיק' : 'הגדרות'}
          </button>
        ))}
      </div>

      {tab === 'quests' && (
        <div className="space-y-3">
          {quests.length === 0 && <div className="text-gbc-cream/60">אין משימות פעילות.</div>}
          {quests.map((q) => {
            const def = questById(q.id);
            if (!def) return null;
            return (
              <div key={q.id} className={`border-4 p-3 ${q.status === 'completed' ? 'border-gbc-mid bg-gbc-dark/40' : 'border-gbc-yellow bg-gbc-frame/40'}`}>
                <div className="flex justify-between items-start mb-1">
                  <div className="text-xl text-gbc-yellow">{def.title}</div>
                  <div className="text-base text-gbc-cream/60">{q.status === 'completed' ? '✓ הושלם' : 'פעיל'}</div>
                </div>
                <div className="text-base text-gbc-cream/80 mb-2">{def.description}</div>
                <ul className="space-y-1">
                  {def.objectives.map((o) => (
                    <li key={o.id} className={`text-base ${flags[o.flag] ? 'line-through text-gbc-cream/50' : 'text-gbc-cream'}`}>
                      {flags[o.flag] ? '☑' : '☐'} {o.description}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'inventory' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {inventory.length === 0 && <div className="col-span-full text-gbc-cream/60">התיק ריק.</div>}
          {inventory.map((it) => (
            <div key={it.id} className="border-4 border-gbc-cream/40 bg-gbc-frame/40 p-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-3xl">{it.icon}</div>
                <div className="text-lg text-gbc-yellow">{it.name}</div>
                {it.count > 1 && <div className="text-base text-gbc-cream/60">x{it.count}</div>}
              </div>
              <div className="text-base text-gbc-cream/80">{it.description}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'settings' && (
        <div className="space-y-4 max-w-sm">
          <div className="flex justify-between items-center">
            <span className="text-xl">צליל</span>
            <button onClick={toggleAudio} className="bg-gbc-yellow text-gbc-frame border-4 border-gbc-frame px-4 py-1 text-lg">
              {audioEnabled ? 'פועל' : 'כבוי'}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xl">מהירות טקסט</span>
            <div className="flex gap-1">
              {(['slow', 'normal', 'fast'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setTextSpeed(s)}
                  className={`px-3 py-1 text-base border-4 ${textSpeed === s ? 'bg-gbc-yellow text-gbc-frame border-gbc-frame' : 'bg-gbc-frame/70 text-gbc-cream border-gbc-cream/30'}`}
                >
                  {s === 'slow' ? 'איטי' : s === 'normal' ? 'רגיל' : 'מהיר'}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-gbc-cream/20">
            <button
              onClick={() => {
                if (confirm('לאפס שמירה? כל ההתקדמות תאבד.')) {
                  resetSave();
                  setScreen('title');
                }
              }}
              className="bg-gbc-red text-gbc-cream border-4 border-gbc-frame px-4 py-2 text-lg"
            >
              איפוס שמירה
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { TRACK_INFO } from '../../game/npcs/npcDefinitions';
import { audio } from '../../engine/audio';

const TRACK_ENDING: Record<string, { title: string; lines: string[]; tagline: string }> = {
  daniel: {
    title: 'מצודת דוד נכבשה',
    lines: [
      'טיפסת על כל המדרגות במצודה.',
      'ספרת 7 שכבות היסטוריות ולקחת תמונות מהפסגה.',
      'עוד יום אחד קרוב יותר לאליפות הספורט של בית הספר.',
    ],
    tagline: 'דניאל: מי בא איתי לעלות שוב?',
  },
  shira: {
    title: 'שיר אחרי שיר',
    lines: [
      'למדת 3 שירים על ירושלים.',
      'שרת ב"ירושלים של זהב" בטקס בית הספר.',
      'ההורים בקהל בכו (במובן הטוב).',
    ],
    tagline: 'שירה: 🎵 כינור הרוח שלום עירך 🎵',
  },
  uri: {
    title: 'הפנקס של אורי',
    lines: [
      'אספת 5 עובדות חדשות על העיר.',
      'הצגת אותן בטקס. הכיתה למדה ממך.',
      'שמרת את הפנקס לשנה הבאה — אולי כיתה ה׳ תרחיב.',
    ],
    tagline: 'אורי: ידעתם? ירושלים נכבשה 44 פעמים בהיסטוריה.',
  },
  yael: {
    title: 'הביקורת של יעל',
    lines: [
      'טעמת 4 מאכלים: פיתה, חלוואה, חמוצים, רימוניאדה.',
      'כתבת ביקורת ארוכה לעיתון בית הספר.',
      'המוכרים במחנה יהודה כבר מכירים אותך בשם.',
    ],
    tagline: 'יעל: צריך עוד מלח. אבל בסך הכל - 4 כוכבים.',
  },
};

export function EndingScreen() {
  const player = useGameStore((s) => s.player);
  const setScreen = useGameStore((s) => s.setScreen);
  const resetSave = useGameStore((s) => s.resetSave);
  const audioEnabled = useGameStore((s) => s.audioEnabled);

  useEffect(() => {
    if (audioEnabled) audio.questDone();
  }, [audioEnabled]);

  if (!player) return null;
  const info = TRACK_INFO[player.trackId];
  const ending = TRACK_ENDING[player.trackId];

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center p-4 overflow-auto"
      dir="rtl"
      style={{ background: 'linear-gradient(180deg, #1a3a6e 0%, #d4a04a 100%)' }}
    >
      <div className="font-title text-3xl md:text-4xl text-gbc-cream mb-3 pixel-shadow text-center" style={{ textShadow: '3px 3px 0 #000' }}>
        יום ירושלים שמח!
      </div>
      <div className="font-rubik font-bold text-2xl text-gbc-yellow mb-1" style={{ textShadow: '2px 2px 0 #000' }}>
        {info.name} · {ending.title}
      </div>

      <div className="bg-gbc-frame/85 border-4 border-gbc-cream/60 p-5 max-w-md w-full mb-4 mt-4">
        {ending.lines.map((l, i) => (
          <div key={i} className="font-rubik text-lg text-gbc-cream mb-2 leading-tight">
            {l}
          </div>
        ))}
      </div>

      <div className="bg-gbc-yellow text-gbc-frame border-4 border-gbc-frame px-4 py-2 font-rubik text-lg mb-6 max-w-md text-center">
        {ending.tagline}
      </div>

      <div className="bg-gbc-frame/70 border-2 border-gbc-cream/30 p-4 max-w-md w-full mb-6 text-center">
        <div className="font-rubik text-sm text-gbc-cream/80 mb-2">מהכיתה אליכם:</div>
        <div className="font-rubik text-base text-gbc-cream space-y-1 leading-tight">
          <div>"כל אבן בעיר הזאת מספרת סיפור."</div>
          <div>"מי שלא ראה ירושלים בתפארתה, לא ראה כרך נחמד מעולם."</div>
          <div className="text-gbc-yellow mt-2">— תלמוד בבלי, סוכה נ"א ע"ב</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => { resetSave(); setScreen('characterSelect'); }}
          className="font-rubik font-bold text-lg bg-gbc-cream text-gbc-frame px-6 py-2 border-4 border-gbc-yellow"
        >
          לדמות אחרת
        </button>
        <button
          onClick={() => setScreen('title')}
          className="font-rubik font-bold text-lg bg-gbc-frame/70 text-gbc-cream px-6 py-2 border-4 border-gbc-cream/30"
        >
          תפריט ראשי
        </button>
      </div>
    </div>
  );
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Direction, ScreenName, InventoryItem, PlayerTrackId } from '../types';

const SAVE_KEY = 'yom-yerushalayim:save:v1';

export interface PlayerState {
  trackId: PlayerTrackId;
  mapId: string;
  x: number;
  y: number;
  facing: Direction;
}

export interface QuestRuntime {
  id: string;
  status: 'active' | 'completed';
  completedObjectives: string[];
}

export interface DialogRuntime {
  active: boolean;
  npcId: string | null;
  stateId: string | null;
  lineIndex: number;
  charsRevealed: number;
  awaitingChoice: boolean;
  choiceIndex: number;
}

export type ToastMessage = { id: number; text: string; kind: 'item' | 'quest' | 'flag' };

export interface GameStore {
  screen: ScreenName;
  player: PlayerState | null;
  flags: Record<string, boolean>;
  inventory: InventoryItem[];
  quests: QuestRuntime[];
  gameMinutes: number;
  dayCount: number;
  dialog: DialogRuntime;
  audioEnabled: boolean;
  textSpeed: 'slow' | 'normal' | 'fast';
  toasts: ToastMessage[];
  chickenTile: { x: number; y: number } | null;
  chickenLastMoveAt: number;
  npcRuntime: Record<
    string,
    {
      x: number;
      y: number;
      fromX: number;
      fromY: number;
      animStart: number;
      animMs: number;
      facing: Direction;
      lastMoveAt: number;
      walkFrame: number;
    }
  >;
  // Visible interactives (shopkeepers, teachers) periodically turn in place
  // so they feel alive without breaking collision/interaction.
  interactiveRuntime: Record<string, { facing: Direction; lastTurnAt: number }>;
  initInteractiveRuntime: (entries: Record<string, { facing: Direction; lastTurnAt: number }>) => void;
  updateInteractiveRuntime: (id: string, patch: Partial<{ facing: Direction; lastTurnAt: number }>) => void;
  sleepFade: { phase: 'fade-out' | 'black' | 'fade-in'; startedAt: number } | null;
  setSleepFade: (s: GameStore['sleepFade']) => void;

  setScreen: (s: ScreenName) => void;
  startNewGame: (trackId: PlayerTrackId) => void;
  continueGame: () => boolean;
  setPlayerPos: (x: number, y: number, facing: Direction) => void;
  setPlayerMap: (mapId: string, x: number, y: number, facing: Direction) => void;
  setFacing: (d: Direction) => void;
  setFlag: (flag: string, value: boolean) => void;
  setFlags: (flags: string[]) => void;
  hasFlag: (flag: string) => boolean;
  addItem: (item: Omit<InventoryItem, 'count'> & { count?: number }) => void;
  hasItem: (id: string) => boolean;
  advanceTime: (minutes: number) => void;
  setTextSpeed: (s: 'slow' | 'normal' | 'fast') => void;
  toggleAudio: () => void;

  startDialog: (npcId: string, stateId: string) => void;
  setDialogReveal: (chars: number) => void;
  nextDialogLine: () => void;
  setAwaitingChoice: (a: boolean) => void;
  setChoiceIndex: (i: number) => void;
  closeDialog: () => void;

  startQuest: (id: string) => void;
  completeObjective: (questId: string, objectiveId: string) => void;
  completeQuest: (id: string) => void;

  pushToast: (text: string, kind: ToastMessage['kind']) => void;
  popToast: (id: number) => void;
  resetSave: () => void;
  setChickenTile: (t: { x: number; y: number } | null, now: number) => void;
  initNpcRuntime: (entries: GameStore['npcRuntime']) => void;
  updateNpcRuntime: (id: string, patch: Partial<GameStore['npcRuntime'][string]>) => void;
}

const initialDialog: DialogRuntime = {
  active: false,
  npcId: null,
  stateId: null,
  lineIndex: 0,
  charsRevealed: 0,
  awaitingChoice: false,
  choiceIndex: 0,
};

let toastSeq = 1;

// In the Yom Yerushalayim game every player track is selectable; there's no
// "self quest" pattern.
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      screen: 'title',
      player: null,
      flags: {},
      inventory: [],
      quests: [],
      gameMinutes: 60 * 2,
      dayCount: 1,
      dialog: initialDialog,
      audioEnabled: true,
      textSpeed: 'normal',
      toasts: [],
      chickenTile: null,
      chickenLastMoveAt: 0,
      npcRuntime: {},
      interactiveRuntime: {},
      sleepFade: null,

      setScreen: (s) => set({ screen: s }),

      startNewGame: (trackId) => {
        set({
          screen: 'game',
          player: { trackId, mapId: 'school', x: 7, y: 12, facing: 'up' },
          flags: { game_started: true, [`track_${trackId}`]: true },
          inventory: [],
          quests: [],
          gameMinutes: 60 * 2,
          dayCount: 1,
          dialog: initialDialog,
          toasts: [],
          chickenTile: null,
          npcRuntime: {},
        });
      },

      continueGame: () => {
        const { player } = get();
        if (player) {
          set({ screen: 'game' });
          return true;
        }
        return false;
      },

      setPlayerPos: (x, y, facing) => {
        const p = get().player;
        if (!p) return;
        set({ player: { ...p, x, y, facing } });
      },

      setPlayerMap: (mapId, x, y, facing) => {
        const p = get().player;
        if (!p) return;
        set({ player: { ...p, mapId, x, y, facing } });
      },

      setFacing: (d) => {
        const p = get().player;
        if (!p) return;
        set({ player: { ...p, facing: d } });
      },

      setFlag: (flag, value) => set({ flags: { ...get().flags, [flag]: value } }),

      setFlags: (flags) => {
        if (!flags || flags.length === 0) return;
        const map = { ...get().flags };
        for (const f of flags) map[f] = true;
        set({ flags: map });
      },

      hasFlag: (flag) => Boolean(get().flags[flag]),

      addItem: (item) => {
        const inv = get().inventory.slice();
        const existing = inv.find((i) => i.id === item.id);
        if (existing) existing.count += item.count ?? 1;
        else inv.push({ ...item, count: item.count ?? 1 });
        set({ inventory: inv });
        get().pushToast(`קיבלת: ${item.name}`, 'item');
      },

      hasItem: (id) => get().inventory.some((i) => i.id === id),

      advanceTime: (minutes) => {
        let m = get().gameMinutes + minutes;
        let d = get().dayCount;
        while (m >= 18 * 60) {
          m -= 18 * 60;
          d += 1;
        }
        set({ gameMinutes: m, dayCount: d });
      },

      setTextSpeed: (s) => set({ textSpeed: s }),
      toggleAudio: () => set({ audioEnabled: !get().audioEnabled }),

      startDialog: (npcId, stateId) =>
        set({ dialog: { ...initialDialog, active: true, npcId, stateId } }),
      setDialogReveal: (chars) => set({ dialog: { ...get().dialog, charsRevealed: chars } }),
      nextDialogLine: () => {
        const d = get().dialog;
        set({
          dialog: {
            ...d,
            lineIndex: d.lineIndex + 1,
            charsRevealed: 0,
            awaitingChoice: false,
            choiceIndex: 0,
          },
        });
      },
      setAwaitingChoice: (a) => set({ dialog: { ...get().dialog, awaitingChoice: a, choiceIndex: 0 } }),
      setChoiceIndex: (i) => set({ dialog: { ...get().dialog, choiceIndex: i } }),
      closeDialog: () => set({ dialog: initialDialog }),

      startQuest: (id) => {
        if (get().quests.find((q) => q.id === id)) return;
        set({ quests: [...get().quests, { id, status: 'active', completedObjectives: [] }] });
      },
      completeObjective: (questId, objectiveId) => {
        set({
          quests: get().quests.map((q) =>
            q.id === questId && !q.completedObjectives.includes(objectiveId)
              ? { ...q, completedObjectives: [...q.completedObjectives, objectiveId] }
              : q,
          ),
        });
      },
      completeQuest: (id) => {
        set({
          quests: get().quests.map((q) => (q.id === id ? { ...q, status: 'completed' } : q)),
        });
        get().pushToast('משימה הושלמה!', 'quest');
      },

      pushToast: (text, kind) => {
        const id = toastSeq++;
        set({ toasts: [...get().toasts, { id, text, kind }] });
        setTimeout(() => get().popToast(id), 3000);
      },
      popToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

      resetSave: () => {
        set({
          screen: 'title',
          player: null,
          flags: {},
          inventory: [],
          quests: [],
          gameMinutes: 60 * 2,
          dayCount: 1,
          dialog: initialDialog,
          toasts: [],
          chickenTile: null,
          npcRuntime: {},
        });
      },

      setChickenTile: (t, now) => set({ chickenTile: t, chickenLastMoveAt: now }),
      setSleepFade: (s) => set({ sleepFade: s }),
      initNpcRuntime: (entries) => set({ npcRuntime: entries }),
      updateNpcRuntime: (id, patch) => {
        const cur = get().npcRuntime[id];
        if (!cur) return;
        set({ npcRuntime: { ...get().npcRuntime, [id]: { ...cur, ...patch } } });
      },
      initInteractiveRuntime: (entries) => set({ interactiveRuntime: entries }),
      updateInteractiveRuntime: (id, patch) => {
        const cur = get().interactiveRuntime[id];
        if (!cur) return;
        set({ interactiveRuntime: { ...get().interactiveRuntime, [id]: { ...cur, ...patch } } });
      },
    }),
    {
      name: SAVE_KEY,
      partialize: (s) => ({
        screen: s.screen === 'menu' ? 'game' : s.screen,
        player: s.player,
        flags: s.flags,
        inventory: s.inventory,
        quests: s.quests,
        gameMinutes: s.gameMinutes,
        dayCount: s.dayCount,
        audioEnabled: s.audioEnabled,
        textSpeed: s.textSpeed,
      }),
    },
  ),
);

if (typeof window !== 'undefined') {
  (window as any).__gs = useGameStore;
}

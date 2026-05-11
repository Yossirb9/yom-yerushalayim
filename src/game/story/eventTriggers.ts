import { useGameStore } from '../../store/gameStore';
import { QUESTS } from '../quests/questRegistry';

export function evaluateStoryTriggers() {
  const state = useGameStore.getState();

  // Activate quests by startFlag
  for (const q of QUESTS) {
    if (state.flags[q.startFlag] && !state.quests.find((qr) => qr.id === q.id)) {
      state.startQuest(q.id);
    }
  }

  // Re-fetch
  const s2 = useGameStore.getState();
  for (const q of QUESTS) {
    const runtime = s2.quests.find((r) => r.id === q.id);
    if (!runtime || runtime.status === 'completed') continue;
    let allDone = true;
    for (const obj of q.objectives) {
      if (s2.flags[obj.flag]) {
        if (!runtime.completedObjectives.includes(obj.id)) {
          state.completeObjective(q.id, obj.id);
        }
      } else {
        allDone = false;
      }
    }
    if (allDone) state.completeQuest(q.id);
  }

  // Class is ready to go once all 3 pre-trip flags are set.
  const s3 = useGameStore.getState();
  if (
    !s3.flags['class_ready_to_go'] &&
    s3.flags['teacher_briefed'] &&
    s3.flags['has_jerusalem_book'] &&
    s3.flags['has_permission_slip']
  ) {
    state.setFlag('class_ready_to_go', true);
    state.pushToast('כל הכיתה מוכנה — לאוטובוס!', 'flag');
  }

  // All Jerusalem stops visited?  Auto-warp condition gets unlocked
  // and the principal at the ceremony triggers the final dialog.
  if (
    !s3.flags['all_stops_visited'] &&
    s3.flags['stop_tower_done'] &&
    s3.flags['stop_kotel_done'] &&
    s3.flags['stop_market_done'] &&
    s3.flags['stop_tayelet_done'] &&
    s3.flags['stop_center_done']
  ) {
    state.setFlag('all_stops_visited', true);
    state.pushToast('כל התחנות מולאו! חזרו לאוטובוס.', 'flag');
  }
}

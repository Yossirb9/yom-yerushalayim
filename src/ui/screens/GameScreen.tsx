import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { TILE_SIZE, VIEW_TILES_W, VIEW_TILES_H } from '../../constants/palette';
import { input } from '../../engine/input';
import { followCamera } from '../../engine/camera';
import { advanceMover, facingTile, newMover, tryStartMove } from '../../engine/gameLoop';
import { applyAmbient, clearCanvas, renderCharacter, renderMap } from '../../engine/renderer';
import { getMap } from '../../game/maps/mapsRegistry';
import { npcPositionOn, visibleNpcsOn, NPCS } from '../../game/npcs/npcDefinitions';
import { resolveDialogState } from '../../game/dialogs/dialogResolver';
import { findDialog, pickFirstAvailable } from '../../game/dialogs/dialogues';
import { evaluateStoryTriggers } from '../../game/story/eventTriggers';
import { applyDialogChoice } from '../../game/dialogs/dialogChoiceApply';
import { interactivesOn, interactiveAt } from '../../game/interactives/interactives';
import { isBlocked } from '../../engine/collision';
import { getTileSprite, areTilesheetsReady, preloadTilesheets } from '../../engine/tiles';
import { areCharacterSheetsReady, preloadCharacterSheets } from '../../engine/sprites';
import { DialogBox } from '../hud/DialogBox';
import { QuestHud } from '../hud/QuestHud';
import { Clock } from '../hud/Clock';
import { TouchControls } from '../hud/TouchControls';
import { Toasts } from '../hud/Toasts';
import { audio } from '../../engine/audio';
import type { Direction, DialogState, DialogChoice } from '../../types';

const CANVAS_W = VIEW_TILES_W * TILE_SIZE;
const CANVAS_H = VIEW_TILES_H * TILE_SIZE;

function dirToDelta(dir: Direction): [number, number] {
  if (dir === 'up') return [0, -1];
  if (dir === 'down') return [0, 1];
  if (dir === 'left') return [-1, 0];
  return [1, 0];
}

function visibleChoices(ds: DialogState | undefined, flags: Record<string, boolean>): DialogChoice[] {
  if (!ds?.choices) return [];
  return ds.choices.filter((c) => {
    if (c.requireFlag && !flags[c.requireFlag]) return false;
    if (c.excludeFlag && flags[c.excludeFlag]) return false;
    return true;
  });
}

export function GameScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const player = useGameStore((s) => s.player)!;
  const setPlayerPos = useGameStore((s) => s.setPlayerPos);
  const setPlayerMap = useGameStore((s) => s.setPlayerMap);
  const setFacing = useGameStore((s) => s.setFacing);
  const advanceTime = useGameStore((s) => s.advanceTime);
  const startDialog = useGameStore((s) => s.startDialog);
  const setScreen = useGameStore((s) => s.setScreen);
  const dialog = useGameStore((s) => s.dialog);
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const [, force] = useState(0);
  const [assetsReady, setAssetsReady] = useState(
    () => areTilesheetsReady() && areCharacterSheetsReady(),
  );

  // Kick off preload + poll until both tilesets and character sheets are ready
  // so we don't render the procedural fallback on first paint.
  useEffect(() => {
    if (assetsReady) return;
    preloadTilesheets();
    preloadCharacterSheets();
    let cancelled = false;
    const poll = () => {
      if (cancelled) return;
      if (areTilesheetsReady() && areCharacterSheetsReady()) {
        setAssetsReady(true);
        return;
      }
      setTimeout(poll, 60);
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [assetsReady]);

  const moverRef = useRef(newMover(player.x, player.y, player.facing));
  useEffect(() => {
    moverRef.current = newMover(player.x, player.y, player.facing);
    // Initialize NPC runtime positions when map changes.  We seed entries for
    // EVERY NPC that has a position on this map (including ones hidden by
    // flags right now, like Or) so they're ready to wander the moment they
    // become visible.
    const entries: ReturnType<typeof useGameStore.getState>['npcRuntime'] = {};
    for (const n of NPCS) {
      if (n.trackId === player.trackId) continue;
      const pos = npcPositionOn(n, player.mapId);
      if (pos) {
        entries[n.id] = {
          x: pos.x,
          y: pos.y,
          fromX: pos.x,
          fromY: pos.y,
          animStart: 0,
          animMs: 0,
          facing: pos.facing,
          lastMoveAt: 0,
          walkFrame: 0,
        };
      }
    }
    useGameStore.getState().initNpcRuntime(entries);

    // Initialize interactive runtime (visible interactives turn in place).
    const intEntries: Record<string, { facing: Direction; lastTurnAt: number }> = {};
    for (const it of interactivesOn(player.mapId)) {
      if (!it.spritePalette) continue; // invisible signs don't need runtime state
      intEntries[it.id] = { facing: it.facing ?? 'down', lastTurnAt: 0 };
    }
    useGameStore.getState().initInteractiveRuntime(intEntries);
  }, [player.mapId, player.trackId]);

  useEffect(() => {
    if (!assetsReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    let raf = 0;

    const tryInteract = () => {
      const state = useGameStore.getState();
      const m = moverRef.current;
      const ft = facingTile(m);
      const npcs = visibleNpcsOn(state.player!.mapId, state.player!.trackId, state.flags);
      const npc = npcs.find((n) => {
        const rt = state.npcRuntime[n.id];
        const p = rt ?? npcPositionOn(n, state.player!.mapId);
        return p && p.x === ft.tx && p.y === ft.ty;
      });
      if (npc) {
        const stateId = resolveDialogState(npc, state.flags, state.player!.trackId, state.player!.mapId);
        if (stateId) {
          const ds = findDialog(stateId);
          if (ds?.onEnterSetFlags) state.setFlags(ds.onEnterSetFlags);
          if (ds?.onEnterGiveItems) {
            for (const it of ds.onEnterGiveItems)
              state.addItem({ id: it.id, name: it.name, description: it.description, icon: it.icon, count: it.count ?? 1 });
          }
          // Make the NPC turn to face the player.
          const opposite: Record<Direction, Direction> = { up: 'down', down: 'up', left: 'right', right: 'left' };
          if (state.npcRuntime[npc.id]) {
            state.updateNpcRuntime(npc.id, { facing: opposite[m.facing] });
          }
          startDialog(npc.id, stateId);
          evaluateStoryTriggers();
          if (state.audioEnabled) audio.confirm();
          return;
        }
      }
      // Special case: chicken (dynamic position).
      if (
        state.player!.mapId === 'town' &&
        state.chickenTile &&
        !state.flags.gasner_chicken_done &&
        ft.tx === state.chickenTile.x &&
        ft.ty === state.chickenTile.y
      ) {
        // Use the static chicken interactive's dialog states for resolution.
        const ints = interactivesOn('town');
        const chickenDef = ints.find((i) => i.id === 'chicken');
        if (chickenDef) {
          const ds = pickFirstAvailable(chickenDef.dialogStates, state.flags);
          if (ds) {
            if (ds.onEnterSetFlags) state.setFlags(ds.onEnterSetFlags);
            if (ds.onEnterGiveItems) {
              for (const it of ds.onEnterGiveItems)
                state.addItem({ id: it.id, name: it.name, description: it.description, icon: it.icon, count: it.count ?? 1 });
            }
            state.startDialog(chickenDef.id, ds.id);
            evaluateStoryTriggers();
            // After successfully catching the chicken, hide it.
            if (state.flags.chicken_quest_active && useGameStore.getState().flags.gasner_chicken_done) {
              useGameStore.getState().setChickenTile(null, performance.now());
            }
            if (state.audioEnabled) audio.confirm();
            return;
          }
        }
      }

      // Try interactive (signs, pickups, shopkeepers)
      const interactive = interactiveAt(state.player!.mapId, ft.tx, ft.ty);
      if (interactive) {
        const ds = pickFirstAvailable(interactive.dialogStates, state.flags);
        if (ds) {
          if (ds.onEnterSetFlags) state.setFlags(ds.onEnterSetFlags);
          if (ds.onEnterGiveItems) {
            for (const it of ds.onEnterGiveItems)
              state.addItem({ id: it.id, name: it.name, description: it.description, icon: it.icon, count: it.count ?? 1 });
          }
          // Make visible interactives turn to face the player when talked to.
          const opposite: Record<Direction, Direction> = { up: 'down', down: 'up', left: 'right', right: 'left' };
          if (interactive.spritePalette && state.interactiveRuntime[interactive.id]) {
            state.updateInteractiveRuntime(interactive.id, {
              facing: opposite[m.facing],
              lastTurnAt: performance.now(),
            });
          }
          state.startDialog(interactive.id, ds.id);
          evaluateStoryTriggers();
          if (state.audioEnabled) audio.confirm();
          return;
        }
      }
      if (state.audioEnabled) audio.cancel();
    };

    const handleDialogInput = () => {
      const state = useGameStore.getState();
      if (input.consumePress('menu') || input.consumePress('cancel')) {
        state.closeDialog();
        if (state.audioEnabled) audio.cancel();
        return;
      }
      if (input.consumePress('confirm')) {
        const d = state.dialog;
        const ds = findDialog(d.stateId!);
        if (!ds) {
          state.closeDialog();
          return;
        }
        if (d.awaitingChoice && ds.choices) {
          const visible = visibleChoices(ds, state.flags);
          const c = visible[d.choiceIndex];
          if (c) {
            applyDialogChoice(c);
            if (c.next) {
              const nextDs = findDialog(c.next);
              if (nextDs?.onEnterSetFlags) state.setFlags(nextDs.onEnterSetFlags);
              if (nextDs?.onEnterGiveItems) {
                for (const it of nextDs.onEnterGiveItems)
                  state.addItem({ id: it.id, name: it.name, description: it.description, icon: it.icon, count: it.count ?? 1 });
              }
              state.startDialog(d.npcId!, c.next);
            } else {
              state.closeDialog();
            }
            evaluateStoryTriggers();
            if (state.audioEnabled) audio.confirm();
          }
          return;
        }
        if (d.charsRevealed < ds.lines[d.lineIndex].text.length) {
          state.setDialogReveal(ds.lines[d.lineIndex].text.length);
          return;
        }
        const isLastLine = d.lineIndex >= ds.lines.length - 1;
        if (isLastLine) {
          if (ds.choices && visibleChoices(ds, state.flags).length > 0) {
            state.setAwaitingChoice(true);
          } else {
            state.closeDialog();
            if (state.audioEnabled) audio.confirm();
          }
        } else {
          state.nextDialogLine();
          if (state.audioEnabled) audio.beep();
        }
        return;
      }
      if (state.dialog.awaitingChoice) {
        const d = state.dialog;
        const ds = findDialog(d.stateId!);
        const visible = visibleChoices(ds, state.flags);
        if (input.consumePress('up')) {
          state.setChoiceIndex((d.choiceIndex - 1 + visible.length) % visible.length);
          if (state.audioEnabled) audio.beep();
        }
        if (input.consumePress('down')) {
          state.setChoiceIndex((d.choiceIndex + 1) % visible.length);
          if (state.audioEnabled) audio.beep();
        }
      }
    };

    const tick = (now: number) => {
      const m = moverRef.current;
      const state = useGameStore.getState();
      if (!state.player) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const map = getMap(state.player.mapId);

      // Freeze ALL NPC + chicken motion during a dialog so the world holds
      // still while the player reads.  This also covers the case of mid-step
      // animation - we re-anchor the running animation on resume.
      const dialogPause = state.dialog.active;

      // SPECIAL: Avdi's exit walk.  Once the pirgonit quest is done (and Avdi
      // has said his goodbye dialog), Avdi marches south one tile at a time
      // until he reaches the bottom edge of the map, then we set `avdi_left`
      // and the renderer hides him while Or (Doc) takes his place.
      if (
        !dialogPause &&
        state.player!.mapId === 'town' &&
        state.flags.avdi_pirgonit_done &&
        !state.flags.avdi_left
      ) {
        const fresh = useGameStore.getState();
        const rt = fresh.npcRuntime['avdi'];
        if (rt) {
          const animEnd = rt.animStart + rt.animMs;
          if (rt.animMs > 0 && now < animEnd) {
            const t = (now - rt.animStart) / rt.animMs;
            const newFrame = Math.floor(t * 4) % 4;
            if (newFrame !== rt.walkFrame) {
              fresh.updateNpcRuntime('avdi', { walkFrame: newFrame });
            }
          } else {
            // Move one tile south (skip collision since he's leaving).
            const ny = rt.y + 1;
            if (ny >= map.height - 1) {
              fresh.setFlag('avdi_left', true);
              fresh.pushToast('עבדי הולך הביתה. אור נכנס במקומו.', 'flag');
            } else {
              fresh.updateNpcRuntime('avdi', {
                fromX: rt.x,
                fromY: rt.y,
                x: rt.x,
                y: ny,
                facing: 'down',
                animStart: now,
                animMs: 500,
                lastMoveAt: now,
                walkFrame: 0,
              });
            }
          }
        }
      }

      // NPC wandering: smooth CONTINUOUS walking within ~2 tiles of home.
      // The instant a step finishes, we start a new one - no static pauses
      // that look like teleport-then-pause-then-teleport.
      if (!dialogPause) {
        const npcs = visibleNpcsOn(state.player!.mapId, state.player!.trackId, state.flags);
        const NPC_STEP_MS = 1400; // slower walk pace so the player can keep up
        for (const n of npcs) {
          // Avdi is being handled by the exit-walk logic above; skip wander.
          if (n.id === 'avdi' && state.flags.avdi_pirgonit_done) continue;
          const home = npcPositionOn(n, state.player!.mapId);
          if (!home) continue;
          // Read fresh state inside the loop so collision checks reflect
          // moves that earlier NPCs in this tick already made.
          const fresh = useGameStore.getState();
          const rt = fresh.npcRuntime[n.id];
          if (!rt) continue;
          const animEnd = rt.animStart + rt.animMs;
          if (rt.animMs > 0 && now < animEnd) {
            // Mid-step: keep the walk-frame counter ticking.
            const t = (now - rt.animStart) / rt.animMs;
            const newFrame = Math.floor(t * 4) % 4;
            if (newFrame !== rt.walkFrame) {
              fresh.updateNpcRuntime(n.id, { walkFrame: newFrame });
            }
            continue;
          }
          // Step finished. Pick a new step immediately.
          const range = 4;
          const dirs: { dx: number; dy: number; dir: Direction }[] = [
            { dx: 0, dy: -1, dir: 'up' },
            { dx: 0, dy: 1, dir: 'down' },
            { dx: -1, dy: 0, dir: 'left' },
            { dx: 1, dy: 0, dir: 'right' },
          ];
          const candidates: { x: number; y: number; dir: Direction }[] = [];
          for (const { dx, dy, dir } of dirs) {
            const nx = rt.x + dx;
            const ny = rt.y + dy;
            if (Math.abs(nx - home.x) > range || Math.abs(ny - home.y) > range) continue;
            if (isBlocked(map, nx, ny)) continue;
            if (fresh.player!.x === nx && fresh.player!.y === ny) continue;
            const collidesNpc = Object.values(fresh.npcRuntime).some(
              (other) => other !== rt && other.x === nx && other.y === ny,
            );
            if (collidesNpc) continue;
            if (interactiveAt(fresh.player!.mapId, nx, ny)) continue;
            candidates.push({ x: nx, y: ny, dir });
          }
          // Prefer continuing the current direction so they walk in lines.
          let pick: { x: number; y: number; dir: Direction } | undefined;
          if (candidates.length > 0) {
            const sameDir = candidates.find((c) => c.dir === rt.facing);
            if (sameDir && Math.random() < 0.55) pick = sameDir;
            else pick = candidates[Math.floor(Math.random() * candidates.length)];
          }
          if (!pick) {
            // Stuck: just turn to a random direction and try again next tick.
            const randomDir = dirs[Math.floor(Math.random() * dirs.length)].dir;
            fresh.updateNpcRuntime(n.id, {
              facing: randomDir,
              animStart: now,
              animMs: 0,
              lastMoveAt: now,
              walkFrame: 0,
            });
            continue;
          }
          fresh.updateNpcRuntime(n.id, {
            fromX: rt.x,
            fromY: rt.y,
            x: pick.x,
            y: pick.y,
            facing: pick.dir,
            animStart: now,
            animMs: NPC_STEP_MS,
            lastMoveAt: now,
            walkFrame: 0,
          });
        }
      }

      // Visible interactives (shopkeepers, teachers, etc.) periodically turn
      // in place so the world feels alive without breaking interaction or
      // collision.
      if (!dialogPause) {
        const fresh = useGameStore.getState();
        const interactives = interactivesOn(state.player!.mapId);
        const dirs: Direction[] = ['up', 'down', 'left', 'right'];
        for (const it of interactives) {
          if (!it.spritePalette) continue;
          const rt = fresh.interactiveRuntime[it.id];
          if (!rt) continue;
          const sinceTurn = now - rt.lastTurnAt;
          if (sinceTurn < 2500 + (it.id.charCodeAt(0) % 5) * 400) continue;
          const next = dirs[Math.floor(Math.random() * dirs.length)];
          if (next !== rt.facing) {
            fresh.updateInteractiveRuntime(it.id, { facing: next, lastTurnAt: now });
          } else {
            fresh.updateInteractiveRuntime(it.id, { lastTurnAt: now });
          }
        }
      }

      // Chicken AI: move the chicken to a random walkable neighbor every 1.5s.
      // It actively avoids the player so the player has to corner it.
      if (!dialogPause && state.player!.mapId === 'town' && state.chickenTile && !state.flags.gasner_chicken_done) {
        const sinceMove = now - state.chickenLastMoveAt;
        if (sinceMove > 1500) {
          const ct = state.chickenTile;
          // Candidate neighbors
          const candidates: { x: number; y: number; dist: number }[] = [];
          for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0], [0, 0]] as const) {
            const nx = ct.x + dx;
            const ny = ct.y + dy;
            if (nx === ct.x && ny === ct.y) {
              // Allow staying still as one option
              candidates.push({ x: nx, y: ny, dist: 0 });
              continue;
            }
            if (isBlocked(map, nx, ny)) continue;
            // Don't walk into the player
            if (state.player!.x === nx && state.player!.y === ny) continue;
            const dist = Math.abs(nx - state.player!.x) + Math.abs(ny - state.player!.y);
            candidates.push({ x: nx, y: ny, dist });
          }
          if (candidates.length > 0) {
            // Prefer moves that increase distance from the player
            candidates.sort((a, b) => b.dist - a.dist);
            // Pick weighted random from top half
            const top = candidates.slice(0, Math.max(1, Math.floor(candidates.length / 2)));
            const pick = top[Math.floor(Math.random() * top.length)];
            useGameStore.getState().setChickenTile({ x: pick.x, y: pick.y }, now);
          }
        }
      }

      const dialogActive = state.dialog.active;

      if (dialogActive) {
        handleDialogInput();
      } else {
        if (input.consumePress('menu')) {
          if (state.audioEnabled) audio.confirm();
          setScreen('menu');
        }
        if (input.consumePress('confirm')) {
          tryInteract();
        }
        if (!m.moving) {
          const dir = input.heldDirection();
          if (dir) {
            const [dx, dy] = dirToDelta(dir);
            const ntx = m.tx + dx;
            const nty = m.ty + dy;
            const npcs = visibleNpcsOn(state.player!.mapId, state.player!.trackId, state.flags);
            const npcBlocked = npcs.some((n) => {
              const rt = state.npcRuntime[n.id];
              const p = rt ?? npcPositionOn(n, state.player!.mapId);
              return p && p.x === ntx && p.y === nty;
            });
            // Only VISIBLE interactives block movement (those with a sprite).
            // Invisible info-only interactives like signs let the player pass.
            const interactiveTile = interactiveAt(state.player!.mapId, ntx, nty);
            const intBlocked = !!(interactiveTile && interactiveTile.spritePalette);
            const blocked = npcBlocked || intBlocked;
            if (!blocked) {
              if (tryStartMove(m, dir, map, now)) {
                setFacing(dir);
              } else {
                m.facing = dir;
                setFacing(dir);
              }
            } else {
              m.facing = dir;
              setFacing(dir);
            }
          }
        }
      }

      const justEntered = advanceMover(m, now, map);
      if (justEntered) {
        advanceTime(1);
        setPlayerPos(m.tx, m.ty, m.facing);
        const warpKey = `${m.tx},${m.ty}`;
        const warp = map.warps?.[warpKey];
        if (warp) {
          if (!warp.flag || state.flags[warp.flag]) {
            // Special case: after every Jerusalem stop is visited, exiting
            // Jerusalem south takes the bus straight to the school ceremony
            // instead of back to the schoolyard.
            const goingToCeremony =
              warp.mapId === 'school' &&
              state.player!.mapId === 'jerusalem' &&
              state.flags['all_stops_visited'] &&
              !state.flags['ceremony_finished'];
            if (goingToCeremony) {
              setPlayerMap('ceremony', 8, 12, 'up');
              useGameStore.getState().pushToast('חזרתם לבית הספר — לטקס!', 'flag');
            } else {
              setPlayerMap(warp.mapId, warp.x, warp.y, warp.facing);
            }
            if (state.audioEnabled) audio.confirm();
            // small time jump on travel
            advanceTime(60);
          } else {
            // push back
            m.tx -= dirToDelta(m.facing)[0];
            m.ty -= dirToDelta(m.facing)[1];
            m.px = m.tx * TILE_SIZE;
            m.py = m.ty * TILE_SIZE;
            setPlayerPos(m.tx, m.ty, m.facing);
            useGameStore.getState().pushToast('עוד לא מוכנים לצאת.', 'flag');
          }
        }
        evaluateStoryTriggers();
      }

      const cam = followCamera(m.px, m.py, map.width, map.height);
      clearCanvas(ctx, '#000');
      renderMap(ctx, map, cam);

      const npcs = visibleNpcsOn(state.player!.mapId, state.player!.trackId, state.flags);
      for (const n of npcs) {
        const rt = state.npcRuntime[n.id];
        const home = npcPositionOn(n, state.player!.mapId);
        if (!home && !rt) continue;
        let px2 = (rt?.x ?? home!.x) * TILE_SIZE;
        let py2 = (rt?.y ?? home!.y) * TILE_SIZE;
        let face: Direction = rt?.facing ?? home!.facing;
        let frame = 0;
        if (rt && rt.animMs > 0) {
          // While a dialog is open the world is paused: snap the NPC to its
          // target tile and show idle frame so it looks like they're standing.
          const t = state.dialog.active ? 1 : Math.min(1, (now - rt.animStart) / rt.animMs);
          px2 = (rt.fromX + (rt.x - rt.fromX) * t) * TILE_SIZE;
          py2 = (rt.fromY + (rt.y - rt.fromY) * t) * TILE_SIZE;
          frame = state.dialog.active ? 0 : Math.floor(t * 4) % 4;
        }
        renderCharacter(ctx, n.id, px2, py2, face, frame, cam);
      }

      // Render interactives (e.g. shopkeeper) as little markers
      const ints = interactivesOn(state.player!.mapId);
      for (const it of ints) {
        if (it.spritePalette) {
          const rt = state.interactiveRuntime[it.id];
          const facing = rt?.facing ?? it.facing ?? 'down';
          renderCharacter(ctx, it.spritePalette, it.x * TILE_SIZE, it.y * TILE_SIZE, facing, 0, cam);
        }
      }

      // Render the dynamic chicken (if present and not yet caught).
      if (state.player!.mapId === 'town' && state.chickenTile && !state.flags.gasner_chicken_done) {
        const chickenSprite = getTileSprite('chicken');
        ctx.drawImage(
          chickenSprite,
          state.chickenTile.x * TILE_SIZE - cam.x,
          state.chickenTile.y * TILE_SIZE - cam.y,
          TILE_SIZE,
          TILE_SIZE,
        );
      }

      renderCharacter(ctx, state.player!.trackId, m.px, m.py, m.facing, m.walkFrame, cam);
      applyAmbient(ctx, map.ambient, state.gameMinutes);

      input.flushFrame();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [audioEnabled, setPlayerPos, setPlayerMap, setFacing, advanceTime, setScreen, startDialog, assetsReady]);

  useEffect(() => {
    force((x) => x + 1);
  }, [dialog.active]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black overflow-hidden">
      <div
        className="relative"
        style={{ width: '100%', maxWidth: CANVAS_W * 1.5, aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="block w-full h-full"
          style={{ imageRendering: 'pixelated', visibility: assetsReady ? 'visible' : 'hidden' }}
        />
        {!assetsReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black text-amber-200 text-2xl tracking-widest">
            טוען...
          </div>
        )}
        <Clock />
        <QuestHud />
        <Toasts />
        <DialogBox />
      </div>
      <TouchControls />
    </div>
  );
}

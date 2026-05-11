import type { Direction } from '../types';

export type InputAction = 'up' | 'down' | 'left' | 'right' | 'confirm' | 'cancel' | 'menu';

const keyMap: Record<string, InputAction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
  KeyZ: 'confirm',
  Space: 'confirm',
  Enter: 'confirm',
  KeyX: 'cancel',
  Escape: 'menu',
  Tab: 'menu',
};

class InputManager {
  private down = new Set<InputAction>();
  private justPressed = new Set<InputAction>();
  private listeners = new Set<(a: InputAction) => void>();

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    const action = keyMap[e.code];
    if (!action) return;
    e.preventDefault();
    if (!this.down.has(action)) {
      this.justPressed.add(action);
      this.listeners.forEach((cb) => cb(action));
    }
    this.down.add(action);
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    const action = keyMap[e.code];
    if (!action) return;
    this.down.delete(action);
  };

  // Touch / on-screen button helpers
  pressVirtual(action: InputAction) {
    if (!this.down.has(action)) {
      this.justPressed.add(action);
      this.listeners.forEach((cb) => cb(action));
    }
    this.down.add(action);
  }

  releaseVirtual(action: InputAction) {
    this.down.delete(action);
  }

  isDown(a: InputAction): boolean {
    return this.down.has(a);
  }

  consumePress(a: InputAction): boolean {
    if (this.justPressed.has(a)) {
      this.justPressed.delete(a);
      return true;
    }
    return false;
  }

  /** Get the first held movement direction. */
  heldDirection(): Direction | null {
    if (this.down.has('up')) return 'up';
    if (this.down.has('down')) return 'down';
    if (this.down.has('left')) return 'left';
    if (this.down.has('right')) return 'right';
    return null;
  }

  flushFrame() {
    this.justPressed.clear();
  }

  on(listener: (a: InputAction) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const input = new InputManager();

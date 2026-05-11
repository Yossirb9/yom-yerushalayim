import { useEffect, useRef, useState } from 'react';
import { input, type InputAction } from '../../engine/input';

function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function TouchControls() {
  const [show, setShow] = useState(false);
  // Track which actions this device is currently holding so we can guarantee
  // a release on global pointerup/cancel (in case the finger slides off the
  // button without firing pointerup on the button itself).
  const heldRef = useRef<Set<InputAction>>(new Set());

  useEffect(() => {
    setShow(isTouchDevice());
  }, []);

  useEffect(() => {
    if (!show) return;
    const releaseAll = () => {
      for (const a of heldRef.current) input.releaseVirtual(a);
      heldRef.current.clear();
    };
    const onUp = () => releaseAll();
    const onCancel = () => releaseAll();
    const onBlur = () => releaseAll();
    const onVisibility = () => {
      if (document.hidden) releaseAll();
    };
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
      releaseAll();
    };
  }, [show]);

  if (!show) return null;

  const press = (action: InputAction) => {
    if (heldRef.current.has(action)) return;
    heldRef.current.add(action);
    input.pressVirtual(action);
  };
  const release = (action: InputAction) => {
    if (!heldRef.current.has(action)) return;
    heldRef.current.delete(action);
    input.releaseVirtual(action);
  };

  const Btn = ({ action, label, className }: { action: InputAction; label: string; className?: string }) => (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        // Capture the pointer so subsequent events (incl. pointerup) come to
        // this element even if the finger slides off the button.
        try { (e.currentTarget as Element).setPointerCapture(e.pointerId); } catch {}
        press(action);
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        try { (e.currentTarget as Element).releasePointerCapture(e.pointerId); } catch {}
        release(action);
      }}
      onPointerCancel={(e) => {
        e.preventDefault();
        release(action);
      }}
      onPointerLeave={(e) => {
        // Only release if pointer is no longer pressed (defensive).
        if (!e.buttons) release(action);
      }}
      onLostPointerCapture={() => release(action)}
      onContextMenu={(e) => e.preventDefault()}
      onTouchStart={(e) => e.preventDefault()}
      onTouchEnd={(e) => e.preventDefault()}
      className={`select-none touch-none bg-gbc-frame/80 text-gbc-cream border-4 border-gbc-cream/60 font-body text-2xl active:bg-gbc-yellow active:text-gbc-frame ${className ?? ''}`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-x-0 bottom-0 pointer-events-none px-3 pb-3 flex justify-between items-end z-30" dir="ltr">
      {/* D-pad on left */}
      <div className="grid grid-cols-3 grid-rows-3 gap-1 pointer-events-auto" style={{ width: 168, height: 168 }}>
        <div />
        <Btn action="up" label="▲" className="row-start-1 col-start-2" />
        <div />
        <Btn action="left" label="◀" className="row-start-2 col-start-1" />
        <div className="bg-gbc-frame/40 border-4 border-gbc-cream/30" />
        <Btn action="right" label="▶" className="row-start-2 col-start-3" />
        <div />
        <Btn action="down" label="▼" className="row-start-3 col-start-2" />
        <div />
      </div>
      {/* Action buttons on right */}
      <div className="flex flex-col gap-2 pointer-events-auto items-center">
        <Btn action="menu" label="≡" className="w-14 h-14 rounded-full" />
        <div className="flex gap-2">
          <Btn action="cancel" label="B" className="w-14 h-14 rounded-full" />
          <Btn action="confirm" label="A" className="w-16 h-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

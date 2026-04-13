import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  gingerStateFromContextValues,
  useGingerMedia,
  useGingerPlayback,
} from "../context/GingerSplitContexts";
import { progressFraction } from "../internal/selectors";

export type SeekDragState = {
  /** Raw drag fraction — only updated during an active drag gesture. */
  fraction: number;
  /** Blended fraction: follows live playback when idle, drag position when dragging. */
  displayFraction: number;
  isDragging: boolean;
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
};

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

type ActiveDrag = {
  target: HTMLElement;
  pointerId: number;
  onMove: (e: PointerEvent) => void;
  onUp: (e: PointerEvent) => void;
};

export function useSeekDrag(duration: number): SeekDragState {
  const media = useGingerMedia();
  const playback = useGingerPlayback();
  const { seek } = media;
  const [fraction, setFraction] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const activeDragRef = useRef<ActiveDrag | null>(null);

  const liveFraction = progressFraction(gingerStateFromContextValues(playback, media));
  const displayFraction = isDragging ? fraction : liveFraction;

  useEffect(() => {
    return () => {
      const drag = activeDragRef.current;
      if (!drag) return;
      drag.target.removeEventListener("pointermove", drag.onMove);
      drag.target.removeEventListener("pointerup", drag.onUp);
      drag.target.removeEventListener("pointercancel", drag.onUp);
      try {
        drag.target.releasePointerCapture(drag.pointerId);
      } catch {
        /* already released */
      }
      activeDragRef.current = null;
    };
  }, []);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!(duration > 0)) return;
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const update = (clientX: number) => {
        const ratio = clamp01((clientX - rect.left) / rect.width);
        setFraction(ratio);
        seek(ratio * duration);
      };
      setIsDragging(true);
      target.setPointerCapture(event.pointerId);
      update(event.clientX);
      const onMove = (moveEvent: PointerEvent) => update(moveEvent.clientX);
      const onUp = (upEvent: PointerEvent) => {
        update(upEvent.clientX);
        setIsDragging(false);
        target.releasePointerCapture(event.pointerId);
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerup", onUp);
        target.removeEventListener("pointercancel", onUp);
        activeDragRef.current = null;
      };
      activeDragRef.current = { target, pointerId: event.pointerId, onMove, onUp };
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", onUp);
      target.addEventListener("pointercancel", onUp);
    },
    [duration, seek],
  );

  return { fraction, displayFraction, isDragging, onPointerDown };
}

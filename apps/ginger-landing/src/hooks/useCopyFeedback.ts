import { useCallback, useEffect, useRef, useState } from "react";

type UseCopyFeedbackOptions = {
  /** Label shown in UI / aria after a successful copy. */
  successLabel?: string;
  /** Label shown after a failed copy. */
  errorLabel?: string;
  resetMs?: number;
};

export function useCopyFeedback(options: UseCopyFeedbackOptions = {}) {
  const { successLabel = "Copied", errorLabel = "Failed", resetMs = 1400 } = options;
  const [label, setLabel] = useState("Copy");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(
    async (text: string) => {
      const scheduleReset = (next: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setLabel(next);
        timeoutRef.current = setTimeout(() => {
          setLabel("Copy");
          timeoutRef.current = null;
        }, resetMs);
      };

      try {
        await navigator.clipboard.writeText(text);
        scheduleReset(successLabel);
      } catch {
        scheduleReset(errorLabel);
      }
    },
    [errorLabel, resetMs, successLabel],
  );

  return { label, copy };
}

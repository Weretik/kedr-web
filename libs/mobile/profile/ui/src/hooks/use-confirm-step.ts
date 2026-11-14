import { useState } from 'react';

/**
 * A form that is checked first and then confirmed: `review` runs the check and either shows its problem or moves to
 * the confirmation, `back` returns to the fields.
 */
export function useConfirmStep(check: () => string | null) {
  const [problem, setProblem] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  return {
    problem,
    confirming,
    review: () => {
      const found = check();
      setProblem(found);
      if (!found) setConfirming(true);
    },
    back: () => setConfirming(false),
  };
}

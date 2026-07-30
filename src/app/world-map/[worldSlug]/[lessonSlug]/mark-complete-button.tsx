"use client";

import { useState, useTransition } from "react";
import { markLessonComplete } from "./actions";

export function MarkCompleteButton({
  lessonId,
  worldSlug,
  initiallyCompleted,
}: {
  lessonId: string;
  worldSlug: string;
  initiallyCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (completed) {
    return <p className="text-success text-sm">Lesson complete.</p>;
  }

  return (
    <div>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await markLessonComplete(lessonId, worldSlug);
              setCompleted(true);
            } catch {
              setError("Could not save progress. Please try again.");
            }
          });
        }}
        className="bg-primary text-background rounded-sm px-4 py-2 text-sm disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Mark lesson complete"}
      </button>
      {error && <p className="text-error text-sm mt-2">{error}</p>}
    </div>
  );
}

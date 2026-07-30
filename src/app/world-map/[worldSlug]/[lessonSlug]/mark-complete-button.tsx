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
  const [justCompleted, setJustCompleted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (completed) {
    return (
      <div
        className={`flex items-center gap-3 border border-success rounded-lg p-4 ${
          justCompleted ? "animate-pop-in" : ""
        }`}
      >
        <span className="text-2xl leading-none" aria-hidden="true">
          🎉
        </span>
        <div>
          <p className="text-success font-medium">Lesson complete!</p>
          <p className="text-text-muted text-sm">
            Nice work. Head back to the world map to keep your streak going.
          </p>
        </div>
      </div>
    );
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
              setJustCompleted(true);
            } catch {
              setError("Could not save progress. Please try again.");
            }
          });
        }}
        className="bg-primary text-background rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 transition-transform duration-motion hover:scale-105"
      >
        {isPending ? "Saving…" : "✅ Mark lesson complete"}
      </button>
      {error && <p className="text-error text-sm mt-2">{error}</p>}
    </div>
  );
}

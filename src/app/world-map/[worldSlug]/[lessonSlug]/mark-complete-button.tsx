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
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [streak, setStreak] = useState<number | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [xpIntoLevel, setXpIntoLevel] = useState<number | null>(null);
  const [xpForNextLevel, setXpForNextLevel] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (completed) {
    const levelPct =
      xpIntoLevel !== null && xpForNextLevel
        ? Math.round((xpIntoLevel / xpForNextLevel) * 100)
        : 0;

    return (
      <div
        className={`border border-success rounded-lg p-4 bg-gradient-to-br from-panel to-background ${
          justCompleted ? "animate-pop-in" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl leading-none" aria-hidden="true">
            🎉
          </span>
          <div>
            <p className="text-success font-medium">Lesson complete!</p>
            <p className="text-text-muted text-sm">
              {xpAwarded ? `⚡ +${xpAwarded} XP earned. ` : ""}
              {streak !== null && streak > 0
                ? `🔥 ${streak}-day streak. `
                : ""}
              Head back to the world map to keep going.
            </p>
          </div>
        </div>
        {level !== null && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-text-muted mb-1">
              <span>⭐ Level {level}</span>
              <span>
                {xpIntoLevel} / {xpForNextLevel} XP
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-motion"
                style={{ width: `${levelPct}%` }}
              />
            </div>
          </div>
        )}
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
              const result = await markLessonComplete(lessonId, worldSlug);
              setCompleted(true);
              setJustCompleted(true);
              setXpAwarded(result.xpAwarded);
              setStreak(result.currentStreak);
              setLevel(result.level);
              setXpIntoLevel(result.xpIntoLevel);
              setXpForNextLevel(result.xpForNextLevel);
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

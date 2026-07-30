"use client";

// Client component that replaces the old "Coming soon" placeholder with a
// real interactive mission-solving flow. Each mission type renders a
// different input (multiple choice options, a text prediction box, or an
// editable code box) and submits to the submitMissionAttempt server
// action, which grades it for real server-side (src/lib/mission-grading.ts)
// and returns updated XP/level so this component can show a live result.
import { useState, useTransition } from "react";
import { submitMissionAttempt } from "./actions";

const MISSION_ICON: Record<string, string> = {
  multiple_choice: "📝",
  predict_output: "🔮",
  fill_in_blank: "✏️",
  debug_challenge: "🐛",
  code_writing: "💻",
};

export interface MissionForClient {
  id: string;
  title: string;
  type: string;
  prompt: string | null;
  options: string[] | null;
  starterCode: string | null;
  explanation: string | null;
  xpReward: number;
  difficulty: number;
  alreadyPassed: boolean;
}

interface SolvedInfo {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
}

function MissionCard({
  mission,
  onSolved,
}: {
  mission: MissionForClient;
  onSolved: (result: SolvedInfo) => void;
}) {
  const [passed, setPassed] = useState(mission.alreadyPassed);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [codeAnswer, setCodeAnswer] = useState(mission.starterCode ?? "");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastPassed, setLastPassed] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isCodeType =
    mission.type === "debug_challenge" || mission.type === "code_writing";
  const isMc = mission.type === "multiple_choice";

  const canSubmit = isMc
    ? selectedOption !== null
    : isCodeType
    ? codeAnswer.trim().length > 0
    : textAnswer.trim().length > 0;

  function handleSubmit() {
    setError(null);
    const submission: unknown = isMc
      ? selectedOption
      : isCodeType
      ? codeAnswer
      : textAnswer;
    startTransition(async () => {
      try {
        const result = await submitMissionAttempt(mission.id, submission);
        setFeedback(result.feedback);
        setLastPassed(result.passed);
        if (result.passed) {
          setPassed(true);
          onSolved({
            level: result.level,
            xpIntoLevel: result.xpIntoLevel,
            xpForNextLevel: result.xpForNextLevel,
          });
        }
      } catch {
        setError("Could not submit your answer. Please try again.");
      }
    });
  }

  return (
    <div
      className={`border rounded-lg bg-panel p-3 ${
        passed ? "border-success" : "border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="font-medium flex items-center gap-2">
          <span aria-hidden="true">{MISSION_ICON[mission.type] ?? "🎯"}</span>
          {mission.title}
        </p>
        <span className="text-xs text-warning bg-background border border-border rounded-full px-2 py-0.5 whitespace-nowrap">
          {passed ? "✅ " : ""}+{mission.xpReward} XP
        </span>
      </div>
      <p className="text-xs text-text-muted mt-1">Type: {mission.type}</p>

      {mission.prompt && <p className="text-sm mt-2">{mission.prompt}</p>}

      {mission.starterCode && !isCodeType && (
        <pre className="bg-background border border-border rounded-md p-2 text-xs overflow-x-auto mt-2">
          <code>{mission.starterCode}</code>
        </pre>
      )}

      {!passed && (
        <div className="mt-3 space-y-2">
          {isMc && mission.options && (
            <div className="space-y-1">
              {mission.options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 text-sm rounded-md px-2 py-1.5 cursor-pointer hover:bg-border"
                >
                  <input
                    type="radio"
                    name={mission.id}
                    checked={selectedOption === index}
                    onChange={() => setSelectedOption(index)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {!isMc && !isCodeType && (
            <input
              type="text"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="w-full text-sm bg-background border border-border rounded-md px-2 py-1.5"
            />
          )}

          {isCodeType && (
            <textarea
              value={codeAnswer}
              onChange={(e) => setCodeAnswer(e.target.value)}
              spellCheck={false}
              rows={5}
              className="w-full text-xs font-mono bg-background border border-border rounded-md p-2"
            />
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
            className="text-sm bg-primary text-background rounded-sm px-3 py-1 disabled:opacity-50 transition-transform duration-motion hover:scale-105"
          >
            {isPending ? "Checking…" : "Submit"}
          </button>
        </div>
      )}

      {feedback && (
        <p
          className={`mt-2 text-sm ${lastPassed ? "text-success" : "text-error"}`}
        >
          {lastPassed ? "✅ " : "❌ "}
          {feedback}
        </p>
      )}
      {error && <p className="text-error text-sm mt-2">{error}</p>}
    </div>
  );
}

export function MissionSolver({ missions }: { missions: MissionForClient[] }) {
  const [banner, setBanner] = useState<SolvedInfo | null>(null);

  return (
    <div className="space-y-3 mt-3">
      {banner && (
        <div className="border border-success rounded-lg p-3 bg-gradient-to-br from-panel to-background text-sm animate-pop-in">
          {"🎉"} Mission passed! {"⭐"} Level {banner.level} ·{" "}
          {banner.xpIntoLevel} / {banner.xpForNextLevel} XP
        </div>
      )}
      {missions.map((mission) => (
        <MissionCard key={mission.id} mission={mission} onSolved={setBanner} />
      ))}
    </div>
  );
}

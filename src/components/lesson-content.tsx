"use client";

// Renders a validated array of LessonBlock objects (see
// src/lib/lesson-content.ts) as the actual lesson UI. Kept as a client
// component only because the knowledge-check block needs local
// interactive state; every other block is static markup.
import { useState } from "react";
import type { LessonBlock } from "@/lib/lesson-content";

function KnowledgeCheck({
  block,
}: {
  block: Extract<LessonBlock, { type: "knowledge_check" }>;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  return (
    <div className="border border-border rounded-lg bg-panel p-4">
      <p className="text-xs uppercase tracking-wide text-info font-medium mb-2">
        🧠 Knowledge Check
      </p>
      <p className="font-medium mb-3">{block.question}</p>
      <div className="space-y-1">
        {block.options.map((option, index) => (
          <label
            key={index}
            className="flex items-center gap-2 text-sm rounded-md px-2 py-1.5 cursor-pointer hover:bg-border"
          >
            <input
              type="radio"
              name={block.question}
              checked={selected === index}
              onChange={() => {
                setSelected(index);
                setChecked(false);
              }}
            />
            {option}
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setChecked(true)}
        disabled={selected === null}
        className="mt-3 text-sm bg-primary text-background rounded-sm px-3 py-1 disabled:opacity-50 transition-transform duration-motion hover:scale-105"
      >
        Check answer
      </button>
      {checked && selected !== null && (
        <p
          className={`mt-2 text-sm ${
            selected === block.correctIndex ? "text-success" : "text-error"
          }`}
        >
          {selected === block.correctIndex
            ? "✅ Correct!"
            : "❌ Not quite - review the explanation above and try again."}
        </p>
      )}
    </div>
  );
}

const CALLOUT_ICON: Record<string, string> = {
  info: "💡",
  warning: "⚠️",
  success: "✅",
  error: "🚫",
};

export function LessonContent({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={index}
                className="text-xl font-semibold border-b-2 border-primary inline-block pb-1"
              >
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p key={index} className="text-text leading-relaxed">
                {block.text}
              </p>
            );
          case "vocabulary":
            return (
              <div
                key={index}
                className="flex gap-3 border border-border border-l-4 border-l-info rounded-lg bg-panel p-3"
              >
                <span className="text-xl leading-none" aria-hidden="true">
                  📘
                </span>
                <div>
                  <p className="font-medium">{block.term}</p>
                  <p className="text-sm text-text-muted">{block.definition}</p>
                </div>
              </div>
            );
          case "analogy":
            return (
              <div
                key={index}
                className="flex gap-3 border border-border rounded-lg bg-panel p-3"
              >
                <span className="text-xl leading-none" aria-hidden="true">
                  💭
                </span>
                <p className="italic text-text-muted">{block.text}</p>
              </div>
            );
          case "code_example":
            return (
              <div
                key={index}
                className="rounded-lg border border-border overflow-hidden"
              >
                <div className="flex items-center gap-3 bg-border px-3 py-1.5">
                  <span className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-error inline-block" />
                    <span className="h-2.5 w-2.5 rounded-full bg-warning inline-block" />
                    <span className="h-2.5 w-2.5 rounded-full bg-success inline-block" />
                  </span>
                  <span className="text-xs text-text-muted uppercase tracking-wide">
                    {block.language}
                  </span>
                </div>
                <pre className="bg-panel p-3 overflow-x-auto text-sm">
                  <code>{block.code}</code>
                </pre>
              </div>
            );
          case "line_explanation":
            return (
              <div key={index} className="space-y-2">
                {block.lines.map((line, lineIndex) => (
                  <div key={lineIndex} className="text-sm flex gap-2">
                    <code className="bg-panel border border-border rounded-sm px-1 whitespace-nowrap">
                      {line.line}
                    </code>
                    <span className="text-text-muted">→ {line.explanation}</span>
                  </div>
                ))}
              </div>
            );
          case "callout":
            return (
              <div
                key={index}
                className={`flex gap-2 border rounded-lg p-3 text-sm ${
                  block.tone === "warning"
                    ? "border-warning text-warning"
                    : block.tone === "error"
                    ? "border-error text-error"
                    : block.tone === "success"
                    ? "border-success text-success"
                    : "border-info text-info"
                }`}
              >
                <span aria-hidden="true">{CALLOUT_ICON[block.tone]}</span>
                <span>{block.text}</span>
              </div>
            );
          case "common_mistake":
            return (
              <div
                key={index}
                className="flex gap-2 border border-warning rounded-lg p-3 text-sm text-warning"
              >
                <span aria-hidden="true">⚠️</span>
                <span>
                  <span className="font-medium">Common mistake: </span>
                  {block.text}
                </span>
              </div>
            );
          case "knowledge_check":
            return <KnowledgeCheck key={index} block={block} />;
          case "summary":
            return (
              <div key={index} className="border-t border-border pt-3">
                <p className="text-xs uppercase tracking-wide text-text-muted font-medium mb-1">
                  🎯 Key takeaway
                </p>
                <p className="text-text-muted">{block.text}</p>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

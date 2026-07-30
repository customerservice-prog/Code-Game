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
    <div className="border border-border rounded-md bg-panel p-4">
      <p className="font-medium mb-3">{block.question}</p>
      <div className="space-y-2">
        {block.options.map((option, index) => (
          <label key={index} className="flex items-center gap-2 text-sm">
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
        className="mt-3 text-sm bg-primary text-background rounded-sm px-3 py-1 disabled:opacity-50"
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
            ? "Correct."
            : "Not quite - review the explanation above and try again."}
        </p>
      )}
    </div>
  );
}

export function LessonContent({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={index} className="text-xl font-semibold">
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
              <div key={index} className="border-l-2 border-info pl-3">
                <p className="font-medium">{block.term}</p>
                <p className="text-sm text-text-muted">{block.definition}</p>
              </div>
            );
          case "analogy":
            return (
              <p
                key={index}
                className="italic text-text-muted border-l-2 border-border pl-3"
              >
                {block.text}
              </p>
            );
          case "code_example":
            return (
              <pre
                key={index}
                className="bg-panel border border-border rounded-md p-3 overflow-x-auto text-sm"
              >
                <code>{block.code}</code>
              </pre>
            );
          case "line_explanation":
            return (
              <div key={index} className="space-y-2">
                {block.lines.map((line, lineIndex) => (
                  <div key={lineIndex} className="text-sm">
                    <code className="bg-panel border border-border rounded-sm px-1">
                      {line.line}
                    </code>
                    <span className="text-text-muted"> - {line.explanation}</span>
                  </div>
                ))}
              </div>
            );
          case "callout":
            return (
              <div
                key={index}
                className={`border rounded-md p-3 text-sm ${
                  block.tone === "warning"
                    ? "border-warning text-warning"
                    : block.tone === "error"
                    ? "border-error text-error"
                    : block.tone === "success"
                    ? "border-success text-success"
                    : "border-info text-info"
                }`}
              >
                {block.text}
              </div>
            );
          case "common_mistake":
            return (
              <div
                key={index}
                className="border border-warning rounded-md p-3 text-sm text-warning"
              >
                <span className="font-medium">Common mistake: </span>
                {block.text}
              </div>
            );
          case "knowledge_check":
            return <KnowledgeCheck key={index} block={block} />;
          case "summary":
            return (
              <p key={index} className="border-t border-border pt-3 text-text-muted">
                {block.text}
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

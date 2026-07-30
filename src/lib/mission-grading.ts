// Server-only mission grading logic. Pure functions plus a small sandboxed
// JS runner used for the one mission type that needs code to actually
// execute (fix-the-infinite-loop). Kept out of actions.ts/page components
// per CLAUDE.md section 5's rule against putting business logic in page
// components.
import vm from "node:vm";

export interface MissionTestSpec {
  checkType: "mc" | "text_exact" | "regex_all" | "nesting_order" | "js_run";
  correctIndex?: number;
  answer?: string;
  acceptableAnswers?: string[];
  patterns?: string[];
  mustContain?: string[];
  firstClose?: string;
  secondClose?: string;
  expectedLogs?: string[];
}

export interface GradeResult {
  passed: boolean;
  feedback: string;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/^["']|["']$/g, "");
}

function runJsAndCollectLogs(
  code: string,
  timeoutMs = 1000
): { logs: string[]; error?: string } {
  const logs: string[] = [];
  const sandboxConsole = {
    log: (...args: unknown[]) => {
      logs.push(
        args
          .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
          .join(" ")
      );
    },
  };
  // Deliberately minimal sandbox: only a console object is exposed. No
  // require/process/global access, and a hard timeout guards against
  // infinite loops. This is a standard (not bulletproof) sandboxing
  // approach appropriate for small pedagogical JS snippets - see
  // KNOWN_ISSUES.md for the honest limitations of this approach.
  const context = vm.createContext({ console: sandboxConsole });
  try {
        const script = new vm.Script(code);
    script.runInContext(context, { timeout: timeoutMs });
    return { logs };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/timed out/i.test(message)) {
      return { logs, error: "timeout" };
    }
    return { logs, error: message };
  }
}

// Grades a single submission against a mission's stored test spec. Never
// trusts the submission's shape - always narrows with typeof checks before
// using it, since it originates from client input (CLAUDE.md section 5).
export function gradeSubmission(
  spec: MissionTestSpec,
  submission: unknown,
  fallbackExplanation: string | null
): GradeResult {
  switch (spec.checkType) {
    case "mc": {
      const idx =
        typeof submission === "number" ? submission : Number(submission);
      const passed = Number.isInteger(idx) && idx === spec.correctIndex;
      return {
        passed,
        feedback: passed
          ? "Correct!"
          : fallbackExplanation ?? "Not quite - try again.",
      };
    }
    case "text_exact": {
      const sub =
        typeof submission === "string" ? normalizeText(submission) : "";
      const candidates = [spec.answer, ...(spec.acceptableAnswers ?? [])]
        .filter((a): a is string => Boolean(a))
        .map(normalizeText);
      const passed = sub.length > 0 && candidates.includes(sub);
      return {
        passed,
        feedback: passed
          ? "Correct!"
          : fallbackExplanation ??
            "Not quite - check your answer and try again.",
      };
    }
    case "regex_all": {
      const code = typeof submission === "string" ? submission : "";
      const passed = (spec.patterns ?? []).every((p) =>
        new RegExp(p).test(code)
      );
      return {
        passed,
        feedback: passed
          ? "Looks good!"
          : fallbackExplanation ?? "Not quite yet - re-check the requirements.",
      };
    }
    case "nesting_order": {
      const code = typeof submission === "string" ? submission : "";
      const hasAll = (spec.mustContain ?? []).every((t) => code.includes(t));
      const firstIdx = spec.firstClose ? code.indexOf(spec.firstClose) : -1;
      const secondIdx = spec.secondClose ? code.indexOf(spec.secondClose) : -1;
      const passed =
        hasAll && firstIdx !== -1 && secondIdx !== -1 && firstIdx < secondIdx;
      return {
        passed,
        feedback: passed
          ? "Nesting fixed!"
          : fallbackExplanation ?? "The closing tags still aren't in the right order.",
      };
    }
    case "js_run": {
      const code = typeof submission === "string" ? submission : "";
      if (code.length > 2000) {
        return { passed: false, feedback: "Code is too long." };
      }
      const { logs, error } = runJsAndCollectLogs(code);
      if (error === "timeout") {
        return {
          passed: false,
          feedback:
            "Your code took too long to run - check for an infinite loop.",
        };
      }
      if (error) {
        return { passed: false, feedback: `Your code threw an error: ${error}` };
      }
      const expected = spec.expectedLogs ?? [];
      const passed =
        expected.length === logs.length &&
        expected.every((l, i) => l === logs[i]);
      return {
        passed,
        feedback: passed
          ? "Correct output!"
          : fallbackExplanation ??
            `Expected output: ${expected.join(", ")}. Got: ${
              logs.join(", ") || "(nothing printed)"
            }.`,
      };
    }
    default:
      return { passed: false, feedback: "Unknown check type." };
  }
}

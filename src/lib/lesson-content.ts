// Validated content-block schema for lesson content stored as Json in
// prisma.Lesson.content. Validating on the server before rendering follows
// CLAUDE.md section 5's rule to validate all external input on the server -
// database content is treated as external/untrusted at the render boundary.
import { z } from "zod";

const headingBlock = z.object({ type: z.literal("heading"), text: z.string() });
const paragraphBlock = z.object({ type: z.literal("paragraph"), text: z.string() });
const vocabularyBlock = z.object({
  type: z.literal("vocabulary"),
  term: z.string(),
  definition: z.string(),
});
const analogyBlock = z.object({ type: z.literal("analogy"), text: z.string() });
const codeExampleBlock = z.object({
  type: z.literal("code_example"),
  language: z.string(),
  code: z.string(),
});
const lineExplanationBlock = z.object({
  type: z.literal("line_explanation"),
  lines: z.array(z.object({ line: z.string(), explanation: z.string() })),
});
const calloutBlock = z.object({
  type: z.literal("callout"),
  tone: z.enum(["info", "warning", "success", "error"]),
  text: z.string(),
});
const commonMistakeBlock = z.object({ type: z.literal("common_mistake"), text: z.string() });
const knowledgeCheckBlock = z.object({
  type: z.literal("knowledge_check"),
  question: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number().int().min(0),
});
const summaryBlock = z.object({ type: z.literal("summary"), text: z.string() });

export const lessonBlockSchema = z.discriminatedUnion("type", [
  headingBlock,
  paragraphBlock,
  vocabularyBlock,
  analogyBlock,
  codeExampleBlock,
  lineExplanationBlock,
  calloutBlock,
  commonMistakeBlock,
  knowledgeCheckBlock,
  summaryBlock,
]);

export const lessonContentSchema = z.array(lessonBlockSchema);

export type LessonBlock = z.infer<typeof lessonBlockSchema>;

// Idempotent curriculum seed script.
// Runs on every deploy start (see package.json's start script) so the
// database always reflects the worlds/modules/lessons/missions defined
// here. Safe to re-run: every write is an upsert keyed on a stable slug.
import { PrismaClient, ContentStatus } from "@prisma/client";

const prisma = new PrismaClient();

// The full world list from CLAUDE.md section 11. Only "Web Foundations" has
// real, launch-quality lessons so far - every other world is intentionally
// left in DRAFT status with no modules, which the world map UI reads as
// "Upcoming" and excludes from completion calculations (CLAUDE.md section 11
// requires worlds without launch-quality lessons to be labeled Upcoming,
// never presented as complete).
const WORLDS: Array<{
  slug: string;
  title: string;
  summary: string;
  order: number;
  status: ContentStatus;
}> = [
  { slug: "web-foundations", title: "Web Foundations", summary: "How the web actually works, before you write a line of code.", order: 1, status: ContentStatus.PUBLISHED },
  { slug: "html-harbor", title: "HTML Harbor", summary: "Structure content with HTML.", order: 2, status: ContentStatus.DRAFT },
  { slug: "css-city", title: "CSS City", summary: "Style and layout with CSS.", order: 3, status: ContentStatus.DRAFT },
  { slug: "javascript-jungle", title: "JavaScript Jungle", summary: "Programming fundamentals with JavaScript.", order: 4, status: ContentStatus.DRAFT },
  { slug: "typescript-tower", title: "TypeScript Tower", summary: "Add types to your JavaScript.", order: 5, status: ContentStatus.DRAFT },
  { slug: "react-realm", title: "React Realm", summary: "Build interactive UIs with React.", order: 6, status: ContentStatus.DRAFT },
  { slug: "nextjs-network", title: "Next.js Network", summary: "Full-stack React with Next.js.", order: 7, status: ContentStatus.DRAFT },
  { slug: "api-headquarters", title: "API Headquarters", summary: "Requests, responses, and REST.", order: 8, status: ContentStatus.DRAFT },
  { slug: "database-district", title: "Database District", summary: "Model and store real data.", order: 9, status: ContentStatus.DRAFT },
  { slug: "prisma-workshop", title: "Prisma Workshop", summary: "Query your database with confidence.", order: 10, status: ContentStatus.DRAFT },
  { slug: "authentication-fortress", title: "Authentication Fortress", summary: "Sign-in, sessions, and security.", order: 11, status: ContentStatus.DRAFT },
  { slug: "github-mountain", title: "GitHub Mountain", summary: "Version control and collaboration.", order: 12, status: ContentStatus.DRAFT },
  { slug: "railway-launch-center", title: "Railway Launch Center", summary: "Ship real deployments.", order: 13, status: ContentStatus.DRAFT },
  { slug: "debugging-dungeon", title: "Debugging Dungeon", summary: "Find and fix bugs methodically.", order: 14, status: ContentStatus.DRAFT },
  { slug: "testing-laboratory", title: "Testing Laboratory", summary: "Prove your code works.", order: 15, status: ContentStatus.DRAFT },
  { slug: "security-stronghold", title: "Security Stronghold", summary: "Defend real applications.", order: 16, status: ContentStatus.DRAFT },
  { slug: "full-stack-final-challenge", title: "Full-Stack Final Challenge", summary: "Bring every skill together.", order: 17, status: ContentStatus.DRAFT },
];

async function main() {
  for (const w of WORLDS) {
    await prisma.world.upsert({
      where: { slug: w.slug },
      update: { title: w.title, summary: w.summary, order: w.order, status: w.status },
      create: w,
    });
  }

  const webFoundations = await prisma.world.findUniqueOrThrow({ where: { slug: "web-foundations" } });

  const gettingStarted = await prisma.module.upsert({
    where: { worldId_slug: { worldId: webFoundations.id, slug: "getting-started" } },
    update: { title: "Getting Started", summary: "What actually happens when you visit a website.", order: 1, status: ContentStatus.PUBLISHED },
    create: { worldId: webFoundations.id, slug: "getting-started", title: "Getting Started", summary: "What actually happens when you visit a website.", order: 1, status: ContentStatus.PUBLISHED },
  });

  const skillWebRequests = await prisma.skill.upsert({
    where: { slug: "client-server-requests" },
    update: { name: "Client-server requests", description: "Understanding how browsers and servers exchange data." },
    create: { slug: "client-server-requests", name: "Client-server requests", description: "Understanding how browsers and servers exchange data." },
  });

  const skillFilesFolders = await prisma.skill.upsert({
    where: { slug: "files-and-folders" },
    update: { name: "Files and folders", description: "Understanding how a project's files are organized on disk." },
    create: { slug: "files-and-folders", name: "Files and folders", description: "Understanding how a project's files are organized on disk." },
  });

  // ---------- Lesson 1 ----------
  const lesson1Content = [
    { type: "heading", text: "How the Internet Delivers a Website" },
    { type: "paragraph", text: "Every time you open a website, two computers have a short conversation: your browser (the client) asks a question, and a server answers with the files needed to build the page." },
    { type: "vocabulary", term: "Client", definition: "The program requesting information - usually your web browser." },
    { type: "vocabulary", term: "Server", definition: "A computer that stores files and data, and responds to requests from clients." },
    { type: "analogy", text: "Think of a restaurant: you (the client) place an order with a waiter, the kitchen (the server) prepares it, and the waiter brings back your food (the response)." },
    { type: "code_example", language: "text", code: "Browser --- GET / ---> Server\nBrowser <--- HTML --- Server" },
    { type: "line_explanation", lines: [
      { line: "Browser --- GET / ---> Server", explanation: "Your browser sends an HTTP GET request asking for the homepage." },
      { line: "Browser <--- HTML --- Server", explanation: "The server responds with HTML the browser can render into a page." },
    ] },
    { type: "callout", tone: "info", text: "A URL like https://example.com tells your browser which server to talk to and which resource to request." },
    { type: "common_mistake", text: "Beginners often assume a website is a single file. In reality, one page usually combines HTML, CSS, JavaScript, images, and data from several requests." },
    { type: "knowledge_check", question: "What does a web server do when your browser sends a request?", options: [
      "It deletes the request and does nothing",
      "It stores the request forever without responding",
      "It processes the request and sends back a response",
      "It only responds to requests from other servers"
    ], correctIndex: 2 },
    { type: "summary", text: "Every page load is a request-response conversation between a client and a server. Understanding this loop is the foundation for everything else you will build." },
  ];

  const lesson1 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: gettingStarted.id, slug: "how-the-internet-delivers-a-website" } },
    update: { title: "How the Internet Delivers a Website", order: 1, status: ContentStatus.PUBLISHED, content: lesson1Content },
    create: { moduleId: gettingStarted.id, slug: "how-the-internet-delivers-a-website", title: "How the Internet Delivers a Website", order: 1, status: ContentStatus.PUBLISHED, content: lesson1Content },
  });

  await prisma.lessonSkill.upsert({
    where: { lessonId_skillId: { lessonId: lesson1.id, skillId: skillWebRequests.id } },
    update: {},
    create: { lessonId: lesson1.id, skillId: skillWebRequests.id },
  });

  const mission1 = await prisma.mission.upsert({
    where: { lessonId_slug: { lessonId: lesson1.id, slug: "identify-the-request" } },
    update: {
      title: "Identify the Request",
      type: "multiple_choice",
      status: ContentStatus.PUBLISHED,
      explanation: "A GET request asks a server for data without sending a body; POST requests are used to submit new data.",
      xpReward: 10,
      difficulty: 1,
    },
    create: {
      lessonId: lesson1.id,
      slug: "identify-the-request",
      title: "Identify the Request",
      type: "multiple_choice",
      status: ContentStatus.PUBLISHED,
      explanation: "A GET request asks a server for data without sending a body; POST requests are used to submit new data.",
      xpReward: 10,
      difficulty: 1,
    },
  });

  await prisma.missionSkill.upsert({
    where: { missionId_skillId: { missionId: mission1.id, skillId: skillWebRequests.id } },
    update: {},
    create: { missionId: mission1.id, skillId: skillWebRequests.id },
  });

  // ---------- Lesson 2 ----------
  const lesson2Content = [
    { type: "heading", text: "Files and Folders in a Real Project" },
    { type: "paragraph", text: "Every application is really just a folder of files with an agreed-upon structure. Learning to read that structure is one of the fastest ways to stop feeling lost in a new codebase." },
    { type: "vocabulary", term: "Root folder", definition: "The top-level folder that contains an entire project." },
    { type: "vocabulary", term: "Entry point", definition: "The first file a program runs, or the first page a framework renders." },
    { type: "analogy", text: "A project folder is like a filing cabinet: each drawer (folder) groups related documents (files) so you can find what you need without reading everything." },
    { type: "code_example", language: "text", code: "src/\n  app/\n    page.tsx\n    dashboard/\n      page.tsx\n  lib/\n    auth.ts\nprisma/\n  schema.prisma" },
    { type: "line_explanation", lines: [
      { line: "src/app/page.tsx", explanation: "The homepage of this exact application - the first thing a visitor sees." },
      { line: "src/lib/auth.ts", explanation: "Shared logic, kept out of pages so it can be reused safely." },
      { line: "prisma/schema.prisma", explanation: "The single source of truth for every database table this application uses." },
    ] },
    { type: "callout", tone: "info", text: "This exact lesson is stored as a row in a database table - not hardcoded into a page - which is why it can be edited without changing any code." },
    { type: "common_mistake", text: "Beginners often try to memorize every file in a project. Instead, learn the folder conventions once, and you can navigate almost any project that follows them." },
    { type: "knowledge_check", question: "Why does this application store lesson text in the database instead of hardcoding it into React components?", options: [
      "Because databases are always faster than files",
      "So lessons can be edited or added without changing application code",
      "Because React cannot render text from files",
      "It has no real benefit, it is just a style choice"
    ], correctIndex: 1 },
    { type: "summary", text: "Reading a project's folder structure tells you where logic, pages, and data live before you read a single line of code inside them." },
  ];

  const lesson2 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: gettingStarted.id, slug: "files-and-folders-in-a-real-project" } },
    update: { title: "Files and Folders in a Real Project", order: 2, status: ContentStatus.PUBLISHED, content: lesson2Content },
    create: { moduleId: gettingStarted.id, slug: "files-and-folders-in-a-real-project", title: "Files and Folders in a Real Project", order: 2, status: ContentStatus.PUBLISHED, content: lesson2Content },
  });

  await prisma.lessonSkill.upsert({
    where: { lessonId_skillId: { lessonId: lesson2.id, skillId: skillFilesFolders.id } },
    update: {},
    create: { lessonId: lesson2.id, skillId: skillFilesFolders.id },
  });

  const mission2 = await prisma.mission.upsert({
    where: { lessonId_slug: { lessonId: lesson2.id, slug: "find-the-entry-point" } },
    update: {
      title: "Find the Entry Point",
      type: "predict_output",
      status: ContentStatus.PUBLISHED,
      starterCode: "src/\n  app/\n    page.tsx\n    sign-in/\n      page.tsx\n    dashboard/\n      page.tsx",
      explanation: "In the Next.js App Router, src/app/page.tsx maps to the site's root URL (\"/\"), making it the homepage entry point.",
      xpReward: 10,
      difficulty: 1,
    },
    create: {
      lessonId: lesson2.id,
      slug: "find-the-entry-point",
      title: "Find the Entry Point",
      type: "predict_output",
      status: ContentStatus.PUBLISHED,
      starterCode: "src/\n  app/\n    page.tsx\n    sign-in/\n      page.tsx\n    dashboard/\n      page.tsx",
      explanation: "In the Next.js App Router, src/app/page.tsx maps to the site's root URL (\"/\"), making it the homepage entry point.",
      xpReward: 10,
      difficulty: 1,
    },
  });

  await prisma.missionSkill.upsert({
    where: { missionId_skillId: { missionId: mission2.id, skillId: skillFilesFolders.id } },
    update: {},
    create: { missionId: mission2.id, skillId: skillFilesFolders.id },
  });

  // ---------- Module 2: Developer Toolkit ----------
  const developerToolkit = await prisma.module.upsert({
    where: { worldId_slug: { worldId: webFoundations.id, slug: "developer-toolkit" } },
    update: { title: "Developer Toolkit", summary: "The everyday tools professional developers use to write and run code.", order: 2, status: ContentStatus.PUBLISHED },
    create: { worldId: webFoundations.id, slug: "developer-toolkit", title: "Developer Toolkit", summary: "The everyday tools professional developers use to write and run code.", order: 2, status: ContentStatus.PUBLISHED },
  });

  const skillTerminalBasics = await prisma.skill.upsert({
    where: { slug: "terminal-basics" },
    update: { name: "Terminal basics", description: "Understanding what a terminal is and why developers use it." },
    create: { slug: "terminal-basics", name: "Terminal basics", description: "Understanding what a terminal is and why developers use it." },
  });

  const skillFilePaths = await prisma.skill.upsert({
    where: { slug: "file-paths" },
    update: { name: "Reading file paths", description: "Reading and reasoning about relative and absolute file paths." },
    create: { slug: "file-paths", name: "Reading file paths", description: "Reading and reasoning about relative and absolute file paths." },
  });

  // ---------- Lesson 3 ----------
  const lesson3Content = [
    { type: "heading", text: "What Is a Terminal?" },
    { type: "paragraph", text: "A terminal is a text-based way to give your computer instructions directly, instead of clicking through menus and folders. Professional developers use it constantly to run programs, install tools, and manage projects." },
    { type: "vocabulary", term: "Terminal", definition: "A program that lets you type text commands for your computer to execute." },
    { type: "vocabulary", term: "Command", definition: "A single instruction typed into a terminal, such as asking to list files." },
    { type: "analogy", text: "If clicking through folders in a file explorer is like walking through a building room by room, a terminal is like radioing ahead and asking someone to bring you exactly what you need." },
    { type: "code_example", language: "bash", code: "ls\ncd src\nnode --version" },
    { type: "line_explanation", lines: [
      { line: "ls", explanation: "Lists the files and folders in the current location." },
      { line: "cd src", explanation: "Changes into the \"src\" folder so following commands run from there." },
      { line: "node --version", explanation: "Asks the installed Node.js program to report which version is installed." },
    ] },
    { type: "callout", tone: "info", text: "Every deployment of this exact application runs terminal commands behind the scenes, such as installing dependencies and starting the server." },
    { type: "common_mistake", text: "Beginners often fear the terminal because a mistyped command looks scary. In reality, most commands are safe to try, and reading the output carefully is the fastest way to learn what went wrong." },
    { type: "knowledge_check", question: "What is the main purpose of a terminal?", options: [
      "To browse the internet visually",
      "To type text commands that instruct the computer directly",
      "To replace all file explorers permanently",
      "It is only used for playing games"
    ], correctIndex: 1 },
    { type: "summary", text: "A terminal lets you type direct instructions to your computer. It looks intimidating at first, but it is just another way of telling a computer what to do." },
  ];

  const lesson3 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: developerToolkit.id, slug: "what-is-a-terminal" } },
    update: { title: "What Is a Terminal?", order: 1, status: ContentStatus.PUBLISHED, content: lesson3Content },
    create: { moduleId: developerToolkit.id, slug: "what-is-a-terminal", title: "What Is a Terminal?", order: 1, status: ContentStatus.PUBLISHED, content: lesson3Content },
  });

  await prisma.lessonSkill.upsert({
    where: { lessonId_skillId: { lessonId: lesson3.id, skillId: skillTerminalBasics.id } },
    update: {},
    create: { lessonId: lesson3.id, skillId: skillTerminalBasics.id },
  });

  const mission3 = await prisma.mission.upsert({
    where: { lessonId_slug: { lessonId: lesson3.id, slug: "choose-the-right-command" } },
    update: {
      title: "Choose the Right Command",
      type: "multiple_choice",
      status: ContentStatus.PUBLISHED,
      explanation: "\"cd\" (change directory) is the command used to move into a different folder from the terminal.",
      xpReward: 10,
      difficulty: 1,
    },
    create: {
      lessonId: lesson3.id,
      slug: "choose-the-right-command",
      title: "Choose the Right Command",
      type: "multiple_choice",
      status: ContentStatus.PUBLISHED,
      explanation: "\"cd\" (change directory) is the command used to move into a different folder from the terminal.",
      xpReward: 10,
      difficulty: 1,
    },
  });

  await prisma.missionSkill.upsert({
    where: { missionId_skillId: { missionId: mission3.id, skillId: skillTerminalBasics.id } },
    update: {},
    create: { missionId: mission3.id, skillId: skillTerminalBasics.id },
  });

  // ---------- Lesson 4 ----------
  const lesson4Content = [
    { type: "heading", text: "Reading a File Path" },
    { type: "paragraph", text: "A file path tells you exactly where a file lives inside a project, the same way a mailing address tells a courier exactly where to deliver a package." },
    { type: "vocabulary", term: "Absolute path", definition: "A path that starts from the very top of the file system, so it always points to the same location no matter where you currently are." },
    { type: "vocabulary", term: "Relative path", definition: "A path written relative to your current location, such as referring to a file in the current folder or one folder up." },
    { type: "analogy", text: "An absolute path is like giving someone your full home address. A relative path is like saying \"two doors down from where you're standing\" - it only makes sense if you know the starting point." },
    { type: "code_example", language: "text", code: "src/app/dashboard/page.tsx\n../lib/auth.ts\n./page.tsx" },
    { type: "line_explanation", lines: [
      { line: "src/app/dashboard/page.tsx", explanation: "A path from the project root: go into src, then app, then dashboard, then open page.tsx." },
      { line: "../lib/auth.ts", explanation: "A relative path meaning \"go up one folder, then into lib, then open auth.ts\"." },
      { line: "./page.tsx", explanation: "A relative path meaning \"the page.tsx file in this exact same folder\"." },
    ] },
    { type: "callout", tone: "warning", text: "The two dots (..) always mean \"go up one folder\" - mixing up how many times you need it is one of the most common real-world bugs when importing files." },
    { type: "common_mistake", text: "Beginners often guess at relative paths instead of carefully counting folder levels. When an import fails, count the folders between the two files instead of guessing." },
    { type: "knowledge_check", question: "What does \"../\" mean in a file path?", options: [
      "Stay in the exact same folder",
      "Go to the very top of the entire file system",
      "Go up one folder level from the current location",
      "Create a brand new folder"
    ], correctIndex: 2 },
    { type: "summary", text: "File paths, whether absolute or relative, describe exactly where a file lives. Reading them carefully, one folder level at a time, avoids most import errors." },
  ];

  const lesson4 = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: developerToolkit.id, slug: "reading-a-file-path" } },
    update: { title: "Reading a File Path", order: 2, status: ContentStatus.PUBLISHED, content: lesson4Content },
    create: { moduleId: developerToolkit.id, slug: "reading-a-file-path", title: "Reading a File Path", order: 2, status: ContentStatus.PUBLISHED, content: lesson4Content },
  });

  await prisma.lessonSkill.upsert({
    where: { lessonId_skillId: { lessonId: lesson4.id, skillId: skillFilePaths.id } },
    update: {},
    create: { lessonId: lesson4.id, skillId: skillFilePaths.id },
  });

  const mission4 = await prisma.mission.upsert({
    where: { lessonId_slug: { lessonId: lesson4.id, slug: "predict-the-path" } },
    update: {
      title: "Predict the Path",
      type: "predict_output",
      status: ContentStatus.PUBLISHED,
      starterCode: "// File: src/app/dashboard/page.tsx\n// import from: src/lib/auth.ts\nimport { auth } from \"???\";",
      explanation: "From src/app/dashboard/page.tsx, reaching src/lib/auth.ts requires going up two folder levels (out of dashboard, out of app) then into lib: \"../../lib/auth\".",
      xpReward: 10,
      difficulty: 2,
    },
    create: {
      lessonId: lesson4.id,
      slug: "predict-the-path",
      title: "Predict the Path",
      type: "predict_output",
      status: ContentStatus.PUBLISHED,
      starterCode: "// File: src/app/dashboard/page.tsx\n// import from: src/lib/auth.ts\nimport { auth } from \"???\";",
      explanation: "From src/app/dashboard/page.tsx, reaching src/lib/auth.ts requires going up two folder levels (out of dashboard, out of app) then into lib: \"../../lib/auth\".",
      xpReward: 10,
      difficulty: 2,
    },
  });

  await prisma.missionSkill.upsert({
    where: { missionId_skillId: { missionId: mission4.id, skillId: skillFilePaths.id } },
    update: {},
    create: { missionId: mission4.id, skillId: skillFilePaths.id },
  });

  console.log("Seed complete: worlds, Web Foundations (2 modules, 4 lessons, 4 missions) upserted.");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

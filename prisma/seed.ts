// Idempotent curriculum seed script.
// Runs on every deploy start (see package.json's start script) so the
// database always reflects the worlds/modules/lessons/missions defined
// here. Safe to re-run: every write is an upsert keyed on a stable slug.
import { PrismaClient, ContentStatus } from "@prisma/client";

const prisma = new PrismaClient();

// The full world list from CLAUDE.md section 11. "Web Foundations",
// "HTML Harbor", "CSS City", and "JavaScript Jungle" have real, launch-quality
// lessons so far - every other world is intentionally left in DRAFT status
// with no modules,
// which the world map UI reads as "Upcoming" and excludes from completion
// calculations (CLAUDE.md section 11 requires worlds without launch-quality
// lessons to be labeled Upcoming, never presented as complete).
const WORLDS: Array<{
slug: string;
title: string;
summary: string;
order: number;
status: ContentStatus;
}> = [
{ slug: "web-foundations", title: "Web Foundations", summary: "How the web actually works, before you write a line of code.", order: 1, status: ContentStatus.PUBLISHED },
{ slug: "html-harbor", title: "HTML Harbor", summary: "Structure content with HTML.", order: 2, status: ContentStatus.PUBLISHED },
{ slug: "css-city", title: "CSS City", summary: "Style and layout with CSS.", order: 3, status: ContentStatus.PUBLISHED },
{ slug: "javascript-jungle", title: "JavaScript Jungle", summary: "Programming fundamentals with JavaScript.", order: 4, status: ContentStatus.PUBLISHED },
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
{ type: "code_example", language: "text", code: "src/\n app/\n page.tsx\n dashboard/\n page.tsx\n lib/\n auth.ts\nprisma/\n schema.prisma" },
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
starterCode: "src/\n app/\n page.tsx\n sign-in/\n page.tsx\n dashboard/\n page.tsx",
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
starterCode: "src/\n app/\n page.tsx\n sign-in/\n page.tsx\n dashboard/\n page.tsx",
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
// ---------- World 2: HTML Harbor ----------
const htmlHarbor = await prisma.world.findUniqueOrThrow({ where: { slug: "html-harbor" } });

const htmlBasics = await prisma.module.upsert({
where: { worldId_slug: { worldId: htmlHarbor.id, slug: "html-basics" } },
update: { title: "HTML Basics", summary: "The building blocks of every web page.", order: 1, status: ContentStatus.PUBLISHED },
create: { worldId: htmlHarbor.id, slug: "html-basics", title: "HTML Basics", summary: "The building blocks of every web page.", order: 1, status: ContentStatus.PUBLISHED },
});

const skillHtmlSyntax = await prisma.skill.upsert({
where: { slug: "html-syntax" },
update: { name: "HTML syntax", description: "Reading and writing tags, elements, and attributes." },
create: { slug: "html-syntax", name: "HTML syntax", description: "Reading and writing tags, elements, and attributes." },
});

const skillNestingAttributes = await prisma.skill.upsert({
where: { slug: "nesting-and-attributes" },
update: { name: "Nesting and attributes", description: "Understanding parent-child element relationships and how attributes extend elements." },
create: { slug: "nesting-and-attributes", name: "Nesting and attributes", description: "Understanding parent-child element relationships and how attributes extend elements." },
});

// ---------- Lesson 1 (HTML Harbor) ----------
const htmlLesson1Content = [
{ type: "heading", text: "What Is HTML?" },
{ type: "paragraph", text: "Every web page you have ever visited is built from HTML underneath. HTML gives a page structure by describing what each piece of content is: a heading, a paragraph, a link, or an image." },
{ type: "vocabulary", term: "HTML", definition: "HyperText Markup Language, the language browsers use to understand the structure of a web page." },
{ type: "vocabulary", term: "Element", definition: "A single structural building block on a page, made of a tag, optional attributes, and content." },
{ type: "vocabulary", term: "Tag", definition: "The markup written in angle brackets, such as <p> or <h1>, that defines the start or end of an element." },
{ type: "analogy", text: "If a web page were a house, HTML would be the framing: the walls, floors, and rooms that give the house its structure before any paint or furniture is added." },
{ type: "code_example", language: "html", code: "<h1>My Page</h1>\n<p>Welcome to my page.</p>" },
{ type: "line_explanation", lines: [
{ line: "<h1>My Page</h1>", explanation: "An <h1> element defines the single most important heading on the page." },
{ line: "<p>Welcome to my page.</p>", explanation: "A <p> element defines a paragraph of regular text." },
] },
{ type: "callout", tone: "info", text: "Most HTML elements come in pairs: an opening tag like <p> and a matching closing tag like </p>, with content in between." },
{ type: "common_mistake", text: "Beginners often forget closing tags, such as writing <p>Hello without </p>. Browsers sometimes recover from this, but it can cause unpredictable layout bugs." },
{ type: "knowledge_check", question: "What is the main purpose of HTML on a web page?", options: [
"To store data in a database",
"To describe the structure and meaning of content",
"To make network requests",
"To style colors and fonts"
], correctIndex: 1 },
{ type: "summary", text: "HTML structures a page into elements like headings and paragraphs. Every other technology you will learn builds on top of this structure." },
];

const htmlLesson1 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: htmlBasics.id, slug: "what-is-html" } },
update: { title: "What Is HTML?", order: 1, status: ContentStatus.PUBLISHED, content: htmlLesson1Content },
create: { moduleId: htmlBasics.id, slug: "what-is-html", title: "What Is HTML?", order: 1, status: ContentStatus.PUBLISHED, content: htmlLesson1Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: htmlLesson1.id, skillId: skillHtmlSyntax.id } },
update: {},
create: { lessonId: htmlLesson1.id, skillId: skillHtmlSyntax.id },
});

const htmlMission1 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: htmlLesson1.id, slug: "spot-the-element" } },
update: {
title: "Spot the Element",
type: "multiple_choice",
status: ContentStatus.PUBLISHED,
explanation: "An <h1> is a heading element and <p> defines a paragraph. Recognizing each tag's purpose is the first step to reading any HTML page.",
xpReward: 10,
difficulty: 1,
},
create: {
lessonId: htmlLesson1.id,
slug: "spot-the-element",
title: "Spot the Element",
type: "multiple_choice",
status: ContentStatus.PUBLISHED,
explanation: "An <h1> is a heading element and <p> defines a paragraph. Recognizing each tag's purpose is the first step to reading any HTML page.",
xpReward: 10,
difficulty: 1,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: htmlMission1.id, skillId: skillHtmlSyntax.id } },
update: {},
create: { missionId: htmlMission1.id, skillId: skillHtmlSyntax.id },
});
// ---------- Lesson 2 (HTML Harbor) ----------
const htmlLesson2Content = [
{ type: "heading", text: "Attributes and Nesting" },
{ type: "paragraph", text: "Elements can hold extra information called attributes, and elements can also be placed inside other elements. This nesting is what allows simple tags to build complex pages." },
{ type: "vocabulary", term: "Attribute", definition: "Extra information added inside an opening tag, written as name=\"value\", such as an image's src attribute." },
{ type: "vocabulary", term: "Nesting", definition: "Placing one element inside another, creating a parent-child relationship between them." },
{ type: "analogy", text: "Nesting elements is like putting a smaller box inside a bigger box - the outer box (parent) contains and organizes whatever is inside it (children)." },
{ type: "code_example", language: "html", code: "<div class=\"card\">\n <h2>Title</h2>\n <p>Some text inside the card.</p>\n</div>" },
{ type: "line_explanation", lines: [
{ line: "<div class=\"card\">", explanation: "A <div> is a generic container; class is an attribute used to target it with CSS later." },
{ line: "<h2>Title</h2>", explanation: "A nested heading element, a child of the div." },
{ line: "</div>", explanation: "The closing tag for the div, marking where its content ends." },
] },
{ type: "callout", tone: "warning", text: "Nested elements must close in the reverse order they were opened - closing tags out of order breaks the page structure." },
{ type: "common_mistake", text: "A common bug is overlapping tags, such as writing <b><i>text</b></i> instead of closing </i> before </b>. Always close the most recently opened tag first." },
{ type: "knowledge_check", question: "What is an HTML attribute?", options: [
"A separate HTML file",
"Extra information added inside an opening tag",
"A type of closing tag",
"A JavaScript function"
], correctIndex: 1 },
{ type: "summary", text: "Attributes add extra information to elements, and nesting lets elements contain other elements. Together they let a handful of tags describe complex page layouts." },
];

const htmlLesson2 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: htmlBasics.id, slug: "attributes-and-nesting" } },
update: { title: "Attributes and Nesting", order: 2, status: ContentStatus.PUBLISHED, content: htmlLesson2Content },
create: { moduleId: htmlBasics.id, slug: "attributes-and-nesting", title: "Attributes and Nesting", order: 2, status: ContentStatus.PUBLISHED, content: htmlLesson2Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: htmlLesson2.id, skillId: skillNestingAttributes.id } },
update: {},
create: { lessonId: htmlLesson2.id, skillId: skillNestingAttributes.id },
});

const htmlMission2 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: htmlLesson2.id, slug: "fix-the-nesting" } },
update: {
title: "Fix the Nesting",
type: "debug_challenge",
status: ContentStatus.PUBLISHED,
starterCode: "<div>\n <p>Some text\n</div>\n</p>",
explanation: "The closing tags are out of order - </p> must come before </div> since the paragraph was opened after the div and must close first.",
xpReward: 10,
difficulty: 2,
},
create: {
lessonId: htmlLesson2.id,
slug: "fix-the-nesting",
title: "Fix the Nesting",
type: "debug_challenge",
status: ContentStatus.PUBLISHED,
starterCode: "<div>\n <p>Some text\n</div>\n</p>",
explanation: "The closing tags are out of order - </p> must come before </div> since the paragraph was opened after the div and must close first.",
xpReward: 10,
difficulty: 2,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: htmlMission2.id, skillId: skillNestingAttributes.id } },
update: {},
create: { missionId: htmlMission2.id, skillId: skillNestingAttributes.id },
});

// ---------- Module 2 (HTML Harbor): Structuring Content ----------
const structuringContent = await prisma.module.upsert({
where: { worldId_slug: { worldId: htmlHarbor.id, slug: "structuring-content" } },
update: { title: "Structuring Content", summary: "Organize real pages with headings, lists, links, and images.", order: 2, status: ContentStatus.PUBLISHED },
create: { worldId: htmlHarbor.id, slug: "structuring-content", title: "Structuring Content", summary: "Organize real pages with headings, lists, links, and images.", order: 2, status: ContentStatus.PUBLISHED },
});

const skillHeadingsLists = await prisma.skill.upsert({
where: { slug: "headings-and-lists" },
update: { name: "Headings and lists", description: "Structuring text content with headings and lists." },
create: { slug: "headings-and-lists", name: "Headings and lists", description: "Structuring text content with headings and lists." },
});

const skillLinksImages = await prisma.skill.upsert({
where: { slug: "links-and-images" },
update: { name: "Links and images", description: "Connecting pages and embedding media with anchor and image elements." },
create: { slug: "links-and-images", name: "Links and images", description: "Connecting pages and embedding media with anchor and image elements." },
});
// ---------- Lesson 3 (HTML Harbor) ----------
const htmlLesson3Content = [
{ type: "heading", text: "Headings, Paragraphs, and Lists" },
{ type: "paragraph", text: "Most of the text you read on the web is organized using just a few elements: headings for titles, paragraphs for body text, and lists for grouped items." },
{ type: "vocabulary", term: "Heading", definition: "One of six elements (<h1> through <h6>) used to label sections of a page, ordered by importance." },
{ type: "vocabulary", term: "Unordered list", definition: "A bullet-point list, written with a <ul> element containing one or more <li> items." },
{ type: "analogy", text: "Headings and lists work like the table of contents and bullet points in a book - they let a reader scan the structure before reading every word." },
{ type: "code_example", language: "html", code: "<h2>Ingredients</h2>\n<ul>\n <li>Flour</li>\n <li>Sugar</li>\n <li>Eggs</li>\n</ul>" },
{ type: "line_explanation", lines: [
{ line: "<h2>Ingredients</h2>", explanation: "A second-level heading labeling the section below it." },
{ line: "<ul>", explanation: "Starts an unordered (bulleted) list." },
{ line: "<li>Flour</li>", explanation: "A single list item inside the unordered list." },
] },
{ type: "callout", tone: "info", text: "Use heading levels in order (h1, then h2, then h3) to describe a page's outline - skipping levels confuses screen readers and search engines." },
{ type: "common_mistake", text: "Beginners sometimes use headings purely to make text bigger and bold. Headings should describe structure and meaning - use CSS to change how text looks." },
{ type: "knowledge_check", question: "Which element creates a bulleted list item?", options: [
"<ul>",
"<li>",
"<ol>",
"<list>"
], correctIndex: 1 },
{ type: "summary", text: "Headings label sections in order of importance, and lists group related items. Choosing elements for meaning rather than appearance keeps pages accessible." },
];

const htmlLesson3 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: structuringContent.id, slug: "headings-paragraphs-and-lists" } },
update: { title: "Headings, Paragraphs, and Lists", order: 1, status: ContentStatus.PUBLISHED, content: htmlLesson3Content },
create: { moduleId: structuringContent.id, slug: "headings-paragraphs-and-lists", title: "Headings, Paragraphs, and Lists", order: 1, status: ContentStatus.PUBLISHED, content: htmlLesson3Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: htmlLesson3.id, skillId: skillHeadingsLists.id } },
update: {},
create: { lessonId: htmlLesson3.id, skillId: skillHeadingsLists.id },
});

const htmlMission3 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: htmlLesson3.id, slug: "choose-the-heading-level" } },
update: {
title: "Choose the Heading Level",
type: "multiple_choice",
status: ContentStatus.PUBLISHED,
explanation: "Heading levels should never skip - a page titled with <h1> should use <h2> for its next-level sections, not jump straight to <h3>.",
xpReward: 10,
difficulty: 1,
},
create: {
lessonId: htmlLesson3.id,
slug: "choose-the-heading-level",
title: "Choose the Heading Level",
type: "multiple_choice",
status: ContentStatus.PUBLISHED,
explanation: "Heading levels should never skip - a page titled with <h1> should use <h2> for its next-level sections, not jump straight to <h3>.",
xpReward: 10,
difficulty: 1,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: htmlMission3.id, skillId: skillHeadingsLists.id } },
update: {},
create: { missionId: htmlMission3.id, skillId: skillHeadingsLists.id },
});
// ---------- Lesson 4 (HTML Harbor) ----------
const htmlLesson4Content = [
{ type: "heading", text: "Links and Images" },
{ type: "paragraph", text: "Links connect pages together, and images let you embed pictures directly in a page. Together they turn a single document into the interconnected, visual web." },
{ type: "vocabulary", term: "Anchor element", definition: "The <a> element, used to create a clickable link to another page or resource, using its href attribute." },
{ type: "vocabulary", term: "Alt text", definition: "A description provided in an image's alt attribute, read aloud by screen readers and shown if the image fails to load." },
{ type: "analogy", text: "A link is like a street sign pointing to another location; alt text is like a caption you could hear even if you couldn't see the picture." },
{ type: "code_example", language: "html", code: "<a href=\"https://example.com\">Visit Example</a>\n<img src=\"/cat.jpg\" alt=\"A sleeping orange cat\">" },
{ type: "line_explanation", lines: [
{ line: "<a href=\"https://example.com\">Visit Example</a>", explanation: "Creates a clickable link; href specifies the destination URL." },
{ line: "<img src=\"/cat.jpg\" alt=\"A sleeping orange cat\">", explanation: "Embeds an image; alt provides a text description for accessibility." },
] },
{ type: "callout", tone: "warning", text: "Images without meaningful alt text are inaccessible to users relying on screen readers, and this is one of the most common real-world accessibility bugs." },
{ type: "common_mistake", text: "Beginners often forget the alt attribute entirely, or leave it empty when the image conveys real information, which breaks accessibility for many users." },
{ type: "knowledge_check", question: "What is the purpose of an image's alt attribute?", options: [
"To make the image load faster",
"To provide a text description for accessibility",
"To set the image's file size",
"To link the image to another page"
], correctIndex: 1 },
{ type: "summary", text: "Anchor elements link pages together, and images embed visual content. Meaningful alt text keeps that content accessible to everyone." },
];

const htmlLesson4 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: structuringContent.id, slug: "links-and-images" } },
update: { title: "Links and Images", order: 2, status: ContentStatus.PUBLISHED, content: htmlLesson4Content },
create: { moduleId: structuringContent.id, slug: "links-and-images", title: "Links and Images", order: 2, status: ContentStatus.PUBLISHED, content: htmlLesson4Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: htmlLesson4.id, skillId: skillLinksImages.id } },
update: {},
create: { lessonId: htmlLesson4.id, skillId: skillLinksImages.id },
});

const htmlMission4 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: htmlLesson4.id, slug: "write-an-accessible-image" } },
update: {
title: "Write an Accessible Image",
type: "code_writing",
status: ContentStatus.PUBLISHED,
starterCode: "<img src=\"/dog.jpg\">",
explanation: "A complete, accessible image tag needs a descriptive alt attribute, such as <img src=\"/dog.jpg\" alt=\"A brown dog running on grass\">.",
xpReward: 10,
difficulty: 2,
},
create: {
lessonId: htmlLesson4.id,
slug: "write-an-accessible-image",
title: "Write an Accessible Image",
type: "code_writing",
status: ContentStatus.PUBLISHED,
starterCode: "<img src=\"/dog.jpg\">",
explanation: "A complete, accessible image tag needs a descriptive alt attribute, such as <img src=\"/dog.jpg\" alt=\"A brown dog running on grass\">.",
xpReward: 10,
difficulty: 2,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: htmlMission4.id, skillId: skillLinksImages.id } },
update: {},
create: { missionId: htmlMission4.id, skillId: skillLinksImages.id },
});
// ---------- World 3: CSS City ----------
const cssCity = await prisma.world.findUniqueOrThrow({ where: { slug: "css-city" } });

const cssBasics = await prisma.module.upsert({
where: { worldId_slug: { worldId: cssCity.id, slug: "css-basics" } },
update: { title: "CSS Basics", summary: "Select elements and change how they look.", order: 1, status: ContentStatus.PUBLISHED },
create: { worldId: cssCity.id, slug: "css-basics", title: "CSS Basics", summary: "Select elements and change how they look.", order: 1, status: ContentStatus.PUBLISHED },
});

const skillCssSelectors = await prisma.skill.upsert({
where: { slug: "css-selectors" },
update: { name: "CSS selectors", description: "Targeting HTML elements so styles apply to the right content." },
create: { slug: "css-selectors", name: "CSS selectors", description: "Targeting HTML elements so styles apply to the right content." },
});

const skillCascadeSpecificity = await prisma.skill.upsert({
where: { slug: "cascade-and-specificity" },
update: { name: "The cascade and specificity", description: "Understanding how browsers decide which conflicting CSS rule wins." },
create: { slug: "cascade-and-specificity", name: "The cascade and specificity", description: "Understanding how browsers decide which conflicting CSS rule wins." },
});

// ---------- Lesson 1 (CSS City) ----------
const cssLesson1Content = [
{ type: "heading", text: "What Is CSS?" },
{ type: "paragraph", text: "HTML gives a page structure, but CSS (Cascading Style Sheets) controls how that structure looks: colors, fonts, spacing, and layout. Without CSS, every page would be plain black text on a white background." },
{ type: "vocabulary", term: "CSS", definition: "Cascading Style Sheets, the language used to describe how HTML elements should be displayed." },
{ type: "vocabulary", term: "Selector", definition: "A pattern that targets which HTML elements a CSS rule should apply to." },
{ type: "analogy", text: "If HTML is the framing of a house, CSS is the paint, furniture, and lighting - it changes how the same structure looks and feels without changing the structure itself." },
{ type: "code_example", language: "css", code: "p {\n color: navy;\n font-size: 18px;\n}" },
{ type: "line_explanation", lines: [
{ line: "p {", explanation: "Selects every <p> element on the page." },
{ line: "color: navy;", explanation: "Sets the text color of matched elements to navy blue." },
{ line: "font-size: 18px;", explanation: "Sets the text size of matched elements to 18 pixels." },
] },
{ type: "callout", tone: "info", text: "A CSS rule always has the same shape: a selector, followed by curly braces containing one or more property: value; declarations." },
{ type: "common_mistake", text: "Beginners often forget the semicolon after a declaration, such as writing \"color: navy\" without the trailing semicolon, which can silently break the next declaration." },
{ type: "knowledge_check", question: "What does CSS control on a web page?", options: [
"The meaning and structure of content",
"How content looks and is laid out",
"Server-side data storage",
"Network requests between client and server"
], correctIndex: 1 },
{ type: "summary", text: "CSS describes how HTML elements should look, using rules made of a selector and one or more declarations. It changes appearance without changing structure." },
];

const cssLesson1 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: cssBasics.id, slug: "what-is-css" } },
update: { title: "What Is CSS?", order: 1, status: ContentStatus.PUBLISHED, content: cssLesson1Content },
create: { moduleId: cssBasics.id, slug: "what-is-css", title: "What Is CSS?", order: 1, status: ContentStatus.PUBLISHED, content: cssLesson1Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: cssLesson1.id, skillId: skillCssSelectors.id } },
update: {},
create: { lessonId: cssLesson1.id, skillId: skillCssSelectors.id },
});

const cssMission1 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: cssLesson1.id, slug: "identify-the-selector" } },
update: {
title: "Identify the Selector",
type: "multiple_choice",
status: ContentStatus.PUBLISHED,
explanation: "In \"p { color: navy; }\", the selector \"p\" is the part before the curly braces - it decides which elements the rule targets.",
xpReward: 10,
difficulty: 1,
},
create: {
lessonId: cssLesson1.id,
slug: "identify-the-selector",
title: "Identify the Selector",
type: "multiple_choice",
status: ContentStatus.PUBLISHED,
explanation: "In \"p { color: navy; }\", the selector \"p\" is the part before the curly braces - it decides which elements the rule targets.",
xpReward: 10,
difficulty: 1,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: cssMission1.id, skillId: skillCssSelectors.id } },
update: {},
create: { missionId: cssMission1.id, skillId: skillCssSelectors.id },
});
// ---------- Lesson 2 (CSS City) ----------
const cssLesson2Content = [
{ type: "heading", text: "Selectors and the Cascade" },
{ type: "paragraph", text: "Real pages often have multiple CSS rules that could apply to the same element. The cascade is the set of rules browsers use to decide which declaration actually wins." },
{ type: "vocabulary", term: "Class selector", definition: "A selector starting with a dot, like .card, that targets any element with that class attribute." },
{ type: "vocabulary", term: "Specificity", definition: "A score browsers calculate for each selector to decide which conflicting rule takes priority." },
{ type: "analogy", text: "The cascade is like a company's chain of command: a more specific instruction from your direct manager overrides a general policy from the company handbook." },
{ type: "code_example", language: "css", code: ".card {\n color: navy;\n}\n\np {\n color: gray;\n}" },
{ type: "line_explanation", lines: [
{ line: ".card { color: navy; }", explanation: "A class selector, which is more specific than a plain element selector." },
{ line: "p { color: gray; }", explanation: "An element selector; on a <p class=\"card\"> element, this rule loses to .card because class selectors are more specific." },
] },
{ type: "callout", tone: "warning", text: "When two rules have equal specificity, the one written later in the stylesheet wins - order matters, not just specificity." },
{ type: "common_mistake", text: "Beginners often add \"!important\" to force a style to win instead of understanding specificity, which makes future overrides much harder to reason about." },
{ type: "knowledge_check", question: "If a <p class=\"card\"> element is targeted by both \".card\" and \"p\" rules with conflicting colors, which one wins?", options: [
"\"p\", because element selectors always win",
"Neither rule applies",
"\".card\", because class selectors are more specific than element selectors",
"Whichever rule appears first in the file"
], correctIndex: 2 },
{ type: "summary", text: "When multiple CSS rules conflict, the cascade resolves them using specificity and order. Class selectors beat plain element selectors." },
];

const cssLesson2 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: cssBasics.id, slug: "selectors-and-the-cascade" } },
update: { title: "Selectors and the Cascade", order: 2, status: ContentStatus.PUBLISHED, content: cssLesson2Content },
create: { moduleId: cssBasics.id, slug: "selectors-and-the-cascade", title: "Selectors and the Cascade", order: 2, status: ContentStatus.PUBLISHED, content: cssLesson2Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: cssLesson2.id, skillId: skillCascadeSpecificity.id } },
update: {},
create: { lessonId: cssLesson2.id, skillId: skillCascadeSpecificity.id },
});

const cssMission2 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: cssLesson2.id, slug: "predict-the-winning-rule" } },
update: {
title: "Predict the Winning Rule",
type: "predict_output",
status: ContentStatus.PUBLISHED,
starterCode: "/* HTML: <p class=\"card\">Hello</p> */\n\n.card {\n color: navy;\n}\n\np {\n color: gray;\n}",
explanation: "Class selectors are more specific than element selectors, so .card wins and the text renders navy, not gray.",
xpReward: 10,
difficulty: 2,
},
create: {
lessonId: cssLesson2.id,
slug: "predict-the-winning-rule",
title: "Predict the Winning Rule",
type: "predict_output",
status: ContentStatus.PUBLISHED,
starterCode: "/* HTML: <p class=\"card\">Hello</p> */\n\n.card {\n color: navy;\n}\n\np {\n color: gray;\n}",
explanation: "Class selectors are more specific than element selectors, so .card wins and the text renders navy, not gray.",
xpReward: 10,
difficulty: 2,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: cssMission2.id, skillId: skillCascadeSpecificity.id } },
update: {},
create: { missionId: cssMission2.id, skillId: skillCascadeSpecificity.id },
});

// ---------- Module 2 (CSS City): Layout Basics ----------
const layoutBasics = await prisma.module.upsert({
where: { worldId_slug: { worldId: cssCity.id, slug: "layout-basics" } },
update: { title: "Layout Basics", summary: "Arrange elements on the page with the box model and flexbox.", order: 2, status: ContentStatus.PUBLISHED },
create: { worldId: cssCity.id, slug: "layout-basics", title: "Layout Basics", summary: "Arrange elements on the page with the box model and flexbox.", order: 2, status: ContentStatus.PUBLISHED },
});

const skillBoxModel = await prisma.skill.upsert({
where: { slug: "box-model" },
update: { name: "The box model", description: "Understanding content, padding, border, and margin around every element." },
create: { slug: "box-model", name: "The box model", description: "Understanding content, padding, border, and margin around every element." },
});

const skillFlexboxLayout = await prisma.skill.upsert({
where: { slug: "flexbox-layout" },
update: { name: "Flexbox layout", description: "Arranging elements in a row or column using flexbox." },
create: { slug: "flexbox-layout", name: "Flexbox layout", description: "Arranging elements in a row or column using flexbox." },
});
// ---------- Lesson 3 (CSS City) ----------
const cssLesson3Content = [
{ type: "heading", text: "The Box Model" },
{ type: "paragraph", text: "Every HTML element is rendered as a rectangular box made of four layers: content, padding, border, and margin. Understanding these layers explains most spacing and sizing behavior in CSS." },
{ type: "vocabulary", term: "Padding", definition: "Space between an element's content and its border, added inside the element." },
{ type: "vocabulary", term: "Margin", definition: "Space between an element's border and neighboring elements, added outside the element." },
{ type: "analogy", text: "Think of a framed photo: the photo itself is the content, the mat around it is the padding, the frame is the border, and the gap to the next photo on the wall is the margin." },
{ type: "code_example", language: "css", code: ".box {\n width: 200px;\n padding: 16px;\n border: 2px solid black;\n margin: 24px;\n}" },
{ type: "line_explanation", lines: [
{ line: "width: 200px;", explanation: "Sets the width of the content area itself." },
{ line: "padding: 16px;", explanation: "Adds 16 pixels of space between the content and the border, on all four sides." },
{ line: "margin: 24px;", explanation: "Adds 24 pixels of space outside the border, pushing neighboring elements away." },
] },
{ type: "callout", tone: "warning", text: "By default, padding and border are added on top of the specified width, making the final rendered box larger than you might expect - box-sizing: border-box changes this." },
{ type: "common_mistake", text: "Beginners often confuse padding and margin. Padding is space inside the border (around the content); margin is space outside the border (between elements)." },
{ type: "knowledge_check", question: "Which box model layer sits directly between the content and the border?", options: [
"Margin",
"Padding",
"Outline",
"Background"
], correctIndex: 1 },
{ type: "summary", text: "Every element is a box made of content, padding, border, and margin. Knowing which layer you are adjusting is key to controlling spacing precisely." },
];

const cssLesson3 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: layoutBasics.id, slug: "the-box-model" } },
update: { title: "The Box Model", order: 1, status: ContentStatus.PUBLISHED, content: cssLesson3Content },
create: { moduleId: layoutBasics.id, slug: "the-box-model", title: "The Box Model", order: 1, status: ContentStatus.PUBLISHED, content: cssLesson3Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: cssLesson3.id, skillId: skillBoxModel.id } },
update: {},
create: { lessonId: cssLesson3.id, skillId: skillBoxModel.id },
});

const cssMission3 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: cssLesson3.id, slug: "calculate-the-box-size" } },
update: {
title: "Calculate the Box Size",
type: "predict_output",
status: ContentStatus.PUBLISHED,
starterCode: ".box {\n width: 100px;\n padding: 10px;\n border: 5px solid black;\n}",
explanation: "With the default box-sizing, the rendered width is content + padding + border on both sides: 100 + (10*2) + (5*2) = 130px.",
xpReward: 10,
difficulty: 2,
},
create: {
lessonId: cssLesson3.id,
slug: "calculate-the-box-size",
title: "Calculate the Box Size",
type: "predict_output",
status: ContentStatus.PUBLISHED,
starterCode: ".box {\n width: 100px;\n padding: 10px;\n border: 5px solid black;\n}",
explanation: "With the default box-sizing, the rendered width is content + padding + border on both sides: 100 + (10*2) + (5*2) = 130px.",
xpReward: 10,
difficulty: 2,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: cssMission3.id, skillId: skillBoxModel.id } },
update: {},
create: { missionId: cssMission3.id, skillId: skillBoxModel.id },
});
// ---------- Lesson 4 (CSS City) ----------
const cssLesson4Content = [
{ type: "heading", text: "Flexbox Basics" },
{ type: "paragraph", text: "Flexbox is a CSS layout mode that arranges elements in a single row or column, distributing space between them automatically. It replaced most of the fragile float-based layouts developers used to rely on." },
{ type: "vocabulary", term: "Flex container", definition: "An element with display: flex applied, which controls the layout of its direct children." },
{ type: "vocabulary", term: "Flex item", definition: "A direct child of a flex container, laid out according to the container's flex properties." },
{ type: "analogy", text: "A flex container is like a row of seats on a bus: justify-content decides how the seats are spaced along the row, while align-items decides how each passenger sits within their seat's height." },
{ type: "code_example", language: "css", code: ".nav {\n display: flex;\n justify-content: space-between;\n align-items: center;\n}" },
{ type: "line_explanation", lines: [
{ line: "display: flex;", explanation: "Turns .nav into a flex container, laying its children out in a row by default." },
{ line: "justify-content: space-between;", explanation: "Spreads the children evenly along the row, with the first item at the start and the last at the end." },
{ line: "align-items: center;", explanation: "Vertically centers the children within the height of the container." },
] },
{ type: "callout", tone: "info", text: "Adding flex-direction: column changes a flex container to lay its children out top to bottom instead of left to right." },
{ type: "common_mistake", text: "Beginners often apply flex properties like justify-content to the item instead of the container - these properties only work when set on the flex container itself." },
{ type: "knowledge_check", question: "Where should display: flex be applied to create a flex layout?", options: [
"On every child element",
"On the parent container whose children should be arranged",
"On the <body> element only",
"It is applied automatically to all elements"
], correctIndex: 1 },
{ type: "summary", text: "Flexbox turns a container into a flexible row or column, letting properties like justify-content and align-items control spacing and alignment without fragile hacks." },
];

const cssLesson4 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: layoutBasics.id, slug: "flexbox-basics" } },
update: { title: "Flexbox Basics", order: 2, status: ContentStatus.PUBLISHED, content: cssLesson4Content },
create: { moduleId: layoutBasics.id, slug: "flexbox-basics", title: "Flexbox Basics", order: 2, status: ContentStatus.PUBLISHED, content: cssLesson4Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: cssLesson4.id, skillId: skillFlexboxLayout.id } },
update: {},
create: { lessonId: cssLesson4.id, skillId: skillFlexboxLayout.id },
});

const cssMission4 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: cssLesson4.id, slug: "fix-the-flex-layout" } },
update: {
title: "Fix the Flex Layout",
type: "debug_challenge",
status: ContentStatus.PUBLISHED,
starterCode: ".nav {\n justify-content: space-between;\n}",
explanation: "justify-content only has an effect on a flex (or grid) container. The rule is missing \"display: flex;\", so the browser ignores justify-content entirely.",
xpReward: 10,
difficulty: 2,
},
create: {
lessonId: cssLesson4.id,
slug: "fix-the-flex-layout",
title: "Fix the Flex Layout",
type: "debug_challenge",
status: ContentStatus.PUBLISHED,
starterCode: ".nav {\n justify-content: space-between;\n}",
explanation: "justify-content only has an effect on a flex (or grid) container. The rule is missing \"display: flex;\", so the browser ignores justify-content entirely.",
xpReward: 10,
difficulty: 2,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: cssMission4.id, skillId: skillFlexboxLayout.id } },
update: {},
create: { missionId: cssMission4.id, skillId: skillFlexboxLayout.id },
});

// ---------- World 4: JavaScript Jungle ----------
const javascriptJungle = await prisma.world.findUniqueOrThrow({ where: { slug: "javascript-jungle" } });

const jsBasics = await prisma.module.upsert({
where: { worldId_slug: { worldId: javascriptJungle.id, slug: "js-basics" } },
update: { title: "JS Basics", summary: "Variables, values, and operators.", order: 1, status: ContentStatus.PUBLISHED },
create: { worldId: javascriptJungle.id, slug: "js-basics", title: "JS Basics", summary: "Variables, values, and operators.", order: 1, status: ContentStatus.PUBLISHED },
});

const skillVariables = await prisma.skill.upsert({
where: { slug: "variables-and-values" },
update: { name: "Variables and values", description: "Declaring, naming, and reassigning variables to store values." },
create: { slug: "variables-and-values", name: "Variables and values", description: "Declaring, naming, and reassigning variables to store values." },
});

const skillOperators = await prisma.skill.upsert({
where: { slug: "operators-and-expressions" },
update: { name: "Operators and expressions", description: "Using arithmetic and comparison operators to produce new values." },
create: { slug: "operators-and-expressions", name: "Operators and expressions", description: "Using arithmetic and comparison operators to produce new values." },
});

// ---------- Lesson 1 (JavaScript Jungle) ----------
const jsLesson1Content = [
{ type: "heading", text: "Variables and Values" },
{ type: "paragraph", text: "A variable is a named container for a value your program needs to remember and reuse. JavaScript uses variables to store everything from a user's name to the result of a calculation." },
{ type: "vocabulary", term: "Variable", definition: "A named container that stores a value your program can read and change later." },
{ type: "vocabulary", term: "Value", definition: "The actual piece of data stored in a variable, such as a number, string, or boolean." },
{ type: "analogy", text: "A variable is like a labeled box: the label (variable name) stays the same, but you can open the box and replace what's inside (the value) at any time." },
{ type: "code_example", language: "javascript", code: "let score = 0;\nscore = score + 10;\nconst playerName = \"Ada\";" },
{ type: "line_explanation", lines: [
{ line: "let score = 0;", explanation: "Declares a variable named score and sets its initial value to 0." },
{ line: "score = score + 10;", explanation: "Reassigns score to its current value plus 10, since let variables can change." },
{ line: "const playerName = \"Ada\";", explanation: "Declares a constant that cannot be reassigned after this line." },
] },
{ type: "callout", tone: "info", text: "Use const by default, and only use let when you know a variable's value will need to change later." },
{ type: "common_mistake", text: "Beginners often try to reassign a const variable, which throws an error. If a value needs to change, declare it with let instead." },
{ type: "knowledge_check", question: "What is the difference between let and const in JavaScript?", options: [
"There is no difference",
"let can be reassigned, const cannot",
"const can be reassigned, let cannot",
"Both must be reassigned"
], correctIndex: 1 },
{ type: "summary", text: "Variables store values under a name you choose. Use const for values that won't change and let for values that will." },
];

const jsLesson1 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: jsBasics.id, slug: "variables-and-values" } },
update: { title: "Variables and Values", order: 1, status: ContentStatus.PUBLISHED, content: jsLesson1Content },
create: { moduleId: jsBasics.id, slug: "variables-and-values", title: "Variables and Values", order: 1, status: ContentStatus.PUBLISHED, content: jsLesson1Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: jsLesson1.id, skillId: skillVariables.id } },
update: {},
create: { lessonId: jsLesson1.id, skillId: skillVariables.id },
});

const jsMission1 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: jsLesson1.id, slug: "predict-the-score" } },
update: {
title: "Predict the Score",
type: "predict_output",
status: ContentStatus.PUBLISHED,
starterCode: "let score = 5;\nscore = score + 3;\nconsole.log(score);",
explanation: "score starts at 5, then is reassigned to 5 + 3, so console.log prints 8.",
xpReward: 10,
difficulty: 1,
},
create: {
lessonId: jsLesson1.id,
slug: "predict-the-score",
title: "Predict the Score",
type: "predict_output",
status: ContentStatus.PUBLISHED,
starterCode: "let score = 5;\nscore = score + 3;\nconsole.log(score);",
explanation: "score starts at 5, then is reassigned to 5 + 3, so console.log prints 8.",
xpReward: 10,
difficulty: 1,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: jsMission1.id, skillId: skillVariables.id } },
update: {},
create: { missionId: jsMission1.id, skillId: skillVariables.id },
});
// ---------- Lesson 2 (JavaScript Jungle) ----------
const jsLesson2Content = [
{ type: "heading", text: "Operators and Expressions" },
{ type: "paragraph", text: "Operators combine values to produce new values. JavaScript has arithmetic operators for math, comparison operators for checking relationships, and more." },
{ type: "vocabulary", term: "Operator", definition: "A symbol like + or === that performs an operation on one or more values." },
{ type: "vocabulary", term: "Expression", definition: "Any piece of code that produces a value, such as 2 + 2 or score > 10." },
{ type: "analogy", text: "Operators are like verbs in a sentence: they take the nouns (values) around them and produce a new outcome, the same way \"add\" combines two numbers into a sum." },
{ type: "code_example", language: "javascript", code: "let total = 4 + 5;\nlet isHighScore = total > 8;\nlet isEqual = total === 9;" },
{ type: "line_explanation", lines: [
{ line: "let total = 4 + 5;", explanation: "The + operator adds two numbers, so total becomes 9." },
{ line: "let isHighScore = total > 8;", explanation: "The > operator compares two values and produces a boolean, here true." },
{ line: "let isEqual = total === 9;", explanation: "The === operator checks strict equality, comparing both value and type." },
] },
{ type: "callout", tone: "warning", text: "Always use === instead of == in JavaScript - == converts types before comparing, which can produce surprising results." },
{ type: "common_mistake", text: "Beginners often confuse the assignment operator = with the equality operator ===. \"=\" stores a value; \"===\" compares two values." },
{ type: "knowledge_check", question: "What does the === operator do?", options: [
"Assigns a value to a variable",
"Checks strict equality between two values",
"Adds two numbers together",
"Declares a new variable"
], correctIndex: 1 },
{ type: "summary", text: "Operators combine values into new results. Arithmetic operators do math, and comparison operators like === produce booleans used to make decisions." },
];

const jsLesson2 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: jsBasics.id, slug: "operators-and-expressions" } },
update: { title: "Operators and Expressions", order: 2, status: ContentStatus.PUBLISHED, content: jsLesson2Content },
create: { moduleId: jsBasics.id, slug: "operators-and-expressions", title: "Operators and Expressions", order: 2, status: ContentStatus.PUBLISHED, content: jsLesson2Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: jsLesson2.id, skillId: skillOperators.id } },
update: {},
create: { lessonId: jsLesson2.id, skillId: skillOperators.id },
});

const jsMission2 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: jsLesson2.id, slug: "identify-the-operator" } },
update: {
title: "Identify the Operator",
type: "multiple_choice",
status: ContentStatus.PUBLISHED,
explanation: "\"===\" is the strict equality operator, checking that two values are equal without converting their types.",
xpReward: 10,
difficulty: 1,
},
create: {
lessonId: jsLesson2.id,
slug: "identify-the-operator",
title: "Identify the Operator",
type: "multiple_choice",
status: ContentStatus.PUBLISHED,
explanation: "\"===\" is the strict equality operator, checking that two values are equal without converting their types.",
xpReward: 10,
difficulty: 1,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: jsMission2.id, skillId: skillOperators.id } },
update: {},
create: { missionId: jsMission2.id, skillId: skillOperators.id },
});

// ---------- Module 2 (JavaScript Jungle): Control Flow ----------
const controlFlow = await prisma.module.upsert({
where: { worldId_slug: { worldId: javascriptJungle.id, slug: "control-flow" } },
update: { title: "Control Flow", summary: "Make decisions and repeat actions in code.", order: 2, status: ContentStatus.PUBLISHED },
create: { worldId: javascriptJungle.id, slug: "control-flow", title: "Control Flow", summary: "Make decisions and repeat actions in code.", order: 2, status: ContentStatus.PUBLISHED },
});

const skillConditionals = await prisma.skill.upsert({
where: { slug: "conditionals" },
update: { name: "Conditionals", description: "Branching program flow with if, else, and comparisons." },
create: { slug: "conditionals", name: "Conditionals", description: "Branching program flow with if, else, and comparisons." },
});

const skillLoops = await prisma.skill.upsert({
where: { slug: "loops" },
update: { name: "Loops", description: "Repeating code with for and while loops." },
create: { slug: "loops", name: "Loops", description: "Repeating code with for and while loops." },
});
// ---------- Lesson 3 (JavaScript Jungle) ----------
const jsLesson3Content = [
{ type: "heading", text: "Making Decisions with If Statements" },
{ type: "paragraph", text: "Programs need to make decisions: run one block of code if something is true, and a different block otherwise. The if statement is the primary tool JavaScript gives you to do this." },
{ type: "vocabulary", term: "Conditional", definition: "A statement that runs different code depending on whether a condition is true or false." },
{ type: "vocabulary", term: "Boolean", definition: "A value that is either true or false, often produced by comparison operators." },
{ type: "analogy", text: "An if statement is like a fork in a hiking trail with a sign: if the sign's condition matches your situation, you take that path; otherwise, you continue on the other one." },
{ type: "code_example", language: "javascript", code: "let score = 85;\nif (score >= 60) {\n console.log(\"Pass\");\n} else {\n console.log(\"Fail\");\n}" },
{ type: "line_explanation", lines: [
{ line: "if (score >= 60) {", explanation: "Checks whether score is greater than or equal to 60." },
{ line: "console.log(\"Pass\");", explanation: "Runs only when the condition above is true." },
{ line: "} else {", explanation: "Marks the block that runs when the condition is false instead." },
] },
{ type: "callout", tone: "info", text: "The condition inside an if statement's parentheses must evaluate to true or false - comparison operators are what usually produce that boolean." },
{ type: "common_mistake", text: "Beginners sometimes write if (score = 60) with a single equals sign, which assigns 60 to score instead of comparing - always use === for comparisons." },
{ type: "knowledge_check", question: "When does the code inside an else block run?", options: [
"Always, right after the if block",
"Only when the if condition is true",
"Only when the if condition is false",
"Never, it is just a comment"
], correctIndex: 2 },
{ type: "summary", text: "If statements let a program branch based on a condition. Pairing if with else covers both the true and false cases." },
];

const jsLesson3 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: controlFlow.id, slug: "if-statements-and-comparisons" } },
update: { title: "If Statements and Comparisons", order: 1, status: ContentStatus.PUBLISHED, content: jsLesson3Content },
create: { moduleId: controlFlow.id, slug: "if-statements-and-comparisons", title: "If Statements and Comparisons", order: 1, status: ContentStatus.PUBLISHED, content: jsLesson3Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: jsLesson3.id, skillId: skillConditionals.id } },
update: {},
create: { lessonId: jsLesson3.id, skillId: skillConditionals.id },
});

const jsMission3 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: jsLesson3.id, slug: "predict-the-branch" } },
update: {
title: "Predict the Branch",
type: "predict_output",
status: ContentStatus.PUBLISHED,
starterCode: "let temperature = 40;\nif (temperature > 90) {\n console.log(\"Hot\");\n} else {\n console.log(\"Not hot\");\n}",
explanation: "temperature (40) is not greater than 90, so the condition is false and the else branch runs, printing \"Not hot\".",
xpReward: 10,
difficulty: 2,
},
create: {
lessonId: jsLesson3.id,
slug: "predict-the-branch",
title: "Predict the Branch",
type: "predict_output",
status: ContentStatus.PUBLISHED,
starterCode: "let temperature = 40;\nif (temperature > 90) {\n console.log(\"Hot\");\n} else {\n console.log(\"Not hot\");\n}",
explanation: "temperature (40) is not greater than 90, so the condition is false and the else branch runs, printing \"Not hot\".",
xpReward: 10,
difficulty: 2,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: jsMission3.id, skillId: skillConditionals.id } },
update: {},
create: { missionId: jsMission3.id, skillId: skillConditionals.id },
});
// ---------- Lesson 4 (JavaScript Jungle) ----------
const jsLesson4Content = [
{ type: "heading", text: "Repeating Actions with Loops" },
{ type: "paragraph", text: "Loops let a program repeat a block of code multiple times without writing it out by hand. The for loop is one of the most common ways to repeat an action a specific number of times." },
{ type: "vocabulary", term: "Loop", definition: "A structure that repeats a block of code while a condition remains true." },
{ type: "vocabulary", term: "Iteration", definition: "A single pass through the body of a loop." },
{ type: "analogy", text: "A for loop is like giving someone instructions to \"knock on this door 5 times\" instead of separately saying \"knock\" five times in a row." },
{ type: "code_example", language: "javascript", code: "for (let i = 0; i < 3; i++) {\n console.log(i);\n}" },
{ type: "line_explanation", lines: [
{ line: "for (let i = 0; i < 3; i++) {", explanation: "Starts i at 0, repeats while i is less than 3, and increases i by 1 after each pass." },
{ line: "console.log(i);", explanation: "Runs once per iteration, printing the current value of i." },
{ line: "}", explanation: "Marks the end of the loop's body." },
] },
{ type: "callout", tone: "warning", text: "Forgetting to update the loop's counter (like i++) creates an infinite loop, since the condition never becomes false." },
{ type: "common_mistake", text: "Beginners often write the wrong comparison, such as i <= 3 when they meant i < 3, causing one extra iteration than intended." },
{ type: "knowledge_check", question: "In \"for (let i = 0; i < 3; i++)\", how many times does the loop body run?", options: [
"2 times",
"3 times",
"4 times",
"Infinitely"
], correctIndex: 1 },
{ type: "summary", text: "Loops repeat a block of code while a condition holds true. The for loop's three parts control where it starts, when it stops, and how it advances." },
];

const jsLesson4 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: controlFlow.id, slug: "loops" } },
update: { title: "Loops", order: 2, status: ContentStatus.PUBLISHED, content: jsLesson4Content },
create: { moduleId: controlFlow.id, slug: "loops", title: "Loops", order: 2, status: ContentStatus.PUBLISHED, content: jsLesson4Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: jsLesson4.id, skillId: skillLoops.id } },
update: {},
create: { lessonId: jsLesson4.id, skillId: skillLoops.id },
});

const jsMission4 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: jsLesson4.id, slug: "fix-the-infinite-loop" } },
update: {
title: "Fix the Infinite Loop",
type: "debug_challenge",
status: ContentStatus.PUBLISHED,
starterCode: "let i = 0;\nwhile (i < 5) {\n console.log(i);\n}",
explanation: "The loop never updates i, so the condition i < 5 stays true forever. Adding i++; inside the loop body fixes the infinite loop.",
xpReward: 10,
difficulty: 2,
},
create: {
lessonId: jsLesson4.id,
slug: "fix-the-infinite-loop",
title: "Fix the Infinite Loop",
type: "debug_challenge",
status: ContentStatus.PUBLISHED,
starterCode: "let i = 0;\nwhile (i < 5) {\n console.log(i);\n}",
explanation: "The loop never updates i, so the condition i < 5 stays true forever. Adding i++; inside the loop body fixes the infinite loop.",
xpReward: 10,
difficulty: 2,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: jsMission4.id, skillId: skillLoops.id } },
update: {},
create: { missionId: jsMission4.id, skillId: skillLoops.id },
});


// ---------- Mission prompts, options, and grading specs ----------
type MissionMeta = {
  prompt: string;
  options?: string[];
  test: Record<string, unknown>;
};

const MISSION_META: Record<string, MissionMeta> = {
  "identify-the-request": {
    prompt: "Which HTTP method should you use to fetch data from a server without changing anything, and without sending a request body?",
    options: ["GET", "POST", "PUT", "DELETE"],
    test: { checkType: "mc", correctIndex: 0 },
  },
  "find-the-entry-point": {
    prompt: "Given the project's folder structure, which file path is the homepage entry point that answers requests to the site's root URL (a single forward slash)?",
    test: { checkType: "text_exact", answer: "src/app/page.tsx", acceptableAnswers: ["app/page.tsx", "page.tsx", "src/app/page.tsx"] },
  },
  "choose-the-right-command": {
    prompt: "Which terminal command moves you into a different folder?",
    options: ["cd", "ls", "mkdir", "pwd"],
    test: { checkType: "mc", correctIndex: 0 },
  },
  "predict-the-path": {
    prompt: "This file needs to import from src/lib/auth.ts. What import path replaces the placeholder so the import resolves correctly?",
    test: { checkType: "text_exact", answer: "../../lib/auth", acceptableAnswers: ["../../lib/auth", "../../lib/auth.ts"] },
  },
  "spot-the-element": {
    prompt: "Which tag defines a top-level heading?",
    options: ["<h1>", "<p>", "<div>", "<span>"],
    test: { checkType: "mc", correctIndex: 0 },
  },
  "fix-the-nesting": {
    prompt: "Fix the closing tag order below so the elements are properly nested, then submit.",
    test: { checkType: "nesting_order", mustContain: ["<div>", "<p>", "</p>", "</div>"], firstClose: "</p>", secondClose: "</div>" },
  },
  "choose-the-heading-level": {
    prompt: "A page titled with an <h1> should use which tag for its next-level sections?",
    options: ["<h2>", "<h3>", "<h1> again", "<h4>"],
    test: { checkType: "mc", correctIndex: 0 },
  },
  "write-an-accessible-image": {
    prompt: "Add a descriptive alt attribute to this image tag, then submit.",
    test: { checkType: "regex_all", patterns: ['<img', 'alt="[^"]'] },
  },
  "identify-the-selector": {
    prompt: "In the rule p { color: navy; }, what part is the selector?",
    options: ["p", "color", "navy", "{ }"],
    test: { checkType: "mc", correctIndex: 0 },
  },
  "predict-the-winning-rule": {
    prompt: "Given the two conflicting rules above, what color will the paragraph's text render?",
    test: { checkType: "text_exact", answer: "navy" },
  },
  "calculate-the-box-size": {
    prompt: "What is the total rendered width of .box, in pixels?",
    test: { checkType: "text_exact", answer: "130px", acceptableAnswers: ["130px", "130"] },
  },
  "fix-the-flex-layout": {
    prompt: "Add the missing property so justify-content takes effect, then submit.",
    test: { checkType: "regex_all", patterns: ["display", "flex"] },
  },
  "predict-the-score": {
    prompt: "What number does this code print to the console?",
    test: { checkType: "text_exact", answer: "8" },
  },
  "identify-the-operator": {
    prompt: "Which operator checks that two values are equal without converting their types?",
    options: ["===", "==", "=", "!="],
    test: { checkType: "mc", correctIndex: 0 },
  },
  "predict-the-branch": {
    prompt: "What does this code print to the console?",
    test: { checkType: "text_exact", answer: "Not hot" },
  },
  "fix-the-infinite-loop": {
    prompt: "Fix the loop so it prints 0 through 4 and terminates, then submit. Your code will actually run.",
    test: { checkType: "js_run", expectedLogs: ["0", "1", "2", "3", "4"] },
  },
};

for (const [slug, meta] of Object.entries(MISSION_META)) {
  const mission = await prisma.mission.findFirst({ where: { slug } });
  if (!mission) continue;
  await prisma.mission.update({
    where: { id: mission.id },
    data: { prompt: meta.prompt, options: meta.options ?? undefined },
  });
  await prisma.missionTest.upsert({
    where: { missionId: mission.id },
    update: { expected: meta.test },
    create: { missionId: mission.id, expected: meta.test },
  });
}

console.log("Seed complete: worlds, Web Foundations (2 modules, 4 lessons, 4 missions), HTML Harbor (2 modules, 4 lessons, 4 missions), CSS City (2 modules, 4 lessons, 4 missions), and JavaScript Jungle (2 modules, 4 lessons, 4 missions) upserted.");
}

main()
.catch((err) => {
console.error("Seed failed:", err);
process.exitCode = 1;
})
.finally(async () => {
await prisma.$disconnect();
});

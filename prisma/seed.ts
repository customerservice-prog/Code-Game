// Idempotent curriculum seed script.
// Runs on every deploy start (see package.json's start script) so the
// database always reflects the worlds/modules/lessons/missions defined
// here. Safe to re-run: every write is an upsert keyed on a stable slug.
import { PrismaClient, ContentStatus, Prisma } from "@prisma/client";

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
{ slug: "typescript-tower", title: "TypeScript Tower", summary: "Add types to your JavaScript.", order: 5, status: ContentStatus.PUBLISHED },
{ slug: "react-realm", title: "React Realm", summary: "Build interactive UIs with React.", order: 6, status: ContentStatus.PUBLISHED },
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


// ---------- World 5: TypeScript Tower ----------
const typescriptTower = await prisma.world.findUniqueOrThrow({ where: { slug: "typescript-tower" } });

const typeBasics = await prisma.module.upsert({
where: { worldId_slug: { worldId: typescriptTower.id, slug: "type-basics" } },
update: { title: "Type Basics", summary: "Annotate values so TypeScript can catch mistakes before you run your code.", order: 1, status: ContentStatus.PUBLISHED },
create: { worldId: typescriptTower.id, slug: "type-basics", title: "Type Basics", summary: "Annotate values so TypeScript can catch mistakes before you run your code.", order: 1, status: ContentStatus.PUBLISHED },
});

const skillBasicTypes = await prisma.skill.upsert({
where: { slug: "basic-types" },
update: { name: "Basic types", description: "Annotating variables with primitive types like string, number, and boolean." },
create: { slug: "basic-types", name: "Basic types", description: "Annotating variables with primitive types like string, number, and boolean." },
});

const skillTypeInference = await prisma.skill.upsert({
where: { slug: "type-inference" },
update: { name: "Type inference", description: "Understanding when TypeScript can infer a type without an explicit annotation." },
create: { slug: "type-inference", name: "Type inference", description: "Understanding when TypeScript can infer a type without an explicit annotation." },
});

// ---------- Lesson 1 (TypeScript Tower) ----------
const tsLesson1Content = [
{ type: "heading", text: "Annotating Variables with Types" },
{ type: "paragraph", text: "TypeScript adds type annotations on top of ordinary JavaScript, letting you describe what kind of value a variable should hold so mistakes are caught before the code ever runs." },
{ type: "vocabulary", term: "Type annotation", definition: "Extra syntax like \": string\" that tells TypeScript what kind of value a variable should hold." },
{ type: "vocabulary", term: "Static typing", definition: "Checking types before the code runs, rather than only while it runs." },
{ type: "analogy", text: "Type annotations are like labeling drawers in a toolbox: everyone knows a screwdriver drawer should hold screwdrivers, not nails, and it's obvious immediately if something doesn't belong." },
{ type: "code_example", language: "typescript", code: "let username: string = \"Ada\";\nlet age: number = 32;\nlet isAdmin: boolean = false;" },
{ type: "line_explanation", lines: [
{ line: "let username: string = \"Ada\";", explanation: ": string tells TypeScript this variable can only ever hold text." },
{ line: "let age: number = 32;", explanation: ": number restricts this variable to numeric values." },
{ line: "let isAdmin: boolean = false;", explanation: ": boolean restricts this variable to true or false." },
] },
{ type: "callout", tone: "info", text: "TypeScript is a superset of JavaScript - any valid JavaScript file is already valid TypeScript, with optional type annotations layered on top." },
{ type: "common_mistake", text: "Beginners sometimes try to assign a value of the wrong type, like assigning a string to a variable annotated as number - TypeScript flags this immediately as a compile-time error rather than waiting for it to break the running program." },
{ type: "knowledge_check", question: "What is the main benefit of adding type annotations in TypeScript?", options: [
"It makes code run faster",
"It catches type-related mistakes before the code runs",
"It replaces the need for testing entirely",
"It is required for JavaScript to run in a browser"
], correctIndex: 1 },
{ type: "summary", text: "Type annotations describe what kind of value a variable should hold, letting TypeScript catch mismatches before the code ever runs." },
];

const tsLesson1 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: typeBasics.id, slug: "annotating-variables-with-types" } },
update: { title: "Annotating Variables with Types", order: 1, status: ContentStatus.PUBLISHED, content: tsLesson1Content },
create: { moduleId: typeBasics.id, slug: "annotating-variables-with-types", title: "Annotating Variables with Types", order: 1, status: ContentStatus.PUBLISHED, content: tsLesson1Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: tsLesson1.id, skillId: skillBasicTypes.id } },
update: {},
create: { lessonId: tsLesson1.id, skillId: skillBasicTypes.id },
});

const tsMission1 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: tsLesson1.id, slug: "spot-the-valid-annotation" } },
update: {
title: "Spot the Valid Annotation",
type: "multiple_choice",
status: ContentStatus.PUBLISHED,
explanation: "The string type restricts a variable so it can only ever hold text values.",
xpReward: 10,
difficulty: 1,
},
create: {
lessonId: tsLesson1.id,
slug: "spot-the-valid-annotation",
title: "Spot the Valid Annotation",
type: "multiple_choice",
status: ContentStatus.PUBLISHED,
explanation: "The string type restricts a variable so it can only ever hold text values.",
xpReward: 10,
difficulty: 1,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: tsMission1.id, skillId: skillBasicTypes.id } },
update: {},
create: { missionId: tsMission1.id, skillId: skillBasicTypes.id },
});
// ---------- Lesson 2 (TypeScript Tower) ----------
const tsLesson2Content = [
{ type: "heading", text: "Type Inference" },
{ type: "paragraph", text: "TypeScript can often figure out a variable's type automatically from its initial value, without needing an explicit annotation." },
{ type: "vocabulary", term: "Type inference", definition: "TypeScript's ability to automatically determine a variable's type from the value assigned to it." },
{ type: "vocabulary", term: "Explicit annotation", definition: "A type written directly by the developer, such as \": number\", instead of relying on inference." },
{ type: "analogy", text: "Type inference is like a librarian who can tell a book is a mystery novel just by glancing at its cover, without needing a label that spells it out." },
{ type: "code_example", language: "typescript", code: "let count = 5;\nlet label = \"Total\";\ncount = \"five\";" },
{ type: "line_explanation", lines: [
{ line: "let count = 5;", explanation: "TypeScript infers count's type as number from the initial value, with no annotation needed." },
{ line: "let label = \"Total\";", explanation: "TypeScript infers label's type as string." },
{ line: "count = \"five\";", explanation: "This reassignment is a type error, since TypeScript inferred count as a number." },
] },
{ type: "callout", tone: "warning", text: "Inference only locks in a type from the first value assigned - reassigning a variable to a different type afterward is treated as a compile-time error." },
{ type: "common_mistake", text: "Beginners sometimes think a variable without an explicit annotation has no type at all. In reality, TypeScript still infers and enforces a type behind the scenes." },
{ type: "knowledge_check", question: "What type does TypeScript infer for \"let count = 5;\"?", options: [
"string",
"boolean",
"number",
"any"
], correctIndex: 2 },
{ type: "summary", text: "TypeScript infers a variable's type from its initial value when no annotation is written, and still enforces that inferred type afterward." },
];

const tsLesson2 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: typeBasics.id, slug: "type-inference" } },
update: { title: "Type Inference", order: 2, status: ContentStatus.PUBLISHED, content: tsLesson2Content },
create: { moduleId: typeBasics.id, slug: "type-inference", title: "Type Inference", order: 2, status: ContentStatus.PUBLISHED, content: tsLesson2Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: tsLesson2.id, skillId: skillTypeInference.id } },
update: {},
create: { lessonId: tsLesson2.id, skillId: skillTypeInference.id },
});

const tsMission2 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: tsLesson2.id, slug: "predict-the-inferred-type" } },
update: {
title: "Predict the Inferred Type",
type: "predict_output",
status: ContentStatus.PUBLISHED,
starterCode: "let count = 5;\nlet label = \"Total\";\ncount = \"five\";",
explanation: "count is initialized with the number 5, so TypeScript infers its type as number and later flags the reassignment to a string as an error.",
xpReward: 10,
difficulty: 1,
},
create: {
lessonId: tsLesson2.id,
slug: "predict-the-inferred-type",
title: "Predict the Inferred Type",
type: "predict_output",
status: ContentStatus.PUBLISHED,
starterCode: "let count = 5;\nlet label = \"Total\";\ncount = \"five\";",
explanation: "count is initialized with the number 5, so TypeScript infers its type as number and later flags the reassignment to a string as an error.",
xpReward: 10,
difficulty: 1,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: tsMission2.id, skillId: skillTypeInference.id } },
update: {},
create: { missionId: tsMission2.id, skillId: skillTypeInference.id },
});

// ---------- Module 2 (TypeScript Tower): Functions and Interfaces ----------
const functionsAndInterfaces = await prisma.module.upsert({
where: { worldId_slug: { worldId: typescriptTower.id, slug: "functions-and-interfaces" } },
update: { title: "Functions and Interfaces", summary: "Add types to functions and describe the shape of objects.", order: 2, status: ContentStatus.PUBLISHED },
create: { worldId: typescriptTower.id, slug: "functions-and-interfaces", title: "Functions and Interfaces", summary: "Add types to functions and describe the shape of objects.", order: 2, status: ContentStatus.PUBLISHED },
});

const skillTypedFunctions = await prisma.skill.upsert({
where: { slug: "typed-functions" },
update: { name: "Typed functions", description: "Adding parameter and return types to functions." },
create: { slug: "typed-functions", name: "Typed functions", description: "Adding parameter and return types to functions." },
});

const skillInterfaces = await prisma.skill.upsert({
where: { slug: "interfaces" },
update: { name: "Interfaces", description: "Describing the shape of objects with interfaces." },
create: { slug: "interfaces", name: "Interfaces", description: "Describing the shape of objects with interfaces." },
});
// ---------- Lesson 3 (TypeScript Tower) ----------
const tsLesson3Content = [
{ type: "heading", text: "Typing Function Parameters and Returns" },
{ type: "paragraph", text: "Functions can have types on both their parameters and their return value, so TypeScript catches calls made with the wrong argument types before the code runs." },
{ type: "vocabulary", term: "Parameter type", definition: "A type annotation on a function parameter that restricts what kind of arguments it accepts." },
{ type: "vocabulary", term: "Return type", definition: "A type annotation describing what kind of value a function returns." },
{ type: "analogy", text: "Typing a function is like posting rules at the entrance to a ride: only visitors that meet the requirements (parameter types) are allowed in, and everyone knows what to expect when they come out (the return type)." },
{ type: "code_example", language: "typescript", code: "function add(a: number, b: number): number {\n return a + b;\n}\n\nadd(2, 3);" },
{ type: "line_explanation", lines: [
{ line: "function add(a: number, b: number): number {", explanation: "Both parameters must be numbers, and the function promises to return a number." },
{ line: "return a + b;", explanation: "Adds the two numbers and returns the sum." },
{ line: "add(2, 3);", explanation: "A valid call, since both arguments are numbers." },
] },
{ type: "callout", tone: "info", text: "If a function is called with the wrong argument type, such as passing a string where add expects a number, TypeScript reports an error before the code ever runs." },
{ type: "common_mistake", text: "Beginners sometimes call a typed function with the wrong kind of value, such as passing a string where a number is expected, and are surprised when TypeScript rejects it immediately." },
{ type: "knowledge_check", question: "In function add(a: number, b: number): number, what does the final \": number\" describe?", options: [
"The type of the first parameter",
"The type of the second parameter",
"The type of the value the function returns",
"The name of the function"
], correctIndex: 2 },
{ type: "summary", text: "Typing a function's parameters and return value lets TypeScript check both what goes in and what comes out, catching mismatched calls immediately." },
];

const tsLesson3 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: functionsAndInterfaces.id, slug: "typing-function-parameters-and-returns" } },
update: { title: "Typing Function Parameters and Returns", order: 1, status: ContentStatus.PUBLISHED, content: tsLesson3Content },
create: { moduleId: functionsAndInterfaces.id, slug: "typing-function-parameters-and-returns", title: "Typing Function Parameters and Returns", order: 1, status: ContentStatus.PUBLISHED, content: tsLesson3Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: tsLesson3.id, skillId: skillTypedFunctions.id } },
update: {},
create: { lessonId: tsLesson3.id, skillId: skillTypedFunctions.id },
});

const tsMission3 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: tsLesson3.id, slug: "fix-the-function-call" } },
update: {
title: "Fix the Function Call",
type: "debug_challenge",
status: ContentStatus.PUBLISHED,
starterCode: "function greet(name: string): string {\n return \"Hello, \" + name;\n}\n\ngreet(42);",
explanation: "greet expects a string parameter, but 42 is a number. Wrapping it in quotes, like greet(\"42\"), satisfies the parameter type.",
xpReward: 10,
difficulty: 2,
},
create: {
lessonId: tsLesson3.id,
slug: "fix-the-function-call",
title: "Fix the Function Call",
type: "debug_challenge",
status: ContentStatus.PUBLISHED,
starterCode: "function greet(name: string): string {\n return \"Hello, \" + name;\n}\n\ngreet(42);",
explanation: "greet expects a string parameter, but 42 is a number. Wrapping it in quotes, like greet(\"42\"), satisfies the parameter type.",
xpReward: 10,
difficulty: 2,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: tsMission3.id, skillId: skillTypedFunctions.id } },
update: {},
create: { missionId: tsMission3.id, skillId: skillTypedFunctions.id },
});
// ---------- Lesson 4 (TypeScript Tower) ----------
const tsLesson4Content = [
{ type: "heading", text: "Defining Interfaces" },
{ type: "paragraph", text: "An interface names a reusable shape for an object, describing exactly which properties it must have and what type each one is." },
{ type: "vocabulary", term: "Interface", definition: "A named definition describing the required properties and types of an object." },
{ type: "vocabulary", term: "Property type", definition: "The type annotation on a single field within an interface or object." },
{ type: "analogy", text: "An interface is like a job application form: it lists exactly which fields (properties) must be filled in, and what kind of answer (type) each one expects." },
{ type: "code_example", language: "typescript", code: "interface User {\n name: string;\n age: number;\n}\n\nconst user: User = { name: \"Ada\", age: 32 };" },
{ type: "line_explanation", lines: [
{ line: "interface User {", explanation: "Declares a new named shape called User." },
{ line: "name: string;", explanation: "Every User must have a name property that is a string." },
{ line: "const user: User = { name: \"Ada\", age: 32 };", explanation: "This object matches the User interface, so TypeScript accepts it." },
] },
{ type: "callout", tone: "info", text: "If an object is missing a required property, or has the wrong type for one, TypeScript reports an error wherever that interface type is used." },
{ type: "common_mistake", text: "Beginners sometimes forget a required property when creating an object that claims to match an interface, and are confused when TypeScript rejects it - every required property must be present." },
{ type: "knowledge_check", question: "What does a TypeScript interface describe?", options: [
"The runtime performance of a function",
"The required properties and types of an object",
"The visual styling of a component",
"The order operations run in"
], correctIndex: 1 },
{ type: "summary", text: "Interfaces name a reusable object shape, listing required properties and their types so TypeScript can check that objects match consistently." },
];

const tsLesson4 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: functionsAndInterfaces.id, slug: "defining-interfaces" } },
update: { title: "Defining Interfaces", order: 2, status: ContentStatus.PUBLISHED, content: tsLesson4Content },
create: { moduleId: functionsAndInterfaces.id, slug: "defining-interfaces", title: "Defining Interfaces", order: 2, status: ContentStatus.PUBLISHED, content: tsLesson4Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: tsLesson4.id, skillId: skillInterfaces.id } },
update: {},
create: { lessonId: tsLesson4.id, skillId: skillInterfaces.id },
});

const tsMission4 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: tsLesson4.id, slug: "write-a-user-interface" } },
update: {
title: "Write a User Interface",
type: "code_writing",
status: ContentStatus.PUBLISHED,
starterCode: "// Define an interface named User with:\n// - a name property (string)\n// - an age property (number)\n",
explanation: "A correct interface looks like: interface User { name: string; age: number; }",
xpReward: 10,
difficulty: 2,
},
create: {
lessonId: tsLesson4.id,
slug: "write-a-user-interface",
title: "Write a User Interface",
type: "code_writing",
status: ContentStatus.PUBLISHED,
starterCode: "// Define an interface named User with:\n// - a name property (string)\n// - an age property (number)\n",
explanation: "A correct interface looks like: interface User { name: string; age: number; }",
xpReward: 10,
difficulty: 2,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: tsMission4.id, skillId: skillInterfaces.id } },
update: {},
create: { missionId: tsMission4.id, skillId: skillInterfaces.id },
});




// ---------- World 6: React Realm ----------
const reactRealm = await prisma.world.findUniqueOrThrow({ where: { slug: "react-realm" } });

const reactBasics = await prisma.module.upsert({
  where: { worldId_slug: { worldId: reactRealm.id, slug: "react-basics" } },
  update: { title: "React Basics", summary: "Write your first components with JSX.", order: 1, status: ContentStatus.PUBLISHED },
  create: { worldId: reactRealm.id, slug: "react-basics", title: "React Basics", summary: "Write your first components with JSX.", order: 1, status: ContentStatus.PUBLISHED },
});

const skillJsxBasics = await prisma.skill.upsert({
  where: { slug: "jsx-basics" },
  update: { name: "JSX", description: "A syntax extension for JavaScript that lets you write HTML-like markup directly in your code." },
  create: { slug: "jsx-basics", name: "JSX", description: "A syntax extension for JavaScript that lets you write HTML-like markup directly in your code." },
});

const skillJsxExpressions = await prisma.skill.upsert({
  where: { slug: "jsx-expressions" },
  update: { name: "JSX expressions", description: "Embedding dynamic JavaScript values inside JSX markup using curly braces." },
  create: { slug: "jsx-expressions", name: "JSX expressions", description: "Embedding dynamic JavaScript values inside JSX markup using curly braces." },
});

const reactLesson1Content = [
  { type: "heading", text: "Writing Your First JSX" },
  { type: "paragraph", text: "React components are JavaScript functions that return JSX, a syntax extension that looks like HTML but compiles down to regular JavaScript." },
  { type: "vocabulary", term: "JSX", definition: "A syntax extension for JavaScript that lets you write HTML-like markup directly in your code." },
  { type: "vocabulary", term: "Component", definition: "A reusable, self-contained piece of UI defined as a JavaScript function that returns JSX." },
  { type: "analogy", text: "JSX is like a recipe card that blends the ingredients (data) and instructions (markup) onto one page, instead of keeping them in separate binders." },
  { type: "code_example", language: "jsx", code: "function Greeting() {\n  return <h1>Hello, world!</h1>;\n}" },
  { type: "line_explanation", lines: [
    { line: "function Greeting() {", explanation: "Defines a component named Greeting as a plain JavaScript function." },
    { line: "return <h1>Hello, world!</h1>;", explanation: "JSX markup that looks like HTML but compiles down to JavaScript function calls." },
    { line: "}", explanation: "Closes the component function." },
  ] },
  { type: "callout", tone: "info", text: "Component names must start with a capital letter, or React will treat them as a regular HTML tag instead of a component." },
  { type: "common_mistake", text: "Beginners often forget that JSX requires exactly one root element - wrap multiple sibling elements in a single parent tag or a fragment (<>...</>)." },
  { type: "knowledge_check", question: "What must a React component's name start with?", options: [
    "a number",
    "a lowercase letter",
    "a capital letter",
    "an underscore"
  ], correctIndex: 2 },
  { type: "summary", text: "JSX lets you write HTML-like markup inside JavaScript functions called components, which React renders to the page." },
];

const reactLesson1 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: reactBasics.id, slug: "writing-your-first-jsx" } },
  update: { title: "Writing Your First JSX", order: 1, status: ContentStatus.PUBLISHED, content: reactLesson1Content },
  create: { moduleId: reactBasics.id, slug: "writing-your-first-jsx", title: "Writing Your First JSX", order: 1, status: ContentStatus.PUBLISHED, content: reactLesson1Content },
});

await prisma.lessonSkill.upsert({
  where: { lessonId_skillId: { lessonId: reactLesson1.id, skillId: skillJsxBasics.id } },
  update: {},
  create: { lessonId: reactLesson1.id, skillId: skillJsxBasics.id },
});

const reactMission1 = await prisma.mission.upsert({
  where: { lessonId_slug: { lessonId: reactLesson1.id, slug: "spot-the-valid-component" } },
  update: {
    title: "Spot the Valid Component",
    type: "multiple_choice",
    status: ContentStatus.PUBLISHED,
    explanation: "Component names must be capitalized, and the function must return the JSX rather than just writing it as a statement.",
    xpReward: 10,
    difficulty: 1,
  },
  create: {
    lessonId: reactLesson1.id,
    slug: "spot-the-valid-component",
    title: "Spot the Valid Component",
    type: "multiple_choice",
    status: ContentStatus.PUBLISHED,
    explanation: "Component names must be capitalized, and the function must return the JSX rather than just writing it as a statement.",
    xpReward: 10,
    difficulty: 1,
  },
});

await prisma.missionSkill.upsert({
  where: { missionId_skillId: { missionId: reactMission1.id, skillId: skillJsxBasics.id } },
  update: {},
  create: { missionId: reactMission1.id, skillId: skillJsxBasics.id },
});

// ---------- Lesson 2 (React Realm) ----------

const reactLesson2Content = [
  { type: "heading", text: "Rendering Dynamic Values with Curly Braces" },
  { type: "paragraph", text: "JSX lets you embed any JavaScript expression directly inside markup by wrapping it in curly braces, so components can render dynamic values instead of only static text." },
  { type: "vocabulary", term: "Expression", definition: "Any JavaScript snippet that evaluates to a value, like a variable or a function call." },
  { type: "vocabulary", term: "Interpolation", definition: "Inserting a dynamic value into markup, done in JSX with curly braces {}." },
  { type: "analogy", text: "Curly braces in JSX are like fill-in-the-blank spots on a form letter - whatever value you drop in there gets printed exactly where the blank is." },
  { type: "code_example", language: "jsx", code: "const name = \"Ada\";\nfunction Greeting() {\n  return <h1>Hello, {name}!</h1>;\n}" },
  { type: "line_explanation", lines: [
    { line: "const name = \"Ada\";", explanation: "Defines a plain JavaScript variable outside the component." },
    { line: "return <h1>Hello, {name}!</h1>;", explanation: "The curly braces embed the value of name directly into the rendered markup." },
  ] },
  { type: "callout", tone: "warning", text: "You can only put expressions inside curly braces, not statements - things like if or for loops won't work directly inside JSX." },
  { type: "common_mistake", text: "Wrapping the curly-brace expression in quotes, like \"{name}\", which renders literally as text instead of interpolating the variable." },
  { type: "knowledge_check", question: "What is the correct way to render the value of a variable called price inside JSX?", options: [
    "\"price\"",
    "{price}",
    "(price)",
    "[price]"
  ], correctIndex: 1 },
  { type: "summary", text: "Curly braces {} let you embed any JavaScript expression directly inside JSX markup." },
];

const reactLesson2 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: reactBasics.id, slug: "rendering-dynamic-values" } },
  update: { title: "Rendering Dynamic Values with Curly Braces", order: 2, status: ContentStatus.PUBLISHED, content: reactLesson2Content },
  create: { moduleId: reactBasics.id, slug: "rendering-dynamic-values", title: "Rendering Dynamic Values with Curly Braces", order: 2, status: ContentStatus.PUBLISHED, content: reactLesson2Content },
});

await prisma.lessonSkill.upsert({
  where: { lessonId_skillId: { lessonId: reactLesson2.id, skillId: skillJsxExpressions.id } },
  update: {},
  create: { lessonId: reactLesson2.id, skillId: skillJsxExpressions.id },
});

const reactMission2 = await prisma.mission.upsert({
  where: { lessonId_slug: { lessonId: reactLesson2.id, slug: "predict-the-rendered-text" } },
  update: {
    title: "Predict the Rendered Text",
    type: "predict_output",
    status: ContentStatus.PUBLISHED,
    starterCode: "const name = \"Ada\";\nfunction Greeting() {\n  return <h1>Hello, {name}!</h1>;\n}",
    explanation: "The curly braces interpolate the value of name, so the rendered heading reads Hello, Ada!",
    xpReward: 10,
    difficulty: 1,
  },
  create: {
    lessonId: reactLesson2.id,
    slug: "predict-the-rendered-text",
    title: "Predict the Rendered Text",
    type: "predict_output",
    status: ContentStatus.PUBLISHED,
    starterCode: "const name = \"Ada\";\nfunction Greeting() {\n  return <h1>Hello, {name}!</h1>;\n}",
    explanation: "The curly braces interpolate the value of name, so the rendered heading reads Hello, Ada!",
    xpReward: 10,
    difficulty: 1,
  },
});

await prisma.missionSkill.upsert({
  where: { missionId_skillId: { missionId: reactMission2.id, skillId: skillJsxExpressions.id } },
  update: {},
  create: { missionId: reactMission2.id, skillId: skillJsxExpressions.id },
});

// ---------- Module 2 (React Realm) ----------

const stateAndInteractivity = await prisma.module.upsert({
  where: { worldId_slug: { worldId: reactRealm.id, slug: "state-and-interactivity" } },
  update: { title: "State and Interactivity", summary: "Give components memory and respond to user actions.", order: 2, status: ContentStatus.PUBLISHED },
  create: { worldId: reactRealm.id, slug: "state-and-interactivity", title: "State and Interactivity", summary: "Give components memory and respond to user actions.", order: 2, status: ContentStatus.PUBLISHED },
});

const skillReactState = await prisma.skill.upsert({
  where: { slug: "react-state" },
  update: { name: "State", description: "Data a component manages internally that can change over time and triggers a re-render when updated." },
  create: { slug: "react-state", name: "State", description: "Data a component manages internally that can change over time and triggers a re-render when updated." },
});

const skillProps = await prisma.skill.upsert({
  where: { slug: "props" },
  update: { name: "Props", description: "Read-only data passed into a component from its parent." },
  create: { slug: "props", name: "Props", description: "Read-only data passed into a component from its parent." },
});

const reactLesson3Content = [
  { type: "heading", text: "Managing State with useState" },
  { type: "paragraph", text: "The useState hook gives a component its own piece of memory called state, plus a setter function that updates it and triggers a re-render." },
  { type: "vocabulary", term: "State", definition: "Data a component owns that can change over time; updating it causes React to re-render the component." },
  { type: "vocabulary", term: "Hook", definition: "A special function (like useState) that lets a function component use React features such as state." },
  { type: "analogy", text: "State is like a scoreboard at a game - it starts at some value, and every time something scores, the display updates automatically so everyone always sees the current total." },
  { type: "code_example", language: "jsx", code: "import { useState } from \"react\";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}" },
  { type: "line_explanation", lines: [
    { line: "const [count, setCount] = useState(0);", explanation: "Declares a state variable count starting at 0, plus a setCount function to update it." },
    { line: "return <button onClick={() => setCount(count + 1)}>{count}</button>;", explanation: "Clicking the button calls setCount, which updates count and re-renders the component with the new value." },
  ] },
  { type: "callout", tone: "info", text: "Calling the setter function (like setCount) is what tells React to re-render - directly changing a plain variable would not update the screen." },
  { type: "common_mistake", text: "Trying to update state directly (count = count + 1) instead of calling the setter function returned by useState, which does nothing visible on screen." },
  { type: "knowledge_check", question: "What does calling setCount(count + 1) do?", options: [
    "Nothing until the page is refreshed",
    "Updates count and triggers a re-render",
    "Only updates count without re-rendering",
    "Throws an error"
  ], correctIndex: 1 },
  { type: "summary", text: "The useState hook gives a component a piece of state and a setter function; calling the setter updates the value and triggers a re-render." },
];

const reactLesson3 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: stateAndInteractivity.id, slug: "managing-state-with-usestate" } },
  update: { title: "Managing State with useState", order: 1, status: ContentStatus.PUBLISHED, content: reactLesson3Content },
  create: { moduleId: stateAndInteractivity.id, slug: "managing-state-with-usestate", title: "Managing State with useState", order: 1, status: ContentStatus.PUBLISHED, content: reactLesson3Content },
});

await prisma.lessonSkill.upsert({
  where: { lessonId_skillId: { lessonId: reactLesson3.id, skillId: skillReactState.id } },
  update: {},
  create: { lessonId: reactLesson3.id, skillId: skillReactState.id },
});

const reactMission3 = await prisma.mission.upsert({
  where: { lessonId_slug: { lessonId: reactLesson3.id, slug: "fix-the-broken-counter" } },
  update: {
    title: "Fix the Broken Counter",
    type: "debug_challenge",
    status: ContentStatus.PUBLISHED,
    starterCode: "import { useState } from \"react\";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => count + 1}>{count}</button>;\n}",
    explanation: "The onClick handler must call setCount with the new value; simply computing count + 1 without calling setCount never updates state or re-renders the button.",
    xpReward: 10,
    difficulty: 2,
  },
  create: {
    lessonId: reactLesson3.id,
    slug: "fix-the-broken-counter",
    title: "Fix the Broken Counter",
    type: "debug_challenge",
    status: ContentStatus.PUBLISHED,
    starterCode: "import { useState } from \"react\";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => count + 1}>{count}</button>;\n}",
    explanation: "The onClick handler must call setCount with the new value; simply computing count + 1 without calling setCount never updates state or re-renders the button.",
    xpReward: 10,
    difficulty: 2,
  },
});

await prisma.missionSkill.upsert({
  where: { missionId_skillId: { missionId: reactMission3.id, skillId: skillReactState.id } },
  update: {},
  create: { missionId: reactMission3.id, skillId: skillReactState.id },
});

// ---------- Lesson 4 (React Realm) ----------

const reactLesson4Content = [
  { type: "heading", text: "Handling Events and Props" },
  { type: "paragraph", text: "Props let a parent component pass data into a child component, which the child reads as read-only input, often alongside event handlers that respond to user interaction." },
  { type: "vocabulary", term: "Props", definition: "Data passed into a component from its parent, read-only from the component's own perspective." },
  { type: "vocabulary", term: "Event handler", definition: "A function that runs in response to a user interaction, like onClick or onChange." },
  { type: "analogy", text: "Props are like ingredients handed to a chef by someone else - the chef (component) can use them to cook, but can't reach back and change what's in the delivery truck." },
  { type: "code_example", language: "jsx", code: "function Welcome(props) {\n  return <h1>Welcome, {props.name}!</h1>;\n}\n\nfunction App() {\n  return <Welcome name=\"Ada\" />;\n}" },
  { type: "line_explanation", lines: [
    { line: "function Welcome(props) {", explanation: "Declares a component that receives a props object as its parameter." },
    { line: "return <h1>Welcome, {props.name}!</h1>;", explanation: "Reads the name property off props and interpolates it into the markup." },
    { line: "return <Welcome name=\"Ada\" />;", explanation: "Passes name=\"Ada\" as a prop when rendering the Welcome component." },
  ] },
  { type: "callout", tone: "warning", text: "Props are read-only - a component should never reassign or mutate props it receives from its parent." },
  { type: "common_mistake", text: "Trying to modify props directly inside a component (props.name = \"new\") instead of treating them as immutable input." },
  { type: "knowledge_check", question: "How does a parent component pass a value into a child component?", options: [
    "Through global variables",
    "Through props",
    "By importing the child's state",
    "Through the URL only"
  ], correctIndex: 1 },
  { type: "summary", text: "Props let a parent component pass data into a child component; the child treats props as read-only input." },
];

const reactLesson4 = await prisma.lesson.upsert({
  where: { moduleId_slug: { moduleId: stateAndInteractivity.id, slug: "handling-events-and-props" } },
  update: { title: "Handling Events and Props", order: 2, status: ContentStatus.PUBLISHED, content: reactLesson4Content },
  create: { moduleId: stateAndInteractivity.id, slug: "handling-events-and-props", title: "Handling Events and Props", order: 2, status: ContentStatus.PUBLISHED, content: reactLesson4Content },
});

await prisma.lessonSkill.upsert({
  where: { lessonId_skillId: { lessonId: reactLesson4.id, skillId: skillProps.id } },
  update: {},
  create: { lessonId: reactLesson4.id, skillId: skillProps.id },
});

const reactMission4 = await prisma.mission.upsert({
  where: { lessonId_slug: { lessonId: reactLesson4.id, slug: "write-a-welcome-component" } },
  update: {
    title: "Write a Welcome Component",
    type: "code_writing",
    status: ContentStatus.PUBLISHED,
    explanation: "A valid Welcome component is a capitalized function that takes props and reads props.name to render dynamic content.",
    xpReward: 10,
    difficulty: 2,
  },
  create: {
    lessonId: reactLesson4.id,
    slug: "write-a-welcome-component",
    title: "Write a Welcome Component",
    type: "code_writing",
    status: ContentStatus.PUBLISHED,
    explanation: "A valid Welcome component is a capitalized function that takes props and reads props.name to render dynamic content.",
    xpReward: 10,
    difficulty: 2,
  },
});

await prisma.missionSkill.upsert({
  where: { missionId_skillId: { missionId: reactMission4.id, skillId: skillProps.id } },
  update: {},
  create: { missionId: reactMission4.id, skillId: skillProps.id },
});


// ---------- World 7: Next.js Network ----------
const nextjsNetwork = await prisma.world.findUniqueOrThrow({ where: { slug: "nextjs-network" } });

const appRouterBasics = await prisma.module.upsert({
where: { worldId_slug: { worldId: nextjsNetwork.id, slug: "app-router-basics" } },
update: { title: "App Router Basics", summary: "Understand how folders and files map to real URLs.", order: 1, status: ContentStatus.PUBLISHED },
create: { worldId: nextjsNetwork.id, slug: "app-router-basics", title: "App Router Basics", summary: "Understand how folders and files map to real URLs.", order: 1, status: ContentStatus.PUBLISHED },
});

const skillFileRouting = await prisma.skill.upsert({
where: { slug: "file-based-routing" },
update: { name: "File-based routing", description: "Mapping folders and page.tsx files to real URL routes." },
create: { slug: "file-based-routing", name: "File-based routing", description: "Mapping folders and page.tsx files to real URL routes." },
});

const skillServerClientComponents = await prisma.skill.upsert({
where: { slug: "server-and-client-components" },
update: { name: "Server and client components", description: "Understanding which components render on the server versus the browser." },
create: { slug: "server-and-client-components", name: "Server and client components", description: "Understanding which components render on the server versus the browser." },
});

const nextjsLesson1Content = [
{ type: "heading", text: "Routing with the App Router" },
{ type: "paragraph", text: "In the Next.js App Router, folders inside src/app map directly to URL paths, and a page.tsx file inside a folder is what actually renders that route." },
{ type: "vocabulary", term: "Route segment", definition: "A single folder inside src/app that contributes one piece of a URL path." },
{ type: "vocabulary", term: "page.tsx", definition: "The special file inside a route folder whose export is rendered when that route is visited." },
{ type: "analogy", text: "The app folder is like a building directory: each folder name is a floor, and the page.tsx file inside is the actual room you arrive in when you go there." },
{ type: "code_example", language: "text", code: "src/app/\n about/\n page.tsx\n blog/\n [slug]/\n page.tsx" },
{ type: "line_explanation", lines: [
{ line: "src/app/about/page.tsx", explanation: "Renders when a visitor requests the /about URL." },
{ line: "src/app/blog/[slug]/page.tsx", explanation: "A dynamic route segment - [slug] matches any value, like /blog/hello-world." },
] },
{ type: "callout", tone: "info", text: "Folders without a page.tsx file do not create a visitable route on their own - they just group related files together." },
{ type: "common_mistake", text: "Beginners sometimes expect any file inside a route folder to be rendered. Only the page.tsx file (or special files like layout.tsx) has special routing meaning." },
{ type: "knowledge_check", question: "What URL does src/app/about/page.tsx correspond to?", options: [
"/about",
"/app/about",
"/src/about",
"/page"
], correctIndex: 0 },
{ type: "summary", text: "Folders inside src/app become URL segments, and the page.tsx file inside a folder is what actually renders when that route is visited." },
];

const nextjsLesson1 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: appRouterBasics.id, slug: "routing-with-the-app-router" } },
update: { title: "Routing with the App Router", order: 1, status: ContentStatus.PUBLISHED, content: nextjsLesson1Content },
create: { moduleId: appRouterBasics.id, slug: "routing-with-the-app-router", title: "Routing with the App Router", order: 1, status: ContentStatus.PUBLISHED, content: nextjsLesson1Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: nextjsLesson1.id, skillId: skillFileRouting.id } },
update: {},
create: { lessonId: nextjsLesson1.id, skillId: skillFileRouting.id },
});

const nextjsMission1 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: nextjsLesson1.id, slug: "predict-the-route" } },
update: {
title: "Predict the Route",
type: "predict_output",
status: ContentStatus.PUBLISHED,
starterCode: "src/app/\n about/\n page.tsx",
explanation: "The about folder inside src/app becomes the /about URL segment, and page.tsx is what renders there.",
xpReward: 10,
difficulty: 1,
},
create: {
lessonId: nextjsLesson1.id,
slug: "predict-the-route",
title: "Predict the Route",
type: "predict_output",
status: ContentStatus.PUBLISHED,
starterCode: "src/app/\n about/\n page.tsx",
explanation: "The about folder inside src/app becomes the /about URL segment, and page.tsx is what renders there.",
xpReward: 10,
difficulty: 1,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: nextjsMission1.id, skillId: skillFileRouting.id } },
update: {},
create: { missionId: nextjsMission1.id, skillId: skillFileRouting.id },
});

// ---------- Lesson 2 (Next.js Network) ----------
const nextjsLesson2Content = [
{ type: "heading", text: "Server and Client Components" },
  { type: "paragraph", text: "In the App Router, every component is a Server Component by default, rendering only on the server. Adding a \"use client\" directive at the top of a file switches it to a Client Component that can run in the browser and use interactive features." },
{ type: "vocabulary", term: "Server Component", definition: "A component that renders on the server and sends only HTML to the browser, with no client-side JavaScript for that component." },
  { type: "vocabulary", term: "Client Component", definition: "A component marked with \"use client\" that runs in the browser and can use hooks like useState and event handlers." },
{ type: "analogy", text: "A Server Component is like a pre-cooked meal delivered ready to eat; a Client Component is like a meal kit that still needs some assembly (JavaScript) once it arrives in the browser." },
{ type: "code_example", language: "jsx", code: "\"use client\";\n\nimport { useState } from \"react\";\n\nfunction Counter() {\n const [count, setCount] = useState(0);\n return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}" },
{ type: "line_explanation", lines: [
  { line: "\"use client\";", explanation: "Must be the very first line of the file to mark every export below as a Client Component." },
{ line: "const [count, setCount] = useState(0);", explanation: "useState only works in Client Components, since it requires interactivity in the browser." },
] },
{ type: "callout", tone: "warning", text: "Hooks like useState and useEffect, along with browser event handlers like onClick, only work inside Client Components." },
  { type: "common_mistake", text: "Beginners often try to use useState in a component without the \"use client\" directive, which causes a build or runtime error since Server Components cannot hold browser-side state." },
{ type: "knowledge_check", question: "Which directive marks a file as a Client Component?", options: [
"\"use client\";",
  "\"use server\";",
  "\"use strict\";",
"import client;"
], correctIndex: 0 },
  { type: "summary", text: "Components are Server Components by default in the App Router. Adding \"use client\" as the first line switches a file to a Client Component that can use hooks and browser interactivity." },
];

const nextjsLesson2 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: appRouterBasics.id, slug: "server-and-client-components" } },
update: { title: "Server and Client Components", order: 2, status: ContentStatus.PUBLISHED, content: nextjsLesson2Content },
create: { moduleId: appRouterBasics.id, slug: "server-and-client-components", title: "Server and Client Components", order: 2, status: ContentStatus.PUBLISHED, content: nextjsLesson2Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: nextjsLesson2.id, skillId: skillServerClientComponents.id } },
update: {},
create: { lessonId: nextjsLesson2.id, skillId: skillServerClientComponents.id },
});

const nextjsMission2 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: nextjsLesson2.id, slug: "spot-the-client-directive" } },
update: {
title: "Spot the Client Directive",
type: "multiple_choice",
status: ContentStatus.PUBLISHED,
explanation: "\"use client\" placed as the first line of a file marks every export in that file as a Client Component.",
xpReward: 10,
difficulty: 1,
},
create: {
lessonId: nextjsLesson2.id,
slug: "spot-the-client-directive",
title: "Spot the Client Directive",
type: "multiple_choice",
status: ContentStatus.PUBLISHED,
explanation: "\"use client\" placed as the first line of a file marks every export in that file as a Client Component.",
xpReward: 10,
difficulty: 1,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: nextjsMission2.id, skillId: skillServerClientComponents.id } },
update: {},
create: { missionId: nextjsMission2.id, skillId: skillServerClientComponents.id },
});

// ---------- Module 2 (Next.js Network): Navigation and Server Actions ----------
const navigationAndActions = await prisma.module.upsert({
where: { worldId_slug: { worldId: nextjsNetwork.id, slug: "navigation-and-server-actions" } },
update: { title: "Navigation and Server Actions", summary: "Link pages together and run real server-side logic from the client.", order: 2, status: ContentStatus.PUBLISHED },
create: { worldId: nextjsNetwork.id, slug: "navigation-and-server-actions", title: "Navigation and Server Actions", summary: "Link pages together and run real server-side logic from the client.", order: 2, status: ContentStatus.PUBLISHED },
});

const skillClientNavigation = await prisma.skill.upsert({
where: { slug: "client-side-navigation" },
update: { name: "Client-side navigation", description: "Linking between pages without a full page reload using the Link component." },
create: { slug: "client-side-navigation", name: "Client-side navigation", description: "Linking between pages without a full page reload using the Link component." },
});

const skillServerActions = await prisma.skill.upsert({
where: { slug: "server-actions" },
update: { name: "Server actions", description: "Writing server-side functions that client components can call directly." },
create: { slug: "server-actions", name: "Server actions", description: "Writing server-side functions that client components can call directly." },
});

// ---------- Lesson 3 (Next.js Network) ----------
const nextjsLesson3Content = [
{ type: "heading", text: "Linking Between Pages" },
{ type: "paragraph", text: "The Link component from next/link lets visitors navigate between pages without a full page reload, keeping the app feeling fast by only updating what actually changed." },
{ type: "vocabulary", term: "Link component", definition: "A component from next/link that renders a real anchor tag but navigates client-side instead of triggering a full page reload." },
{ type: "vocabulary", term: "Client-side navigation", definition: "Moving between pages by updating the page in place with JavaScript, instead of requesting an entirely new HTML document." },
{ type: "analogy", text: "Using a plain <a> tag is like leaving a building and walking to a new one from scratch every time; Link is like taking an elevator between floors of the same building - faster, because most of the structure stays in place." },
{ type: "code_example", language: "jsx", code: "import Link from \"next/link\";\n\nfunction Nav() {\n return <Link href=\"/about\">About</Link>;\n}" },
{ type: "line_explanation", lines: [
  { line: "import Link from \"next/link\";", explanation: "Imports the Link component used for client-side navigation." },
  { line: "return <Link href=\"/about\">About</Link>;", explanation: "Renders a link to /about that navigates without a full page reload." },
] },
{ type: "callout", tone: "info", text: "Link still renders a real <a> tag under the hood, so it keeps working correctly for accessibility, right-click, and opening in a new tab." },
  { type: "common_mistake", text: "Beginners often use a plain <a href=\"...\"> for internal navigation, which causes a full page reload and loses the performance benefits Link provides." },
{ type: "knowledge_check", question: "What is the main benefit of using Link instead of a plain <a> tag for internal navigation?", options: [
"It looks different from a normal link",
"It navigates client-side without a full page reload",
"It only works on the homepage",
"It disables all styling"
], correctIndex: 1 },
{ type: "summary", text: "The Link component enables fast, client-side navigation between pages, avoiding the full page reload a plain anchor tag would trigger." },
];

const nextjsLesson3 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: navigationAndActions.id, slug: "linking-between-pages" } },
update: { title: "Linking Between Pages", order: 1, status: ContentStatus.PUBLISHED, content: nextjsLesson3Content },
create: { moduleId: navigationAndActions.id, slug: "linking-between-pages", title: "Linking Between Pages", order: 1, status: ContentStatus.PUBLISHED, content: nextjsLesson3Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: nextjsLesson3.id, skillId: skillClientNavigation.id } },
update: {},
create: { lessonId: nextjsLesson3.id, skillId: skillClientNavigation.id },
});

const nextjsMission3 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: nextjsLesson3.id, slug: "fix-the-navigation-link" } },
update: {
title: "Fix the Navigation Link",
type: "debug_challenge",
status: ContentStatus.PUBLISHED,
starterCode: "function Nav() {\n return <a href=\"/about\">About</a>;\n}",
explanation: "Replacing the plain <a> tag with the Link component from next/link (imported at the top of the file) enables client-side navigation.",
xpReward: 10,
difficulty: 2,
},
create: {
lessonId: nextjsLesson3.id,
slug: "fix-the-navigation-link",
title: "Fix the Navigation Link",
type: "debug_challenge",
status: ContentStatus.PUBLISHED,
starterCode: "function Nav() {\n return <a href=\"/about\">About</a>;\n}",
explanation: "Replacing the plain <a> tag with the Link component from next/link (imported at the top of the file) enables client-side navigation.",
xpReward: 10,
difficulty: 2,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: nextjsMission3.id, skillId: skillClientNavigation.id } },
update: {},
create: { missionId: nextjsMission3.id, skillId: skillClientNavigation.id },
});

// ---------- Lesson 4 (Next.js Network) ----------
const nextjsLesson4Content = [
{ type: "heading", text: "Writing Server Actions" },
  { type: "paragraph", text: "A Server Action is a function marked with \"use server\" that runs only on the server, but can be called directly from a client component, such as when a form is submitted." },
  { type: "vocabulary", term: "Server Action", definition: "A function marked with \"use server\" that executes on the server but can be invoked directly from client-side code." },
{ type: "vocabulary", term: "use server", definition: "A directive placed at the top of a function or file marking it as a Server Action." },
{ type: "analogy", text: "A Server Action is like handing a sealed envelope to a courier: the client never sees or runs the logic inside, it just gets a result back once the server has processed it." },
{ type: "code_example", language: "typescript", code: "\"use server\";\n\nasync function saveName(name: string) {\n console.log(\"Saving:\", name);\n}" },
{ type: "line_explanation", lines: [
  { line: "\"use server\";", explanation: "Marks this function as a Server Action, ensuring it only ever runs on the server." },
{ line: "async function saveName(name: string) {", explanation: "Server Actions are typically declared as async functions, since they often perform I/O like database writes." },
] },
{ type: "callout", tone: "info", text: "This exact application uses real Server Actions, like submitMissionAttempt, to validate and grade mission submissions safely on the server." },
{ type: "common_mistake", text: "Beginners sometimes assume Server Action code also runs in the browser. It never does - only the function's result is sent back to the client." },
{ type: "knowledge_check", question: "Where does the code inside a Server Action actually execute?", options: [
"In the browser only",
"On the server only",
"On both the browser and server simultaneously",
"It never executes"
], correctIndex: 1 },
  { type: "summary", text: "A Server Action is a \"use server\" function that runs exclusively on the server while remaining directly callable from client components." },
];

const nextjsLesson4 = await prisma.lesson.upsert({
where: { moduleId_slug: { moduleId: navigationAndActions.id, slug: "writing-server-actions" } },
update: { title: "Writing Server Actions", order: 2, status: ContentStatus.PUBLISHED, content: nextjsLesson4Content },
create: { moduleId: navigationAndActions.id, slug: "writing-server-actions", title: "Writing Server Actions", order: 2, status: ContentStatus.PUBLISHED, content: nextjsLesson4Content },
});

await prisma.lessonSkill.upsert({
where: { lessonId_skillId: { lessonId: nextjsLesson4.id, skillId: skillServerActions.id } },
update: {},
create: { lessonId: nextjsLesson4.id, skillId: skillServerActions.id },
});

const nextjsMission4 = await prisma.mission.upsert({
where: { lessonId_slug: { lessonId: nextjsLesson4.id, slug: "write-a-server-action" } },
update: {
title: "Write a Server Action",
type: "code_writing",
status: ContentStatus.PUBLISHED,
starterCode: "// Write a Server Action function named saveName that takes\n// a single string parameter called name and logs it.\n",
explanation: "A correct Server Action starts with \"use server\"; and declares an async function, such as: \"use server\"; async function saveName(name: string) { console.log(name); }",
xpReward: 10,
difficulty: 2,
},
create: {
lessonId: nextjsLesson4.id,
slug: "write-a-server-action",
title: "Write a Server Action",
type: "code_writing",
status: ContentStatus.PUBLISHED,
starterCode: "// Write a Server Action function named saveName that takes\n// a single string parameter called name and logs it.\n",
explanation: "A correct Server Action starts with \"use server\"; and declares an async function, such as: \"use server\"; async function saveName(name: string) { console.log(name); }",
xpReward: 10,
difficulty: 2,
},
});

await prisma.missionSkill.upsert({
where: { missionId_skillId: { missionId: nextjsMission4.id, skillId: skillServerActions.id } },
update: {},
create: { missionId: nextjsMission4.id, skillId: skillServerActions.id },
});
// ---------- Mission prompts, options, and grading specs ----------
type MissionMeta = {
  prompt: string;
  options?: string[];
    test: Prisma.InputJsonValue;
};

const MISSION_META: Record<string, MissionMeta> = {
    "spot-the-valid-component": {
    prompt: "Which of these is a valid React component that correctly returns JSX?",
    options: ["function greeting() { return <h1>Hi</h1>; }", "function Greeting() { return <h1>Hi</h1>; }", "function Greeting() { <h1>Hi</h1> }", "const greeting = <h1>Hi</h1>"],
    test: { checkType: "mc", correctIndex: 1 },
  },
  "predict-the-rendered-text": {
    prompt: "If this component renders, what text appears inside the <h1> element?",
    test: { checkType: "text_exact", answer: "Hello, Ada!" },
  },
  "fix-the-broken-counter": {
    prompt: "Fix the button's onClick handler so clicking it actually increments the counter, then submit.",
    test: { checkType: "regex_all", patterns: ["setCount\\(count\\s*\\+\\s*1\\)"] },
  },
  "write-a-welcome-component": {
    prompt: "Write a component named Welcome that accepts a props parameter and returns an <h1> element rendering \"Welcome, \" followed by props.name, then submit.",
    test: { checkType: "regex_all", patterns: ["function\\s+Welcome\\s*\\(\\s*props\\s*\\)", "props\\.name"] },
  },
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
    test: { checkType: "text_exact", answer: "Not hot" }, },
  "spot-the-valid-annotation": {
prompt: "Which type annotation correctly restricts a variable to text values only?",
options: ["let name: string;", "let name: number;", "let name: boolean;", "let name: any;"],
test: { checkType: "mc", correctIndex: 0 },
},
"predict-the-inferred-type": {
prompt: "What type does TypeScript infer for the count variable, based on its initial value?",
test: { checkType: "text_exact", answer: "number" },
},
"fix-the-function-call": {
prompt: "Fix the call below so it passes a valid argument to greet, then submit.",
test: { checkType: "regex_all", patterns: ['greet\\([\'"]'] },
},
"write-a-user-interface": {
prompt: "Write an interface named User with a name property (string) and an age property (number), then submit.",
test: { checkType: "regex_all", patterns: ["interface\\s+User", "name\\s*:\\s*string", "age\\s*:\\s*number"] },
},
  "fix-the-infinite-loop": {
    prompt: "Fix the loop so it prints 0 through 4 and terminates, then submit. Your code will actually run.",
    test: { checkType: "js_run", expectedLogs: ["0", "1", "2", "3", "4"] },
  },
  
"predict-the-route": {
prompt: "Given the folder structure above, what URL would render src/app/about/page.tsx?",
test: { checkType: "text_exact", answer: "/about" },
},
"spot-the-client-directive": {
prompt: "Which directive marks a file as a Client Component?",
options: ["\"use client\";", "\"use server\";", "\"use strict\";", "import client;"],
test: { checkType: "mc", correctIndex: 0 },
},
"fix-the-navigation-link": {
prompt: "Replace the plain anchor tag with the Link component from next/link so this link navigates client-side, then submit.",
test: { checkType: "regex_all", patterns: ["<Link", "href=\"/about\""] },
},
"write-a-server-action": {
prompt: "Write a Server Action function named saveName that takes a string parameter called name and logs it, then submit.",
test: { checkType: "regex_all", patterns: ["\"use server\"", "function\\s+saveName"] },
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

console.log("Seed complete: worlds, Web Foundations (2 modules, 4 lessons, 4 missions), HTML Harbor (2 modules, 4 lessons, 4 missions), CSS City (2 modules, 4 lessons, 4 missions), JavaScript Jungle (2 modules, 4 lessons, 4 missions), TypeScript Tower (2 modules, 4 lessons, 4 missions), React Realm (2 modules, 4 lessons, 4 missions), and Next.js Network (2 modules, 4 lessons, 4 missions) upserted.");
}

main()
.catch((err) => {
console.error("Seed failed:", err);
process.exitCode = 1;
})
.finally(async () => {
await prisma.$disconnect();
});

# CLAUDE CODE MASTER BUILD INSTRUCTION

You are the lead architect, senior full-stack engineer, product designer, curriculum engineer, security engineer, QA engineer, and DevOps engineer for this project.

Build a production-ready private web application that teaches me how to understand, read, write, debug, and deploy code from the beginning.

Do not build a mockup, shallow demo, visual-only prototype, or collection of placeholder pages.

Build a complete working application that can be deployed through GitHub and Railway and used by me immediately.

The application must be polished enough to launch as a real private product now, while being architected so it can later become a public subscription product.

## 1. PROJECT PURPOSE

I already use Claude Code to create and manage live web projects.

I know how to:

- Give AI instructions
- Run terminal commands
- Open and test projects
- Make changes with AI
- Push code to GitHub
- Deploy applications
- Troubleshoot basic issues with assistance

However, I do not yet fully understand:

- How to read code confidently
- What each part of the code is doing
- How files connect
- How data moves through an application
- How to write features myself
- How to debug without depending completely on AI
- How frontend, backend, APIs, authentication, and databases work together

This application must turn me from an AI-assisted project operator into a capable full-stack developer.

The application should not teach coding as abstract schoolwork.

It should teach coding through realistic business and application examples, including:

- Customer orders
- Rental inventory
- Product availability
- Pricing
- Employees
- Deliveries
- Contractor jobs
- Worker assignments
- Accounts
- Payments
- Dashboards
- Notifications
- Scheduling
- Authentication
- Databases
- API requests
- Deployment failures

## 2. WORKING PROJECT NAME

Use the temporary project name:

CodeQuest Academy

The name must be configurable from one centralized application configuration file.

Do not hard-code the name throughout the application.

Create centralized configuration for:

- Application name
- Application description
- Support email
- Logo text
- Default XP values
- Feature flags
- AI availability
- Registration mode
- Maintenance mode
- Environment name

## 3. PRIMARY USER

The initial launch has one primary owner account: me.

However, the system must support these roles:

- Owner
- Administrator
- Curriculum Editor
- Learner

The initial product may disable public registration.

The owner must be able to invite additional users later.

Role permissions must be enforced on the server, not only hidden in the interface.

## 4. REQUIRED TECHNOLOGY

Use a modern, maintainable full-stack TypeScript architecture.

Use:

- Next.js with App Router
- TypeScript with strict mode
- React
- PostgreSQL
- Prisma ORM
- Tailwind CSS
- Zod
- Secure authentication compatible with the current Next.js version
- A maintained component foundation
- Railway for application and PostgreSQL hosting
- GitHub for source control
- Automated testing
- GitHub Actions for continuous integration

Use current stable versions at implementation time.

Lock dependency versions with the package lockfile.

Document all important technology choices in an architecture decision record.

Do not use experimental libraries for essential functionality unless there is a strong documented reason.

Do not create unnecessary microservices.

The first version should be one well-structured full-stack application.

## 5. NON-NEGOTIABLE ENGINEERING RULES

Follow these rules throughout the repository:

- TypeScript strict mode must remain enabled.
- Do not use any unless absolutely unavoidable and documented.
- Do not place important business logic directly in page components.
- Do not place important business logic directly in route handlers.
- Validate all external input on the server.
- Enforce authorization on every protected server operation.
- Never trust user-provided IDs, roles, scores, XP, progress, or ownership.
- Keep secrets on the server.
- Never expose private environment variables to the browser.
- Use transactions where multiple related database changes must succeed together.
- All database changes must use committed Prisma migrations.
- Production must not rely on prisma db push.
- All user-facing states need loading, empty, success, and error handling.
- Do not leave placeholder buttons that do nothing.
- Do not leave fake data in production flows unless clearly marked as demo curriculum content.
- Do not mark unfinished work as complete.
- Do not hide TypeScript, lint, test, or build errors.
- Do not disable checks merely to make deployment pass.
- Avoid oversized files and components.
- Prefer clear code over clever code.
- Add comments that explain why, not comments that repeat obvious syntax.
- The application must remain usable when all AI features are disabled.
- No arbitrary untrusted server-side code execution in the initial launch.
- The application must be understandable enough to eventually teach me using its own codebase.

## 6. PRODUCT EXPERIENCE

The application should feel like a combination of:

- A professional coding academy
- A modern developer tool
- A progression-based game
- An interactive code laboratory
- A guided personal mentor

It must not feel like:

- A childish cartoon game
- A generic admin template
- A collection of YouTube videos
- A quiz-only application
- A basic learning management system
- A visual mockup with no functioning learning engine

The experience should be:

- Premium
- Highly informative
- Motivating
- Clear
- Interactive
- Practical
- Responsive
- Accessible
- Fast
- Visually polished

## 7. REQUIRED VISUAL DESIGN

Create a consistent design system.

The default appearance should use a modern developer-focused dark theme, with a high-quality light theme also available.

Design requirements:

- Strong visual hierarchy
- Clear navigation
- Large readable lesson content
- Comfortable line length
- Professional typography
- Excellent spacing
- Responsive layouts
- Subtle animations
- Reduced-motion support
- Accessible contrast
- Visible keyboard focus
- Helpful icons
- Consistent status colors
- Clear code formatting
- Premium dashboard
- Mobile-friendly lesson experience

Do not overuse gradients, glowing effects, glassmorphism, or animations.

The design should remain professional after long periods of use.

Create reusable design tokens for:

- Backgrounds
- Panels
- Borders
- Text
- Muted text
- Primary actions
- Success
- Warning
- Error
- Information
- Code syntax
- Spacing
- Border radius
- Shadows
- Motion duration

Do not scatter raw colors across components.

## 8. GLOBAL APPLICATION LAYOUT

Create a responsive application shell.

Desktop:

- Left navigation sidebar
- Main content area
- Optional right learning-context panel
- Top header containing current location, search, progress, and account menu

Mobile:

- Compact top navigation
- Bottom navigation for essential areas
- Slide-out menu for secondary areas
- Code editor that remains usable on smaller screens
- No unavoidable horizontal overflow

Primary navigation:

- Dashboard
- Learn
- World Map
- Practice
- Code Lab
- Projects
- Review
- Notes
- Achievements
- Progress
- Admin, when authorized
- Settings

## 9. COMPLETE USER FLOWS

The application is not launch-ready until these flows work from beginning to end.

### Authentication flow

- Owner can sign in securely.
- User receives helpful errors for invalid login.
- User can sign out.
- Session persists securely.
- Protected pages redirect appropriately.
- Unauthorized roles cannot access admin pages.
- Authentication attempts are rate-limited.
- Password recovery or a documented owner recovery method exists.
- Public registration is disabled by default.
- Owner can invite a learner.
- Invite tokens expire.
- Used invite tokens cannot be reused.

### First-time onboarding flow

On first login:

- Welcome screen
- Explanation of the application
- Experience questionnaire
- Learning goals
- Preferred daily goal
- Confidence assessment
- Practical baseline assessment
- Personalized starting recommendation
- Dashboard introduction
- First lesson launch

The assessment must recognize that a user may have deployed real projects using AI without understanding the code deeply.

Do not place the user automatically at an advanced level based only on claimed experience.

### Lesson flow

- User opens a lesson.
- Objective is displayed.
- Prerequisites are shown.
- New vocabulary is introduced.
- Concept is explained.
- Real-world analogy is shown.
- Small code example appears.
- Code is explained line by line.
- User completes a guided interaction.
- User completes a knowledge check.
- User performs an independent mission.
- Results are evaluated.
- Mistakes are explained.
- XP and mastery are updated.
- Review items are generated when appropriate.
- The next recommended action is shown.

### Mission flow

- User reads the requirements.
- User views starter files or code.
- User writes, fixes, rearranges, predicts, or explains.
- User can run safe code when relevant.
- User can request progressive hints.
- User submits the mission.
- Automated checks run.
- User receives detailed feedback.
- Attempt is saved.
- XP and skill mastery are calculated on the server.
- User may retry.
- Correct solution explanation becomes available after completion or final hint.

### Review flow

- System identifies weak or stale skills.
- Review queue presents appropriate exercises.
- Exercises vary in format.
- Completed reviews affect mastery.
- Repeated mistakes remain scheduled for future review.
- User sees why each item was selected.

### Capstone flow

- User reads project brief.
- User breaks requirements into tasks.
- User works through project milestones.
- Tests validate key behaviors.
- User records notes and decisions.
- Project completion requires actual working functionality.
- Final review highlights strengths and gaps.

## 10. REQUIRED PAGES

Build all of these pages as functional production pages.

### Public pages

Even though this is private initially, create:

- Landing page
- Sign-in page
- Invite acceptance page
- Privacy page
- Terms page
- Accessibility statement
- System status page
- Not-found page
- General error page

The landing page should explain the product without exposing private learning data.

### Learner pages

- Dashboard
- Onboarding
- Initial assessment
- World map
- World details
- Module details
- Lesson viewer
- Mission player
- Practice center
- Review queue
- Code Lab
- Code reader
- Projects
- Project details
- Notes
- Bookmarks
- Saved code
- Mistake history
- Achievements
- Skill mastery
- Progress analytics
- Activity history
- Search
- Notifications
- Profile
- Learning preferences
- Appearance settings
- Accessibility settings
- Account security

### Admin pages

- Admin dashboard
- User management
- Invitation management
- Role management
- World management
- Module management
- Lesson management
- Mission management
- Skill management
- Achievement management
- Curriculum ordering
- Content preview
- Draft and publishing management
- Curriculum validation
- Feature flags
- Application settings
- Audit log
- System diagnostics
- Database health summary
- Content import and export
- AI usage configuration
- Maintenance mode

## 11. WORLD MAP AND CURRICULUM

Create these worlds:

- Web Foundations
- HTML Harbor
- CSS City
- JavaScript Jungle
- TypeScript Tower
- React Realm
- Next.js Network
- API Headquarters
- Database District
- Prisma Workshop
- Authentication Fortress
- GitHub Mountain
- Railway Launch Center
- Debugging Dungeon
- Testing Laboratory
- Security Stronghold
- Full-Stack Final Challenge

The first production release must not contain empty world shells presented as complete.

Worlds that do not yet contain launch-quality lessons should be labeled clearly as upcoming and excluded from completion calculations.

## 12. LAUNCH CURRICULUM REQUIREMENT

The application must launch with at least:

- 30 complete lessons
- 100 complete missions
- 5 mission types or more
- 3 boss challenges
- 2 complete mini projects
- 1 complete launch capstone
- 75 or more review questions
- 30 or more debugging scenarios
- 25 or more code-reading exercises
- 20 or more terminal and Git simulations

Minimum fully available launch topics:

- Web fundamentals
- Files and folders
- HTML
- CSS
- JavaScript fundamentals
- Reading JavaScript
- Debugging JavaScript
- Terminal basics
- Git fundamentals
- GitHub fundamentals
- Basic TypeScript
- Basic API concepts
- Basic database concepts
- Basic deployment concepts

Content must be substantive.

Do not duplicate the same exercise with renamed variables merely to reach these totals.

## 13. LESSON CONTENT FORMAT

Create a structured lesson content system.

Do not hard-code full lessons into React components.

A lesson should support ordered blocks such as:

- Heading
- Paragraph
- Callout
- Vocabulary
- Analogy
- Code example
- Line-by-line code explanation
- Diagram
- Interactive demonstration
- Knowledge check
- Guided activity
- Independent activity
- Warning
- Common mistake
- Summary
- Reflection
- Resource
- Mission link

Every content block must be validated before publication.

Lesson content must support drafts and published versions.

Published content should not change unexpectedly while a learner is completing it.

Consider versioning important lesson and mission content.

## 14. REQUIRED TEACHING METHOD

Every major concept should be taught through this sequence:

- Explain the concept in plain English.
- Give a real-world analogy.
- Show a minimal example.
- Explain each line.
- Show how the code executes.
- Demonstrate a common mistake.
- Let the learner try with guidance.
- Let the learner solve independently.
- Explain the completed solution.
- Schedule future review.

Never assume a technical word is understood merely because it has appeared before.

Important vocabulary should be clickable or hoverable for a definition.

Create a glossary.

Definitions must include:

- Plain-English meaning
- Technical meaning
- Small example
- Related terms
- Where it appears in the curriculum

## 15. MISSION TYPES

Implement these mission types.

Multiple choice

Use only when it genuinely tests understanding.

Distractors should represent realistic misunderstandings.

Predict the output

Display code and ask what it produces.

After submission, show execution steps.

Explain the code

Ask the learner to describe what code does.

For launch, evaluation may use:

- Required concept keywords
- Structured questions
- Rubric-based self-check
- Optional AI evaluation behind a feature flag

Do not require exact wording.

Complete the code

Provide missing sections.

Evaluate behavior, not only exact text.

Fix the bug

Provide broken code, symptoms, and optional error output.

Require the learner to find and fix the issue.

Rearrange the code

Give code lines or logical steps out of order.

Build from requirements

Provide a small feature requirement and starter environment.

Trace the data

Show data moving across:

- Component
- Event handler
- API request
- Server handler
- Service
- Database
- Response
- Updated interface

Terminal command mission

Provide a simulated terminal scenario.

Git workflow mission

Simulate:

- Status
- Staging
- Committing
- Branching
- Merging
- Pull requests
- Conflicts
- Reverting

Deployment diagnosis

Provide logs and ask the learner to identify the failure.

Code review

Ask the learner to identify:

- Bugs
- Security problems
- Readability issues
- Missing validation
- Incorrect assumptions
- Unnecessary complexity

## 16. CODE EDITOR

Integrate a polished browser code editor.

Choose Monaco Editor or CodeMirror based on bundle size, accessibility, maintainability, and compatibility.

The editor must support:

- Syntax highlighting
- Line numbers
- Multiple files
- Tabs
- Active file indication
- Error markers
- Reset
- Run
- Submit
- Format
- Hints
- Solution comparison
- Console output
- Test output
- Expected output
- Actual output
- Keyboard shortcuts
- Accessible labels
- Mobile fallback

Persist unsaved mission work automatically to the database or a secure draft system.

Do not lose a learner's work when the page refreshes accidentally.

Provide a clear reset confirmation.

## 17. SAFE CODE EXECUTION

For launch, support safe client-side JavaScript exercises.

Do not execute learner JavaScript directly in the main page context.

Use a constrained isolated environment such as a sandboxed worker or another secure browser-based execution strategy.

Apply:

- Execution timeout
- Output limit
- Memory-conscious design
- Infinite loop handling
- Restricted global access
- No application secrets
- No cookies
- No authentication tokens
- No database access
- No network access unless an exercise explicitly uses a controlled mock
- Console capture
- Structured error capture

If secure isolation cannot be guaranteed for a feature, do not ship that feature.

Do not add unrestricted server-side execution in the launch version.

Create an architectural extension point for a future remote execution service.

## 18. AUTOMATED CODE EVALUATION

Code missions must not rely only on string comparison.

Support:

- Public tests
- Hidden tests
- Function behavior tests
- Output tests
- Edge-case tests
- Required construct checks when pedagogically necessary
- Prohibited shortcut checks when necessary
- Time limit
- Helpful failure messages

Mission authors must be able to configure:

- Starter code
- Editable files
- Read-only files
- Visible tests
- Hidden tests
- Expected result
- Allowed language
- Execution timeout
- Required concepts
- Hints
- Solution code
- Explanation
- XP reward
- Skill mappings

Never send hidden test definitions or solution code to the client before completion.

## 19. CODE EXECUTION VISUALIZER

Create a visual step-through experience for selected JavaScript lessons.

It should display:

- Current line
- Previous line
- Variables and values
- Function call stack
- Function parameters
- Return values
- Array mutations
- Object mutations
- Conditional decisions
- Loop iterations
- Console output
- Final result

For launch, this may use carefully prepared trace data for curriculum examples rather than attempting to interpret every possible JavaScript program.

The architecture should allow more general tracing later.

## 20. CODE READER

Build an advanced code-reading mode.

The user should be able to select a file and line.

Display:

- Plain-English explanation
- Syntax explanation
- Input data
- Output data
- Relevant types
- Imports used
- Functions called
- Files connected
- Possible errors
- Security considerations
- Common beginner misunderstanding
- Real-world analogy

Create a visual feature-flow tracer:

User action -> component -> handler -> validation -> server operation -> service -> database -> response -> interface update

Include at least one complete sample full-stack project inside the curriculum for tracing.

## 21. SAMPLE APPLICATION

Create a simplified but real sample application called:

Rental Manager

It should include:

- Products
- Inventory
- Customers
- Orders
- Order items
- Availability
- Basic pricing
- Status updates
- Dashboard
- API routes or server operations
- PostgreSQL data
- Prisma
- Validation
- Authentication examples
- Error handling

The sample application should be part of the learning experience, not a separate unmaintained project.

Use it to teach:

- Folder structure
- Components
- Forms
- Data validation
- Database models
- Relationships
- CRUD
- API behavior
- Errors
- Authentication
- Deployment

The code must be intentionally clear and educational.

## 22. HINT SYSTEM

Implement four hint levels.

Hint 1

Concept reminder only.

Hint 2

Point to the relevant area.

Hint 3

Provide pseudocode or partial structure.

Hint 4

Show the complete solution and detailed explanation.

Track:

- Hint level used
- Time used
- Attempt number
- Mission score impact

Hints should reduce scoring modestly, but should not block learning progress.

The learner must always be able to continue.

## 23. FEEDBACK SYSTEM

Never return only:

- Incorrect
- Wrong answer
- Try again

For incorrect answers, return:

- What was correct
- What was incorrect
- Why
- What the code currently does
- What the learner expected
- A smaller related example
- The next recommended step

For code failures, distinguish:

- Syntax error
- Runtime error
- Failed test
- Incorrect output
- Missing requirement
- Timeout
- Unsupported operation

Make technical errors understandable without hiding the real error message.

Show both:

- Beginner explanation
- Original technical error

## 24. XP, LEVELS, AND SCORING

XP and scoring must be calculated on the server.

Do not trust XP values submitted by the browser.

XP can be awarded for:

- Lesson completion
- Mission success
- First-attempt success
- Completing without hints
- Review completion
- Boss challenge
- Capstone milestone
- Consistency

Avoid rewarding repeated meaningless actions.

Prevent farming XP by repeatedly completing the same easy mission.

Create separate values for:

- Completion status
- Best score
- Latest score
- Attempt count
- XP earned
- Mastery impact

XP must not be the same as skill mastery.

## 25. SKILL MASTERY

Create individual skills such as:

- File navigation
- HTML structure
- Semantic HTML
- CSS selectors
- Box model
- Flexbox
- Grid
- Variables
- Data types
- Conditions
- Functions
- Arrays
- Objects
- Loops
- DOM events
- Async code
- TypeScript types
- Git status
- Git commits
- Branching
- Debugging
- API requests
- Database relationships
- Validation
- Authentication
- Deployment

Mastery states:

- Not Started
- Introduced
- Practicing
- Developing
- Proficient
- Mastered
- Needs Review

Use a numeric internal score with displayed mastery bands.

Mastery changes should consider:

- Accuracy
- Mission difficulty
- Mission type
- Number of attempts
- Hint usage
- Recency
- Repeated success
- Performance across multiple contexts

One answer must never produce mastery.

A learner should demonstrate a skill through multiple mission types.

## 26. SPACED REVIEW

Create a review scheduling system.

Each review item needs:

- User
- Skill
- Source lesson or mission
- Reason for review
- Due date
- Interval
- Difficulty
- Previous performance
- Status

Create review items when:

- User answers incorrectly
- User uses major hints
- User reports low confidence
- Mastery declines due to time
- User repeatedly struggles with a related concept

Show the user:

- Why the item is being reviewed
- When it was last practiced
- Current mastery
- Expected benefit

Do not claim scientifically precise scheduling without evidence.

Use a clear maintainable review algorithm and document it.

## 27. STREAKS AND DAILY GOALS

Implement:

- Daily learning goal
- Current streak
- Longest streak
- Streak calendar
- Weekly activity
- Optional streak freeze later

Do not create manipulative alerts.

The learner's timezone must be stored and used for daily boundaries.

Streak updates must be idempotent and server-controlled.

## 28. ACHIEVEMENTS

Create meaningful achievements, such as:

- First Lesson
- First Bug Fixed
- First Function Written
- First Perfect Mission
- Five-Day Practice Streak
- JavaScript Fundamentals Complete
- First Git Branch
- First Merge Conflict Resolved
- First Deployment Diagnosis
- No-Hint Boss Victory
- First Capstone Complete

Achievements must be awarded once.

Awarding must be safe against duplicate requests.

Display achievement details and award date.

## 29. NOTES, BOOKMARKS, AND SAVED CODE

Allow users to:

- Bookmark lessons
- Bookmark code lines
- Save code snippets
- Write private notes
- Tag notes
- Search notes
- Attach a note to a lesson
- Attach a note to a mission
- Attach a note to a project
- Edit and delete notes
- Export notes

Use autosave with visible saving status.

Prevent data loss.

## 30. SEARCH

Implement global search across:

- Lessons
- Worlds
- Modules
- Glossary terms
- Skills
- Missions
- Notes
- Bookmarks

Respect permissions.

Do not expose draft curriculum to learners.

Search should return useful grouped results.

## 31. NOTIFICATIONS

Create in-app notifications for:

- Achievement earned
- New world unlocked
- Review due
- Invitation accepted
- Admin publishing errors
- System maintenance

Notifications require:

- Read and unread states
- Mark one as read
- Mark all as read
- Linked destination
- Timestamp
- Notification type

Email notifications are optional at launch and should be behind a feature flag.

## 32. ADMIN CURRICULUM SYSTEM

The admin area must allow authorized users to create and manage curriculum without modifying source code.

Support:

- Create world
- Create module
- Create lesson
- Create mission
- Create skill
- Create achievement
- Reorder content
- Set prerequisites
- Assign skill mappings
- Add content blocks
- Add starter code
- Add files
- Add visible tests
- Add hidden tests
- Add hints
- Add solutions
- Add explanations
- Add XP
- Add difficulty
- Preview as learner
- Save draft
- Publish
- Unpublish
- Archive
- Duplicate content
- Validate content
- Export content
- Import content

Prevent publication when:

- Required fields are missing
- Mission has no valid answer or test
- Skill mappings are invalid
- Prerequisites create cycles
- Referenced content is missing
- Code language is unsupported
- Hidden tests are malformed

Create a curriculum health dashboard.

## 33. CONTENT PUBLISHING

Content needs statuses:

- Draft
- In Review
- Published
- Archived

Track:

- Created by
- Updated by
- Published by
- Created date
- Updated date
- Published date
- Version

Learners must only see published content.

Changes to published content must be intentional.

Maintain basic revision history for lesson and mission content.

## 34. DATABASE DESIGN

Create a normalized PostgreSQL schema.

Include models equivalent to:

Identity and access

- User
- Account
- Session
- VerificationToken, if required by authentication approach
- Role
- Permission, if using permission records
- UserRole
- Invitation
- PasswordResetToken, when applicable
- LoginAttempt or security event tracking

User configuration

- UserProfile
- UserSettings
- LearningPreference
- AccessibilityPreference
- DailyGoal

Curriculum

- World
- Module
- Lesson
- LessonVersion
- ContentBlock
- Mission
- MissionVersion
- MissionFile
- MissionTest
- MissionHint
- MissionSolution
- Skill
- LessonSkill
- MissionSkill
- Prerequisite
- GlossaryTerm
- Resource

Progress

- LessonProgress
- MissionAttempt
- MissionResult
- UserSkill
- UserWorldProgress
- UserModuleProgress
- ReviewItem
- LearningActivity
- Streak
- DailyActivity
- UserAchievement
- Achievement

Personal learning data

- Note
- Bookmark
- SavedCode
- Project
- ProjectMilestone
- ProjectSubmission

Communication and operations

- Notification
- AuditLog
- FeatureFlag
- SystemSetting
- ContentImportJob
- ContentExportJob

Adjust the exact schema where justified.

Document all relationships.

Add indexes for frequent queries.

Use database constraints for important invariants.

Use enums carefully and understand migration implications.

Do not store the entire application in JSON columns.

JSON fields may be used for structured content where appropriate, but important searchable and relational data should have proper tables.

## 35. DATA INTEGRITY

Enforce:

- Unique email addresses
- Unique slugs where required
- Unique achievement awards per user
- Valid ordering positions
- No duplicate skill mappings
- No duplicate active invitations
- No cross-user access to notes or saved code
- Valid content ownership
- Valid published references
- Valid mission version references
- Non-negative XP
- Non-negative attempt counts
- Valid mastery ranges

Use transactions for:

- Mission submission
- XP award
- Skill update
- Achievement check
- Lesson completion
- Review scheduling

A partial failure must not award XP while failing to save the attempt.

## 36. SERVICES AND DOMAIN LOGIC

Create a clear service layer.

Examples:

- auth-service
- invitation-service
- curriculum-service
- lesson-service
- mission-service
- evaluation-service
- progress-service
- xp-service
- mastery-service
- review-service
- achievement-service
- streak-service
- notification-service
- search-service
- audit-service
- content-publishing-service

Services should:

- Accept validated inputs
- Enforce authorization where appropriate
- Perform business logic
- Use database transactions where needed
- Return typed results
- Avoid framework-specific response objects

Route handlers and server actions should be thin.

## 37. AUTHORIZATION

Create a centralized authorization system.

Do not scatter role comparisons randomly.

Support checks such as:

- Can view admin
- Can manage users
- Can invite users
- Can edit curriculum
- Can publish curriculum
- Can view audit logs
- Can change feature flags
- Can access learner content
- Can access a specific personal record

Every protected operation must check authorization on the server.

Add tests proving learners cannot:

- Open admin routes
- Publish lessons
- Change XP
- Read another user's notes
- Read another user's attempts
- Change roles
- View hidden tests
- View solutions before eligible

## 38. SECURITY

Perform a security review before launch.

Implement:

- Secure cookies
- CSRF protection where applicable
- Server-side authorization
- Input validation
- Output encoding
- Secure password hashing when passwords are used
- Login rate limiting
- Invitation rate limiting
- Expiring tokens
- Token hashing in the database where appropriate
- Security headers
- Content Security Policy compatible with the editor
- Protection against open redirects
- Protection against unsafe URL handling
- Protection against mass assignment
- Safe markdown or rich-content rendering
- No raw HTML rendering without sanitization
- Redaction of secrets from logs
- Audit logging for sensitive admin operations
- Dependency security checks
- Least-privilege database access
- Least-privilege GitHub access
- Least-privilege AI credentials
- Error messages that do not reveal secrets

Create a threat model covering:

- Authentication
- Admin access
- Curriculum content
- Code execution
- Hidden tests
- AI integration
- GitHub integration
- Database access
- Environment variables
- User-generated notes
- Import and export

Do not claim the system is perfectly secure.

Document known limitations.

## 39. RATE LIMITING

Implement appropriate rate limiting for:

- Login
- Password reset
- Invitations
- AI tutor
- Code submission
- Search
- Content import
- Expensive admin operations

Use a strategy compatible with Railway deployment.

Do not use in-memory-only rate limiting if multiple application instances would make it ineffective.

## 40. AI TUTOR

AI is optional and feature-flagged.

The core application must function without an AI API key.

When enabled, the AI tutor should:

- Explain code at the learner's level
- Ask guiding questions
- Identify misunderstandings
- Explain errors
- Generate extra practice
- Review a learner explanation
- Compare solutions
- Help break down project requirements

Default behavior must not immediately reveal the full answer.

Tutor sequence:

- Ask what the learner thinks.
- Point to the relevant concept.
- Give a small hint.
- Ask the learner to try.
- Explain the missing idea.
- Reveal the solution only when requested or after sufficient attempts.

AI safeguards:

- Never send secrets
- Never send hidden tests
- Never send private environment values
- Never send more repository data than necessary
- Clearly label AI-generated feedback
- Allow AI features to be disabled
- Track usage and cost
- Apply rate limits
- Handle provider failures gracefully
- Do not block course completion if AI is unavailable

Create an AI provider abstraction.

Do not tightly couple business logic to one model provider.

## 41. PERSONAL PROJECT IMPORT

Do not make full private GitHub import a launch blocker.

However, prepare the architecture for it.

Launch version may include:

- Built-in sample repository
- Upload of selected plain-text code files with strict limits
- Manual project creation
- Safe code-reading exercises

Future GitHub integration should use a GitHub App with least privilege.

Do not use a broad personal access token as the final production design.

Never display repository secrets or .env contents.

## 42. TERMINAL SIMULATOR

Build a safe terminal learning simulator.

It should simulate a controlled virtual project and support commands such as:

- pwd
- ls
- cd
- mkdir
- touch
- cat
- npm install
- npm run dev
- npm run build
- git status
- git add
- git commit
- git log
- git branch
- git switch
- git merge
- git pull
- git push

This is a simulation.

Do not execute arbitrary system shell commands.

Display:

- Current directory
- Current branch
- File changes
- Staging area
- Commit history
- Command result
- Helpful error explanation

Build scenarios such as:

- Wrong directory
- Untracked file
- Nothing staged
- Merge conflict
- Detached understanding exercise
- Failed build
- Missing dependency
- Missing environment variable

## 43. GIT SIMULATION

Create a visual Git model showing:

- Working directory
- Staging area
- Local repository
- Remote repository
- Branches
- Commits
- Merge point
- Conflict state

When the learner enters a simulated command, animate or update the corresponding state.

Teach what changed, not only whether the command was accepted.

## 44. DEPLOYMENT LEARNING

Create a Railway deployment simulator and real deployment documentation.

Teach:

- Repository connection
- Build command
- Start command
- Environment variables
- Database provisioning
- Migrations
- Build logs
- Runtime logs
- Health checks
- Domains
- Rollbacks
- Failed deployments

Create diagnosis missions using realistic but fictional logs.

Do not expose actual production secrets in curriculum screenshots or examples.

## 45. OBSERVABILITY

Production must include:

- Structured server logs
- Request correlation where useful
- Error tracking integration or a replaceable adapter
- Health endpoint
- Readiness endpoint if appropriate
- Database connectivity check
- Build version
- Deployment environment
- Application version or commit SHA
- Basic performance monitoring
- AI usage logging when enabled

Do not log:

- Passwords
- Session tokens
- Reset tokens
- Invitation tokens
- API keys
- Full private code submissions unnecessarily

Create an admin diagnostics page without exposing secrets.

## 46. ERROR HANDLING

Create typed application errors.

Distinguish:

- Validation error
- Authentication error
- Authorization error
- Not found
- Conflict
- Rate limit
- Code execution error
- Content error
- Database error
- External service error
- Internal server error

User-facing errors should be helpful.

Technical details should be logged securely.

Create:

- Route-level error boundaries
- Not-found handling
- Retry actions where safe
- Recovery actions
- Form-level validation messages
- Global error tracking

## 47. PERFORMANCE

Set launch performance goals.

Optimize:

- Database query count
- Dashboard queries
- Curriculum navigation
- Lesson loading
- Editor loading
- Search
- Large code blocks
- Client bundle size
- Images
- Fonts

Use dynamic loading for the heavy code editor when appropriate.

Avoid loading admin code for normal learners.

Avoid unnecessary client components.

Use pagination for:

- Attempts
- Activity history
- Audit logs
- Users
- Notifications
- Search results

Do not fetch complete large histories for dashboard cards.

## 48. ACCESSIBILITY

Target WCAG 2.2 AA practices.

Requirements:

- Keyboard navigation
- Visible focus states
- Semantic HTML
- Correct heading order
- Form labels
- Error associations
- Screen-reader announcements
- Accessible dialogs
- Sufficient contrast
- Reduced motion
- No color-only meaning
- Skip navigation link
- Accessible code editor fallback
- Captions or text alternatives for important animations
- Logical tab order
- Touch-friendly controls

Test with automated accessibility tools and manual keyboard review.

## 49. RESPONSIVE DESIGN

Test at minimum:

- Small mobile
- Large mobile
- Tablet
- Laptop
- Desktop
- Wide desktop

Important screens must remain usable:

- Dashboard
- Lesson
- Mission editor
- World map
- Admin editor
- Review queue
- Code reader

The world map may become a vertical journey on mobile.

Do not force a tiny desktop map into a mobile viewport.

## 50. TESTING

Create a serious automated test suite.

### Unit tests

Test:

- XP calculations
- Mastery calculations
- Review scheduling
- Streak logic
- Prerequisite logic
- Achievement eligibility
- Content validation
- Permission checks
- Mission scoring
- Code test evaluation
- Slug creation
- Token expiration

### Integration tests

Test:

- Authentication
- Invitations
- Lesson progress
- Mission submission
- XP transaction
- Skill update
- Achievement award
- Review creation
- Publishing workflow
- Notes and bookmarks
- Search permissions
- Role enforcement

### End-to-end tests

Test:

- Owner login
- First-time onboarding
- Start lesson
- Complete knowledge check
- Complete code mission
- Receive XP
- Unlock next lesson
- View review queue
- Save note
- Bookmark lesson
- Admin creates lesson
- Admin previews lesson
- Admin publishes lesson
- Learner sees published lesson
- Learner cannot see draft lesson
- Learner cannot access admin
- Owner invites another learner
- Invite is accepted
- Application works on mobile viewport

### Security tests

Test:

- Unauthorized data access
- Role escalation attempts
- Hidden-test exposure
- Solution exposure
- XP manipulation
- Cross-user note access
- Cross-user attempt access
- Invalid invite reuse
- Expired token
- Excessive login attempts
- Unsafe content rendering

All critical launch flows must have automated coverage.

## 51. TEST DATA

Create predictable factories and seed data.

Separate:

- Development seed
- Test seed
- Production launch seed

Production seed must include curriculum and required system configuration.

It must not include insecure sample accounts with shared passwords.

Create a secure owner bootstrap process.

The bootstrap process should be documented and usable on Railway.

## 52. DATABASE MIGRATIONS

Implement a safe migration process.

Requirements:

- Migrations committed to Git
- Migration naming conventions
- Deployment migration command
- Failed migration handling
- Backup before risky production migration
- No destructive migration without documentation
- Data migration strategy
- Rollback or forward-fix guidance
- Migration testing in CI

Railway deployment must run migrations safely.

Do not cause multiple application instances to race while running migrations.

Choose and document the migration execution strategy.

## 53. BACKUPS AND RECOVERY

Create a documented backup and recovery plan.

Include:

- Railway PostgreSQL backup approach
- Backup frequency recommendation
- Manual backup procedure
- Restore procedure
- Verification procedure
- Recovery owner
- Expected data-loss window
- Disaster recovery checklist

Create an admin export for personal learning data and curriculum content.

Do not describe export as a replacement for database backups.

## 54. PRIVACY

Collect only necessary personal data.

Create:

- Privacy policy
- Data export
- Account deletion process
- Personal note privacy
- AI data disclosure
- Retention explanation

If account deletion could damage shared curriculum ownership or audit integrity, anonymize where appropriate and document the approach.

## 55. AUDIT LOG

Record sensitive operations such as:

- User invited
- Role changed
- Lesson published
- Mission published
- Content archived
- Feature flag changed
- System setting changed
- User deactivated
- Data export requested
- Maintenance mode changed

Audit records should include:

- Actor
- Action
- Target type
- Target ID
- Timestamp
- Safe metadata
- Request context where appropriate

Do not store secrets in audit metadata.

Audit logs should not be editable through the normal application.

## 56. FEATURE FLAGS

Create database-backed or environment-backed feature flags for:

- AI tutor
- Public registration
- Email notifications
- GitHub import
- Server code execution
- Daily challenge
- Sound effects
- New curriculum worlds
- Maintenance mode

Provide safe defaults.

Flags that affect security must be checked on the server.

## 57. EMAIL

Email is optional for the first private launch, but architecture must support:

- Invitations
- Password reset
- Account notices
- Security notice

Use an email adapter.

Development must use a safe local or console provider.

Production email configuration must be documented.

The application must not fail entirely when email is unavailable.

Allow the owner to copy a secure invitation link when outbound email is disabled.

## 58. ANALYTICS

Create privacy-conscious internal learning analytics.

Track:

- Lesson starts
- Lesson completion
- Mission attempts
- Mission success
- Hint usage
- Time on learning activity
- Skill performance
- Review completion
- Capstone progress

Do not depend on invasive third-party tracking.

Provide an internal progress dashboard.

Do not treat time-on-page as perfect learning time.

## 59. DASHBOARD

The learner dashboard must show:

- Continue learning
- Current world
- Current module
- Current lesson
- XP
- Level
- Daily goal
- Streak
- Skills needing review
- Review count
- Recent mistakes
- Recent achievements
- Capstone progress
- Weekly activity
- Recommended next action
- Saved notes
- Bookmarks

Every dashboard card must link to a useful destination.

Handle the new-user empty state intelligently.

## 60. PROGRESS PAGE

Display:

- Overall curriculum progress
- World progress
- Module progress
- Skill mastery
- Mission accuracy
- First-attempt accuracy
- Hint usage
- Review completion
- Learning activity by day
- Strongest skills
- Weakest skills
- Recent improvement
- Capstone milestones

Do not present misleading precision.

Explain how mastery is estimated.

## 61. WORLD MAP

Create an interactive progression map.

Desktop may use a visual path.

Mobile should use a clean vertical progression.

Each world displays:

- Name
- Description
- Progress
- Locked or unlocked
- Required prerequisites
- Number of lessons
- Number of missions
- Boss challenge
- Completion reward
- Upcoming status when not yet available

The learner should always understand why a world is locked.

## 62. LESSON VIEWER

Required elements:

- Breadcrumbs
- Lesson title
- Objective
- Skill tags
- Prerequisites
- Estimated difficulty
- Progress indicator
- Main content
- Glossary access
- Notes panel
- Bookmark action
- Previous and next navigation
- Guided activities
- Independent mission
- Completion state
- Confidence question
- Feedback control

Do not trap the learner in a long unbroken page.

Break lessons into meaningful sections.

Persist section progress when useful.

## 63. PRACTICE CENTER

Allow practice by:

- Skill
- Difficulty
- Mission type
- Weak areas
- Bookmarked topics
- Recently learned
- Random mix
- No-hint mode
- Debugging-only mode
- Code-reading mode

Practice attempts should affect mastery, but use safeguards against repeatedly farming the same content.

## 64. INITIAL ASSESSMENT

The initial assessment should include:

- Technical vocabulary
- Reading basic HTML
- Reading simple CSS
- Predicting basic JavaScript
- Identifying a simple bug
- Recognizing terminal commands
- Understanding frontend versus backend
- Understanding database concepts
- Understanding Git at a basic level

Afterward, show:

- What the user already appears to understand
- What needs development
- Recommended starting point
- Skills that will still be reviewed

Do not shame the user for weak results.

## 65. CAPSTONE PROJECTS

Launch with these complete projects.

### Project 1: Party Rental Landing Page

Teach:

- File structure
- Semantic HTML
- CSS layout
- Responsive design
- Forms
- Accessibility

### Project 2: Rental Price Calculator

Teach:

- Variables
- Arrays
- Objects
- Functions
- Events
- Validation
- Totals
- Edge cases

### Launch Capstone: Rental Inventory Mini App

Teach:

- TypeScript
- React
- Components
- State
- Forms
- Filtering
- Basic API concepts
- Data persistence concepts
- Debugging
- Git workflow
- Deployment planning

The launch capstone may use a controlled application environment rather than requiring unrestricted deployment from inside the learning app.

Every project must include:

- Requirements
- Milestones
- Acceptance criteria
- Starter files
- Tests
- Hints
- Final review
- Reflection
- Extension ideas

## 66. DEMO AND SEED CURRICULUM QUALITY

Every seeded lesson must be human-readable and coherent.

Do not generate repetitive filler content.

For every launch lesson, verify:

- Correct technical content
- Plain-English explanation
- Complete examples
- Correct code
- Valid tests
- Useful hints
- Meaningful solution
- Skill mappings
- Prerequisites
- Mobile rendering
- Accessibility
- No placeholder text

Create a curriculum validation script that checks structural completeness.

Also manually review sample lessons in the browser.

## 67. REPOSITORY STRUCTURE

Use a clear structure similar to:

```
app/
  (public)/
  (auth)/
  (learner)/
  (admin)/
  api/
components/
  app-shell/
  curriculum/
  lessons/
  missions/
  editor/
  code-reader/
  progress/
  admin/
  shared/
  ui/
config/
content/
lib/
  auth/
  authorization/
  database/
  validation/
  services/
  scoring/
  mastery/
  review/
  achievements/
  code-execution/
  curriculum/
  search/
  notifications/
  analytics/
  logging/
  errors/
  security/
prisma/
  migrations/
  schema.prisma
  seed/
public/
scripts/
tests/
  unit/
  integration/
  e2e/
docs/
```

Refine this as needed.

Keep route-specific components near routes when appropriate.

Keep reusable domain logic out of route folders.

## 68. DOCUMENTATION

Create complete documentation.

Required files:

- README.md
- docs/architecture.md
- docs/local-development.md
- docs/environment-variables.md
- docs/database.md
- docs/migrations.md
- docs/railway-deployment.md
- docs/github-workflow.md
- docs/testing.md
- docs/security.md
- docs/threat-model.md
- docs/code-execution.md
- docs/curriculum-authoring.md
- docs/content-publishing.md
- docs/backups-and-recovery.md
- docs/troubleshooting.md
- docs/owner-bootstrap.md
- docs/release-process.md
- docs/known-limitations.md

Documentation must be understandable to someone learning development.

Explain important commands and why they are used.

## 69. ENVIRONMENT VARIABLES

Create a validated environment configuration layer.

Validate environment variables at startup.

Separate server-only and public variables.

Document:

- Name
- Required or optional
- Purpose
- Example format without real secrets
- Environments where used
- Consequence if missing

Expected categories:

- Database
- Authentication
- Application URL
- Session security
- Email
- AI provider
- Error tracking
- Rate limiting
- Feature flags

Never commit real .env files.

Provide .env.example.

## 70. CI PIPELINE

Create GitHub Actions that run on pull requests and main branch changes.

Required checks:

- Install dependencies
- Validate formatting
- Lint
- Type check
- Unit tests
- Integration tests
- Production build
- Prisma schema validation
- Migration checks
- Curriculum validation
- Security or dependency audit where practical

Do not deploy broken code.

Main branch should be protected.

Document required GitHub branch protection settings.

## 71. GITHUB WORKFLOW

Use:

- Private repository
- Protected main
- Feature branches
- Pull requests
- Descriptive commits
- Issue tracking
- Release tags
- Changelog

Create templates for:

- Bug report
- Feature request
- Curriculum issue
- Pull request

Create CONTRIBUTING.md.

## 72. RAILWAY DEPLOYMENT

Prepare the project for Railway.

Create:

- Application service
- PostgreSQL service
- Production variables
- Health check
- Build command
- Start command
- Migration release process
- Deployment documentation
- Custom domain instructions
- Rollback instructions

The application must bind correctly to Railway's assigned port and host configuration.

Use production-safe database connection handling.

Do not create excessive database connections.

Confirm the application deploys from a clean GitHub checkout.

## 73. PRODUCTION DEPLOYMENT CHECK

Before calling the project launch-ready:

- Create a clean production build.
- Run all tests.
- Run migration against a clean database.
- Seed launch curriculum.
- Create owner account securely.
- Deploy to Railway.
- Verify health endpoint.
- Verify sign-in.
- Verify onboarding.
- Complete a lesson.
- Complete a code mission.
- Verify XP update.
- Verify mastery update.
- Verify review generation.
- Verify notes.
- Verify bookmark.
- Verify admin permissions.
- Publish a test lesson.
- Verify learner visibility.
- Verify unauthorized access is blocked.
- Verify mobile layout.
- Verify error tracking.
- Verify logs contain no secrets.
- Verify database backup process.
- Verify rollback instructions.

## 74. LAUNCH CHECKLIST

Create a machine-readable and human-readable launch checklist.

Categories:

Product

- All essential flows complete
- No dead buttons
- No placeholder pages
- No fake completion states
- No broken links
- Helpful empty states
- Helpful errors

Curriculum

- Minimum lesson count complete
- Minimum mission count complete
- Code validated
- Tests validated
- Hints complete
- Solutions complete
- Skill mappings complete
- Prerequisites valid

Security

- Authorization reviewed
- Rate limits active
- Secrets protected
- Security headers active
- Dependency audit reviewed
- Code sandbox reviewed
- Threat model complete

Data

- Migrations complete
- Seed complete
- Backups configured
- Restore tested
- Constraints validated

Quality

- Tests passing
- Type checks passing
- Lint passing
- Build passing
- Accessibility reviewed
- Responsive layouts reviewed
- Performance reviewed

Operations

- Railway deployed
- Domain configured or temporary domain documented
- Health checks active
- Logging active
- Error tracking active
- Rollback documented
- Owner access verified

Do not mark launch ready while any critical item remains incomplete.

## 75. DEFINITION OF DONE

A feature is done only when:

- Functional code exists
- Server validation exists
- Authorization exists where needed
- Loading state exists
- Empty state exists
- Error state exists
- Success state exists
- Mobile state works
- Accessibility is considered
- Tests exist
- Documentation is updated
- No known critical bug remains

A screen is not done merely because it renders.

A lesson is not done merely because it has text.

A mission is not done merely because it has an answer field.

A deployment is not done merely because Railway shows a green build.

## 76. PROHIBITED SHORTCUTS

Do not:

- Build only a landing page and dashboard
- Use fake progress values
- Store progress only in browser storage
- Calculate XP only on the client
- Expose hidden answers
- Expose hidden tests
- Use public registration without controls
- Run arbitrary server shell commands
- Run arbitrary learner code in the app server
- Put all content in one giant JSON file
- Put all business logic in server actions
- Disable strict TypeScript
- Ignore failed tests
- Skip database migrations
- Use production credentials in seed files
- Create default passwords
- Leave admin routes protected only by hidden navigation
- Claim a feature works without manually testing it
- Add empty future worlds just to make the application look larger
- Add AI as a substitute for a real curriculum engine
- Generate hundreds of low-quality lessons automatically

## 77. DEVELOPMENT ORDER

Build in this order.

### Phase 0: Discovery and planning

Before writing major implementation code:

- Inspect repository
- Create architecture plan
- Create data model proposal
- Create route map
- Create permission matrix
- Create threat model outline
- Create curriculum content model
- Create launch milestone plan
- Identify risks
- Record architectural decisions

Commit the plan.

### Phase 1: Foundation

Build:

- Next.js application
- TypeScript configuration
- Styling system
- Database
- Prisma
- Authentication
- Roles
- Authorization
- Application shell
- Error handling
- Logging
- Environment validation
- CI

### Phase 2: Curriculum engine

Build:

- Worlds
- Modules
- Lessons
- Skills
- Content blocks
- Prerequisites
- Drafts
- Publishing
- Admin editor
- Curriculum validation

### Phase 3: Learning progress

Build:

- Lesson progress
- Mission attempts
- XP
- Levels
- Mastery
- Review scheduling
- Streaks
- Achievements
- Activity tracking

### Phase 4: Interactive missions

Build:

- Code editor
- Safe client-side execution
- Test runner
- Hint system
- Feedback system
- Code-reading missions
- Debugging missions
- Terminal simulator
- Git simulator

### Phase 5: Learner experience

Build:

- Dashboard
- World map
- Lesson viewer
- Practice
- Review
- Progress
- Notes
- Bookmarks
- Saved code
- Search
- Settings

### Phase 6: Launch curriculum

Write and validate:

- 30 lessons
- 100 missions
- Projects
- Boss challenges
- Review content
- Debugging scenarios
- Terminal scenarios

### Phase 7: Production hardening

Complete:

- Security review
- Accessibility review
- Responsive review
- Performance work
- Full tests
- Backups
- Railway deployment
- Documentation
- Launch checklist

## 78. WORKING METHOD

Work autonomously, but keep the repository continuously runnable.

For each phase:

- Create or update an issue or implementation plan.
- Implement a small coherent slice.
- Add or update tests.
- Run lint.
- Run type checks.
- Run tests.
- Run production build.
- Review the diff.
- Commit with a clear message.
- Continue.

Do not create one enormous unreviewable commit.

Do not rewrite working architecture repeatedly without cause.

When you find an important architectural problem, fix it properly and document the decision.

## 79. REQUIRED PROGRESS FILES

Maintain these files throughout implementation:

- PROJECT_STATUS.md
- LAUNCH_CHECKLIST.md
- KNOWN_ISSUES.md
- DECISIONS.md
- CHANGELOG.md

PROJECT_STATUS.md must show:

- Current phase
- Completed features
- Current work
- Blockers
- Remaining launch requirements
- Test status
- Deployment status

Do not mark items complete unless verified.

## 80. REQUIRED FINAL HANDOFF

At completion, provide:

- Production Railway URL
- GitHub repository
- Owner login bootstrap instructions
- Architecture summary
- Database diagram
- Permission matrix
- Curriculum summary
- Test report
- Security review summary
- Known limitations
- Backup instructions
- Restore instructions
- Deployment instructions
- Rollback instructions
- Admin curriculum instructions
- Monthly maintenance checklist
- Dependency update procedure
- Estimated recurring service costs based on actual configured services
- List of deferred post-launch features

Also create an in-app owner guide.

## 81. MONTHLY MAINTENANCE GUIDE

Document monthly checks:

- Database backup verification
- Restore test schedule
- Dependency updates
- Security advisories
- Error logs
- Failed login activity
- Railway usage
- Database usage
- AI usage and cost
- Slow queries
- Broken curriculum content
- User feedback
- Test suite health
- Domain and certificate status

## 82. POST-LAUNCH FEATURES

Do not delay launch for these unless required for architecture:

- Full GitHub App repository import
- General server-side code execution
- Multiple programming languages
- Public subscriptions
- Payment processing
- Native mobile app
- Live instructor marketplace
- Multiplayer coding
- Public leaderboards
- Social profiles
- Team accounts
- Enterprise organizations

Document extension points for these features.

## 83. FIRST ACTIONS

Start now with these exact actions:

1. Inspect the current repository.
2. If the repository is empty, initialize the application.
3. Create PROJECT_STATUS.md.
4. Create LAUNCH_CHECKLIST.md.
5. Create DECISIONS.md.
6. Create the architecture documents.
7. Propose the database schema.
8. Propose the route structure.
9. Propose the permission matrix.
10. Propose the curriculum data format.
11. Propose the secure code-execution design.
12. Create the implementation phases as GitHub issues or local planning documents.
13. Then begin Phase 1 implementation.

Do not stop after producing the plan.

Continue implementing the project phase by phase.

At the end of every meaningful implementation batch, run:

```
npm run lint
npm run typecheck
npm test
npm run build
```

Use the actual package scripts created in the repository if the command names differ.

Fix errors before continuing.

## 84. FINAL STANDARD

The final application must be something I can open every day and genuinely learn from.

It must teach me to:

- Read unfamiliar code
- Explain what code does
- Follow data through files
- Understand errors
- Debug systematically
- Write features
- Use Git safely
- Understand databases
- Understand APIs
- Understand frontend and backend relationships
- Deploy projects
- Review AI-generated code instead of blindly trusting it

The application should eventually reduce my dependence on Claude Code.

Build it with that goal in mind.

Start now.

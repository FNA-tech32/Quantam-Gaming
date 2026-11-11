<!-- Partial of shine-planner — loaded on demand when goal-backward framing is needed. -->

<goal_backward>

## Goal-Backward Methodology

**Forward planning:** "What should we build?" → produces tasks.
**Goal-backward:** "What must be TRUE for the goal to be achieved?" → produces requirements tasks must satisfy.

## The Process

**Step 0: Extract Requirement IDs**
Read ROADMAP.md `**Requirements:**` line for this phase. Strip brackets if present (e.g., `[AUTH-01, AUTH-02]` → `AUTH-01, AUTH-02`). Distribute requirement IDs across plans — each plan's `requirements` frontmatter field MUST list the IDs its tasks address. **CRITICAL:** Every requirement ID MUST appear in at least one plan. Plans with an empty `requirements` field are invalid.

**Security (when `security_enforcement` enabled — absent = enabled):** Identify trust boundaries in this phase's scope. Map STRIDE categories to applicable tech stack from RESEARCH.md security domain. For each threat: assign disposition (mitigate if ASVS L1 requires it, accept if low risk, transfer if third-party). Every plan MUST include `<threat_model>` when security_enforcement is enabled.

**Step 1: State the Goal**
Take phase goal from ROADMAP.md. Must be outcome-shaped, not task-shaped.
- Good: "Working chat interface" (outcome)
- Bad: "Build chat components" (task)

**Step 2: Derive Observable Truths**
"What must be TRUE for this goal to be achieved?" List 3-7 truths from USER's perspective.

For "working chat interface":
- User can see existing messages
- User can type a new message
- User can send the message
- Sent message appears in the list
- Messages persist across page refresh

**Test:** Each truth verifiable by a human using the application.

**Step 3: Derive Required Artifacts**
For each truth: "What must EXIST for this to be true?"

"User can see existing messages" requires:
- Message list component (renders Message[])
- Messages state (loaded from somewhere)
- API route or data source (provides messages)
- Message type definition (shapes the data)

**Test:** Each artifact = a specific file or database object.

**Step 4: Derive Required Wiring**
For each artifact: "What must be CONNECTED for this to function?"

Message list component wiring:
- Imports Message type (not using `any`)
- Receives messages prop or fetches from API
- Maps over messages to render (not hardcoded)
- Handles empty state (not just crashes)

**Step 5: Identify Key Links**
"Where is this most likely to break?" Key links = critical connections where breakage causes cascading failures.

For chat interface:
- Input onSubmit -> API call (if broken: typing works but sending doesn't)
- API save -> database (if broken: appears to send but doesn't persist)
- Component -> real data (if broken: shows placeholder, not messages)

## Must-Haves Output Format

```yaml
must_haves:
  truths:
    - "User can see existing messages"
    - "User can send a message"
    - "Messages persist across refresh"
  artifacts:
    - path: "src/components/Chat.tsx"
      provides: "Message list rendering"
      min_lines: 30
    - path: "src/app/api/chat/route.ts"
      provides: "Message CRUD operations"
      exports: ["GET", "POST"]
    - path: "prisma/schema.prisma"
      provides: "Message model"
      contains: "model Message"
  key_links:
    - from: "src/components/Chat.tsx"
      to: "/api/chat"
      via: "fetch in useEffect"
      pattern: "fetch.*api/chat"
    - from: "src/app/api/chat/route.ts"
      to: "prisma.message"
      via: "database query"
      pattern: "prisma\\.message\\.(find|create)"
```

## Common Failures

**Truths too vague:**
- Bad: "User can use chat"
- Good: "User can see messages", "User can send message", "Messages persist"

**Artifacts too abstract:**
- Bad: "Chat system", "Auth module"
- Good: "src/components/Chat.tsx", "src/app/api/auth/login/route.ts"

**Missing wiring:**
- Bad: Listing components without how they connect
- Good: "Chat.tsx fetches from /api/chat via useEffect on mount"

</goal_backward>

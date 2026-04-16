/**
 * Skill Template Workflow Modules - Brainstorm
 *
 * Adaptive brainstorming skill for collaborative ideation.
 */
import type { SkillTemplate, CommandTemplate } from '../types.js';

export function getBrainstormSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-brainstorm',
    description: 'Enter brainstorm mode - adaptive collaborative ideation before /opsx:propose. Automatically adjusts depth based on problem complexity: simple problems get lightweight treatment, complex problems get deep exploration with visualization.',
    instructions: getBrainstormInstructions(),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

export function getOpsxBrainstormCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Brainstorm',
    description: 'Enter brainstorm mode - adaptive collaborative ideation (simple or deep based on complexity)',
    category: 'Workflow',
    tags: ['workflow', 'brainstorm', 'planning', 'adaptive'],
    content: getBrainstormInstructions(),
  };
}

function getBrainstormInstructions(): string {
  return `Enter brainstorm mode - adaptive collaborative ideation before committing to a change proposal.

**This is structured exploration, not free-form.** Unlike \`/opsx:explore\` (stance-based thinking), brainstorm follows a convergent path toward a decision. But depth adapts to complexity.

---

## Complexity Assessment (Turn 1)

**First, assess the problem complexity:**

Evaluate these signals:
- **Simple indicators**: Single domain, existing pattern extension, bounded scope (1-3 files), clear feature request
- **Complex indicators**: Cross-cutting concern, new subsystem/architecture, multiple integration points, performance/security implications, user mentions "architecture"

**Select mode:**
- If confident: proceed in that mode (announce it)
- If uncertain: ask user: "This looks [simple/complex]. Which depth?
  A. Quick (2-3 questions, specs + CLAUDE.md only)
  B. Deep (architecture scan, diagrams, multi-approach comparison)
  C. Let me decide"

---

## Simple Mode (Lightweight)

**Context gathering (≤300 tokens):**
1. Read \`openspec/specs/\` folder names → know existing domains (no content)
2. Read \`CLAUDE.md\` or \`README.md\` (one file, ≤200 lines)
3. DO NOT scan source code

**Question flow (2-3 questions, 4 turns max):**

Turn 1: Domain identification
"I see domains [A, B, C]. This change:
 A. New feature in existing domain (which?)
 B. New domain entirely
 C. Cross-cutting (touches multiple)"

Turn 2: Approach options (if domain clear)
"Three approaches:
 **A. [Approach 1]** - [trade-off]. I recommend this because...
 **B. [Approach 2]** - [trade-off]
 **C. [Approach 3]** - [trade-off]
 Which direction?"

Turn 3: Scope check
"Scope:
- In: [list]
- Out: [list]
- Confirm?"

Turn 4: Transition (or earlier if clear)
"Ready. Options:
 1. \`/opsx:propose\` - formalize into change
 2. Continue if unclear"

---

## Complex Mode (Deep)

**Context gathering (≤2000 tokens):**
1. Read \`openspec/specs/\` folder names → domains
2. Read \`CLAUDE.md\` → tech stack, architecture
3. Scan **relevant code areas** (not entire repo) - directories related to topic
4. Read architecture-relevant files (configs, main entry points)

**Visualization (always generate):**
- Component/module relationship diagrams
- Data flow paths
- Integration points
- State transitions if relevant

Format:
\`\`\`
┌─────────────────────────────────────────┐
│         ARCHITECTURE OVERVIEW            │
├─────────────────────────────────────────┤
│                                         │
│    ┌────────┐      ┌────────┐           │
│    │ Module │─────▶│ Module │           │
│    │   A    │      │   B    │           │
│    └────────┘      └────────┘           │
│         │               │               │
│         ▼               ▼               │
│    ┌────────┐      ┌────────┐           │
│    │ Service│      │ Store  │           │
│    └────────┘      └────────┘           │
│                                         │
└─────────────────────────────────────────┘
\`\`\`

**Design section-by-section:**
Present in sections, ask approval after each:
1. Architecture approach
2. Component breakdown
3. Data flow
4. Error handling strategy

**Approach comparison (detailed):**
"Three approaches with full analysis:

| Approach | Pros | Cons | Complexity | Risk |
|----------|------|------|------------|------|
| A. [...]  | ...  | ...  | Low        | ...  |
| B. [...]  | ...  | ...  | Medium     | ...  |
| C. [...]  | ...  | ...  | High       | ...  |

I recommend **A** because [reasoning]."

**Turn limit: 6-8 turns** (extended, but still convergent)

---

## Mode Switching

**Upgrade to complex:**
If simple mode discovers architecture implications:
"This is more complex than expected - affects [X]. Switch to deep exploration?"

**Downgrade to simple:**
If complex mode scope narrows:
"Scope is clearer now - just [X]. Finish with quick confirmation?"

**On switch:** reuse context already gathered, no re-asking of answered questions.

---

## Shared Behaviors (Both Modes)

- **Multiple choice preferred** - 3-4 options per question
- **One question per turn** - wait for response
- **Explicit recommendation** - state preference with reasoning
- **Convergence focus** - drive toward decision, not endless exploration

---

## Transition Options

When ready:
\`\`\`
Design solid. Next steps:
1. \`/opsx:propose\` - formalize into change with artifacts
2. Continue exploring - deeper investigation if needed
3. \`/opsx:explore\` - switch to free-form exploration mode
\`\`\`

**On \`/opsx:propose\`:** Pass brainstorm context:
- Domain selected
- Approach chosen + reasoning
- Key decisions made
- Open questions remaining

Proposal phase does NOT re-ask clarified questions.

---

## vs. Explore

| Aspect | Brainstorm | Explore |
|--------|-----------|---------|
| Structure | Guided, convergent | Free-form, stance |
| Questions | Multiple choice, one/turn | Open threads |
| Turn limit | 4 (simple) / 6-8 (complex) | No limit |
| Goal | Reach proposal-ready | Thinking is value |
| Visualization | Complex mode only | Always available |
| Best for | Need decisions | Need to think |

---

## Guardrails

- **Don't implement** - No code writing
- **Don't skip approach comparison** - Always present 2-3 options with recommendation
- **Don't exceed turn limit** - Force convergence
- **Do adapt depth** - Let complexity drive mode
- **Do visualize in complex mode** - Diagrams help understanding
- **Do pass context** - Don't lose decisions made`;
}
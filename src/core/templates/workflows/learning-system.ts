/**
 * Learning System - Instinct-Based Knowledge Retention
 *
 * Captures patterns from sessions and evolves them into skills.
 */
import path from 'path';
import type { SkillTemplate } from '../types.js';

// Instinct JSON Schema
export interface Instinct {
  id: string;
  trigger: string;
  action: string;
  confidence: number; // 0.3 = tentative, 0.5 = moderate, 0.7 = strong, 0.9 = near-certain
  domain: string; // code-style, testing, git, debugging, workflow, security, tooling
  evidence: string[];
  created_at: string;
  updated_at: string;
}

export const INSTINCT_DOMAINS = [
  'code-style',
  'testing',
  'git',
  'debugging',
  'workflow',
  'security',
  'tooling',
];

export const CONFIDENCE_LEVELS = {
  TENTATIVE: 0.3,
  MODERATE: 0.5,
  STRONG: 0.7,
  NEAR_CERTAIN: 0.9,
};

// Storage paths
export const USER_INSTINCTS_DIR = '.openspec/instincts';
export const PROJECT_INSTINCTS_DIR = 'openspec/instincts';

/**
 * Get user-level instincts directory path
 */
export function getUserInstinctsPath(): string {
  const homeDir = process.env.HOME || process.env.USERPROFILE || '';
  return path.join(homeDir, USER_INSTINCTS_DIR);
}

/**
 * Get project-level instincts directory path
 */
export function getProjectInstinctsPath(projectRoot: string): string {
  return path.join(projectRoot, PROJECT_INSTINCTS_DIR);
}

export function getInstinctSchemaDescription(): string {
  return `Instinct JSON Schema:

{
  "id": "prefer-functional-style",
  "trigger": "when writing new functions",
  "action": "Use functional patterns over classes when appropriate",
  "confidence": 0.7,
  "domain": "code-style",
  "evidence": [
    "Observed 5 instances of functional pattern preference",
    "User corrected class-based approach on 2026-01-15"
  ],
  "created_at": "2026-03-22T10:00:00Z",
  "updated_at": "2026-03-22T12:00:00Z"
}

Properties:
- **id**: Unique identifier (kebab-case)
- **trigger**: When this instinct applies
- **action**: What behavior to take
- **confidence**: 0.3-0.9 score (see levels below)
- **domain**: Category for grouping
- **evidence**: List of observations supporting this instinct
- **created_at/updated_at**: ISO timestamps

Confidence Levels:
- 0.3 (Tentative): Suggested but not enforced
- 0.5 (Moderate): Applied when relevant
- 0.7 (Strong): Auto-approved for application
- 0.9 (Near-certain): Core behavior

Storage Locations:
- User-level: ~/.openspec/instincts/<id>.json (cross-project patterns)
- Project-level: openspec/instincts/<id>.json (project-specific patterns)`;
}

export function getLearnSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-learn',
    description: 'Extract patterns from current session or archived change into instincts. Use `--change <name>` to extract from archived change.',
    instructions: getLearnInstructions(),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

export function getEvolveSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-evolve',
    description: 'Promote high-confidence instincts into skills. Use when instincts reach confidence >= 0.7 and form coherent patterns.',
    instructions: getEvolveInstructions(),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

export function getInstinctStatusSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-instinct-status',
    description: 'Display all instincts with their confidence scores grouped by domain. Use to review what has been learned.',
    instructions: getInstinctStatusInstructions(),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

function getLearnInstructions(): string {
  return `Extract patterns from the current session into instincts.

## When to Use

After a session demonstrates:
- User corrections that redirect your approach
- Error resolutions that worked after failure
- Repeated workflows the user follows consistently
- Patterns worth remembering for future sessions

## The Learning Process

\`\`\`
Session Activity
      |
      v
+-------------------------+
|  Pattern Detection      |
|  - User corrections     |
|  - Error resolutions    |
|  - Repeated workflows   |
+----------+--------------+
           |
           v
+-------------------------+
|  Instinct Creation      |
|  - trigger: when applies|
|  - action: what to do   |
|  - confidence: 0.3      |
|  - evidence: why        |
+----------+--------------+
           |
           v
  Save to ~/.openspec/instincts/<id>.json
\`\`\`

## Pattern Types to Detect

1. **User Corrections**
   - User said "No, use X instead" → creates instinct
   - User corrected output format → creates instinct
   - User rejected approach → creates instinct

2. **Error Resolutions**
   - Build failed, fix worked → creates instinct
   - Test failed, resolution worked → creates instinct

3. **Repeated Workflows**
   - User always asks X before Y → creates instinct
   - User prefers certain tools → creates instinct

## Instinct Creation Format

For each pattern detected:

\`\`\`json
{
  "id": "use-ripgrep-not-grep",
  "trigger": "when searching code",
  "action": "Use Grep tool (ripgrep) instead of grep command",
  "confidence": 0.3,
  "domain": "tooling",
  "evidence": [
    "User corrected grep command usage on 2026-04-16"
  ],
  "created_at": "2026-04-16T...",
  "updated_at": "2026-04-16T..."
}
\`\`\`

## Confidence Initialization

New instincts start at:
- **0.3 (Tentative)**: First observation
- Higher if user explicitly stated preference

## Storage Location

\`\`\`
~/.openspec/instincts/           # User-level (cross-project patterns)
  +-- <instinct-id>.json         # Individual instinct files
  +-- index.json                 # Registry with confidence scores

openspec/instincts/              # Project-level (project-specific patterns)
  +-- <instinct-id>.json         # Project-specific instincts
  +-- index.json                 # Project registry
\`\`\`

## Destination Selection

| Pattern | Destination |
|---------|-------------|
| Tooling preference (e.g., ripgrep) | User-level |
| Code style (e.g., functional) | User-level |
| Project architecture | Project-level |
| Domain-specific decisions | Project-level |

Use \`--change <name>\` option to extract from archived change (stores to project-level).

## Important Notes

- Only capture patterns, not code or conversation content
- Evidence describes what happened, not the actual text
- Start low confidence, increase with reinforcement
- Multiple related instincts may evolve into a skill`;
}

function getEvolveInstructions(): string {
  return `Promote high-confidence instincts into skills.

## When to Use

When:
- Instincts reach confidence >= 0.7
- Multiple instincts in same domain form coherent pattern
- Pattern is generalizable across projects

## The Evolution Process

\`\`\`
Instincts (atomic behaviors)
      |
      | cluster by domain + relatedness
      v
Clusters (3+ related instincts with confidence >= 0.7)
      |
      | evolve into one of:
      v
+-- Skills    (SKILL.md format)
+-- Commands  (slash commands)
+-- Agents    (agent definitions)
\`\`\`

## Evolution Candidates

Look for:
1. **Domain clusters**: 3+ instincts in same domain
2. **High confidence**: All >= 0.7
3. **Coherent pattern**: Instincts form logical group

Example cluster:
\`\`\`
Domain: testing
- instinct: "write-tests-first" (0.7)
- instinct: "prefer-table-driven-tests" (0.8)
- instinct: "always-run-tests-before-commit" (0.9)

→ Evolves into skill: openspec-test-driven-development
\`\`\`

## Evolution Output Types

| Type | When | Output |
|------|------|--------|
| **Skill** | Process pattern | SKILL.md in skills/ |
| **Command** | Repeated workflow | Slash command |
| **Agent** | Specialist behavior | Agent definition |

## Evolution Steps

1. **Cluster instincts**: Group by domain and relatedness
2. **Identify pattern**: Extract common theme
3. **Draft artifact**: Create skill/command/agent draft
4. **User approval**: Confirm evolution
5. **Archive instincts**: Move source instincts to archive

## Draft Skill Format

\`\`\`markdown
---
name: openspec-<skill-name>
description: <when to use>
---

# <Skill Name>

<instructions derived from instinct cluster>
\`\`\`

## Important Notes

- Evolution requires user approval
- Source instincts archived (not deleted)
- Evolved artifacts are reusable across projects
- Confidence threshold ensures quality`;
}

function getInstinctStatusInstructions(): string {
  return `Display all instincts with confidence scores grouped by domain.

## Usage

\`\`\`
/opsx:instinct-status           # Show both user and project instincts
/opsx:instinct-status --user    # Show only user-level instincts
/opsx:instinct-status --project # Show only project-level instincts
\`\`\`

## Output Format

\`\`\`
## Instinct Status

### User-Level (~/.openspec/instincts/)

**code-style** (3 instincts)
- prefer-functional-style: 0.7 (strong)
- use-explicit-names: 0.5 (moderate)
- avoid-magic-numbers: 0.3 (tentative)

### Project-Level (openspec/instincts/)

**workflow** (2 instincts)
- decision-arch-pattern: 0.3 (tentative)
- impl-module-structure: 0.3 (tentative)

### Summary

- User instincts: 6
- Project instincts: 2
- Strong (>= 0.7): 3
- Evolution candidates: 2 clusters
\`\`\`

## Confidence Levels

| Score | Label | Behavior |
|-------|-------|----------|
| 0.9 | near-certain | Core behavior |
| 0.7 | strong | Auto-approved |
| 0.5 | moderate | Applied when relevant |
| 0.3 | tentative | Suggested only |

## Reading Instincts

Load from both locations:
1. \`~/.openspec/instincts/\` (user-level)
2. \`openspec/instincts/\` (project-level, if exists)
3. Read all JSON files in each directory
4. Group by domain
5. Sort by confidence (descending)
6. Identify evolution candidates

## Empty State

If no instincts exist:
\`\`\`
## Instinct Status

No instincts stored yet.

Use \`/opsx:learn\` after sessions to capture patterns.
\`\`\``;
}

export function getLearningSystemSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-learning-system',
    description: 'Overview of the instinct-based learning system. Explains how patterns become instincts and instincts become skills.',
    instructions: getLearningSystemInstructions(),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

function getLearningSystemInstructions(): string {
  return `Instinct-based learning system for cross-session knowledge retention.

## Overview

The learning system captures patterns from sessions and evolves them into reusable knowledge.

\`\`\`
Session → Pattern Detection → Instinct → Reinforcement → Skill
\`\`\`

## Key Concepts

**Instinct**: Atomic learned behavior
- Trigger: When it applies
- Action: What to do
- Confidence: How certain (0.3-0.9)
- Evidence: Why we learned it

**Evolution**: Instincts become skills when:
- Confidence >= 0.7
- Multiple instincts form coherent cluster
- Pattern generalizes across projects

## Commands

| Command | Purpose |
|---------|---------|
| \`/opsx:learn\` | Extract patterns from session |
| \`/opsx:evolve\` | Promote instincts to skills |
| \`/opsx:instinct-status\` | View all instincts |

## Storage

\`\`\`
~/.openspec/                    # User-level (cross-project)
  +-- instincts/
  |   +-- <id>.json             # Individual instincts
  |   +-- index.json            # Registry
  +-- skills/
  |   +-- evolved/              # Skills from evolution

openspec/                       # Project-level (project-specific)
  +-- instincts/
  |   +-- <id>.json             # Project-specific instincts
  |   +-- index.json            # Project registry
\`\`\`

## Storage Destinations

| Pattern Type | Location | Reason |
|--------------|----------|--------|
| Tool preferences | ~/.openspec/instincts/ | Cross-project |
| Code style | ~/.openspec/instincts/ | Cross-project |
| Project architecture | openspec/instincts/ | Project-specific |
| Domain decisions | openspec/instincts/ | Project-specific |

## Confidence Evolution

\`\`\`
0.3 (tentative) → First observation
0.5 (moderate)  → Repeated across sessions
0.7 (strong)    → User confirmed or no corrections
0.9 (near-certain) → Core behavior, always applies
\`\`\`

## Privacy

- Only patterns stored, not code or conversations
- Evidence describes observations, not content
- User controls what gets exported
- All data stays local`;
}

// ========== Storage Helper Functions ==========

/**
 * Create a new instinct with initial values
 */
export function createInstinct(
  id: string,
  trigger: string,
  action: string,
  domain: string,
  evidence: string[]
): Instinct {
  const now = new Date().toISOString();
  return {
    id,
    trigger,
    action,
    confidence: CONFIDENCE_LEVELS.TENTATIVE,
    domain,
    evidence,
    created_at: now,
    updated_at: now,
  };
}

/**
 * Boost confidence of an existing instinct
 */
export function boostConfidence(instinct: Instinct, additionalEvidence: string[]): Instinct {
  const newConfidence = Math.min(instinct.confidence + 0.1, CONFIDENCE_LEVELS.NEAR_CERTAIN);
  return {
    ...instinct,
    confidence: newConfidence,
    evidence: [...instinct.evidence, ...additionalEvidence],
    updated_at: new Date().toISOString(),
  };
}

/**
 * Determine if pattern should be stored at project-level
 */
export function shouldStoreAtProjectLevel(domain: string, patternContext: string): boolean {
  // Project-specific domains
  const projectDomains = ['workflow'];
  // Patterns mentioning project-specific concepts
  const projectIndicators = ['architecture', 'design decision', 'project', 'change'];

  if (projectDomains.includes(domain)) return true;
  if (projectIndicators.some(ind => patternContext.toLowerCase().includes(ind))) return true;

  return false;
}

/**
 * Get confidence label for display
 */
export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.9) return 'near-certain';
  if (confidence >= 0.7) return 'strong';
  if (confidence >= 0.5) return 'moderate';
  return 'tentative';
}
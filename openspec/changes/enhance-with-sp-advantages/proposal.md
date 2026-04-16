## Why

Users report that OpenSpec lacks the "brainstorming feel" of Superpowers - the planning phase feels shallow, without deep exploration of alternatives. Meanwhile, Superpowers' brainstorming is powerful but token-inefficient, often scanning entire repositories before asking questions.

This change proposes two enhancements to combine the best of both: deep thinking without token waste.

## What Changes

### New Feature: `/opsx:brainstorm` Skill

A lightweight brainstorming skill that:
- Uses existing `openspec/specs/` as knowledge base (no full repo scan)
- Asks focused, multiple-choice questions (max 4 turns)
- Proposes 2-3 approaches with explicit recommendation
- Transitions to `/opsx:propose` when ready

### Enhanced: Existing Artifacts with SP-inspired Patterns

Strengthen the current workflow with SP's proven patterns:
- **Two-stage review**: spec compliance → code quality (optional mode for `/opsx:apply`)
- **Verification iron law**: reinforce `/opsx:verify` with SP's "evidence before claims" discipline
- **Learning system**: optional instincts mechanism for cross-session pattern capture

## Capabilities

### New Capabilities

- `brainstorm-skill`: A new skill for collaborative ideation before `/opsx:propose`, designed for token efficiency

### Modified Capabilities

- `apply-workflow`: Add optional two-stage review mode (spec reviewer → code quality reviewer)
- `verify-workflow`: Strengthen verification prompts with SP's iron law patterns
- `learning-system`: (Optional) Add instinct-based learning for cross-session knowledge retention

## Impact

- New file: `skills/brainstorm/SKILL.md` (or equivalent skill format)
- Modified: `schemas/spec-driven/schema.yaml` (apply instruction enhancement)
- Modified: verification-related prompts/docs
- Optional new directory: `~/.openspec/instincts/` for learning system (if implemented)

## Two Implementation Options

### Option A: Lightweight Integration

Focus on `/opsx:brainstorm` + strengthened `/opsx:verify`. No learning system.

**Pros**: Simple, minimal changes, immediate value
**Cons**: No cross-session learning

### Option B: Full Enhancement

Include learning system (instincts) + two-stage review + brainstorm.

**Pros**: Complete feature set, long-term knowledge accumulation
**Cons**: More complex, requires state storage mechanism

**Recommendation**: Start with Option A, validate with users, then add learning system if demand exists.
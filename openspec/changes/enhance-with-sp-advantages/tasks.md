# Tasks

## 1. Brainstorm Skill Core Infrastructure

- [x] 1.1 Create `skills/brainstorm/SKILL.md` with adaptive complexity design
- [x] 1.2 Add `/opsx:brainstorm` command entry in CLI
- [x] 1.3 Implement complexity assessment logic (analyze topic description)
- [x] 1.4 Implement mode selection (AI-driven + user-choice fallback)
- [x] 1.5 Add transition-to-propose handoff with context passing
- [x] 1.6 Add transition-to-explore handoff (mode switching support)

## 2. Simple Mode Implementation

- [x] 2.1 Implement specs-folder-as-knowledge-base (read folder names only)
- [x] 2.2 Implement CLAUDE.md/README.md reader (one file, ≤200 lines)
- [x] 2.3 Implement multiple-choice question helper (3-4 options per question)
- [x] 2.4 Add 2-3 question flow for domain/approach/scope
- [x] 2.5 Implement approach comparison with recommendation
- [x] 2.6 Add 4-turn convergence tracking for simple mode

## 3. Complex Mode Implementation

- [x] 3.1 Implement focused code area scanner (topic-relevant directories)
- [x] 3.2 Implement architecture visualization generator (ASCII diagrams)
- [x] 3.3 Add component relationship diagramming
- [x] 3.4 Add data flow path diagramming
- [x] 3.5 Implement deep approach comparison (trade-offs, risks, complexity)
- [x] 3.6 Add design section presentation (architecture, components, data flow, errors)
- [x] 3.7 Implement section-by-section approval flow
- [x] 3.8 Add 6-8 turn limit tracking for complex mode

## 4. Mode Switching Support

- [x] 4.1 Implement upgrade-to-complex detection (complexity signals emerge)
- [x] 4.2 Implement downgrade-to-simple detection (scope narrows)
- [x] 4.3 Add mid-session mode switch prompt
- [x] 4.4 Implement context reuse on mode switch (no re-asking)

## 5. Verify Skill Enhancement (Iron Law)

- [x] 5.1 Update `schemas/spec-driven/schema.yaml` apply instruction with iron law requirements
- [x] 5.2 Add "Iron Law Compliance" section to verification report template
- [x] 5.3 Implement weasel word detection in verification logic
- [x] 5.4 Add red-green cycle verification for regression tests
- [x] 5.5 Update `openspec/specs/opsx-verify-skill/spec.md` after archive

## 6. Documentation

- [x] 6.1 Update `docs/workflows.md` to include brainstorm workflow (both modes)
- [x] 6.2 Add brainstorm usage examples in `docs/commands.md` (simple + complex scenarios)
- [x] 6.3 Document adaptive complexity assessment in `docs/concepts.md`
- [x] 6.4 Document iron law verification in `docs/concepts.md`
- [x] 6.5 Add comparison table: `/opsx:brainstorm` vs `/opsx:explore`
- [x] 6.6 Update README.md to mention enhanced adaptive planning experience

## 7. Testing

- [x] 7.1 Add unit tests for complexity assessment signals
- [x] 7.2 Test simple mode token budget enforcement
- [x] 7.3 Test complex mode visualization generation
- [x] 7.4 Test mode switching mid-session
- [x] 7.5 Test context passing to `/opsx:propose`
- [x] 7.6 Test iron law detection (weasel words, partial verification)
- [x] 7.7 Cross-platform test for any new file path operations

## 8. Phase 2 (Optional - Two-Stage Review)

- [x] 8.1 Add `--two-stage` flag option to schema config
- [x] 8.2 Create spec-reviewer subagent prompt template
- [x] 8.3 Create code-quality-reviewer subagent prompt template
- [x] 8.4 Implement review loop mechanism (max 3 iterations)
- [x] 8.5 Document two-stage review usage

## 9. Phase 3 (Optional - Learning System)

- [x] 9.1 Design instinct storage structure at `~/.openspec/instincts/`
- [x] 9.2 Implement instinct JSON schema (id, trigger, action, confidence, domain)
- [x] 9.3 Create `/opsx:learn` command for pattern extraction
- [x] 9.4 Create `/opsx:evolve` command for instinct-to-skill promotion
- [x] 9.5 Implement confidence scoring algorithm
- [x] 9.6 Add instinct status display command
- [ ] 9.7 Document learning system in docs
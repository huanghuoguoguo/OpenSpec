# brainstorm-skill Specification

## Purpose
Define `/opsx:brainstorm` behavior for **adaptive** collaborative ideation - automatically adjusting depth based on problem complexity, combining lightweight efficiency with deep exploration when needed.

## Requirements

### Requirement: Brainstorm Skill Invocation
The system SHALL provide an `/opsx:brainstorm` skill for adaptive collaborative idea exploration.

#### Scenario: User invokes brainstorm with topic
- **WHEN** agent executes `/opsx:brainstorm <topic>`
- **THEN** the agent initiates adaptive complexity assessment
- **AND** determines whether simple or complex mode is appropriate

#### Scenario: User invokes brainstorm without topic
- **WHEN** agent executes `/opsx:brainstorm` without arguments
- **THEN** the agent asks "What would you like to explore?"
- **AND** waits for user input before complexity assessment

### Requirement: Adaptive Complexity Assessment
The agent SHALL assess problem complexity and select appropriate exploration mode.

#### Scenario: AI-driven complexity assessment
- **WHEN** user provides topic description
- **THEN** agent evaluates complexity signals:
  - Single domain vs cross-cutting
  - Existing patterns available vs new architecture needed
  - Clear endpoints vs systemic change
- **AND** selects mode automatically if confident
- **AND** asks user if uncertain

#### Scenario: User-driven mode selection
- **WHEN** agent offers mode choice
- **THEN** agent presents:
  ```
  This request seems [simple/complex]. Which exploration depth?
  A. Quick (2-3 questions, specs + CLAUDE.md only)
  B. Deep (full architecture scan, visual diagrams, multi-approach comparison)
  C. Let you decide
  ```
- **AND** respects user's choice

#### Scenario: Complexity signals for simple
- **WHEN** any of these apply:
  - Single domain modification (e.g., "add logout button")
  - Existing component/pattern to extend
  - Clear, bounded scope (1-3 files likely)
- **THEN** default to simple mode
- **AND** uses lightweight context gathering

#### Scenario: Complexity signals for complex
- **WHEN** any of these apply:
  - Cross-cutting concern (auth, logging, theming)
  - New subsystem or architecture pattern
  - Multiple integration points
  - Performance/security implications
  - User explicitly mentions architecture
- **THEN** default to complex mode
- **AND** enables deep exploration capabilities

### Requirement: Simple Mode - Lightweight Exploration
Simple mode SHALL use token-efficient context gathering with limited file reads.

#### Scenario: Simple mode context gathering
- **WHEN** simple mode activated
- **THEN** agent reads `openspec/specs/` folder names only (domains)
- **AND** reads `CLAUDE.md` or `README.md` (one file, ≤200 lines)
- **AND** does NOT scan source code directories
- **AND** consumes ≤300 tokens for context gathering

#### Scenario: Simple mode question flow
- **WHEN** context gathered in simple mode
- **THEN** agent asks 2-3 focused multiple-choice questions
- **AND** questions cover: domain, approach options, scope boundaries
- **AND** each question has 3-4 options (A/B/C/D)
- **AND** ONE question per message, waits for response

#### Scenario: Simple mode approach comparison
- **WHEN** intent clarified
- **THEN** agent presents 2-3 approaches with brief trade-offs
- **AND** states explicit recommendation with reasoning
- **AND** format: "**A. [Approach]** - [pro/cons]. I recommend A because..."
- **AND** consumes ≤200 tokens for approaches

#### Scenario: Simple mode convergence
- **WHEN** 2-3 questions answered
- **THEN** agent summarizes understanding
- **AND** offers transition to `/opsx:propose`
- **AND** max 4 turns total

### Requirement: Complex Mode - Deep Exploration
Complex mode SHALL enable comprehensive architecture exploration with visualization.

#### Scenario: Complex mode context gathering
- **WHEN** complex mode activated
- **THEN** agent scans relevant code areas (not entire repo)
- **AND** focuses on directories related to topic
- **AND** reads architecture-relevant files (configs, main entry points)
- **AND** may read 3-5 files for context
- **AND** token budget: ≤2000 for exploration phase

#### Scenario: Complex mode architecture visualization
- **WHEN** architecture understanding needed
- **THEN** agent produces ASCII diagrams showing:
  - Component/module relationships
  - Data flow paths
  - Integration points
  - State transitions if relevant
- **AND** diagrams help user see "the whole picture"

#### Scenario: Complex mode approach comparison
- **WHEN** architecture mapped
- **THEN** agent presents 2-3 approaches with:
  - Full trade-off analysis (pros, cons, risks)
  - Implementation complexity estimate
  - Impact on existing patterns
- **AND** states explicit recommendation with reasoning
- **AND** may create comparison table

#### Scenario: Complex mode design sections
- **WHEN** approach selected
- **THEN** agent presents design in sections:
  - Architecture approach
  - Component breakdown
  - Data flow
  - Error handling strategy
- **AND** asks for approval after each section
- **AND** allows iteration on sections before proceeding

#### Scenario: Complex mode transition options
- **WHEN** design sections approved
- **THEN** agent offers:
  ```
  Design solid. Next steps:
  1. `/opsx:propose` - formalize into change artifacts
  2. Continue exploring - deeper investigation if needed
  3. `/opsx:explore` - switch to free-form exploration mode
  ```
- **AND** respects user choice

#### Scenario: Complex mode turn limit relaxed
- **WHEN** complex mode active
- **THEN** turn limit extended to 6-8 turns
- **AND** agent still drives toward convergence
- **AND** warns if approaching limit without clarity

### Requirement: Shared Behaviors Across Modes
Both modes SHALL share core brainstorm behaviors.

#### Scenario: Multiple choice preference
- **WHEN** asking any question
- **THEN** agent prefers multiple choice format
- **AND** options are specific, not vague
- **AND** reduces token consumption vs open-ended

#### Scenario: One question per turn
- **WHEN** in dialogue phase
- **THEN** agent asks ONE question per message
- **AND** waits for user response
- **AND** no multi-question dumps

#### Scenario: Explicit recommendation
- **WHEN** presenting options
- **THEN** agent always states recommendation
- **AND** provides reasoning
- **AND** does NOT remain neutral

#### Scenario: User mentions specific file
- **WHEN** user references specific file in dialogue
- **THEN** agent may read that file
- **AND** context for next question includes file insights
- **AND** respects mode's file read limits

### Requirement: Mode Switching
The agent SHALL allow switching between modes mid-session.

#### Scenario: Upgrade to complex
- **WHEN** simple mode active and complexity emerges
- **THEN** agent may suggest: "This looks more complex than expected. Switch to deep exploration?"
- **AND** user confirms or declines

#### Scenario: Downgrade to simple
- **WHEN** complex mode active and scope narrows
- **THEN** agent may suggest: "Scope is clearer now. Finish with quick confirmation?"
- **AND** user confirms or declines

#### Scenario: Mid-session mode switch
- **WHEN** mode switched
- **THEN** turn count resets partially
- **AND** context already gathered is reused
- **AND** no re-asking of answered questions

### Requirement: Transition to Proposal
The agent SHALL offer smooth transition to `/opsx:propose` in both modes.

#### Scenario: Pass context to proposal
- **WHEN** user selects `/opsx:propose`
- **THEN** agent invokes `/opsx:propose <name>`
- **AND** passes brainstorm summary as context:
  - Domain selected
  - Approach chosen with reasoning
  - Key decisions made
  - Open questions remaining
- **AND** proposal phase does NOT re-ask clarified questions

#### Scenario: Transition to explore
- **WHEN** user selects `/opsx:explore`
- **THEN** agent switches to explore mode
- **AND** maintains brainstorm context
- **AND** explore continues free-form investigation

### Requirement: Optional Entry Point
The brainstorm skill SHALL be optional, not mandatory.

#### Scenario: Skip brainstorm entirely
- **WHEN** user invokes `/opsx:propose` directly
- **THEN** agent proceeds without brainstorm
- **AND** does NOT require brainstorm first

#### Scenario: Brainstorm for unclear requirements
- **WHEN** user unsure about requirements
- **THEN** `/opsx:brainstorm` provides structured exploration
- **AND** helps clarify before committing to proposal

#### Scenario: Relationship with explore
- **WHEN** user wants free-form thinking
- **THEN** `/opsx:explore` is available (stance-based, no structure)
- **WHEN** user wants guided thinking
- **THEN** `/opsx:brainstorm` is available (structured, convergent)
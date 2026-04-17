## ADDED Requirements

### Requirement: OPSX Learn Skill

The system SHALL provide an `/opsx:learn` skill that extracts patterns from sessions or changes into instincts.

#### Scenario: Learn from session context

- **WHEN** agent executes `/opsx:learn` without change context
- **THEN** agent extracts patterns from current session
- **AND** stores instincts at user-level `~/.openspec/instincts/`

#### Scenario: Learn from change context

- **WHEN** agent executes `/opsx:learn` with change context (from archive)
- **THEN** agent extracts patterns from change documents
- **AND** stores project-level instincts at `openspec/instincts/`

### Requirement: Dual storage destination

The learn skill SHALL support both user-level and project-level instinct storage.

#### Scenario: User-level storage for general patterns

- **WHEN** pattern applies across projects (e.g., tooling preferences)
- **THEN** instinct stored at `~/.openspec/instincts/<id>.json`

#### Scenario: Project-level storage for project-specific patterns

- **WHEN** pattern is specific to current project (e.g., architecture decisions)
- **THEN** instinct stored at `openspec/instincts/<id>.json`

### Requirement: Change context parameter

The learn skill SHALL accept optional change context parameter.

#### Scenario: Learn with change name

- **WHEN** learn is called with change name parameter
- **THEN** agent reads archived change documents
- **AND** extracts patterns specific to that change

#### Scenario: Learn without change name

- **WHEN** learn is called without parameters
- **THEN** agent uses current session context for pattern extraction
## ADDED Requirements

### Requirement: Extract patterns from change documents

The system SHALL extract patterns from completed change documents (design.md, tasks.md).

#### Scenario: Pattern extraction from design

- **WHEN** learn extracts patterns from a change
- **AND** design.md exists in the change
- **THEN** system parses design decisions section
- **AND** creates instincts for architectural patterns

#### Scenario: Pattern extraction from tasks

- **WHEN** learn extracts patterns from a change
- **AND** tasks.md exists in the change
- **THEN** system parses completed task descriptions
- **AND** creates instincts for implementation patterns

### Requirement: Pattern classification by domain

Extracted patterns SHALL be classified by domain (code-style, testing, workflow, etc.).

#### Scenario: Domain classification

- **WHEN** pattern is extracted from change
- **THEN** system assigns domain based on pattern content
- **AND** domain matches one of: code-style, testing, git, debugging, workflow, security, tooling

### Requirement: Initial confidence scoring

Newly extracted patterns SHALL start with appropriate confidence score.

#### Scenario: Tentative confidence for new patterns

- **WHEN** pattern is first extracted from change
- **THEN** confidence starts at 0.3 (tentative)
- **AND** evidence includes change name and extraction date

#### Scenario: Higher confidence for repeated patterns

- **WHEN** extracted pattern matches existing instinct
- **THEN** confidence increases by 0.1
- **AND** evidence is appended to existing instinct
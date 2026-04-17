## ADDED Requirements

### Requirement: Project-level instinct storage location

The system SHALL support project-level instinct storage at `openspec/instincts/` directory.

#### Scenario: Project instincts directory creation

- **WHEN** project-level learn is executed
- **AND** `openspec/instincts/` directory does not exist
- **THEN** system creates the directory using `fs.mkdir` with `recursive: true`

#### Scenario: Project instinct file storage

- **WHEN** a project-level instinct is captured
- **THEN** system stores it at `openspec/instincts/<instinct-id>.json`
- **AND** file uses same JSON schema as user-level instincts

### Requirement: Project instincts separate from user instincts

Project-level instincts SHALL be stored separately from user-level instincts in `~/.openspec/instincts/`.

#### Scenario: Dual storage locations

- **WHEN** learn detects project-level patterns
- **THEN** project instincts go to `openspec/instincts/`
- **AND** general/user-level instincts go to `~/.openspec/instincts/`

#### Scenario: Project instincts portable with project

- **WHEN** project directory is copied or moved
- **THEN** `openspec/instincts/` directory moves with project
- **AND** project-level patterns remain accessible

### Requirement: Instinct index for project

The system SHALL maintain an index file for project-level instincts.

#### Scenario: Project instinct index

- **WHEN** project instincts are stored
- **THEN** system maintains `openspec/instincts/index.json`
- **AND** index contains list of instinct IDs with confidence scores
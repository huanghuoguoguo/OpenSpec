## MODIFIED Requirements

### Requirement: OPSX Archive Skill

The system SHALL provide an `/opsx:archive` skill that archives completed changes in the experimental workflow.

#### Scenario: Archive a change with all artifacts complete

- **WHEN** agent executes `/opsx:archive` with a change name
- **AND** all artifacts in the schema are complete
- **AND** all tasks are complete
- **THEN** the agent moves the change to `openspec/changes/archive/YYYY-MM-DD-<name>/`
- **AND** displays success message with archived location
- **AND** prompts user to run learn for pattern capture

#### Scenario: Change selection prompt

- **WHEN** agent executes `/opsx:archive` without specifying a change
- **THEN** the agent prompts user to select from available changes
- **AND** shows only active changes (excludes archive/)

#### Scenario: Learn prompt after archive

- **WHEN** archive completes successfully
- **THEN** agent displays: "Archive complete. Would you like to capture patterns from this change?"
- **AND** if user confirms, agent executes learn logic with change context
- **AND** if user declines, agent displays final summary only

### Requirement: Skill Output

The skill SHALL provide clear feedback about the archive operation.

#### Scenario: Archive complete with learn executed

- **WHEN** archive completes and user accepts learn prompt
- **THEN** display summary:
  - Change archived to location
  - Patterns captured (count of new/updated instincts)
  - Schema that was used

#### Scenario: Archive complete without learn

- **WHEN** archive completes and user declines learn prompt
- **THEN** display summary:
  - Change archived to location
  - Schema that was used
  - Note: "Patterns not captured. Run `/opsx:learn` manually if needed."
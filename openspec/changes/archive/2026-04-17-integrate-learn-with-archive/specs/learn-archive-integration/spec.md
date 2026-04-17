## ADDED Requirements

### Requirement: Archive triggers learn prompt

The archive process SHALL prompt the user to run learn after successful archive completion.

#### Scenario: Archive complete with learn prompt

- **WHEN** archive completes successfully
- **AND** change has been moved to archive directory
- **THEN** system displays prompt: "Would you like to capture patterns from this change? [Y/n]"
- **AND** if user accepts, triggers learn with change context

#### Scenario: User declines learn

- **WHEN** user declines learn prompt
- **THEN** system displays archive summary only
- **AND** learn is not triggered

### Requirement: Learn receives change context

When learn is triggered from archive, it SHALL receive the archived change context for pattern extraction.

#### Scenario: Learn with change context

- **WHEN** learn is triggered from archive
- **THEN** learn process receives change name and archive path
- **AND** pattern extraction prioritizes change-specific patterns

### Requirement: Non-blocking learn integration

The learn prompt SHALL be non-blocking to the archive completion.

#### Scenario: Learn failure does not affect archive

- **WHEN** learn is triggered from archive
- **AND** learn process fails or user cancels
- **THEN** archive remains complete and valid
- **AND** error is logged but not thrown
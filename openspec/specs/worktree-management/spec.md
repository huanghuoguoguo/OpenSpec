## ADDED Requirements

### Requirement: Worktree creation

The system SHALL provide ability to create git worktrees for change isolation.

#### Scenario: Create worktree for change

- **WHEN** user executes worktree create for a change
- **AND** git version >= 2.5 is available
- **THEN** system creates worktree at `.worktrees/openspec-<change>-<hash>/`
- **AND** creates branch `<change>-wip`
- **AND** worktree is checked out to that branch

#### Scenario: Worktree creation fails

- **WHEN** git version < 2.5
- **THEN** system displays error: "Git worktree requires git >= 2.5"
- **AND** suggests using git branch manually

#### Scenario: Duplicate worktree name

- **WHEN** worktree with same name already exists
- **THEN** system displays error listing existing worktree
- **AND** suggests using different change name or cleaning existing

### Requirement: Worktree listing

The system SHALL provide ability to list all OpenSpec-managed worktrees.

#### Scenario: List worktrees

- **WHEN** user requests worktree list
- **THEN** system displays all worktrees in `.worktrees/` directory
- **AND** shows change name, branch, and status (active/stale)

#### Scenario: No worktrees exist

- **WHEN** user requests worktree list
- **AND** no OpenSpec worktrees exist
- **THEN** system displays: "No OpenSpec worktrees found"

### Requirement: Worktree merge

The system SHALL provide ability to merge worktree changes back to main directory.

#### Scenario: Merge without conflicts

- **WHEN** user requests worktree merge
- **AND** no conflicts between worktree branch and main branch
- **THEN** system merges worktree branch to main
- **AND** displays success message
- **AND** optionally cleans worktree

#### Scenario: Merge with conflicts

- **WHEN** user requests worktree merge
- **AND** conflicts exist
- **THEN** system displays list of conflicting files
- **AND** prompts user to resolve conflicts
- **AND** waits for user confirmation before proceeding

#### Scenario: Merge abandoned

- **WHEN** user chooses to abandon merge
- **THEN** system resets merge state
- **AND** preserves worktree for later retry

### Requirement: Worktree cleanup

The system SHALL provide ability to remove worktrees.

#### Scenario: Clean specific worktree

- **WHEN** user requests worktree clean for specific change
- **THEN** system removes worktree directory
- **AND** optionally deletes associated branch

#### Scenario: Clean all worktrees

- **WHEN** user requests worktree clean with `--all` flag
- **THEN** system removes all OpenSpec worktrees
- **AND** displays count of removed worktrees

#### Scenario: Clean worktree with unmerged changes

- **WHEN** user requests clean
- **AND** worktree has uncommitted/unmerged changes
- **THEN** system warns about potential data loss
- **AND** prompts for confirmation
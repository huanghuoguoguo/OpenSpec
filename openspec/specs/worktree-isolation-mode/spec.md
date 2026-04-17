## ADDED Requirements

### Requirement: Apply with worktree isolation

The `/opsx:apply` skill SHALL support optional worktree isolation mode.

#### Scenario: Apply with --worktree flag

- **WHEN** user executes `/opsx:apply --worktree`
- **THEN** system creates worktree for the change
- **AND** dispatches agent with isolation: "worktree"
- **AND** agent executes tasks in isolated environment

#### Scenario: Apply without --worktree

- **WHEN** user executes `/opsx:apply` without --worktree
- **THEN** system executes tasks in main working directory
- **AND** no worktree is created

### Requirement: Agent isolation integration

When using worktree isolation, the agent SHALL execute in the worktree environment.

#### Scenario: Agent receives worktree context

- **WHEN** agent is dispatched with worktree isolation
- **THEN** agent receives worktree path as working directory
- **AND** agent reads change artifacts from worktree location
- **AND** agent writes implementation to worktree location

#### Scenario: Agent commits in worktree

- **WHEN** agent completes tasks in worktree
- **THEN** agent commits changes to worktree branch
- **AND** commits reference change name in message

### Requirement: Post-apply merge prompt

After apply with worktree, the system SHALL prompt for merge.

#### Scenario: Apply complete, prompt merge

- **WHEN** apply completes in worktree mode
- **THEN** system displays: "Implementation complete in worktree. Merge to main?"
- **AND** if user confirms, system merges worktree branch
- **AND** if user declines, system preserves worktree for later

#### Scenario: Automatic merge with --merge flag

- **WHEN** user executes `/opsx:apply --worktree --merge`
- **THEN** system automatically merges after implementation
- **AND** cleans worktree after successful merge

### Requirement: Worktree path handling

All path operations SHALL use path.join() for cross-platform compatibility.

#### Scenario: Windows path compatibility

- **WHEN** creating worktree on Windows
- **THEN** paths use backslash separators via path.join()
- **AND** worktree location is valid Windows path

#### Scenario: POSIX path compatibility

- **WHEN** creating worktree on Linux/macOS
- **THEN** paths use forward slash separators via path.join()
- **AND** worktree location is valid POSIX path
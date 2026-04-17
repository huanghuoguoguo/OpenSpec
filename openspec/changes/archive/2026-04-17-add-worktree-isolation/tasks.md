# Tasks

## 1. Core Worktree Manager

- [x] 1.1 Create `src/core/worktree.ts` module
- [x] 1.2 Implement `WorktreeManager` class with create/list/merge/clean methods
- [x] 1.3 Add worktree naming logic (`openspec-<change>-<hash>`)
- [x] 1.4 Implement branch creation (`<change>-wip`)
- [x] 1.5 Add git version check (>= 2.5 required)
- [x] 1.6 Implement worktree path resolution using path.join()

## 2. CLI Commands

- [x] 2.1 Add `openspec worktree` command group to CLI
- [x] 2.2 Implement `openspec worktree create <change>`
- [x] 2.3 Implement `openspec worktree list`
- [x] 2.4 Implement `openspec worktree merge <change>`
- [x] 2.5 Implement `openspec worktree clean <change>` with `--all` option
- [x] 2.6 Add shell completions for worktree commands

## 3. Apply Integration

- [x] 3.1 Add `--worktree` flag to `/opsx:apply` skill
- [x] 3.2 Add `--merge` flag for automatic merge after apply
- [x] 3.3 Implement agent dispatch with isolation: "worktree"
- [x] 3.4 Add post-apply merge prompt
- [x] 3.5 Handle merge conflicts with user prompts

## 4. Error Handling

- [x] 4.1 Handle git version < 2.5 with graceful error
- [x] 4.2 Handle duplicate worktree names
- [x] 4.3 Handle merge conflicts with file list display
- [x] 4.4 Handle uncommitted changes warning on clean
- [x] 4.5 Handle worktree creation failures (permissions, disk space)

## 5. Documentation

- [x] 5.1 Add worktree commands to `docs/cli.md`
- [x] 5.2 Add worktree workflow to `docs/workflows.md`
- [x] 5.3 Add worktree isolation examples to `docs/commands.md`
- [x] 5.4 Update README with parallel development section

## 6. Testing

- [x] 6.1 Add unit tests for WorktreeManager
- [x] 6.2 Add tests for worktree creation and cleanup
- [x] 6.3 Add tests for merge conflict handling
- [x] 6.4 Add cross-platform path tests
- [x] 6.5 Add integration tests for apply --worktree flow
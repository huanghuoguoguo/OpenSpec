## Why

当前并行开发多个 change 时存在冲突风险：
- 多个 change 同时修改同一文件会导致互相覆盖
- Agent 在同一工作目录执行任务，无法隔离
- 用户需要手动管理分支或等待 change 完成

Claude Code 的 Agent 工具支持 `isolation: "worktree"` 参数，可以在独立 git worktree 中运行 agent。OpenSpec 应该利用这个能力，为每个 change 提供隔离的工作环境。

## What Changes

### New Feature: Worktree Isolation Mode

为 `/opsx:apply` 添加 worktree isolation 支持：
- 创建独立 git worktree 用于 change 实现
- Agent 在 worktree 中执行任务
- 完成后合并回主工作目录或清理

### New Commands

- `/opsx:worktree-create <change>` — 为 change 创建 worktree
- `/opsx:worktree-list` — 列出所有 worktrees
- `/opsx:worktree-merge <change>` — 合并 worktree 回主目录
- `/opsx:worktree-clean <change>` — 清理 worktree

### Enhanced: `/opsx:apply` with `--worktree` flag

可选地在 worktree 中执行实现：
```text
/opsx:apply --worktree
```

## Capabilities

### New Capabilities

- `worktree-management`: 创建、列出、合并、清理 git worktrees
- `worktree-isolation-mode`: 在隔离环境中执行 change 实现

### Modified Capabilities

- `opsx-apply-skill`: 支持 `--worktree` 选项

## Impact

- New file: `src/core/worktree.ts` — worktree 管理逻辑
- Modified: `src/core/templates/workflows/apply-change.ts` — 添加 worktree 支持
- New specs: `openspec/specs/worktree-management/spec.md`
- CLI commands: `openspec worktree create/list/merge/clean`
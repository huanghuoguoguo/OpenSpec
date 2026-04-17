## Why

当前 `/opsx:archive` 和 `/opsx:learn` 是独立命令，但执行阶段相似——都是"收尾/总结"。用户需要手动执行两个命令，容易遗漏学习步骤，导致有价值的项目模式未被捕获。

Superpowers 的 learn 系统在会话结束时自动提取模式（instinct），而 OpenSpec 的 archive 在变更完成时归档。两者结合可提供更完整的收尾体验：归档变更内容的同时，捕获项目级别的实现模式。

## What Changes

- 在 `/opsx:archive` 流程中集成 `/opsx:learn` 触发点
- 增加项目级 instinct 存储位置（区别于用户级 ~/.openspec/instincts）
- 实现 change 完成后自动提取与该变更相关的模式
- 提供用户确认选项，避免强制执行

## Capabilities

### New Capabilities

- `learn-archive-integration`: archive 流程中触发 learn 的集成机制
- `project-instinct-storage`: 项目级 instinct 存储（位于 openspec/instincts/）
- `change-pattern-extraction`: 从已完成的变更中提取模式

### Modified Capabilities

- `opsx-archive-skill`: 增加学习触发点，更新归档后的输出提示
- `opsx-learn-skill`: 支持项目级 instinct 存储和 change 上下文

## Impact

- `src/core/archive.ts`: 增加学习触发逻辑
- `src/core/templates/workflows/learning-system.ts`: 支持项目级存储
- `openspec/specs/opsx-archive-skill/spec.md`: 更新行为规格
- `openspec/specs/opsx-learn-skill/spec.md`: 新增或更新（如不存在）
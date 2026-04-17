## Context

Git worktree 允许在同一仓库中创建多个工作目录，每个目录可以检出不同的分支。这解决了并行开发时的文件冲突问题。

Claude Code 的 Agent 工具已支持 `isolation: "worktree"`：
```typescript
Agent({
  description: "...",
  prompt: "...",
  isolation: "worktree"  // 创建临时 worktree
})
```

当前 OpenSpec 的 apply 流程在主工作目录执行，多个并行 change 会互相干扰。

## Goals / Non-Goals

**Goals:**
- 为每个 change 提供可选的隔离工作环境
- 支持手动和自动 worktree 管理
- 合并 worktree 回主目录时处理冲突
- 与现有 change 流程无缝集成

**Non-Goals:**
- 不强制所有 change 使用 worktree（可选特性）
- 不替代 git branch 管理（worktree 是辅助工具）
- 不自动解决所有合并冲突（提供工具，用户决策）

## Decisions

### D1: Worktree 命名规则

**选择**: `openspec-<change-name>-<short-hash>`

**理由**:
- 包含 change 名称，易于识别
- short-hash 防止同名冲突
- 前缀 `openspec-` 标识来源

**示例**: `openspec-add-auth-a1b2c3`

### D2: Worktree 存储位置

**选择**: 在仓库根目录的 `.worktrees/` 子目录

**理由**:
- 与主仓库同目录，便于管理
- 集中存放，易于批量清理
- 不污染用户的其他目录

**路径**: `/path/to/repo/.worktrees/openspec-<change>-<hash>/`

### D3: 分支策略

**选择**: 每个 worktree 创建独立分支 `<change-name>-wip`

**理由**:
- 分支记录 change 的所有提交
- 合并时通过 git merge 处理
- 便于追踪和回滚

**流程**:
```
主分支 (main)
    │
    ├── worktree 创建
    │   └── 创建分支: add-auth-wip
    │   └── 检出 worktree
    │
    ├── agent 在 worktree 中实现
    │   └── 提交到 add-auth-wip
    │
    └── 合合并回 main
    │   └── git merge add-auth-wip
    │   └── 清理 worktree
```

### D4: 与 `/opsx:apply` 集成

**选择**: `--worktree` 标志触发隔离模式

**理由**:
- 可选特性，不改变默认行为
- 用户按需选择隔离
- 简单易用

**用法**:
```text
/opsx:apply                    # 默认：主目录执行
/opsx:apply --worktree         # 创建 worktree 执行
/opsx:apply add-auth --worktree  # 指定 change + worktree
```

### D5: 冲突处理

**选择**: 使用 git merge，遇到冲突时暂停并提示用户

**理由**:
- git merge 是标准工具
- 冲突标记清晰
- 用户有控制权

**流程**:
```
合并时检测冲突
    │
    ├── 有冲突
    │   └── 显示冲突文件列表
    │   └── 提示用户解决
    │   └── 等待用户确认
    │
    ├── 无冲突
    │   └── 自动合并
    │   └── 清理 worktree
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Worktree 创建失败 | 检查 git 版本 >= 2.5，提供降级方案 |
| 合并冲突阻塞流程 | 提供冲突文件列表，用户可选择放弃合并 |
| Worktree 残留占用空间 | 提供 `/opsx:worktree-clean` 批量清理 |
| 多 worktree 并行耗资源 | 建议限制并行数量，默认最多 3 个 |

## Implementation Phases

### Phase 1: Core Worktree Management

1. 实现 `WorktreeManager` 类
2. CLI 命令: `openspec worktree create/list/merge/clean`
3. 基础测试

### Phase 2: Apply Integration

1. 添加 `--worktree` 标志到 apply
2. Agent 调用时使用 isolation: "worktree"
3. 合并流程

### Phase 3: Documentation & Polish

1. 更新 docs/commands.md
2. 更新 docs/workflows.md
3. 添加使用示例
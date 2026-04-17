## Context

当前状态：
- `/opsx:archive` 在变更完成后归档到 `openspec/changes/archive/`
- `/opsx:learn` 提取会话模式到用户级 `~/.openspec/instincts/`
- 两者独立运行，用户需手动执行两步

约束：
- 学习系统已在 `learning-system.ts` 中定义
- Archive 流程在 `archive.ts` 中实现
- 需支持用户确认（非强制执行）

## Goals / Non-Goals

**Goals:**
- archive 完成后提示/触发 learn
- 支持项目级 instinct 存储（模式与特定项目相关）
- 从 change 内容提取项目级模式

**Non-Goals:**
- 不改变现有用户级 instinct 存储
- 不自动执行 learn（需用户确认）
- 不修改 learn 的核心提取逻辑

## Decisions

### D1: 集成方式 — 软集成（提示而非自动）

**选择**: archive 完成后显示提示，用户选择是否执行 learn

**理由**:
- 用户可能有不想记录的模式
- 会话级 vs 项目级模式来源不同
- 保持用户控制权

**替代方案**:
- 硬集成（自动执行）: 可能捕获用户不想记录的内容

### D2: 项目级 Instinct 存储位置

**选择**: `openspec/instincts/<id>.json`

**理由**:
- 与用户级分离（`~/.openspec/instincts/`）
- 项目特定模式随项目移动
- 符合 OpenSpec 的项目目录结构

### D3: 模式提取来源

**选择**: 从 change 的 tasks.md 和 design.md 提取模式

**理由**:
- change 文档记录了实现决策
- design.md 包含架构选择
- tasks.md 包含执行步骤和发现

### D4: Learn 调用时机

**选择**: archive 完成后、显示成功消息之前

**理由**:
- 用户已确认归档
- change 内容完整可用
- 最后一步，不阻塞主流程

## Risks / Trade-offs

- **模式提取准确性**: 自动提取可能不准确 → 提供用户审核/修改选项
- **项目级与用户级冲突**: 两者可能重叠 → 项目级优先级更高（项目内适用）
- **遗漏重要模式**: 仅从 change 文档提取 → 支持手动补充
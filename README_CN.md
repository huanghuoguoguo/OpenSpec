<p align="center">
  <a href="https://github.com/Fission-AI/OpenSpec">
    <picture>
      <source srcset="assets/openspec_bg.png">
      <img src="assets/openspec_bg.png" alt="OpenSpec logo">
    </picture>
  </a>
</p>

<p align="center">
  <a href="https://github.com/Fission-AI/OpenSpec/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/Fission-AI/OpenSpec/actions/workflows/ci.yml/badge.svg" /></a>
  <a href="https://www.npmjs.com/package/@fission-ai/openspec"><img alt="npm version" src="https://img.shields.io/npm/v/@fission-ai/openspec?style=flat-square" /></a>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
</p>

> **[Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) 的分支版本** —
> 基础项目详情请参阅 [原版 README](https://github.com/Fission-AI/OpenSpec/blob/main/README.md)。

---

## 本分支版本

受 [Superpowers](https://github.com/anthropics/superpowers) 启发，增强了 OpenSpec 的功能：

### 新增特性

| 特性 | 描述 |
|------|------|
| **自适应头脑风暴** | `/opsx:brainstorm` 根据问题复杂度自动选择深度 |
| **铁律验证** | `/opsx:verify` 强制执行"先证据后声明"原则 |
| **学习系统** | `/opsx:learn` 跨会话捕获模式 |

### 设计哲学

```
→ 快速 + 准确 + 节省 Token
→ 自适应复杂度（简单问题用简单模式）
→ 跨会话知识保留
```

---

## 快速开始

```text
# 1. 先头脑风暴（自适应深度）
/opsx:brainstorm 添加认证系统

# 2. 准备好后发起提案
/opsx:propose 添加认证系统

# 3. 实施
/opsx:apply

# 4. 验证（强制执行铁律）
/opsx:verify

# 5. 归档
/opsx:archive
```

### 头脑风暴模式

根据复杂度信号自动选择：

| 简单 | 复杂 |
|------|------|
| 2-3 个问题 | 架构扫描 + 图表 |
| 约 300 tokens | 约 2000 tokens |
| 最多 4 轮 | 6-8 轮，逐节进行 |

```text
# 简单问题
你: /opsx:brainstorm 添加登出按钮
AI: 简单模式（单个组件）。
    三种方案：A（页眉）、B（设置）、C（两者）。
    推荐：A。选择哪个方向？

# 复杂问题
你: /opsx:brainstorm 添加认证系统
AI: 复杂模式（跨切面）。

    ┌───────────────────────┐
    │       架构图           │
    │   API → Session Store  │
    └───────────────────────┘

    | 方案 | 优点 | 缺点 |
    | JWT  | 无状态 | Token 管理 |
    | Session | 简单 | 服务端状态 |

    推荐：JWT（你的 API 是无状态的）。
```

### 铁律验证

验证必须展示证据，而非模糊声明：

```text
✓ 合规
  证据: test_auth.py:45 通过
  运行: pytest auth/tests/ -v

✗ 不合规
  证据: 未找到测试
  行动: 需运行测试并提供结果
```

禁止使用模棱两可的措辞："看起来"、"应该"、"部分完成"。

### 学习系统

跨会话捕获模式：

```text
# 会话结束后
/opsx:learn

# 查看学习成果
/opsx:instinct-status

## Instinct 状态

**code-style**（2 条本能）
- prefer-functional: 0.7（强）
- avoid-magic-numbers: 0.3（初步）

**testing**（1 条本能）
- write-tests-first: 0.9（接近确定）

# 将高置信度模式提升为技能
/opsx:evolve
```

---

## 文档

→ **[命令参考](docs/commands.md)**：完整斜杠命令参考<br>
→ **[核心概念](docs/concepts.md)**：整体运作原理<br>
→ **[工作流程](docs/workflows.md)**：常见使用模式

---

<details>
<summary><strong>原版 OpenSpec 信息</strong></summary>

<p></p>
原版设计哲学：

```text
→ 流动而非僵化
→ 迭代而非瀑布
→ 简单而非复杂
→ 为棕地项目而非仅绿地项目构建
→ 可从个人项目扩展到企业级
```

### 团队协作

在团队中使用 OpenSpec？[发送邮件](mailto:teams@openspec.dev) 获取 Slack 频道访问权限。

### 实际演示

```text
你: /opsx:propose 添加深色模式
AI: 已创建 openspec/changes/add-dark-mode/
    ✓ proposal.md — 为什么做、改什么
    ✓ specs/       — 需求和场景
    ✓ design.md    — 技术方案
    ✓ tasks.md     — 实现清单
    准备开始实施！

你: /opsx:apply
AI: 正在实施任务...
    ✓ 1.1 添加主题上下文提供者
    ✓ 1.2 创建切换组件
    ✓ 2.1 添加 CSS 变量
    ✓ 2.2 连接 localStorage
    所有任务完成！

你: /opsx:archive
AI: 已归档到 openspec/changes/archive/2025-01-23-add-dark-mode/
    规格已更新。准备下一个功能。
```

<details>
<summary><strong>OpenSpec 控制面板</strong></summary>

<p align="center">
  <img src="assets/openspec_dashboard.png" alt="OpenSpec 控制面板预览" width="90%">
</p>

</details>

### 为什么选择 OpenSpec？

AI 编码助手功能强大，但当需求仅存在于聊天记录中时，行为难以预测。OpenSpec 添加了轻量级规范层，让你在编写任何代码之前就达成共识。

- **先达成共识再构建** — 人和 AI 在代码编写前对齐规范
- **保持有序** — 每个变更都有自己的文件夹，包含提案、规范、设计和任务
- **流畅工作** — 随时更新任何文档，无僵化的阶段门槛
- **使用你的工具** — 通过斜杠命令支持 20+ AI 助手

### 安装

**需要 Node.js 20.19.0 或更高版本。**

```bash
npm install -g @fission-ai/openspec@latest
cd your-project
openspec init
```

### 更新

```bash
npm install -g @fission-ai/openspec@latest
openspec update
```

### 贡献

贡献指南请参阅 [原版 README](https://github.com/Fission-AI/OpenSpec/blob/main/README.md)。

</details>

---

## 许可证

MIT
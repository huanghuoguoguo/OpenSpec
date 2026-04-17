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

> **Fork of [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)** — 
> See [original README](https://github.com/Fission-AI/OpenSpec/blob/main/README.md) for base project details.

---

## This Fork

Enhanced OpenSpec with features inspired by [Superpowers](https://github.com/anthropics/superpowers):

### What's New

| Feature | Description |
|---------|-------------|
| **Adaptive Brainstorm** | `/opsx:brainstorm` auto-selects depth based on problem complexity |
| **Iron Law Verification** | `/opsx:verify` enforces "evidence before claims" |
| **Learning System** | `/opsx:learn` captures patterns across sessions |

### Design Philosophy

```
→ fast + accurate + token-efficient
→ adaptive complexity (simple mode for simple problems)
→ cross-session knowledge retention
```

---

## Quick Start

```text
# 1. Brainstorm first (adaptive depth)
/opsx:brainstorm add authentication system

# 2. Propose when ready
/opsx:propose add-auth-system

# 3. Implement
/opsx:apply

# 4. Verify (iron law enforced)
/opsx:verify

# 5. Archive
/opsx:archive
```

### Brainstorm Modes

Auto-selected based on complexity signals:

| Simple | Complex |
|--------|---------|
| 2-3 questions | Architecture scan + diagrams |
| ~300 tokens | ~2000 tokens |
| 4 turns max | 6-8 turns, section-by-section |

```text
# Simple problem
You: /opsx:brainstorm add logout button
AI:  Simple mode (single component).
     Three approaches: A (header), B (settings), C (both).
     Recommend: A. Which direction?

# Complex problem  
You: /opsx:brainstorm add authentication
AI:  Complex mode (cross-cutting).
     
     ┌───────────────────────┐
     │    ARCHITECTURE        │
     │  API → Session Store   │
     └───────────────────────┘
     
     | Approach | Pros | Cons |
     | JWT      | Stateless | Token mgmt |
     | Session  | Simple | Server state |
     
     Recommend: JWT (your API is stateless).
```

### Iron Law Verification

Verification must show evidence, not vague claims:

```text
✓ COMPLIANT
  Evidence: test_auth.py:45 PASSED
  Run: pytest auth/tests/ -v

✗ NON-COMPLIANT
  Evidence: 未找到测试
  Action: 需运行测试并提供结果
```

No weasel words allowed: "看起来"、"应该"、"部分完成"。

### Learning System

Patterns captured across sessions:

```text
# After session
/opsx:learn

# Review learning
/opsx:instinct-status

## Instinct Status

**code-style** (2 instincts)
- prefer-functional: 0.7 (strong)
- avoid-magic-numbers: 0.3 (tentative)

**testing** (1 instinct)
- write-tests-first: 0.9 (near-certain)

# Promote high-confidence patterns to skills
/opsx:evolve
```

---

## Docs

→ **[Commands](docs/commands.md)**: full slash command reference<br>
→ **[Concepts](docs/concepts.md)**: how it all fits together<br>
→ **[Workflows](docs/workflows.md)**: common patterns

---

<details>
<summary><strong>Original OpenSpec Info</strong></summary>

<p></p>
Original philosophy:

```text
→ fluid not rigid
→ iterative not waterfall
→ easy not complex
→ built for brownfield not just greenfield
→ scalable from personal projects to enterprises
```

### Teams

Using OpenSpec in a team? [Email here](mailto:teams@openspec.dev) for access to our Slack channel.

### See it in action

```text
You: /opsx:propose add-dark-mode
AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!

You: /opsx:apply
AI:  Implementing tasks...
     ✓ 1.1 Add theme context provider
     ✓ 1.2 Create toggle component
     ✓ 2.1 Add CSS variables
     ✓ 2.2 Wire up localStorage
     All tasks complete!

You: /opsx:archive
AI:  Archived to openspec/changes/archive/2025-01-23-add-dark-mode/
     Specs updated. Ready for the next feature.
```

<details>
<summary><strong>OpenSpec Dashboard</strong></summary>

<p align="center">
  <img src="assets/openspec_dashboard.png" alt="OpenSpec dashboard preview" width="90%">
</p>

</details>

### Why OpenSpec?

AI coding assistants are powerful but unpredictable when requirements live only in chat history. OpenSpec adds a lightweight spec layer so you agree on what to build before any code is written.

- **Agree before you build** — human and AI align on specs before code gets written
- **Stay organized** — each change gets its own folder with proposal, specs, design, and tasks
- **Work fluidly** — update any artifact anytime, no rigid phase gates
- **Use your tools** — works with 20+ AI assistants via slash commands

### Installation

**Requires Node.js 20.19.0 or higher.**

```bash
npm install -g @fission-ai/openspec@latest
cd your-project
openspec init
```

### Updating

```bash
npm install -g @fission-ai/openspec@latest
openspec update
```

### Contributing

See [original README](https://github.com/Fission-AI/OpenSpec/blob/main/README.md) for contribution guidelines.

</details>

---

## License

MIT

## Context

OpenSpec currently has a streamlined workflow (`propose → apply → archive`) that is efficient but lacks depth in the planning phase. Superpowers (SP) has a rich brainstorming experience but suffers from token inefficiency due to full repository scans and unlimited question loops.

**Key insight**: OpenSpec's `openspec/specs/` directory already contains compressed project knowledge - domain names indicate what areas exist without needing to read code. However, complex problems DO need deeper exploration. The solution is **adaptive complexity**.

## Goals / Non-Goals

**Goals:**
- Create `/opsx:brainstorm` skill with **adaptive complexity** - simple problems get lightweight treatment, complex problems get deep exploration
- Maintain token efficiency for simple cases (~300 tokens)
- Enable full architecture exploration for complex cases (~2000 tokens, with visual diagrams)
- Strengthen `/opsx:verify` with SP's "evidence before claims" discipline
- Add optional two-stage review mode for `/opsx:apply`
- Preserve OpenSpec's "easy not complex" philosophy by auto-selecting mode

**Non-Goals:**
- Full 7-step SP workflow (too heavyweight)
- Mandatory brainstorm gate (violates "fluid" principle)
- Complete learning system in initial implementation (defer to user validation)
- Replace `/opsx:explore` (brainstorm is structured/convergent, explore is free-form)

## Decisions

### Decision 1: Adaptive Complexity Mode Selection

**Chosen**: AI-driven complexity assessment + user-choice fallback

**Alternatives considered**:
- **Always simple**: Misses complex architecture needs
- **Always complex**: Token-inefficient for simple cases
- **User always chooses**: Extra friction, most users want AI to decide
- **SP's full exploration**: Token-inefficient for all cases

**Rationale**: Best user experience is AI auto-selecting mode based on complexity signals, with option to override. Simple problems (single domain, bounded scope) get quick treatment. Complex problems (cross-cutting, new architecture) get deep exploration.

**Complexity signals**:
```text
Simple indicators:
- Single domain modification
- Existing component/pattern extension
- Bounded scope (1-3 files)
- Clear feature request

Complex indicators:
- Cross-cutting concern (auth, logging, theming)
- New subsystem or architecture pattern
- Multiple integration points
- Performance/security implications
- User mentions architecture/explore
```

### Decision 2: Simple Mode Design (Token-Efficient)

**Chosen**: Specs-folder + CLAUDE.md only, 2-3 questions, 4-turn max

**Alternatives considered**:
- **No context read**: AI operates blind, low-quality suggestions
- **Full specs content read**: Token waste, folder names sufficient for domain awareness
- **Unlimited questions**: Never converges

**Rationale**: Using `openspec/specs/` folder names gives domain awareness in ~50 tokens. CLAUDE.md provides tech stack/architecture in ~200 tokens. 2-3 questions cover domain, approach, scope. Total: ~300 tokens for entire brainstorm phase.

### Decision 3: Complex Mode Design (Deep Exploration)

**Chosen**: Focused scan + visualization + section-by-section design

**Alternatives considered**:
- **Full repo scan**: Token waste, irrelevant areas
- **No visualization**: Hard to see architecture relationships
- **SP's rigid 7-step**: Too heavyweight, violates OpenSpec philosophy
- **Free-form like explore**: No convergence guarantee

**Rationale**: Complex problems need architecture understanding. Focused scan reads topic-relevant directories (not entire repo). ASCII diagrams show component relationships, data flow. Section-by-section design with approval ensures user drives decisions. Extended turn limit (6-8) allows depth but still converges.

### Decision 4: Relationship with `/opsx:explore`

**Chosen**: Brainstorm (structured/convergent) complements Explore (free-form)

**Alternatives considered**:
- **Replace explore**: Lose valuable free-form thinking mode
- **Merge into explore**: Explore becomes two modes, confusing
- **Brainstorm only**: Miss users who want unstructured thinking

**Comparison**:
| Aspect | `/opsx:brainstorm` | `/opsx:explore` |
|--------|-------------------|-----------------|
| Structure | Guided, convergent | Free-form, stance-based |
| Questions | One per turn, multiple choice | Open threads, natural |
| Turn limit | 4 (simple) / 6-8 (complex) | No limit |
| Goal | Reach proposal-ready | Thinking is the value |
| Visualization | Complex mode only | Always available |
| Best for | Need to make decisions | Need to think through |

**Rationale**: Both modes serve different needs. Brainstorm for users who want guided decision-making. Explore for users who want thinking partner. Brainstorm can transition to explore if more free-form thinking needed.

### Decision 5: Mode Switching Mid-Session

**Chosen**: Allow upgrade/downgrade with context reuse

**Alternatives considered**:
- **Lock mode**: Friction if complexity emerges mid-session
- **Restart on switch**: Token waste, lose context
- **Never switch**: Inflexible

**Rationale**: Complexity can emerge during dialogue. If simple mode discovers architecture implications, offer upgrade. If complex mode scope narrows, offer downgrade. Context already gathered is reused - no re-asking of questions.

### Decision 6: Two-Stage Review as Optional Mode

**Chosen**: Add as optional flag/config, not mandatory

**Alternatives considered**:
- **Always enforce**: Violates "easy" principle
- **Never add**: Misses SP's quality gate benefit

**Rationale**: Complex changes benefit from spec → quality review. Simple changes don't. Let users choose via config or flag.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Complexity assessment wrong | Offer user override: "This looks [X]. Want [Y] instead?" |
| Simple mode too shallow | User can upgrade mid-session or skip to explore |
| Complex mode still token-heavy | Focused scan (not full repo), diagrams are efficient |
| Users confused by two modes | Clear documentation, AI explains mode selection |
| Brainstorm vs explore overlap | Document distinction clearly (structured vs free-form) |

## Implementation Phases

### Phase 1: Adaptive Brainstorm + Verify Enhancement

1. Create complexity assessment logic
2. Implement simple mode (specs folder + CLAUDE.md, 2-3 questions)
3. Implement complex mode (focused scan, diagrams, section-by-section)
4. Add mode switching support
5. Update verify with iron law requirements
6. Document all modes in docs/

### Phase 2: Two-Stage Review (Optional)

1. Add `--two-stage` flag to `/opsx:apply`
2. Create spec reviewer + quality reviewer templates
3. Implement review loop mechanism

### Phase 3: Learning System (If Demand Exists)

1. Design instinct storage
2. Create `/opsx:learn`, `/opsx:evolve` commands
3. Implement confidence scoring

## Open Questions

1. Should complex mode diagrams be optional or always generated?
   - **Current leaning**: Always generate in complex mode (value > token cost)
2. Should turn limits be strict or advisory?
   - **Current leaning**: Advisory with warning, not hard block
3. Should brainstorm be invoked automatically before `/opsx:propose`?
   - **Current leaning**: No, optional. User can call directly if needs exploration.
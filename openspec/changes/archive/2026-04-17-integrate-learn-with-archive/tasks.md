# Tasks

## 1. Project-Level Instinct Storage

- [x] 1.1 Create project instinct storage directory structure (`openspec/instincts/`)
- [x] 1.2 Update `learning-system.ts` to support dual storage locations
- [x] 1.3 Add `saveProjectInstinct()` function with path resolution
- [x] 1.4 Add `loadProjectInstincts()` function for project-level retrieval
- [x] 1.5 Update instinct index handling for project-level storage

## 2. Change Pattern Extraction

- [x] 2.1 Create pattern extraction module (`src/core/pattern-extraction.ts`)
- [x] 2.2 Implement design.md parser for decision extraction
- [x] 2.3 Implement tasks.md parser for implementation pattern extraction
- [x] 2.4 Add domain classification logic
- [x] 2.5 Implement confidence scoring for extracted patterns
- [x] 2.6 Add pattern matching with existing instincts (confidence boost)

## 3. Archive-Learn Integration

- [x] 3.1 Add learn prompt logic to `archive.ts` after successful archive
- [x] 3.2 Implement non-blocking learn trigger with change context
- [x] 3.3 Add user confirmation prompt for learn execution
- [x] 3.4 Update archive output messages to include learn status
- [x] 3.5 Handle learn failure gracefully (log but don't throw)

## 4. OPSX Learn Skill Enhancement

- [x] 4.1 Update learn skill template to accept change context parameter
- [x] 4.2 Add logic to determine storage destination (user vs project)
- [x] 4.3 Implement change document reading for context
- [x] 4.4 Update `/opsx:learn` command to support `--change <name>` option
- [x] 4.5 Update `/opsx:instinct-status` to show both user and project instincts

## 5. Documentation

- [x] 5.1 Update `docs/commands.md` with learn-archive integration usage
- [x] 5.2 Update `docs/concepts.md` to explain dual storage system
- [x] 5.3 Update `docs/workflows.md` with integrated archive workflow
- [x] 5.4 Update README to mention automatic pattern capture option

## 6. Testing

- [x] 6.1 Add unit tests for project instinct storage
- [x] 6.2 Add unit tests for pattern extraction from change documents
- [x] 6.3 Add tests for archive-learn integration flow
- [x] 6.4 Add tests for dual storage destination selection
- [x] 6.5 Cross-platform test for project instinct path handling
- [x] 6.6 Windows CI verification for new file path operations

## 7. Spec Archive

- [x] 7.1 Archive updated spec for opsx-archive-skill
- [x] 7.2 Create and archive spec for opsx-learn-skill (new capability)
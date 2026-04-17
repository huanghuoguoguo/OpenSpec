import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import {
  extractPatternsFromChange,
  matchExistingInstinct,
} from '../../src/core/pattern-extraction.js';
import {
  type Instinct,
  createInstinct,
  CONFIDENCE_LEVELS,
} from '../../src/core/templates/workflows/learning-system.js';

// Mock fs.readFile
vi.mock('fs', () => ({
  promises: {
    readFile: vi.fn(),
  },
}));

describe('pattern extraction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('extractPatternsFromChange', () => {
    it('should return empty array when files do not exist', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('ENOENT'));

      const patterns = await extractPatternsFromChange('/archive/path', 'test-change');

      expect(patterns).toEqual([]);
    });

    it('should extract patterns from design.md', async () => {
      const designContent = `## Decisions

### D1: Architecture Choice
**选择**: Monorepo structure
**理由**: Better code sharing between packages
**替代方案**: Polyrepo

### D2: Testing Strategy
**Choice**: Unit tests first
**Rationale**: Faster feedback loop
`;

      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(designContent) // design.md
        .mockRejectedValueOnce(new Error('ENOENT')); // tasks.md

      const patterns = await extractPatternsFromChange('/archive/path', 'test-change');

      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns.some(p => p.domain === 'workflow')).toBe(true);
    });

    it('should extract patterns from tasks.md', async () => {
      const tasksContent = `# Tasks

## 1. Setup

- [x] 1.1 Create module structure
- [x] 1.2 Add tests for module
- [x] 1.3 Document changes
`;

      vi.mocked(fs.readFile)
        .mockRejectedValueOnce(new Error('ENOENT')) // design.md
        .mockResolvedValueOnce(tasksContent); // tasks.md

      const patterns = await extractPatternsFromChange('/archive/path', 'test-change');

      expect(patterns.length).toBeGreaterThan(0);
    });

    it('should extract patterns from both files', async () => {
      const designContent = `## Decisions

### D1: Storage
**选择**: File-based storage
**理由**: Simple and portable
`;

      const tasksContent = `# Tasks

- [x] 1.1 Create storage module
- [x] 1.2 Test storage operations
`;

      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(designContent)
        .mockResolvedValueOnce(tasksContent);

      const patterns = await extractPatternsFromChange('/archive/path', 'test-change');

      expect(patterns.length).toBeGreaterThanOrEqual(2);
    });

    it('should create instincts with correct structure', async () => {
      const designContent = `## Decisions

### D1: Auth Strategy
**选择**: JWT tokens
**理由**: Stateless authentication
`;

      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(designContent)
        .mockRejectedValueOnce(new Error('ENOENT'));

      const patterns = await extractPatternsFromChange('/archive/path', 'test-change');

      for (const pattern of patterns) {
        expect(pattern.id).toBeTruthy();
        expect(pattern.trigger).toBeTruthy();
        expect(pattern.action).toBeTruthy();
        expect(pattern.confidence).toBe(CONFIDENCE_LEVELS.TENTATIVE);
        expect(pattern.domain).toBeTruthy();
        expect(pattern.evidence).toBeTruthy();
        expect(pattern.created_at).toBeTruthy();
        expect(pattern.updated_at).toBeTruthy();
      }
    });

    it('should include change name in evidence', async () => {
      const designContent = `## Decisions

### D1: Choice
**选择**: Option A
**理由**: Reason here
`;

      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(designContent)
        .mockRejectedValueOnce(new Error('ENOENT'));

      const patterns = await extractPatternsFromChange('/archive/path', 'my-change');

      for (const pattern of patterns) {
        expect(pattern.evidence.some(e => e.includes('my-change'))).toBe(true);
      }
    });
  });

  describe('matchExistingInstinct', () => {
    it('should return null when no matching instinct exists', () => {
      const newPattern = createInstinct(
        'new-pattern',
        'when doing X',
        'use Y',
        'testing',
        ['New observation']
      );

      const existing: Instinct[] = [
        createInstinct('other-pattern', 'when doing Z', 'use W', 'testing', ['Old']),
      ];

      const match = matchExistingInstinct(newPattern, existing);

      expect(match).toBeNull();
    });

    it('should return matching instinct when domains match', () => {
      const existingInstinct: Instinct = {
        id: 'existing-pattern',
        trigger: 'when testing code',
        action: 'write tests first',
        confidence: 0.5,
        domain: 'testing',
        evidence: ['Previous observation'],
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      };

      const newPattern = createInstinct(
        'new-pattern',
        'when testing',
        'write tests first',
        'testing',
        ['New observation']
      );

      const match = matchExistingInstinct(newPattern, [existingInstinct]);

      expect(match).toBe(existingInstinct);
    });

    it('should not match instincts from different domains', () => {
      const existingInstinct: Instinct = {
        id: 'existing-pattern',
        trigger: 'when testing code',
        action: 'write tests first',
        confidence: 0.5,
        domain: 'testing',
        evidence: [],
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      };

      const newPattern = createInstinct(
        'new-pattern',
        'when testing',
        'write tests first',
        'code-style', // Different domain
        ['New']
      );

      const match = matchExistingInstinct(newPattern, [existingInstinct]);

      expect(match).toBeNull();
    });

    it('should match when triggers have similar words', () => {
      const existingInstinct: Instinct = {
        id: 'existing',
        trigger: 'when writing new functions',
        action: 'use functional patterns',
        confidence: 0.5,
        domain: 'code-style',
        evidence: [],
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      };

      const newPattern = createInstinct(
        'new',
        'when writing functions',
        'use functional patterns',
        'code-style',
        ['New']
      );

      const match = matchExistingInstinct(newPattern, [existingInstinct]);

      expect(match).toBe(existingInstinct);
    });
  });

  describe('domain classification', () => {
    it('should classify testing-related content', async () => {
      const designContent = `## Decisions

### D1: Test Strategy
**选择**: Unit tests
**理由**: Faster test execution
`;

      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(designContent)
        .mockRejectedValueOnce(new Error('ENOENT'));

      const patterns = await extractPatternsFromChange('/path', 'change');

      expect(patterns.some(p => p.domain === 'testing')).toBe(true);
    });

    it('should classify workflow-related content', async () => {
      const designContent = `## Decisions

### D1: Workflow Choice
**选择**: Incremental approach
**理由**: Better progress tracking
`;

      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(designContent)
        .mockRejectedValueOnce(new Error('ENOENT'));

      const patterns = await extractPatternsFromChange('/path', 'change');

      expect(patterns.some(p => p.domain === 'workflow')).toBe(true);
    });

    it('should default to workflow for unknown content', async () => {
      const designContent = `## Decisions

### D1: Unknown Choice
**选择**: Something
**理由**: Because reasons
`;

      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(designContent)
        .mockRejectedValueOnce(new Error('ENOENT'));

      const patterns = await extractPatternsFromChange('/path', 'change');

      expect(patterns.every(p => p.domain === 'workflow')).toBe(true);
    });
  });
});
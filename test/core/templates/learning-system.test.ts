import { describe, it, expect } from 'vitest';
import path from 'path';
import {
  getLearnSkillTemplate,
  getEvolveSkillTemplate,
  getInstinctStatusSkillTemplate,
  getLearningSystemSkillTemplate,
  INSTINCT_DOMAINS,
  CONFIDENCE_LEVELS,
  getInstinctSchemaDescription,
  getUserInstinctsPath,
  getProjectInstinctsPath,
  createInstinct,
  boostConfidence,
  shouldStoreAtProjectLevel,
  getConfidenceLabel,
  USER_INSTINCTS_DIR,
  PROJECT_INSTINCTS_DIR,
  type Instinct,
} from '../../../src/core/templates/workflows/learning-system.js';

describe('learning system templates', () => {
  describe('INSTINCT_DOMAINS', () => {
    it('should have expected domains', () => {
      expect(INSTINCT_DOMAINS).toContain('code-style');
      expect(INSTINCT_DOMAINS).toContain('testing');
      expect(INSTINCT_DOMAINS).toContain('git');
      expect(INSTINCT_DOMAINS).toContain('debugging');
      expect(INSTINCT_DOMAINS).toContain('workflow');
      expect(INSTINCT_DOMAINS).toContain('security');
      expect(INSTINCT_DOMAINS).toContain('tooling');
    });

    it('should have 7 domains', () => {
      expect(INSTINCT_DOMAINS).toHaveLength(7);
    });
  });

  describe('CONFIDENCE_LEVELS', () => {
    it('should have expected levels', () => {
      expect(CONFIDENCE_LEVELS.TENTATIVE).toBe(0.3);
      expect(CONFIDENCE_LEVELS.MODERATE).toBe(0.5);
      expect(CONFIDENCE_LEVELS.STRONG).toBe(0.7);
      expect(CONFIDENCE_LEVELS.NEAR_CERTAIN).toBe(0.9);
    });

    it('should have increasing values', () => {
      expect(CONFIDENCE_LEVELS.TENTATIVE).toBeLessThan(CONFIDENCE_LEVELS.MODERATE);
      expect(CONFIDENCE_LEVELS.MODERATE).toBeLessThan(CONFIDENCE_LEVELS.STRONG);
      expect(CONFIDENCE_LEVELS.STRONG).toBeLessThan(CONFIDENCE_LEVELS.NEAR_CERTAIN);
    });
  });

  describe('Instinct type', () => {
    it('should allow valid instinct objects', () => {
      const instinct: Instinct = {
        id: 'prefer-functional-style',
        trigger: 'when writing new functions',
        action: 'Use functional patterns over classes when appropriate',
        confidence: 0.7,
        domain: 'code-style',
        evidence: ['Observed 5 instances of functional pattern preference'],
        created_at: '2026-03-22T10:00:00Z',
        updated_at: '2026-03-22T12:00:00Z',
      };

      expect(instinct.id).toBe('prefer-functional-style');
      expect(instinct.confidence).toBe(0.7);
      expect(instinct.domain).toBe('code-style');
      expect(instinct.evidence).toHaveLength(1);
    });
  });

  describe('getInstinctSchemaDescription', () => {
    it('should return a schema description', () => {
      const description = getInstinctSchemaDescription();

      expect(description).toContain('Instinct JSON Schema');
      expect(description).toContain('id');
      expect(description).toContain('trigger');
      expect(description).toContain('action');
      expect(description).toContain('confidence');
      expect(description).toContain('domain');
      expect(description).toContain('evidence');
    });

    it('should include confidence level explanations', () => {
      const description = getInstinctSchemaDescription();

      expect(description).toContain('0.3');
      expect(description).toContain('Tentative');
      expect(description).toContain('0.9');
      expect(description).toContain('Near-certain');
    });

    it('should include example instinct', () => {
      const description = getInstinctSchemaDescription();

      expect(description).toContain('prefer-functional-style');
      expect(description).toContain('functional patterns');
    });
  });

  describe('getLearnSkillTemplate', () => {
    it('should return a valid skill template', () => {
      const template = getLearnSkillTemplate();

      expect(template.name).toBe('openspec-learn');
      expect(template.description).toContain('patterns');
      expect(template.description).toContain('instincts');
      expect(template.instructions).toBeTruthy();
      expect(template.license).toBe('MIT');
    });

    it('should include when to use section', () => {
      const template = getLearnSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('When to Use');
    });

    it('should include pattern types to detect', () => {
      const template = getLearnSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Pattern Types to Detect');
      expect(instructions).toContain('User Corrections');
      expect(instructions).toContain('Error Resolutions');
      expect(instructions).toContain('Repeated Workflows');
    });

    it('should include instinct creation format', () => {
      const template = getLearnSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Instinct Creation Format');
      expect(instructions).toContain('trigger');
      expect(instructions).toContain('action');
      expect(instructions).toContain('confidence');
      expect(instructions).toContain('domain');
    });

    it('should include confidence initialization guidance', () => {
      const template = getLearnSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Confidence Initialization');
      expect(instructions).toContain('0.3');
      expect(instructions).toContain('Tentative');
    });

    it('should include storage location', () => {
      const template = getLearnSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Storage Location');
      expect(instructions).toContain('.openspec/instincts');
    });

    it('should mention privacy considerations', () => {
      const template = getLearnSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Only capture patterns');
      expect(instructions).toContain('not code or conversation content');
    });

    it('should have instructions longer than 500 characters', () => {
      const template = getLearnSkillTemplate();

      expect(template.instructions.length).toBeGreaterThan(500);
    });
  });

  describe('getEvolveSkillTemplate', () => {
    it('should return a valid skill template', () => {
      const template = getEvolveSkillTemplate();

      expect(template.name).toBe('openspec-evolve');
      expect(template.description).toContain('instincts');
      expect(template.description).toContain('skills');
      expect(template.instructions).toBeTruthy();
      expect(template.license).toBe('MIT');
    });

    it('should include when to use section', () => {
      const template = getEvolveSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('When to Use');
      expect(instructions).toContain('0.7');
    });

    it('should include evolution process diagram', () => {
      const template = getEvolveSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Evolution Process');
      expect(instructions).toContain('Instincts');
      expect(instructions).toContain('Skills');
    });

    it('should include evolution candidates criteria', () => {
      const template = getEvolveSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Evolution Candidates');
      expect(instructions).toContain('Domain clusters');
      expect(instructions).toContain('High confidence');
    });

    it('should include evolution output types', () => {
      const template = getEvolveSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Evolution Output Types');
      expect(instructions).toContain('Skill');
      expect(instructions).toContain('Command');
      expect(instructions).toContain('Agent');
    });

    it('should include evolution steps', () => {
      const template = getEvolveSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Evolution Steps');
      expect(instructions).toContain('Cluster instincts');
      expect(instructions).toContain('User approval');
    });

    it('should mention user approval requirement', () => {
      const template = getEvolveSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Evolution requires user approval');
    });

    it('should have instructions longer than 500 characters', () => {
      const template = getEvolveSkillTemplate();

      expect(template.instructions.length).toBeGreaterThan(500);
    });
  });

  describe('getInstinctStatusSkillTemplate', () => {
    it('should return a valid skill template', () => {
      const template = getInstinctStatusSkillTemplate();

      expect(template.name).toBe('openspec-instinct-status');
      expect(template.description).toContain('instincts');
      expect(template.description).toContain('confidence');
      expect(template.instructions).toBeTruthy();
      expect(template.license).toBe('MIT');
    });

    it('should include output format example', () => {
      const template = getInstinctStatusSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Output Format');
      expect(instructions).toContain('Instinct Status');
    });

    it('should include confidence level table', () => {
      const template = getInstinctStatusSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Confidence Levels');
      expect(instructions).toContain('near-certain');
      expect(instructions).toContain('strong');
      expect(instructions).toContain('moderate');
      expect(instructions).toContain('tentative');
    });

    it('should include summary section guidance', () => {
      const template = getInstinctStatusSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Summary');
    });

    it('should include usage section with flags', () => {
      const template = getInstinctStatusSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Usage');
      expect(instructions).toContain('--user');
      expect(instructions).toContain('--project');
    });

    it('should include empty state handling', () => {
      const template = getInstinctStatusSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Empty State');
      expect(instructions).toContain('No instincts stored');
    });

    it('should have instructions longer than 300 characters', () => {
      const template = getInstinctStatusSkillTemplate();

      expect(template.instructions.length).toBeGreaterThan(300);
    });
  });

  describe('getLearningSystemSkillTemplate', () => {
    it('should return a valid skill template', () => {
      const template = getLearningSystemSkillTemplate();

      expect(template.name).toBe('openspec-learning-system');
      expect(template.description).toContain('instinct-based');
      expect(template.description).toContain('learning');
      expect(template.instructions).toBeTruthy();
      expect(template.license).toBe('MIT');
    });

    it('should include overview section', () => {
      const template = getLearningSystemSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Overview');
      expect(instructions).toContain('Pattern Detection');
      expect(instructions).toContain('Instinct');
      expect(instructions).toContain('Skill');
    });

    it('should include key concepts', () => {
      const template = getLearningSystemSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Key Concepts');
      expect(instructions).toContain('Trigger');
      expect(instructions).toContain('Action');
      expect(instructions).toContain('Confidence');
      expect(instructions).toContain('Evidence');
    });

    it('should include commands table', () => {
      const template = getLearningSystemSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Commands');
      expect(instructions).toContain('/opsx:learn');
      expect(instructions).toContain('/opsx:evolve');
      expect(instructions).toContain('/opsx:instinct-status');
    });

    it('should include storage structure', () => {
      const template = getLearningSystemSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Storage');
      expect(instructions).toContain('instincts/');
      expect(instructions).toContain('skills/');
    });

    it('should include confidence evolution', () => {
      const template = getLearningSystemSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Confidence Evolution');
      expect(instructions).toContain('0.3');
      expect(instructions).toContain('0.9');
    });

    it('should include privacy section', () => {
      const template = getLearningSystemSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Privacy');
      expect(instructions).toContain('local');
    });

    it('should have instructions longer than 300 characters', () => {
      const template = getLearningSystemSkillTemplate();

      expect(template.instructions.length).toBeGreaterThan(300);
    });
  });

  describe('template consistency', () => {
    it('all templates should have MIT license', () => {
      expect(getLearnSkillTemplate().license).toBe('MIT');
      expect(getEvolveSkillTemplate().license).toBe('MIT');
      expect(getInstinctStatusSkillTemplate().license).toBe('MIT');
      expect(getLearningSystemSkillTemplate().license).toBe('MIT');
    });

    it('all templates should have openspec prefix in name', () => {
      expect(getLearnSkillTemplate().name).toMatch(/^openspec-/);
      expect(getEvolveSkillTemplate().name).toMatch(/^openspec-/);
      expect(getInstinctStatusSkillTemplate().name).toMatch(/^openspec-/);
      expect(getLearningSystemSkillTemplate().name).toMatch(/^openspec-/);
    });

    it('all templates should have metadata with author and version', () => {
      const templates = [
        getLearnSkillTemplate(),
        getEvolveSkillTemplate(),
        getInstinctStatusSkillTemplate(),
        getLearningSystemSkillTemplate(),
      ];

      for (const template of templates) {
        expect(template.metadata).toBeDefined();
        expect(template.metadata?.author).toBe('openspec');
        expect(template.metadata?.version).toBe('1.0');
      }
    });

    it('all templates should have compatibility note', () => {
      const templates = [
        getLearnSkillTemplate(),
        getEvolveSkillTemplate(),
        getInstinctStatusSkillTemplate(),
        getLearningSystemSkillTemplate(),
      ];

      for (const template of templates) {
        expect(template.compatibility).toContain('openspec CLI');
      }
    });
  });
});

describe('storage path helpers', () => {
  describe('USER_INSTINCTS_DIR', () => {
    it('should be relative to home directory', () => {
      expect(USER_INSTINCTS_DIR).toBe('.openspec/instincts');
    });
  });

  describe('PROJECT_INSTINCTS_DIR', () => {
    it('should be in openspec directory', () => {
      expect(PROJECT_INSTINCTS_DIR).toBe('openspec/instincts');
    });
  });

  describe('getUserInstinctsPath', () => {
    it('should return path in home directory', () => {
      const pathResult = getUserInstinctsPath();
      expect(pathResult).toContain('.openspec');
      expect(pathResult).toContain('instincts');
    });

    it('should use HOME environment variable', () => {
      const homeDir = process.env.HOME || process.env.USERPROFILE || '';
      const expected = path.join(homeDir, USER_INSTINCTS_DIR);
      expect(getUserInstinctsPath()).toBe(expected);
    });
  });

  describe('getProjectInstinctsPath', () => {
    it('should return path relative to project root', () => {
      const projectRoot = '/my/project';
      const pathResult = getProjectInstinctsPath(projectRoot);
      expect(pathResult).toContain('openspec');
      expect(pathResult).toContain('instincts');
    });

    it('should use path.join for cross-platform compatibility', () => {
      const projectRoot = '/my/project';
      const expected = path.join(projectRoot, PROJECT_INSTINCTS_DIR);
      expect(getProjectInstinctsPath(projectRoot)).toBe(expected);
    });
  });
});

describe('instinct helper functions', () => {
  describe('createInstinct', () => {
    it('should create instinct with initial values', () => {
      const instinct = createInstinct(
        'test-pattern',
        'when testing',
        'use table-driven tests',
        'testing',
        ['First observation']
      );

      expect(instinct.id).toBe('test-pattern');
      expect(instinct.trigger).toBe('when testing');
      expect(instinct.action).toBe('use table-driven tests');
      expect(instinct.domain).toBe('testing');
      expect(instinct.confidence).toBe(CONFIDENCE_LEVELS.TENTATIVE);
      expect(instinct.evidence).toContain('First observation');
    });

    it('should set created_at and updated_at to current time', () => {
      const instinct = createInstinct(
        'test-pattern',
        'when testing',
        'use table-driven tests',
        'testing',
        ['Observation']
      );

      expect(instinct.created_at).toBeTruthy();
      expect(instinct.updated_at).toBeTruthy();
      // Times should be close (within 1 second)
      const created = new Date(instinct.created_at).getTime();
      const updated = new Date(instinct.updated_at).getTime();
      expect(Math.abs(created - updated)).toBeLessThan(1000);
    });

    it('should start at tentative confidence (0.3)', () => {
      const instinct = createInstinct(
        'test-pattern',
        'trigger',
        'action',
        'code-style',
        ['evidence']
      );

      expect(instinct.confidence).toBe(0.3);
    });
  });

  describe('boostConfidence', () => {
    it('should increase confidence by 0.1', () => {
      const baseInstinct: Instinct = {
        id: 'test-pattern',
        trigger: 'when testing',
        action: 'use table-driven tests',
        confidence: 0.3,
        domain: 'testing',
        evidence: ['First observation'],
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      };

      const boosted = boostConfidence(baseInstinct, ['Second observation']);

      expect(boosted.confidence).toBe(0.4);
    });

    it('should cap confidence at 0.9', () => {
      const highInstinct: Instinct = {
        id: 'test-pattern',
        trigger: 'trigger',
        action: 'action',
        confidence: 0.85,
        domain: 'testing',
        evidence: ['Many observations'],
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      };

      const boosted = boostConfidence(highInstinct, ['Another observation']);

      expect(boosted.confidence).toBe(0.9);
    });

    it('should append evidence', () => {
      const baseInstinct: Instinct = {
        id: 'test-pattern',
        trigger: 'trigger',
        action: 'action',
        confidence: 0.3,
        domain: 'testing',
        evidence: ['First'],
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      };

      const boosted = boostConfidence(baseInstinct, ['Second', 'Third']);

      expect(boosted.evidence).toHaveLength(3);
      expect(boosted.evidence).toContain('First');
      expect(boosted.evidence).toContain('Second');
      expect(boosted.evidence).toContain('Third');
    });

    it('should update updated_at timestamp', () => {
      const oldInstinct: Instinct = {
        id: 'test-pattern',
        trigger: 'trigger',
        action: 'action',
        confidence: 0.3,
        domain: 'testing',
        evidence: ['Old'],
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      };

      const boosted = boostConfidence(oldInstinct, ['New']);

      // updated_at should be newer than created_at
      const updatedTime = new Date(boosted.updated_at).getTime();
      const createdTime = new Date(boosted.created_at).getTime();
      expect(updatedTime).toBeGreaterThan(createdTime);
    });

    it('should preserve other properties', () => {
      const baseInstinct: Instinct = {
        id: 'test-pattern',
        trigger: 'trigger',
        action: 'action',
        confidence: 0.3,
        domain: 'testing',
        evidence: ['Old'],
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      };

      const boosted = boostConfidence(baseInstinct, ['New']);

      expect(boosted.id).toBe(baseInstinct.id);
      expect(boosted.trigger).toBe(baseInstinct.trigger);
      expect(boosted.action).toBe(baseInstinct.action);
      expect(boosted.domain).toBe(baseInstinct.domain);
      expect(boosted.created_at).toBe(baseInstinct.created_at);
    });
  });

  describe('shouldStoreAtProjectLevel', () => {
    it('should return true for workflow domain', () => {
      expect(shouldStoreAtProjectLevel('workflow', 'any context')).toBe(true);
    });

    it('should return true for architecture indicators', () => {
      expect(shouldStoreAtProjectLevel('code-style', 'architecture decision')).toBe(true);
      expect(shouldStoreAtProjectLevel('testing', 'design decision for project')).toBe(true);
    });

    it('should return true for project indicators', () => {
      expect(shouldStoreAtProjectLevel('tooling', 'project-specific config')).toBe(true);
      expect(shouldStoreAtProjectLevel('testing', 'change in testing approach')).toBe(true);
    });

    it('should return false for cross-project patterns', () => {
      expect(shouldStoreAtProjectLevel('code-style', 'prefer functional style')).toBe(false);
      expect(shouldStoreAtProjectLevel('tooling', 'use ripgrep')).toBe(false);
      expect(shouldStoreAtProjectLevel('testing', 'table-driven tests')).toBe(false);
    });
  });

  describe('getConfidenceLabel', () => {
    it('should return near-certain for 0.9+', () => {
      expect(getConfidenceLabel(0.9)).toBe('near-certain');
      expect(getConfidenceLabel(0.95)).toBe('near-certain');
    });

    it('should return strong for 0.7-0.89', () => {
      expect(getConfidenceLabel(0.7)).toBe('strong');
      expect(getConfidenceLabel(0.8)).toBe('strong');
    });

    it('should return moderate for 0.5-0.69', () => {
      expect(getConfidenceLabel(0.5)).toBe('moderate');
      expect(getConfidenceLabel(0.6)).toBe('moderate');
    });

    it('should return tentative for <0.5', () => {
      expect(getConfidenceLabel(0.3)).toBe('tentative');
      expect(getConfidenceLabel(0.4)).toBe('tentative');
      expect(getConfidenceLabel(0.1)).toBe('tentative');
    });
  });
});

describe('dual storage in templates', () => {
  describe('getInstinctSchemaDescription', () => {
    it('should mention both storage locations', () => {
      const description = getInstinctSchemaDescription();
      expect(description).toContain('User-level');
      expect(description).toContain('Project-level');
    });

    it('should include ~/.openspec path', () => {
      const description = getInstinctSchemaDescription();
      expect(description).toContain('~/.openspec/instincts');
    });

    it('should include openspec/ path', () => {
      const description = getInstinctSchemaDescription();
      expect(description).toContain('openspec/instincts');
    });
  });

  describe('getLearnSkillTemplate', () => {
    it('should mention --change option in description', () => {
      const template = getLearnSkillTemplate();
      expect(template.description).toContain('--change');
    });

    it('should include dual storage locations', () => {
      const template = getLearnSkillTemplate();
      expect(template.instructions).toContain('~/.openspec/instincts');
      expect(template.instructions).toContain('openspec/instincts');
    });

    it('should include destination selection guidance', () => {
      const template = getLearnSkillTemplate();
      expect(template.instructions).toContain('Destination Selection');
    });
  });

  describe('getInstinctStatusSkillTemplate', () => {
    it('should mention both storage levels', () => {
      const template = getInstinctStatusSkillTemplate();
      expect(template.instructions).toContain('User-Level');
      expect(template.instructions).toContain('Project-Level');
    });

    it('should include reading from both locations', () => {
      const template = getInstinctStatusSkillTemplate();
      expect(template.instructions).toContain('~/.openspec/instincts');
      expect(template.instructions).toContain('openspec/instincts');
    });
  });
});
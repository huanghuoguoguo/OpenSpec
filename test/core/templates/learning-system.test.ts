import { describe, it, expect } from 'vitest';
import {
  getLearnSkillTemplate,
  getEvolveSkillTemplate,
  getInstinctStatusSkillTemplate,
  getLearningSystemSkillTemplate,
  INSTINCT_DOMAINS,
  CONFIDENCE_LEVELS,
  getInstinctSchemaDescription,
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
      expect(instructions).toContain('By Domain');
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
      expect(instructions).toContain('Total instincts');
      expect(instructions).toContain('Evolution candidates');
    });

    it('should include recommendations section', () => {
      const template = getInstinctStatusSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Recommendations');
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
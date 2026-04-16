import { describe, it, expect } from 'vitest';
import {
  getBrainstormSkillTemplate,
  getOpsxBrainstormCommandTemplate,
} from '../../../src/core/templates/workflows/brainstorm.js';

describe('brainstorm skill', () => {
  describe('getBrainstormSkillTemplate', () => {
    it('should return a valid skill template', () => {
      const template = getBrainstormSkillTemplate();

      expect(template.name).toBe('openspec-brainstorm');
      expect(template.description).toContain('adaptive');
      expect(template.description).toContain('collaborative ideation');
      expect(template.instructions).toBeTruthy();
      expect(template.license).toBe('MIT');
      expect(template.compatibility).toBe('Requires openspec CLI.');
    });

    it('should include complexity assessment section', () => {
      const template = getBrainstormSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Complexity Assessment');
      expect(instructions).toContain('Simple indicators');
      expect(instructions).toContain('Complex indicators');
    });

    it('should include simple mode section', () => {
      const template = getBrainstormSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Simple Mode');
      expect(instructions).toContain('≤300 tokens');
      expect(instructions).toContain('2-3 questions');
    });

    it('should include complex mode section', () => {
      const template = getBrainstormSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Complex Mode');
      expect(instructions).toContain('Architecture');
      expect(instructions).toContain('diagrams');
      expect(instructions).toContain('6-8 turn');
    });

    it('should include mode switching section', () => {
      const template = getBrainstormSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Mode Switching');
      expect(instructions).toContain('Upgrade to complex');
      expect(instructions).toContain('Downgrade');
    });

    it('should include transition options', () => {
      const template = getBrainstormSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('/opsx:propose');
      expect(instructions).toContain('/opsx:explore');
    });

    it('should include comparison with explore', () => {
      const template = getBrainstormSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('vs. Explore');
    });

    it('should have instructions longer than 500 characters', () => {
      const template = getBrainstormSkillTemplate();

      expect(template.instructions.length).toBeGreaterThan(500);
    });

    it('should include guardrails section', () => {
      const template = getBrainstormSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Guardrails');
      expect(instructions).toContain('Don\'t implement');
    });
  });

  describe('getOpsxBrainstormCommandTemplate', () => {
    it('should return a valid command template', () => {
      const template = getOpsxBrainstormCommandTemplate();

      expect(template.name).toBe('OPSX: Brainstorm');
      expect(template.description).toContain('adaptive');
      expect(template.category).toBe('Workflow');
      expect(template.tags).toContain('workflow');
      expect(template.tags).toContain('brainstorm');
      expect(template.content).toBeTruthy();
    });

    it('should have content matching skill instructions', () => {
      const skillTemplate = getBrainstormSkillTemplate();
      const commandTemplate = getOpsxBrainstormCommandTemplate();

      // Both should have the core sections
      expect(commandTemplate.content).toContain('Complexity Assessment');
      expect(commandTemplate.content).toContain('Simple Mode');
      expect(commandTemplate.content).toContain('Complex Mode');

      // Content should be substantial
      expect(commandTemplate.content.length).toBeGreaterThan(500);
    });
  });

  describe('complexity signals', () => {
    it('should define clear simple indicators', () => {
      const template = getBrainstormSkillTemplate();
      const instructions = template.instructions;

      // Simple indicators
      expect(instructions).toContain('Single domain');
      expect(instructions).toContain('bounded scope');
    });

    it('should define clear complex indicators', () => {
      const template = getBrainstormSkillTemplate();
      const instructions = template.instructions;

      // Complex indicators
      expect(instructions).toContain('Cross-cutting');
      expect(instructions).toContain('architecture');
      expect(instructions).toContain('integration');
    });
  });

  describe('token budget enforcement', () => {
    it('should specify token limits for simple mode', () => {
      const template = getBrainstormSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('≤300');
    });

    it('should specify token limits for complex mode', () => {
      const template = getBrainstormSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('≤2000');
    });
  });

  describe('turn limits', () => {
    it('should specify turn limit for simple mode', () => {
      const template = getBrainstormSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('4 turn');
    });

    it('should specify turn limit for complex mode', () => {
      const template = getBrainstormSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('6-8 turn');
    });
  });
});
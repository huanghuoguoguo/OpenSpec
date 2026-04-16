import { describe, it, expect } from 'vitest';
import {
  getVerifyChangeSkillTemplate,
  getOpsxVerifyCommandTemplate,
} from '../../../src/core/templates/workflows/verify-change.js';

describe('verify skill with Iron Law', () => {
  describe('getVerifyChangeSkillTemplate', () => {
    it('should return a valid skill template', () => {
      const template = getVerifyChangeSkillTemplate();

      expect(template.name).toBe('openspec-verify-change');
      expect(template.description).toContain('Iron Law');
      expect(template.description).toContain('evidence before claims');
      expect(template.instructions).toBeTruthy();
      expect(template.license).toBe('MIT');
    });

    it('should include Iron Law section at the beginning', () => {
      const template = getVerifyChangeSkillTemplate();
      const instructions = template.instructions;

      // Iron Law should be prominently placed
      expect(instructions.indexOf('IRON LAW')).toBeLessThan(
        instructions.indexOf('Completeness')
      );
    });

    it('should include the gate function', () => {
      const template = getVerifyChangeSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Gate Function');
      expect(instructions).toContain('IDENTIFY');
      expect(instructions).toContain('RUN');
      expect(instructions).toContain('READ');
      expect(instructions).toContain('VERIFY');
      expect(instructions).toContain('ONLY THEN');
    });

    it('should include red flags section', () => {
      const template = getVerifyChangeSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Red Flags');
      expect(instructions).toContain('should');
      expect(instructions).toContain('probably');
      expect(instructions).toContain('seems to');
    });

    it('should include rationalization prevention table', () => {
      const template = getVerifyChangeSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Rationalization Prevention');
      expect(instructions).toContain('Excuse');
      expect(instructions).toContain('Reality');
    });

    it('should include weasel word examples', () => {
      const template = getVerifyChangeSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('should');
      expect(instructions).toContain('probably');
      expect(instructions).toContain('likely');
      expect(instructions).toContain('seems to');
    });

    it('should include red-green cycle verification', () => {
      const template = getVerifyChangeSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('red-green');
      expect(instructions).toContain('Test fails when bug present');
      expect(instructions).toContain('Test passes after fix');
    });

    it('should include Iron Law Compliance section in report', () => {
      const template = getVerifyChangeSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Iron Law Compliance');
      expect(instructions).toContain('Fresh evidence for claims');
      expect(instructions).toContain('No weasel words');
    });

    it('should block archive on Iron Law violation', () => {
      const template = getVerifyChangeSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('IRON LAW VIOLATION');
      expect(instructions).toContain('Cannot proceed');
      expect(instructions).toContain('Cannot archive');
    });

    it('should have instructions longer than 500 characters', () => {
      const template = getVerifyChangeSkillTemplate();

      expect(template.instructions.length).toBeGreaterThan(500);
    });
  });

  describe('getOpsxVerifyCommandTemplate', () => {
    it('should return a valid command template', () => {
      const template = getOpsxVerifyCommandTemplate();

      expect(template.name).toBe('OPSX: Verify');
      expect(template.description).toContain('Iron Law');
      expect(template.category).toBe('Workflow');
      expect(template.tags).toContain('workflow');
      expect(template.tags).toContain('verify');
      expect(template.tags).toContain('iron-law');
      expect(template.content).toBeTruthy();
    });

    it('should have content matching skill instructions', () => {
      const skillTemplate = getVerifyChangeSkillTemplate();
      const commandTemplate = getOpsxVerifyCommandTemplate();

      // Both should have Iron Law sections
      expect(commandTemplate.content).toContain('IRON LAW');
      expect(commandTemplate.content).toContain('Gate Function');
      expect(commandTemplate.content).toContain('Red Flags');
    });
  });

  describe('gate function steps', () => {
    it('should require running verification command', () => {
      const template = getVerifyChangeSkillTemplate();
      const instructions = template.instructions;

      // Should require actually running commands
      expect(instructions).toContain('RUN');
      expect(instructions).toContain('Execute the FULL command');
    });

    it('should require reading full output', () => {
      const template = getVerifyChangeSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('READ');
      expect(instructions).toContain('Full output');
      expect(instructions).toContain('exit code');
    });

    it('should prohibit claiming without verification', () => {
      const template = getVerifyChangeSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION');
      expect(instructions).toContain('haven\'t run');
    });
  });

  describe('weasel word detection', () => {
    it('should list specific weasel words', () => {
      const template = getVerifyChangeSkillTemplate();
      const instructions = template.instructions;

      // These are the key weasel words to detect
      const weaselWords = ['should', 'probably', 'seems to', 'likely'];

      for (const word of weaselWords) {
        expect(instructions.toLowerCase()).toContain(word.toLowerCase());
      }
    });

    it('should require flagging weasel words as red flags', () => {
      const template = getVerifyChangeSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Red Flags');
      expect(instructions).toContain('STOP');
    });
  });

  describe('report format', () => {
    it('should place Iron Law compliance before other sections', () => {
      const template = getVerifyChangeSkillTemplate();
      const instructions = template.instructions;

      // Iron Law Compliance should come first in report
      const ironLawPos = instructions.indexOf('Iron Law Compliance Section');
      const summaryPos = instructions.indexOf('Summary Scorecard');

      expect(ironLawPos).toBeLessThan(summaryPos);
    });

    it('should include Iron Law violation block message', () => {
      const template = getVerifyChangeSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('⛔');
      expect(instructions).toContain('IRON LAW VIOLATION');
    });

    it('should include success message when Iron Law passed', () => {
      const template = getVerifyChangeSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('✅');
      expect(instructions).toContain('All checks passed including Iron Law');
    });
  });
});
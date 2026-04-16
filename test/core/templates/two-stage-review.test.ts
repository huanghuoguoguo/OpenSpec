import { describe, it, expect } from 'vitest';
import {
  getSpecReviewerPromptTemplate,
  getCodeQualityReviewerPromptTemplate,
  getTwoStageReviewSkillTemplate,
} from '../../../src/core/templates/workflows/two-stage-review.js';

describe('two-stage review templates', () => {
  describe('getSpecReviewerPromptTemplate', () => {
    it('should return a valid skill template', () => {
      const template = getSpecReviewerPromptTemplate();

      expect(template.name).toBe('openspec-spec-reviewer');
      expect(template.description).toContain('Spec compliance');
      expect(template.description).toContain('reviewer');
      expect(template.instructions).toBeTruthy();
      expect(template.license).toBe('MIT');
    });

    it('should include review process steps', () => {
      const template = getSpecReviewerPromptTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Review Process');
      expect(instructions).toContain('Step 1');
      expect(instructions).toContain('Step 2');
      expect(instructions).toContain('Step 3');
    });

    it('should include compliance categories', () => {
      const template = getSpecReviewerPromptTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Compliance Categories');
      expect(instructions).toContain('COMPLIANT');
      expect(instructions).toContain('NON-COMPLIANT');
      expect(instructions).toContain('PARTIAL');
    });

    it('should include output format specification', () => {
      const template = getSpecReviewerPromptTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Output format');
      expect(instructions).toContain('Spec Compliance Review');
      expect(instructions).toContain('Evidence');
      expect(instructions).toContain('Issues');
    });

    it('should include common issues section', () => {
      const template = getSpecReviewerPromptTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Common Issues');
      expect(instructions).toContain('Missing implementation');
      expect(instructions).toContain('Extra implementation');
    });

    it('should include red flags section', () => {
      const template = getSpecReviewerPromptTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Red Flags');
    });

    it('should specify PASS/FAIL/WARNINGS status options', () => {
      const template = getSpecReviewerPromptTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('PASS');
      expect(instructions).toContain('FAIL');
      expect(instructions).toContain('WARNINGS');
    });

    it('should clarify what NOT to check', () => {
      const template = getSpecReviewerPromptTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Do NOT check');
      expect(instructions).toContain('code quality');
    });

    it('should have instructions longer than 500 characters', () => {
      const template = getSpecReviewerPromptTemplate();

      expect(template.instructions.length).toBeGreaterThan(500);
    });
  });

  describe('getCodeQualityReviewerPromptTemplate', () => {
    it('should return a valid skill template', () => {
      const template = getCodeQualityReviewerPromptTemplate();

      expect(template.name).toBe('openspec-code-quality-reviewer');
      expect(template.description).toContain('Code quality');
      expect(template.description).toContain('reviewer');
      expect(template.instructions).toBeTruthy();
      expect(template.license).toBe('MIT');
    });

    it('should include review process steps', () => {
      const template = getCodeQualityReviewerPromptTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Review Process');
      expect(instructions).toContain('Step 1');
      expect(instructions).toContain('Step 2');
      expect(instructions).toContain('Step 3');
    });

    it('should include severity categories', () => {
      const template = getCodeQualityReviewerPromptTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('CRITICAL');
      expect(instructions).toContain('IMPORTANT');
      expect(instructions).toContain('MINOR');
    });

    it('should include what to check table', () => {
      const template = getCodeQualityReviewerPromptTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('What to Check');
      expect(instructions).toContain('Cleanliness');
      expect(instructions).toContain('Naming');
      expect(instructions).toContain('Tests');
      expect(instructions).toContain('Security');
    });

    it('should include common issues section', () => {
      const template = getCodeQualityReviewerPromptTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Common Issues');
      expect(instructions).toContain('Magic numbers');
      expect(instructions).toContain('Long functions');
      expect(instructions).toContain('Missing tests');
    });

    it('should specify APPROVED/CHANGES REQUIRED status options', () => {
      const template = getCodeQualityReviewerPromptTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('APPROVED');
      expect(instructions).toContain('CHANGES REQUIRED');
    });

    it('should clarify difference from spec reviewer', () => {
      const template = getCodeQualityReviewerPromptTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('DIFFERENT things');
      expect(instructions).toContain('Spec reviewer');
      expect(instructions).toContain('good code');
    });

    it('should include strengths section in output', () => {
      const template = getCodeQualityReviewerPromptTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Strengths');
    });

    it('should have instructions longer than 500 characters', () => {
      const template = getCodeQualityReviewerPromptTemplate();

      expect(template.instructions.length).toBeGreaterThan(500);
    });
  });

  describe('getTwoStageReviewSkillTemplate', () => {
    it('should return a valid skill template', () => {
      const template = getTwoStageReviewSkillTemplate();

      expect(template.name).toBe('openspec-two-stage-review');
      expect(template.description).toContain('two-stage');
      expect(template.description).toContain('review');
      expect(template.instructions).toBeTruthy();
      expect(template.license).toBe('MIT');
    });

    it('should include when to use section', () => {
      const template = getTwoStageReviewSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('When to Use');
      expect(instructions).toContain('Complex');
      expect(instructions).toContain('Security');
    });

    it('should include process diagram', () => {
      const template = getTwoStageReviewSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('The Process');
      expect(instructions).toContain('Stage 1');
      expect(instructions).toContain('Stage 2');
      expect(instructions).toContain('spec-reviewer');
      expect(instructions).toContain('code-quality');
    });

    it('should include implementation steps', () => {
      const template = getTwoStageReviewSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Implementation');
      expect(instructions).toContain('After implementer');
      expect(instructions).toContain('Dispatch spec reviewer');
      expect(instructions).toContain('Dispatch code quality');
    });

    it('should include review loop limits', () => {
      const template = getTwoStageReviewSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Review Loop Limits');
      expect(instructions).toContain('3 iterations');
    });

    it('should include git diff retrieval section', () => {
      const template = getTwoStageReviewSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Git Diff Retrieval');
      expect(instructions).toContain('git diff');
    });

    it('should include important notes section', () => {
      const template = getTwoStageReviewSkillTemplate();
      const instructions = template.instructions;

      expect(instructions).toContain('Important Notes');
      expect(instructions).toContain('Order matters');
      expect(instructions).toContain('Spec review MUST happen before quality review');
    });

    it('should have instructions longer than 300 characters', () => {
      const template = getTwoStageReviewSkillTemplate();

      expect(template.instructions.length).toBeGreaterThan(300);
    });
  });

  describe('reviewer differentiation', () => {
    it('spec reviewer should focus on requirements', () => {
      const specTemplate = getSpecReviewerPromptTemplate();
      const qualityTemplate = getCodeQualityReviewerPromptTemplate();

      // Spec reviewer mentions requirements and scenarios
      expect(specTemplate.instructions).toContain('requirement');
      expect(specTemplate.instructions).toContain('SHALL');
      expect(specTemplate.instructions).toContain('MUST');

      // Quality reviewer focuses on different things
      expect(qualityTemplate.instructions).toContain('Cleanliness');
      expect(qualityTemplate.instructions).toContain('Maintainability');
    });

    it('quality reviewer should NOT check spec compliance', () => {
      const qualityTemplate = getCodeQualityReviewerPromptTemplate();

      expect(qualityTemplate.instructions).toContain('DIFFERENT things');
      expect(qualityTemplate.instructions).toContain('Spec reviewer');
    });

    it('both should have clear status reporting', () => {
      const specTemplate = getSpecReviewerPromptTemplate();
      const qualityTemplate = getCodeQualityReviewerPromptTemplate();

      expect(specTemplate.instructions).toContain('Report Status');
      expect(qualityTemplate.instructions).toContain('Report Status');
    });
  });
});
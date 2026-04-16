/**
 * Skill Template Workflow Modules - Verify
 *
 * Verification skill with Iron Law enforcement.
 */
import type { SkillTemplate, CommandTemplate } from '../types.js';

export function getVerifyChangeSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-verify-change',
    description: 'Verify implementation matches change artifacts with Iron Law enforcement - evidence before claims, always. Use when the user wants to validate that implementation is complete, correct, and coherent before archiving.',
    instructions: getVerifyInstructions(),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

export function getOpsxVerifyCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Verify',
    description: 'Verify implementation matches change artifacts before archiving (with Iron Law enforcement)',
    category: 'Workflow',
    tags: ['workflow', 'verify', 'experimental', 'iron-law'],
    content: getVerifyInstructions(),
  };
}

function getVerifyInstructions(): string {
  return `Verify that an implementation matches the change artifacts (specs, tasks, design).

## IRON LAW: Evidence Before Claims

**NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE**

If you haven't run the verification command in this message, you cannot claim it passes.

### The Gate Function

BEFORE claiming any status or expressing satisfaction:

1. **IDENTIFY**: What command proves this claim?
2. **RUN**: Execute the FULL command (fresh, complete)
3. **READ**: Full output, check exit code, count failures
4. **VERIFY**: Does output confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. **ONLY THEN**: Make the claim

### Red Flags - STOP

- Using "should", "probably", "seems to", "likely"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!")
- About to archive without verification
- Trusting subagent reports without checking VCS diff
- Relying on partial verification
- Thinking "just this once"

### Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence ≠ evidence |
| "Just this once" | No exceptions |
| "Tests look good" | Run them and count |
| "Agent said success" | Verify independently |

---

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run \`openspec list --json\` to get available changes. Use the **AskUserQuestion tool** to let the user select.

   Show changes that have implementation tasks (tasks artifact exists).
   Include the schema used for each change if available.
   Mark changes with incomplete tasks as "(In Progress)".

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Check status to understand the schema**
   \`\`\`bash
   openspec status --change "<name>" --json
   \`\`\`
   Parse the JSON to understand:
   - \`schemaName\`: The workflow being used (e.g., "spec-driven")
   - Which artifacts exist for this change

3. **Get the change directory and load artifacts**

   \`\`\`bash
   openspec instructions apply --change "<name>" --json
   \`\`\`

   This returns the change directory and \`contextFiles\` (artifact ID -> array of concrete file paths). Read all available artifacts from \`contextFiles\`.

4. **Initialize verification report structure**

   Create a report structure with four sections:
   - **Iron Law Compliance**: Track evidence vs claims
   - **Completeness**: Track tasks and spec coverage
   - **Correctness**: Track requirement implementation and scenario coverage
   - **Coherence**: Track design adherence and pattern consistency

5. **Verify Iron Law Compliance**

   Check for:
   - Claims made without fresh command output shown
   - Weasel words in any artifacts or messages
   - Test claims without test output
   - Build claims without build output
   - Bug fix claims without symptom test

   For regression tests, verify red-green cycle:
   - Test fails when bug present (red)
   - Test passes after fix (green)
   - Test fails when fix reverted (confirms test valid)

   **Iron Law Violation** → BLOCK archive, require fresh verification.

6. **Verify Completeness**

   **Task Completion**:
   - If \`contextFiles.tasks\` exists, read every file path in it
   - Parse checkboxes: \`- [ ]\` (incomplete) vs \`- [x]\` (complete)
   - Count complete vs total tasks
   - If incomplete tasks exist:
     - Add CRITICAL issue for each incomplete task
     - Recommendation: "Complete task: <description>" or "Mark as done if already implemented"

   **Spec Coverage**:
   - If delta specs exist in \`openspec/changes/<name>/specs/\`:
     - Extract all requirements (marked with "### Requirement:")
     - For each requirement:
       - Search codebase for keywords related to the requirement
       - Assess if implementation likely exists
     - If requirements appear unimplemented:
       - Add CRITICAL issue: "Requirement not found: <requirement name>"
       - Recommendation: "Implement requirement X: <description>"

7. **Verify Correctness**

   **Requirement Implementation Mapping**:
   - For each requirement from delta specs:
     - Search codebase for implementation evidence
     - If found, note file paths and line ranges
     - Assess if implementation matches requirement intent
     - If divergence detected:
       - Add WARNING: "Implementation may diverge from spec: <details>"
       - Recommendation: "Review <file>:<lines> against requirement X"

   **Scenario Coverage**:
   - For each scenario in delta specs (marked with "#### Scenario:"):
     - Check if conditions are handled in code
     - Check if tests exist covering the scenario
     - If scenario appears uncovered:
       - Add WARNING: "Scenario not covered: <scenario name>"
       - Recommendation: "Add test or implementation for scenario: <description>"

8. **Verify Coherence**

   **Design Adherence**:
   - If \`contextFiles.design\` exists:
     - Extract key decisions (look for sections like "Decision:", "Approach:", "Architecture:")
     - Verify implementation follows those decisions
     - If contradiction detected:
       - Add WARNING: "Design decision not followed: <decision>"
       - Recommendation: "Update implementation or revise design.md to match reality"
   - If no design.md: Skip design adherence check, note "No design.md to verify against"

   **Code Pattern Consistency**:
   - Review new code for consistency with project patterns
   - Check file naming, directory structure, coding style
   - If significant deviations found:
     - Add SUGGESTION: "Code pattern deviation: <details>"
     - Recommendation: "Consider following project pattern: <example>"

9. **Generate Verification Report**

   **Iron Law Compliance Section (First)**:
   \`\`\`
   ### Iron Law Compliance
   | Check                        | Status   |
   |------------------------------|----------|
   | Fresh evidence for claims    | ✅/❌    |
   | No weasel words              | ✅/❌    |
   | Regression tests verified    | ✅/❌/N/A|
   \`\`\`

   If Iron Law violations found:
   \`\`\`
   ⛔ IRON LAW VIOLATION: Claims made without fresh evidence
   Cannot proceed to archive. Run verification commands and report output.
   \`\`\`

   **Summary Scorecard**:
   \`\`\`
   ### Summary
   | Dimension    | Status           |
   |--------------|------------------|
   | Completeness | X/Y tasks, N reqs|
   | Correctness  | M/N reqs covered |
   | Coherence    | Followed/Issues  |
   \`\`\`

   **Issues by Priority**:

   1. **CRITICAL** (Must fix before archive):
      - Iron Law violations
      - Incomplete tasks
      - Missing requirement implementations
      - Each with specific, actionable recommendation

   2. **WARNING** (Should fix):
      - Spec/design divergences
      - Missing scenario coverage
      - Each with specific recommendation

   3. **SUGGESTION** (Nice to fix):
      - Pattern inconsistencies
      - Minor improvements
      - Each with specific recommendation

   **Final Assessment**:
   - If Iron Law violations: "⛔ Iron Law violation. Cannot archive without fresh evidence."
   - If CRITICAL issues: "X critical issue(s) found. Fix before archiving."
   - If only warnings: "No critical issues. Y warning(s) to consider. Ready for archive (with noted improvements)."
   - If all clear: "✅ All checks passed including Iron Law. Ready for archive."

**Verification Heuristics**

- **Iron Law**: Zero tolerance - any claim without evidence is a violation
- **Completeness**: Focus on objective checklist items (checkboxes, requirements list)
- **Correctness**: Use keyword search, file path analysis, reasonable inference - don't require perfect certainty
- **Coherence**: Look for glaring inconsistencies, don't nitpick style
- **False Positives**: When uncertain, prefer SUGGESTION over WARNING, WARNING over CRITICAL (except Iron Law)
- **Actionability**: Every issue must have a specific recommendation with file/line references where applicable

**Graceful Degradation**

- If only tasks.md exists: verify task completion and Iron Law only, skip spec/design checks
- If tasks + specs exist: verify completeness, correctness, and Iron Law, skip design
- If full artifacts: verify all dimensions plus Iron Law
- Always note which checks were skipped and why

**Output Format**

Use clear markdown with:
- Iron Law compliance table FIRST (blocks if failed)
- Table for summary scorecard
- Grouped lists for issues (CRITICAL/WARNING/SUGGESTION)
- Code references in format: \`file.ts:123\`
- Specific, actionable recommendations
- No vague suggestions like "consider reviewing"`;
}
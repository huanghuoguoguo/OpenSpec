# Delta for opsx-verify-skill

## ADDED Requirements

### Requirement: Verification Iron Law
The agent MUST NOT claim completion without fresh verification evidence.

#### Scenario: Gate before claims
- **WHEN** agent is about to claim "complete", "passing", or "fixed"
- **THEN** the agent MUST have run verification command in current message
- **AND** claim is ONLY made after seeing fresh output
- **AND** previous runs are NOT sufficient evidence

#### Scenario: Evidence before assertions
- **WHEN** making any positive statement about work state
- **THEN** the agent follows sequence:
  1. IDENTIFY: What command proves this claim
  2. RUN: Execute the FULL command (fresh, complete)
  3. READ: Full output, check exit code, count failures
  4. VERIFY: Does output confirm the claim?
  5. ONLY THEN: Make the claim

#### Scenario: Test verification
- **WHEN** claiming "tests pass"
- **THEN** agent MUST show fresh test command output with 0 failures
- **AND** "should pass" or "probably works" are NOT sufficient

#### Scenario: Build verification
- **WHEN** claiming "build succeeds"
- **THEN** agent MUST show fresh build command with exit 0
- **AND** linter passing is NOT sufficient (linter ≠ compiler)

#### Scenario: Bug fix verification
- **WHEN** claiming "bug fixed"
- **THEN** agent MUST run test for original symptom
- **AND** show the test now passes
- **AND** code changed alone is NOT sufficient

### Requirement: Red Flags Detection
The agent SHALL flag and prevent rationalization patterns.

#### Scenario: Detect weasel words
- **WHEN** agent uses "should", "probably", "seems to", "likely"
- **THEN** verification report flags as RED FLAG
- **AND** requires actual verification before proceeding

#### Scenario: Detect premature satisfaction
- **WHEN** agent expresses satisfaction ("Great!", "Perfect!", "Done!") before verification
- **THEN** verification report flags as RED FLAG
- **AND** requires actual verification run

#### Scenario: Detect partial verification
- **WHEN** agent relies on partial check (e.g., "linter passed" for build)
- **THEN** verification report flags as rationalization
- **AND** requires full verification command

#### Scenario: Detect trust without evidence
- **WHEN** agent trusts subagent report without checking VCS diff
- **THEN** verification report flags as trust issue
- **AND** requires independent verification

### Requirement: Regression Test Verification
The agent SHALL verify regression tests with red-green cycle.

#### Scenario: Regression test creation
- **WHEN** agent writes a regression test
- **THEN** agent MUST verify:
  1. Test fails when bug is present (red)
  2. Test passes after fix (green)
  3. Test fails when fix is reverted (confirms test is valid)

#### Scenario: Incomplete regression test
- **WHEN** agent claims "regression test added" without red-green verification
- **THEN** verification report flags as CRITICAL
- **AND** requires full red-green cycle verification

## MODIFIED Requirements

### Requirement: Verification Report Format
The agent SHALL produce a structured, prioritized report with iron law enforcement.

#### Scenario: Report summary with iron law status
- **WHEN** verification completes
- **THEN** display summary scorecard INCLUDING iron law compliance:
  ```text
  ## Verification Report: <change-name>

  ### Iron Law Compliance
  | Check                    | Status   |
  |--------------------------|----------|
  | Fresh evidence for claims| ✅/❌    |
  | No weasel words          | ✅/❌    |
  | Full verification run    | ✅/❌    |

  ### Summary
  | Dimension    | Status   |
  |--------------|----------|
  | Completeness | X/Y      |
  | Correctness  | X/Y      |
  | Coherence    | Followed |
  ```

#### Scenario: Iron law violation blocks archive
- **WHEN** iron law checks fail
- **THEN** report displays:
  ```text
  ⛔ IRON LAW VIOLATION: Claims made without fresh evidence
  Cannot proceed to archive. Run verification commands and report output.
  ```
- **AND** do NOT suggest archive

#### Scenario: Iron law passed
- **WHEN** all iron law checks pass
- **THEN** display:
  ```text
  ✅ Iron Law compliant - all claims backed by fresh evidence
  ```
- **AND** proceed with normal verification checks
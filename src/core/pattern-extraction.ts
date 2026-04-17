/**
 * Pattern Extraction - Extract patterns from change documents
 *
 * Used by archive-learn integration to capture project-level patterns.
 */
import { promises as fs } from 'fs';
import path from 'path';
import {
  type Instinct,
  INSTINCT_DOMAINS,
  CONFIDENCE_LEVELS,
  createInstinct,
  shouldStoreAtProjectLevel,
} from './templates/workflows/learning-system.js';

/**
 * Extract patterns from an archived change
 */
export async function extractPatternsFromChange(
  archivePath: string,
  changeName: string
): Promise<Instinct[]> {
  const patterns: Instinct[] = [];

  // Extract from design.md
  const designPath = path.join(archivePath, 'design.md');
  try {
    const designContent = await fs.readFile(designPath, 'utf-8');
    const designPatterns = extractPatternsFromDesign(designContent, changeName);
    patterns.push(...designPatterns);
  } catch {
    // design.md may not exist
  }

  // Extract from tasks.md
  const tasksPath = path.join(archivePath, 'tasks.md');
  try {
    const tasksContent = await fs.readFile(tasksPath, 'utf-8');
    const taskPatterns = extractPatternsFromTasks(tasksContent, changeName);
    patterns.push(...taskPatterns);
  } catch {
    // tasks.md may not exist
  }

  return patterns;
}

/**
 * Extract patterns from design.md (focus on decisions section)
 */
function extractPatternsFromDesign(content: string, changeName: string): Instinct[] {
  const patterns: Instinct[] = [];

  // Find decisions section (handle multiple newlines)
  const decisionsMatch = content.match(/## Decisions\n+([\s\S]*?)(?=\n##|$)/);
  if (!decisionsMatch) return patterns;

  const decisionsContent = decisionsMatch[1];

  // Parse individual decisions (look for D1, D2, etc.)
  const decisionBlocks = decisionsContent.split(/### D\d+: /).filter(Boolean);

  for (const block of decisionBlocks) {
    const lines = block.trim().split('\n');
    const title = lines[0]?.trim();
    if (!title) continue;

    // Extract choice (support both Chinese and English formats)
    const choiceMatch = block.match(/\*\*选择\*\*:\s*(.+)/) || block.match(/\*\*Choice\*\*:\s*(.+)/);
    const choice = choiceMatch?.[1]?.trim();

    // Extract rationale (support both Chinese and English formats)
    const rationaleMatch = block.match(/\*\*理由\*\*:([\s\S]*?)(?=\*\*替代|$)/) ||
                           block.match(/\*\*Rationale\*\*:([\s\S]*?)(?=\*\*Alternative|$)/);
    const rationale = rationaleMatch?.[1]?.trim();

    if (choice && rationale) {
      const instinct = createInstinct(
        `decision-${slugify(title)}`,
        `when facing ${title.toLowerCase()}`,
        `Choose ${choice}`,
        classifyDomain(title, rationale),
        [`Design decision from change ${changeName}: ${title}`]
      );
      patterns.push(instinct);
    }
  }

  return patterns;
}

/**
 * Extract patterns from tasks.md (focus on implementation patterns)
 */
function extractPatternsFromTasks(content: string, changeName: string): Instinct[] {
  const patterns: Instinct[] = [];

  // Parse completed tasks
  const taskLines = content.split('\n').filter(line => line.match(/- \[x\] \d+\.\d+/));

  for (const line of taskLines) {
    const taskMatch = line.match(/- \[x\] (\d+\.\d+) (.+)/);
    if (!taskMatch) continue;

    const taskId = taskMatch[1];
    const taskDesc = taskMatch[2].trim();

    // Extract implementation patterns
    const implPatterns = extractImplementationPatterns(taskDesc, changeName);
    patterns.push(...implPatterns);
  }

  return patterns;
}

/**
 * Extract implementation pattern keywords from task description
 */
function extractImplementationPatterns(taskDesc: string, changeName: string): Instinct[] {
  const patterns: Instinct[] = [];

  // Look for implementation keywords
  const implKeywords = [
    { keyword: 'update', domain: 'workflow', action: 'Update existing code before adding new' },
    { keyword: 'create', domain: 'workflow', action: 'Create new module/file structure' },
    { keyword: 'add', domain: 'workflow', action: 'Add functionality to existing system' },
    { keyword: 'implement', domain: 'workflow', action: 'Implement according to spec' },
    { keyword: 'test', domain: 'testing', action: 'Write tests for implemented code' },
    { keyword: 'document', domain: 'workflow', action: 'Document changes and decisions' },
  ];

  for (const { keyword, domain, action } of implKeywords) {
    if (taskDesc.toLowerCase().includes(keyword)) {
      const instinct = createInstinct(
        `impl-${slugify(taskDesc.slice(0, 30))}`,
        `when ${keyword}ing code`,
        action,
        domain,
        [`Implementation pattern from change ${changeName}: ${taskDesc}`]
      );
      patterns.push(instinct);
    }
  }

  return patterns;
}

/**
 * Classify domain based on content
 */
function classifyDomain(title: string, content: string): string {
  const combined = `${title} ${content}`.toLowerCase();

  // Domain keywords
  const domainKeywords: Record<string, string[]> = {
    'code-style': ['style', 'format', 'naming', 'functional', 'class', 'pattern'],
    'testing': ['test', 'spec', 'verify', 'assert', 'mock', 'fixture'],
    'git': ['commit', 'branch', 'merge', 'push', 'pull', 'version'],
    'debugging': ['debug', 'error', 'fix', 'issue', 'bug', 'trace'],
    'workflow': ['workflow', 'process', 'step', 'phase', 'flow', 'sequence'],
    'security': ['auth', 'permission', 'secure', 'encrypt', 'token', 'credential'],
    'tooling': ['tool', 'cli', 'command', 'script', 'build', 'compile'],
  };

  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    if (keywords.some(kw => combined.includes(kw))) {
      return domain;
    }
  }

  return 'workflow'; // Default domain
}

/**
 * Slugify text for instinct ID
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 40);
}

/**
 * Match pattern with existing instincts for confidence boost
 */
export function matchExistingInstinct(
  newPattern: Instinct,
  existingInstincts: Instinct[]
): Instinct | null {
  for (const existing of existingInstincts) {
    // Check if trigger and action are similar
    if (
      existing.domain === newPattern.domain &&
      similarTrigger(existing.trigger, newPattern.trigger)
    ) {
      return existing;
    }
  }
  return null;
}

/**
 * Check if triggers are similar (requires high similarity)
 */
function similarTrigger(a: string, b: string): boolean {
  const wordsA = a.toLowerCase().split(/\s+/);
  const wordsB = b.toLowerCase().split(/\s+/);
  const commonWords = wordsA.filter(w => wordsB.includes(w));
  // Require 80% word match for similarity (to avoid false matches)
  const minLen = Math.min(wordsA.length, wordsB.length);
  // For short triggers (≤3 words), require exact match
  if (minLen <= 3) {
    return commonWords.length === minLen;
  }
  return commonWords.length > minLen * 0.8;
}
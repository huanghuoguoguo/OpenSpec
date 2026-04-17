/**
 * Worktree Manager - Git worktree isolation for parallel change development
 *
 * Provides worktree creation, listing, merging, and cleanup for
 * isolated change implementation environments.
 */
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import crypto from 'crypto';

const execAsync = promisify(exec);

// Worktree constants
export const WORKTREE_DIR = '.worktrees';
export const WORKTREE_PREFIX = 'openspec-';
export const WIP_BRANCH_SUFFIX = '-wip';
export const MIN_GIT_VERSION = '2.5.0';

export interface WorktreeInfo {
  name: string;
  changeName: string;
  path: string;
  branch: string;
  createdAt: string;
  status: 'active' | 'stale' | 'merged';
}

export interface MergeResult {
  success: boolean;
  conflicts: string[];
  message: string;
}

/**
 * Check if git version meets minimum requirement
 */
export async function checkGitVersion(): Promise<{ valid: boolean; version: string }> {
  try {
    const { stdout } = await execAsync('git --version');
    const versionMatch = stdout.match(/git version (\d+\.\d+\.\d+)/);
    if (!versionMatch) {
      return { valid: false, version: 'unknown' };
    }
    const version = versionMatch[1];
    const valid = compareVersions(version, MIN_GIT_VERSION) >= 0;
    return { valid, version };
  } catch {
    return { valid: false, version: 'not installed' };
  }
}

/**
 * Compare two version strings (returns -1, 0, or 1)
 */
function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const valA = partsA[i] || 0;
    const valB = partsB[i] || 0;
    if (valA < valB) return -1;
    if (valA > valB) return 1;
  }
  return 0;
}

/**
 * Generate worktree name from change name
 */
export function generateWorktreeName(changeName: string): string {
  const hash = crypto.randomBytes(3).toString('hex');
  return `${WORKTREE_PREFIX}${changeName}-${hash}`;
}

/**
 * Generate branch name for change
 */
export function generateBranchName(changeName: string): string {
  return `${changeName}${WIP_BRANCH_SUFFIX}`;
}

/**
 * Get worktree directory path
 */
export function getWorktreePath(repoRoot: string, worktreeName: string): string {
  return path.join(repoRoot, WORKTREE_DIR, worktreeName);
}

/**
 * Get all worktrees directory path
 */
export function getWorktreesDir(repoRoot: string): string {
  return path.join(repoRoot, WORKTREE_DIR);
}

/**
 * WorktreeManager class for managing OpenSpec worktrees
 */
export class WorktreeManager {
  private repoRoot: string;

  constructor(repoRoot: string = process.cwd()) {
    this.repoRoot = repoRoot;
  }

  /**
   * Create a new worktree for a change
   */
  async create(changeName: string): Promise<WorktreeInfo> {
    // Check git version
    const versionCheck = await checkGitVersion();
    if (!versionCheck.valid) {
      throw new Error(`Git worktree requires git >= ${MIN_GIT_VERSION}. Found: ${versionCheck.version}`);
    }

    const worktreeName = generateWorktreeName(changeName);
    const branchName = generateBranchName(changeName);
    const worktreePath = getWorktreePath(this.repoRoot, worktreeName);
    const worktreesDir = getWorktreesDir(this.repoRoot);

    // Check if worktree already exists
    try {
      await fs.access(worktreePath);
      throw new Error(`Worktree '${worktreeName}' already exists at ${worktreePath}`);
    } catch (err: any) {
      if (err.code !== 'ENOENT') throw err;
    }

    // Create worktrees directory
    await fs.mkdir(worktreesDir, { recursive: true });

    // Create branch and worktree
    // git worktree add <path> -b <branch>
    await execAsync(`git worktree add "${worktreePath}" -b "${branchName}"`, {
      cwd: this.repoRoot,
    });

    return {
      name: worktreeName,
      changeName,
      path: worktreePath,
      branch: branchName,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
  }

  /**
   * List all OpenSpec-managed worktrees
   */
  async list(): Promise<WorktreeInfo[]> {
    const worktreesDir = getWorktreesDir(this.repoRoot);

    try {
      await fs.access(worktreesDir);
    } catch {
      return [];
    }

    const entries = await fs.readdir(worktreesDir, { withFileTypes: true });
    const worktrees: WorktreeInfo[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory() || !entry.name.startsWith(WORKTREE_PREFIX)) {
        continue;
      }

      const worktreePath = path.join(worktreesDir, entry.name);
      const changeName = entry.name.slice(WORKTREE_PREFIX.length).replace(/-[a-f0-9]{6}$/, '');
      const branchName = generateBranchName(changeName);

      // Get status by checking if branch exists and worktree is valid
      let status: 'active' | 'stale' | 'merged' = 'active';
      try {
        const { stdout } = await execAsync(`git worktree list`, { cwd: this.repoRoot });
        if (!stdout.includes(worktreePath)) {
          status = 'stale';
        }
        // Check if branch is merged
        const { stdout: branchCheck } = await execAsync(
          `git branch --merged HEAD --list "${branchName}"`,
          { cwd: this.repoRoot }
        );
        if (branchCheck.trim()) {
          status = 'merged';
        }
      } catch {
        status = 'stale';
      }

      worktrees.push({
        name: entry.name,
        changeName,
        path: worktreePath,
        branch: branchName,
        createdAt: '', // Would need to read from metadata
        status,
      });
    }

    return worktrees;
  }

  /**
   * Merge worktree changes back to main branch
   */
  async merge(worktreeName: string, options: { autoClean?: boolean } = {}): Promise<MergeResult> {
    const worktreePath = getWorktreePath(this.repoRoot, worktreeName);
    const changeName = worktreeName.slice(WORKTREE_PREFIX.length).replace(/-[a-f0-9]{6}$/, '');
    const branchName = generateBranchName(changeName);

    // Check worktree exists
    try {
      await fs.access(worktreePath);
    } catch {
      throw new Error(`Worktree '${worktreeName}' not found at ${worktreePath}`);
    }

    // Get current branch (main)
    const { stdout: currentBranch } = await execAsync(
      'git rev-parse --abbrev-ref HEAD',
      { cwd: this.repoRoot }
    );
    const mainBranch = currentBranch.trim();

    // Attempt merge
    try {
      await execAsync(`git merge "${branchName}" --no-edit`, { cwd: this.repoRoot });

      // Success - optionally clean up
      if (options.autoClean) {
        await this.clean(worktreeName, { deleteBranch: true });
      }

      return {
        success: true,
        conflicts: [],
        message: `Successfully merged '${branchName}' into '${mainBranch}'`,
      };
    } catch (err: any) {
      // Check for conflicts
      const { stdout: statusOutput } = await execAsync('git status --porcelain', {
        cwd: this.repoRoot,
      });
      const conflicts = statusOutput
        .split('\n')
        .filter(line => line.startsWith('UU') || line.startsWith('AA') || line.startsWith('DD'))
        .map(line => line.slice(3));

      if (conflicts.length > 0) {
        return {
          success: false,
          conflicts,
          message: `Merge conflict in ${conflicts.length} files. Resolve conflicts before proceeding.`,
        };
      }

      throw new Error(`Merge failed: ${err.message}`);
    }
  }

  /**
   * Clean/remove a worktree
   */
  async clean(
    worktreeName: string,
    options: { deleteBranch?: boolean; force?: boolean } = {}
  ): Promise<void> {
    const worktreePath = getWorktreePath(this.repoRoot, worktreeName);
    const changeName = worktreeName.slice(WORKTREE_PREFIX.length).replace(/-[a-f0-9]{6}$/, '');
    const branchName = generateBranchName(changeName);

    // Check for uncommitted changes unless force
    if (!options.force) {
      try {
        const { stdout } = await execAsync('git status --porcelain', { cwd: worktreePath });
        if (stdout.trim()) {
          throw new Error(
            `Worktree '${worktreeName}' has uncommitted changes. Use --force to clean anyway.`
          );
        }
      } catch {
        // Worktree might not be valid git repo anymore, proceed
      }
    }

    // Remove worktree via git
    try {
      await execAsync(`git worktree remove "${worktreePath}"`, { cwd: this.repoRoot });
    } catch (err: any) {
      // Fallback: manual removal
      await fs.rm(worktreePath, { recursive: true, force: true });
    }

    // Delete branch if requested
    if (options.deleteBranch) {
      try {
        await execAsync(`git branch -D "${branchName}"`, { cwd: this.repoRoot });
      } catch {
        // Branch might already be deleted or merged
      }
    }
  }

  /**
   * Clean all OpenSpec worktrees
   */
  async cleanAll(options: { deleteBranches?: boolean; force?: boolean } = {}): Promise<number> {
    const worktrees = await this.list();
    let count = 0;

    for (const wt of worktrees) {
      try {
        await this.clean(wt.name, { deleteBranch: options.deleteBranches, force: options.force });
        count++;
      } catch {
        // Skip failed cleanups
      }
    }

    return count;
  }
}

export default WorktreeManager;
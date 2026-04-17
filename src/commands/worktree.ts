/**
 * Worktree CLI Commands
 *
 * Manage git worktrees for isolated change implementation.
 */
import { Command } from 'commander';
import chalk from 'chalk';
import {
  WorktreeManager,
  checkGitVersion,
  WORKTREE_PREFIX,
} from '../core/worktree.js';

/**
 * Register worktree commands with the program
 */
export function registerWorktreeCommand(program: Command): void {
  const worktreeCmd = program
    .command('worktree')
    .description('Manage git worktrees for parallel change development')
    .hook('preAction', async () => {
      // Check git version before any worktree command
      const versionCheck = await checkGitVersion();
      if (!versionCheck.valid) {
        console.error(chalk.red(`Error: Git worktree requires git >= 2.5.0`));
        console.error(chalk.yellow(`Found: git version ${versionCheck.version}`));
        process.exit(1);
      }
    });

  // worktree create
  worktreeCmd
    .command('create <change>')
    .description('Create a new worktree for a change')
    .option('--branch <name>', 'Custom branch name (default: <change>-wip)')
    .action(async (change: string, options: { branch?: string }) => {
      const manager = new WorktreeManager();
      try {
        const info = await manager.create(change);
        console.log(chalk.green(`✓ Created worktree for '${change}'`));
        console.log(`  Path: ${info.path}`);
        console.log(`  Branch: ${info.branch}`);
        console.log(`\nRun tasks in the worktree:`);
        console.log(chalk.gray(`  cd "${info.path}"`));
        console.log(chalk.gray(`  /opsx:apply`));
      } catch (err: any) {
        console.error(chalk.red(`Error: ${err.message}`));
        process.exit(1);
      }
    });

  // worktree list
  worktreeCmd
    .command('list')
    .description('List all OpenSpec-managed worktrees')
    .option('--json', 'Output as JSON')
    .action(async (options: { json?: boolean }) => {
      const manager = new WorktreeManager();
      const worktrees = await manager.list();

      if (options.json) {
        console.log(JSON.stringify(worktrees, null, 2));
        return;
      }

      if (worktrees.length === 0) {
        console.log(chalk.gray('No OpenSpec worktrees found.'));
        console.log(chalk.gray(`Worktrees are stored in .worktrees/${WORKTREE_PREFIX}*/`));
        return;
      }

      console.log(chalk.bold('OpenSpec Worktrees:'));
      console.log();

      for (const wt of worktrees) {
        const statusColor = wt.status === 'active' ? chalk.green :
          wt.status === 'merged' ? chalk.blue : chalk.yellow;
        console.log(`  ${chalk.bold(wt.changeName)} ${statusColor(`(${wt.status})`)}`);
        console.log(`    Path: ${wt.path}`);
        console.log(`    Branch: ${wt.branch}`);
        console.log();
      }

      console.log(chalk.gray(`Total: ${worktrees.length} worktrees`));
    });

  // worktree merge
  worktreeCmd
    .command('merge <worktree>')
    .description('Merge worktree changes back to main branch')
    .option('--clean', 'Clean worktree after successful merge')
    .option('--delete-branch', 'Delete branch after merge')
    .action(async (worktree: string, options: { clean?: boolean; deleteBranch?: boolean }) => {
      const manager = new WorktreeManager();
      try {
        const result = await manager.merge(worktree, {
          autoClean: options.clean,
        });

        if (result.success) {
          console.log(chalk.green(`✓ ${result.message}`));
          if (options.deleteBranch) {
            console.log(chalk.gray(`Branch cleaned.`));
          }
        } else {
          console.log(chalk.yellow(result.message));
          console.log(chalk.bold('\nConflicting files:'));
          for (const file of result.conflicts) {
            console.log(chalk.red(`  ✗ ${file}`));
          }
          console.log(chalk.gray('\nResolve conflicts then run:'));
          console.log(chalk.gray(`  git add <resolved-files>`));
          console.log(chalk.gray(`  git commit`));
          process.exit(1);
        }
      } catch (err: any) {
        console.error(chalk.red(`Error: ${err.message}`));
        process.exit(1);
      }
    });

  // worktree clean
  worktreeCmd
    .command('clean [worktree]')
    .description('Remove a worktree (or all worktrees with --all)')
    .option('--all', 'Clean all OpenSpec worktrees')
    .option('--delete-branch', 'Delete associated branch')
    .option('--force', 'Force clean even with uncommitted changes')
    .action(async (worktree: string | undefined, options: { all?: boolean; deleteBranch?: boolean; force?: boolean }) => {
      const manager = new WorktreeManager();

      if (options.all) {
        const count = await manager.cleanAll({
          deleteBranches: options.deleteBranch,
          force: options.force,
        });
        console.log(chalk.green(`✓ Cleaned ${count} worktrees`));
        return;
      }

      if (!worktree) {
        console.error(chalk.red('Error: Specify a worktree name or use --all'));
        process.exit(1);
        return;
      }

      try {
        await manager.clean(worktree, {
          deleteBranch: options.deleteBranch,
          force: options.force,
        });
        console.log(chalk.green(`✓ Cleaned worktree '${worktree}'`));
        if (options.deleteBranch) {
          console.log(chalk.gray(`Branch deleted.`));
        }
      } catch (err: any) {
        if (err.message.includes('uncommitted changes')) {
          console.error(chalk.yellow(`Warning: ${err.message}`));
          console.log(chalk.gray('\nUse --force to clean anyway (changes will be lost).'));
        } else {
          console.error(chalk.red(`Error: ${err.message}`));
        }
        process.exit(1);
      }
    });
}

export default registerWorktreeCommand;
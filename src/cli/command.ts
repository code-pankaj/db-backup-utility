import { Command } from 'commander';
import { backupCmd } from './backupCmd.ts';
import { restoreCmd } from './restoreCmd.ts';
import { testConnCmd } from './testConnCmd.ts';

export function registerCommands(program: Command) {
  program
    .name('db-backup')
    .description('CLI tool to backup and restore SQL databases (local only)')
    .version('0.1.0');

  program.addCommand(backupCmd);
  program.addCommand(restoreCmd);
  program.addCommand(testConnCmd);
}
import { program } from 'commander';
import { registerCommands } from './cli/command.ts';
import { initLogger } from './logger/logger.ts';

initLogger();
registerCommands(program);
program.parse(process.argv);
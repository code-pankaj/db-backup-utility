import { Command } from 'commander';
import { loadConfig } from '../config/config.ts';
import { BackupService } from '../backup/backupService.ts';

export const backupCmd = new Command('backup')
  .description('Backup a database to local storage')
  .option('-n, --name <name>', 'Name of the database configuration to backup')
  .option('-a, --all', 'Backup all configured databases')
  .action(async (options) => {
    const logger = (global as any).logger;
    const config = loadConfig();

    if (!config.databases || config.databases.length === 0) {
      logger.error('No databases configured in config.json');
      console.log('\nPlease add database configurations to config.json');
      return;
    }

    const backupService = new BackupService();

    if (options.all) {
      // Backup all databases
      logger.info(`Starting backup for all ${config.databases.length} databases...`);
      
      for (const dbConfig of config.databases) {
        await backupService.performBackup(dbConfig, config.defaultBackupDir);
      }
    } else if (options.name) {
      // Backup specific database
      const dbConfig = config.databases.find((db) => db.name === options.name);
      
      if (!dbConfig) {
        logger.error(`Database configuration not found: ${options.name}`);
        console.log('\nAvailable databases:');
        config.databases.forEach((db) => console.log(`  - ${db.name}`));
        return;
      }

      await backupService.performBackup(dbConfig, config.defaultBackupDir);
    } else {
      // No options provided, show available databases
      logger.info('Available databases:');
      config.databases.forEach((db) => {
        console.log(`  - ${db.name} (${db.type})`);
      });
      console.log('\nUsage:');
      console.log('  npm run dev -- backup --name <database-name>');
      console.log('  npm run dev -- backup --all');
    }
  });
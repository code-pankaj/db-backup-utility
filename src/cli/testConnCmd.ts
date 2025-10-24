import { Command } from 'commander';
import { loadConfig } from '../config/config.ts';
import { testConnection } from '../db/connection.ts';

export const testConnCmd = new Command('test-connection')
  .description('Test database connection')
  .option('-n, --name <name>', 'Name of the database configuration to test')
  .option('-a, --all', 'Test all configured databases')
  .action(async (options) => {
    const logger = (global as any).logger;
    const config = loadConfig();

    if (!config.databases || config.databases.length === 0) {
      logger.error('No databases configured in config.json');
      console.log('\nPlease add database configurations to config.json');
      return;
    }

    if (options.all) {
      // Test all databases
      logger.info(`Testing connections for all ${config.databases.length} databases...`);
      
      let successCount = 0;
      for (const dbConfig of config.databases) {
        const success = await testConnection(dbConfig);
        if (success) successCount++;
      }

      console.log(`\n${successCount}/${config.databases.length} connections successful`);
    } else if (options.name) {
      // Test specific database
      const dbConfig = config.databases.find((db) => db.name === options.name);
      
      if (!dbConfig) {
        logger.error(`Database configuration not found: ${options.name}`);
        console.log('\nAvailable databases:');
        config.databases.forEach((db) => console.log(`  - ${db.name}`));
        return;
      }

      await testConnection(dbConfig);
    } else {
      // No options provided, show available databases
      logger.info('Available databases:');
      config.databases.forEach((db) => {
        console.log(`  - ${db.name} (${db.type})`);
      });
      console.log('\nUsage:');
      console.log('  npm run dev -- test-connection --name <database-name>');
      console.log('  npm run dev -- test-connection --all');
    }
  });
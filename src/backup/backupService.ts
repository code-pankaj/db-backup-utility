import type { DatabaseConfig, BackupResult } from '../types/index.ts';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs-extra';
import * as tar from 'tar';
import which from 'which';

const execAsync = promisify(exec);

export class BackupService {
  private logger: any;

  constructor() {
    this.logger = (global as any).logger;
  }

  async performBackup(
    config: DatabaseConfig,
    backupDir: string
  ): Promise<BackupResult> {
    const startTime = Date.now();
    this.logger.info(`Starting backup for database: ${config.name}`);

    try {
      // Ensure backup directory exists
      await fs.ensureDir(backupDir);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${config.name}_${timestamp}`;
      const backupPath = path.join(backupDir, fileName);

      let dumpFile: string;

      switch (config.type) {
        case 'postgresql':
          dumpFile = await this.backupPostgreSQL(config, backupPath);
          break;
        case 'mysql':
          dumpFile = await this.backupMySQL(config, backupPath);
          break;
        case 'sqlite':
          dumpFile = await this.backupSQLite(config, backupPath);
          break;
        default:
          throw new Error(`Unsupported database type: ${config.type}`);
      }

      // Compress the backup
      const compressedFile = await this.compressBackup(dumpFile);

      // Remove uncompressed file
      await fs.remove(dumpFile);

      const duration = Date.now() - startTime;
      this.logger.info(
        `✓ Backup completed successfully in ${duration}ms: ${compressedFile}`
      );

      return {
        success: true,
        filePath: compressedFile,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(`✗ Backup failed for ${config.name}:`, { error: errorMessage, stack: errorStack });
      console.error('\n❌ Backup Error:', errorMessage);
      if (errorStack) {
        console.error('Stack trace:', errorStack);
      }

      return {
        success: false,
        error: errorMessage,
        duration,
      };
    }
  }

  private async backupPostgreSQL(
    config: DatabaseConfig,
    backupPath: string
  ): Promise<string> {
    const dumpFile = `${backupPath}.sql`;

    // Check if pg_dump is available
    try {
      await which('pg_dump');
    } catch {
      throw new Error(
        'pg_dump not found. Please install PostgreSQL client tools.'
      );
    }

    // Build connection string
    const connString = `postgresql://${config.user}:${config.password}@${config.host}:${config.port || 5432}/${config.database}`;

    // Use pg_dump to create backup
    const sslOption = config.ssl ? '--no-password' : '';
    const command = `pg_dump "${connString}" ${sslOption} > "${dumpFile}"`;

    this.logger.info(`Executing: pg_dump for ${config.database}`);
    await execAsync(command);

    return dumpFile;
  }

  private async backupMySQL(
    config: DatabaseConfig,
    backupPath: string
  ): Promise<string> {
    const dumpFile = `${backupPath}.sql`;

    // Check if mysqldump is available
    try {
      await which('mysqldump');
    } catch {
      throw new Error(
        'mysqldump not found. Please install MySQL client tools.'
      );
    }

    const command = `mysqldump -h ${config.host} -P ${config.port || 3306} -u ${config.user} -p${config.password} ${config.database} > "${dumpFile}"`;

    this.logger.info(`Executing: mysqldump for ${config.database}`);
    await execAsync(command);

    return dumpFile;
  }

  private async backupSQLite(
    config: DatabaseConfig,
    backupPath: string
  ): Promise<string> {
    const dumpFile = `${backupPath}.db`;

    if (!config.filePath) {
      throw new Error('SQLite file path not specified');
    }

    // Simply copy the SQLite file
    await fs.copy(config.filePath, dumpFile);

    this.logger.info(`SQLite database copied: ${config.filePath}`);
    return dumpFile;
  }

  private async compressBackup(filePath: string): Promise<string> {
    const compressedPath = `${filePath}.tar.gz`;

    this.logger.info(`Compressing backup: ${path.basename(filePath)}`);

    await tar.create(
      {
        gzip: true,
        file: compressedPath,
        cwd: path.dirname(filePath),
      },
      [path.basename(filePath)]
    );

    this.logger.info(`✓ Backup compressed: ${path.basename(compressedPath)}`);
    return compressedPath;
  }
}

import type { DatabaseConfig } from '../types/index.ts';
import pg from 'pg';
import mysql from 'mysql2/promise';

const { Client: PgClient } = pg;

export async function testConnection(config: DatabaseConfig): Promise<boolean> {
  const logger = (global as any).logger;
  
  try {
    switch (config.type) {
      case 'postgresql': {
        const client = new PgClient({
          host: config.host,
          port: config.port || 5432,
          user: config.user,
          password: config.password,
          database: config.database,
          ssl: config.ssl ? { rejectUnauthorized: false } : false,
        });
        await client.connect();
        await client.end();
        logger.info(`✓ PostgreSQL connection successful: ${config.name}`);
        return true;
      }
      
      case 'mysql': {
        const connection = await mysql.createConnection({
          host: config.host!,
          port: config.port || 3306,
          user: config.user!,
          password: config.password!,
          database: config.database!,
        });
        await connection.end();
        logger.info(`✓ MySQL connection successful: ${config.name}`);
        return true;
      }
      
      case 'sqlite': {
        // SQLite doesn't need connection testing the same way
        logger.info(`✓ SQLite database: ${config.name}`);
        return true;
      }
      
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  } catch (error) {
    logger.error(`✗ Connection failed for ${config.name}:`, error);
    return false;
  }
}

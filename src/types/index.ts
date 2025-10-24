export type DatabaseType = 'postgresql' | 'mysql' | 'sqlite';

export interface DatabaseConfig {
  name: string;
  type: DatabaseType;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  filePath?: string; // For SQLite
  ssl?: boolean;
}

export interface BackupConfig {
  defaultBackupDir: string;
  databases: DatabaseConfig[];
}

export interface BackupResult {
  success: boolean;
  filePath?: string;
  error?: string;
  duration?: number;
}

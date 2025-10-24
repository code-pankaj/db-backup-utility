import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import type { BackupConfig } from '../types/index.ts';

dotenv.config();

export const loadConfig = (): BackupConfig => {
  const cfgPath = path.resolve('config.json');
  if (fs.existsSync(cfgPath)) {
    const config = fs.readJSONSync(cfgPath);
    return config;
  }
  return { defaultBackupDir: './backups', databases: [] };
};

export const saveConfig = (config: BackupConfig): void => {
  const cfgPath = path.resolve('config.json');
  fs.writeJSONSync(cfgPath, config, { spaces: 2 });
};
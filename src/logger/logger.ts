import winston from 'winston';
import path from 'path';
import fs from 'fs-extra';

export function initLogger() {
  fs.ensureDirSync(path.resolve('logs'));
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.File({ filename: 'logs/backup.log' }),
      new winston.transports.Console({ format: winston.format.simple() })
    ],
  });
  (global as any).logger = logger;
}
# 🔄 Execution Flow Documentation

## Complete Step-by-Step Trace of Function Calls and File Execution

This document provides a **detailed, line-by-line trace** of what happens when you run any command in the DB Backup Utility. Perfect for understanding the internal execution flow, debugging, or learning how the application works.

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Command Execution Flow: `backup`](#backup-command-execution-flow)
3. [Command Execution Flow: `test-connection`](#test-connection-command-execution-flow)
4. [Detailed Function Call Traces](#detailed-function-call-traces)
5. [File System Operations](#file-system-operations)
6. [Error Handling Flow](#error-handling-flow)

---

## Overview

### Entry Point Architecture

```
User Terminal
     ↓
npm run dev -- backup --name my-db
     ↓
package.json (runs tsx src/main.ts backup --name my-db)
     ↓
src/main.ts (Entry Point)
```

---

## Backup Command Execution Flow

### Command: `npm run dev -- backup --name my-neondb`

Let's trace **every single step** from start to finish:

---

### **PHASE 1: Application Bootstrap** 
*File: `src/main.ts`*

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1.1: Process Starts                                       │
│ File: src/main.ts                                               │
│ Line: 1-3 (imports)                                             │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
import { program } from 'commander';
import { registerCommands } from './cli/command.ts';
import { initLogger } from './logger/logger.ts';
```

**What Happens:**
1. Node.js loads the TypeScript file via `tsx`
2. Imports are resolved and modules loaded into memory
3. Three dependencies are now available:
   - `program` - Commander.js CLI framework
   - `registerCommands` - Function to register all commands
   - `initLogger` - Function to set up logging

**Memory State:**
- Program object created (empty)
- No commands registered yet
- Logger not initialized

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1.2: Initialize Logger                                    │
│ File: src/main.ts → src/logger/logger.ts                       │
│ Line: 5 → Full file execution                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
// In src/main.ts
initLogger();

// Jumps to src/logger/logger.ts
export function initLogger() {
  fs.ensureDirSync(path.resolve('logs'));
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: 'logs/backup.log' }),
      new winston.transports.Console({ format: winston.format.simple() })
    ],
  });
  (global as any).logger = logger;
}
```

**Detailed Steps:**

**1.2.1** - `fs.ensureDirSync(path.resolve('logs'))`
- Checks if `logs/` directory exists
- If not, creates it recursively
- **File System Change:** `logs/` folder created (if needed)

**1.2.2** - `winston.createLogger({ ... })`
- Creates Winston logger instance
- Configures two transports:
  - **File Transport:** Writes to `logs/backup.log`
  - **Console Transport:** Writes to terminal (stdout)
- Sets log level to `info` (debug, info, warn, error)
- Adds timestamp to each log entry

**1.2.3** - `(global as any).logger = logger`
- Stores logger in global scope
- Now accessible from any file via `(global as any).logger`
- Avoids need to pass logger to every function

**Memory State After:**
- Logger initialized ✓
- Global logger available ✓
- Log file ready to write ✓

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1.3: Register All Commands                                │
│ File: src/main.ts → src/cli/command.ts                         │
│ Line: 6 → Full file execution                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
// In src/main.ts
registerCommands(program);

// Jumps to src/cli/command.ts
export function registerCommands(program: Command) {
  program
    .name('db-backup')
    .description('CLI tool to backup and restore SQL databases (local only)')
    .version('0.1.0');

  program.addCommand(backupCmd);
  program.addCommand(restoreCmd);
  program.addCommand(testConnCmd);
}
```

**Detailed Steps:**

**1.3.1** - `program.name('db-backup')`
- Sets the CLI tool name to `db-backup`
- Used in help messages

**1.3.2** - `program.description(...)`
- Sets the description shown in `--help`

**1.3.3** - `program.version('0.1.0')`
- Enables `--version` flag
- Will output: `0.1.0`

**1.3.4** - `program.addCommand(backupCmd)`
- Imports `backupCmd` from `src/cli/backupCmd.ts`
- Registers the `backup` subcommand
- Now `backup` is available as a command

**1.3.5** - `program.addCommand(restoreCmd)`
- Imports `restoreCmd` from `src/cli/restoreCmd.ts`
- Registers the `restore` subcommand (future feature)

**1.3.6** - `program.addCommand(testConnCmd)`
- Imports `testConnCmd` from `src/cli/testConnCmd.ts`
- Registers the `test-connection` subcommand

**Memory State After:**
- Program configured ✓
- Three commands registered ✓
- CLI ready to parse arguments ✓

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1.4: Parse Command Line Arguments                         │
│ File: src/main.ts                                               │
│ Line: 7                                                         │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
program.parse(process.argv);
```

**What Happens:**

**1.4.1** - `process.argv` contains:
```javascript
[
  '/usr/local/bin/node',           // Node executable path
  '/path/to/src/main.ts',          // Script being run
  'backup',                        // Command name
  '--name',                        // Option flag
  'my-neondb'                      // Option value
]
```

**1.4.2** - Commander parses arguments:
- Identifies command: `backup`
- Identifies option: `--name` with value `my-neondb`
- Matches against registered commands

**1.4.3** - Finds matching command:
- Locates `backupCmd` from `src/cli/backupCmd.ts`
- Prepares to execute its action handler

**1.4.4** - Invokes command action:
- Calls the `.action(async (options) => { ... })` function
- Passes options object: `{ name: 'my-neondb' }`

---

### **PHASE 2: Backup Command Execution**
*File: `src/cli/backupCmd.ts`*

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2.1: Action Handler Begins                                │
│ File: src/cli/backupCmd.ts                                     │
│ Line: Action callback starts                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
.action(async (options) => {
  const logger = (global as any).logger;
  const config = loadConfig();
```

**Detailed Steps:**

**2.1.1** - `const logger = (global as any).logger`
- Retrieves logger from global scope
- Now have access to logging functions

**2.1.2** - `const config = loadConfig()`
- **FUNCTION CALL:** Jumps to `src/config/config.ts`
- Reads `config.json` file
- Returns configuration object

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2.2: Load Configuration                                   │
│ File: src/cli/backupCmd.ts → src/config/config.ts              │
│ Function: loadConfig()                                          │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
// In src/config/config.ts
export const loadConfig = (): BackupConfig => {
  const cfgPath = path.resolve('config.json');
  if (fs.existsSync(cfgPath)) {
    const config = fs.readJSONSync(cfgPath);
    return config;
  }
  return { defaultBackupDir: './backups', databases: [] };
};
```

**Detailed Steps:**

**2.2.1** - `path.resolve('config.json')`
- Resolves to absolute path: `/Users/pankajyadav/projects/dbms_project/db_backup_utility/config.json`

**2.2.2** - `fs.existsSync(cfgPath)`
- Checks if file exists
- Returns `true` or `false`

**2.2.3** - If exists: `fs.readJSONSync(cfgPath)`
- **File System Read:** Reads entire file
- Parses JSON content
- Returns JavaScript object

**2.2.4** - Example returned config:
```json
{
  "defaultBackupDir": "./backups",
  "databases": [
    {
      "name": "my-neondb",
      "type": "postgresql",
      "host": "ep-cool-darkness-a5a5a5a5.us-east-2.aws.neon.tech",
      "port": 5432,
      "user": "myuser",
      "password": "mypassword",
      "database": "neondb",
      "ssl": true
    }
  ]
}
```

**Returns to:** `src/cli/backupCmd.ts` with config object

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2.3: Validate Configuration                               │
│ File: src/cli/backupCmd.ts                                     │
│ Line: Config validation check                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
if (!config.databases || config.databases.length === 0) {
  logger.error('No databases configured in config.json');
  console.log('\nPlease add database configurations to config.json');
  return;
}
```

**What Happens:**
- Checks if `databases` array exists
- Checks if array has at least one database
- If validation fails:
  - Logs error
  - Prints message to console
  - **EXITS** early (return)

**In our case:**
- `config.databases` exists ✓
- `config.databases.length = 1` ✓
- Validation passes → continues

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2.4: Create Backup Service Instance                       │
│ File: src/cli/backupCmd.ts                                     │
│ Line: BackupService instantiation                              │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
const backupService = new BackupService();
```

**What Happens:**

**2.4.1** - Imports `BackupService` class from `src/backup/backupService.ts`

**2.4.2** - Calls constructor:
```typescript
constructor() {
  this.logger = (global as any).logger;
}
```

**2.4.3** - Constructor execution:
- Retrieves global logger
- Stores in instance property `this.logger`
- BackupService instance ready

**Memory State:**
- BackupService instance created ✓
- Logger reference stored ✓

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2.5: Determine Backup Target                              │
│ File: src/cli/backupCmd.ts                                     │
│ Line: Options evaluation                                       │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
if (options.all) {
  // Branch 1: Backup all databases
} else if (options.name) {
  // Branch 2: Backup specific database ← WE TAKE THIS PATH
} else {
  // Branch 3: Show help
}
```

**Our Path:** `options.name = 'my-neondb'`
- `options.all` is `undefined` → Skip Branch 1
- `options.name` is `'my-neondb'` → **Enter Branch 2**

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2.6: Find Database Configuration                          │
│ File: src/cli/backupCmd.ts                                     │
│ Line: Database lookup                                          │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
const dbConfig = config.databases.find((db) => db.name === options.name);

if (!dbConfig) {
  logger.error(`Database configuration not found: ${options.name}`);
  console.log('\nAvailable databases:');
  config.databases.forEach((db) => console.log(`  - ${db.name}`));
  return;
}
```

**Detailed Steps:**

**2.6.1** - `config.databases.find(...)`
- Iterates through databases array
- Compares each `db.name` with `options.name`
- Returns first match or `undefined`

**2.6.2** - In our case:
```javascript
// Iteration 1:
db.name = 'my-neondb'
options.name = 'my-neondb'
'my-neondb' === 'my-neondb' → true
// Returns the database config object
```

**2.6.3** - `dbConfig` now contains:
```javascript
{
  name: "my-neondb",
  type: "postgresql",
  host: "ep-cool-darkness-a5a5a5a5.us-east-2.aws.neon.tech",
  port: 5432,
  user: "myuser",
  password: "mypassword",
  database: "neondb",
  ssl: true
}
```

**2.6.4** - Validation check:
- `dbConfig` is truthy ✓
- Continues to backup

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2.7: Initiate Backup                                      │
│ File: src/cli/backupCmd.ts → src/backup/backupService.ts       │
│ Function: performBackup()                                       │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
await backupService.performBackup(dbConfig, config.defaultBackupDir);
```

**Function Call:**
- Method: `BackupService.performBackup()`
- Arguments:
  - `dbConfig` - Full database configuration
  - `backupDir` - `'./backups'`
- Execution jumps to `src/backup/backupService.ts`

---

### **PHASE 3: Backup Execution**
*File: `src/backup/backupService.ts`*

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3.1: Start Backup Process                                 │
│ File: src/backup/backupService.ts                              │
│ Method: performBackup()                                         │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
async performBackup(
  config: DatabaseConfig,
  backupDir: string
): Promise<BackupResult> {
  const startTime = Date.now();
  this.logger.info(`Starting backup for database: ${config.name}`);
```

**Detailed Steps:**

**3.1.1** - `const startTime = Date.now()`
- Records current timestamp in milliseconds
- Example: `1730386245123`
- Used later to calculate duration

**3.1.2** - `this.logger.info(...)`
- **Log Entry #1**
- Writes to console: `info: Starting backup for database: my-neondb`
- Writes to file: `logs/backup.log`
- JSON format:
```json
{
  "level": "info",
  "message": "Starting backup for database: my-neondb",
  "timestamp": "2025-11-06T14:30:45.123Z"
}
```

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3.2: Ensure Backup Directory Exists                       │
│ File: src/backup/backupService.ts                              │
│ Line: Directory creation                                       │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
await fs.ensureDir(backupDir);
```

**What Happens:**

**3.2.1** - `fs.ensureDir('./backups')`
- Resolves to: `/Users/pankajyadav/projects/dbms_project/db_backup_utility/backups`
- Checks if directory exists
- If not, creates it (including parent directories)
- **File System Operation:** Directory created/verified

**Result:**
- `backups/` folder exists ✓
- Ready to write backup files ✓

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3.3: Generate Backup File Name                            │
│ File: src/backup/backupService.ts                              │
│ Line: Filename generation                                      │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const fileName = `${config.name}_${timestamp}`;
const backupPath = path.join(backupDir, fileName);
```

**Detailed Steps:**

**3.3.1** - `new Date().toISOString()`
- Creates new Date object with current time
- Converts to ISO string format
- Example: `2025-11-06T14:30:45.123Z`

**3.3.2** - `.replace(/[:.]/g, '-')`
- Replaces all colons and dots with hyphens
- Result: `2025-11-06T14-30-45-123Z`
- Makes filename filesystem-safe

**3.3.3** - Build filename:
```javascript
fileName = 'my-neondb_2025-11-06T14-30-45-123Z'
```

**3.3.4** - `path.join(backupDir, fileName)`
- Joins paths correctly for OS
- Result: `backups/my-neondb_2025-11-06T14-30-45-123Z`

**Memory State:**
- `backupPath` = `'backups/my-neondb_2025-11-06T14-30-45-123Z'`
- No file extension yet (added by dump methods)

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3.4: Route to Database-Specific Backup Method             │
│ File: src/backup/backupService.ts                              │
│ Line: Switch statement                                         │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
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
```

**Our Path:** `config.type = 'postgresql'`
- Enters `case 'postgresql'`
- Calls `this.backupPostgreSQL(config, backupPath)`

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3.5: PostgreSQL Backup Execution                          │
│ File: src/backup/backupService.ts                              │
│ Method: backupPostgreSQL()                                      │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
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
```

**Detailed Steps:**

**3.5.1** - `const dumpFile = backupPath + '.sql'`
- Appends `.sql` extension
- Result: `'backups/my-neondb_2025-11-06T14-30-45-123Z.sql'`

**3.5.2** - `await which('pg_dump')`
- Uses `which` library to find executable
- Searches system PATH for `pg_dump` binary
- Example paths checked:
  - `/opt/homebrew/opt/postgresql@17/bin/pg_dump` ✓
  - `/usr/local/bin/pg_dump`
  - `/usr/bin/pg_dump`

**3.5.3** - If `pg_dump` found:
- Returns path to executable
- Continues

**3.5.4** - If `pg_dump` NOT found:
- Throws error
- Jumps to catch block
- User sees error message

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3.6: Build PostgreSQL Connection String                   │
│ File: src/backup/backupService.ts                              │
│ Method: backupPostgreSQL() continued                            │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
// Build connection string
const connString = `postgresql://${config.user}:${config.password}@${config.host}:${config.port || 5432}/${config.database}`;

// Use pg_dump to create backup
const sslOption = config.ssl ? '--no-password' : '';
const command = `pg_dump "${connString}" ${sslOption} > "${dumpFile}"`;
```

**Detailed Steps:**

**3.6.1** - Build connection string:
```javascript
connString = 'postgresql://myuser:mypassword@ep-cool-darkness-a5a5a5a5.us-east-2.aws.neon.tech:5432/neondb'
```

**3.6.2** - Determine SSL option:
```javascript
config.ssl = true
sslOption = '--no-password'
```
(The `--no-password` flag prevents password prompt; password is in connection string)

**3.6.3** - Build shell command:
```bash
pg_dump "postgresql://myuser:mypassword@ep-cool-darkness-a5a5a5a5.us-east-2.aws.neon.tech:5432/neondb" --no-password > "backups/my-neondb_2025-11-06T14-30-45-123Z.sql"
```

**Command Breakdown:**
- `pg_dump` - PostgreSQL dump utility
- `"connection-string"` - Database to backup
- `--no-password` - Don't prompt for password
- `>` - Shell redirect (write output to file)
- `"dumpFile"` - Output file path

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3.7: Execute pg_dump Command                              │
│ File: src/backup/backupService.ts                              │
│ Method: backupPostgreSQL() continued                            │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
this.logger.info(`Executing: pg_dump for ${config.database}`);
await execAsync(command);
```

**Detailed Steps:**

**3.7.1** - `this.logger.info(...)`
- **Log Entry #2**
- Console: `info: Executing: pg_dump for neondb`
- File: Appends to `logs/backup.log`

**3.7.2** - `await execAsync(command)`
- Executes shell command asynchronously
- Spawns child process
- Runs `pg_dump` binary

**What pg_dump Does (External Process):**

1. **Connects to Database:**
   - Uses connection string
   - Establishes SSL connection
   - Authenticates with username/password

2. **Reads Database Schema:**
   - Queries `pg_catalog` tables
   - Gets list of all tables
   - Gets column definitions
   - Gets constraints (primary keys, foreign keys)
   - Gets indexes
   - Gets sequences

3. **Reads All Data:**
   - Iterates through each table
   - Executes `SELECT * FROM table_name`
   - Retrieves all rows

4. **Generates SQL:**
   - Creates `CREATE TABLE` statements
   - Creates `INSERT` statements for data
   - Creates `ALTER TABLE` statements for constraints
   - Creates `CREATE INDEX` statements

5. **Writes to File:**
   - Shell redirects output to `.sql` file
   - Example content:
   ```sql
   --
   -- PostgreSQL database dump
   --
   
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255),
     email VARCHAR(255)
   );
   
   INSERT INTO users VALUES (1, 'John Doe', 'john@example.com');
   INSERT INTO users VALUES (2, 'Jane Smith', 'jane@example.com');
   
   -- More tables and data...
   ```

**Process Time:** 
- Depends on database size
- Small DB (< 1 MB): ~2-5 seconds
- Medium DB (100 MB): ~30-60 seconds
- Large DB (1 GB+): Several minutes

**3.7.3** - `execAsync` completes:
- Returns `{ stdout: '', stderr: '' }`
- If error occurs, throws exception
- File now written to disk

**File System State:**
- New file created: `backups/my-neondb_2025-11-06T14-30-45-123Z.sql`
- File size: e.g., 10 MB (uncompressed)

**3.7.4** - Return dump file path:
```typescript
return dumpFile;
```
- Returns: `'backups/my-neondb_2025-11-06T14-30-45-123Z.sql'`
- Execution returns to `performBackup()` method

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3.8: Compress Backup File                                 │
│ File: src/backup/backupService.ts                              │
│ Method: performBackup() continued                               │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
// Compress the backup
const compressedFile = await this.compressBackup(dumpFile);
```

**Function Call:**
- Calls `this.compressBackup()`
- Argument: `'backups/my-neondb_2025-11-06T14-30-45-123Z.sql'`
- Jumps to compression method

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3.9: Compression Process                                  │
│ File: src/backup/backupService.ts                              │
│ Method: compressBackup()                                        │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
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
```

**Detailed Steps:**

**3.9.1** - `const compressedPath = filePath + '.tar.gz'`
- Result: `'backups/my-neondb_2025-11-06T14-30-45-123Z.sql.tar.gz'`

**3.9.2** - `this.logger.info(...)`
- **Log Entry #3**
- Console: `info: Compressing backup: my-neondb_2025-11-06T14-30-45-123Z.sql`

**3.9.3** - `tar.create({ ... })`
- Uses `tar` library (node-tar)
- Options:
  - `gzip: true` - Use gzip compression
  - `file: compressedPath` - Output file
  - `cwd: 'backups'` - Working directory
  - Files: `['my-neondb_2025-11-06T14-30-45-123Z.sql']`

**Compression Process:**

1. **Read Input File:**
   - Reads `.sql` file in chunks
   - Example size: 10 MB

2. **Create Tar Archive:**
   - Packages file into tar format
   - Preserves metadata (filename, permissions, timestamp)

3. **Apply Gzip Compression:**
   - Compresses with gzip algorithm
   - Compression ratio: typically 80-95% reduction
   - Example: 10 MB → 2 MB

4. **Write Compressed File:**
   - Writes to `.tar.gz` file
   - **File System Operation:** New file created

**File System State After:**
- Original file: `backups/my-neondb_2025-11-06T14-30-45-123Z.sql` (10 MB)
- Compressed file: `backups/my-neondb_2025-11-06T14-30-45-123Z.sql.tar.gz` (2 MB)

**3.9.4** - `this.logger.info(...)`
- **Log Entry #4**
- Console: `info: ✓ Backup compressed: my-neondb_2025-11-06T14-30-45-123Z.sql.tar.gz`

**3.9.5** - Return compressed path:
- Returns: `'backups/my-neondb_2025-11-06T14-30-45-123Z.sql.tar.gz'`
- Execution returns to `performBackup()`

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3.10: Cleanup Uncompressed File                           │
│ File: src/backup/backupService.ts                              │
│ Method: performBackup() continued                               │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
// Remove uncompressed file
await fs.remove(dumpFile);
```

**What Happens:**

**3.10.1** - `fs.remove(dumpFile)`
- Deletes the uncompressed `.sql` file
- Only keeps compressed `.tar.gz` file
- Saves disk space

**File System State After:**
- ✗ `backups/my-neondb_2025-11-06T14-30-45-123Z.sql` (deleted)
- ✓ `backups/my-neondb_2025-11-06T14-30-45-123Z.sql.tar.gz` (kept)

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3.11: Calculate Duration & Log Success                    │
│ File: src/backup/backupService.ts                              │
│ Method: performBackup() continued                               │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
const duration = Date.now() - startTime;
this.logger.info(
  `✓ Backup completed successfully in ${duration}ms: ${compressedFile}`
);

return {
  success: true,
  filePath: compressedFile,
  duration,
};
```

**Detailed Steps:**

**3.11.1** - Calculate duration:
```javascript
startTime = 1730386245123
Date.now() = 1730386253245
duration = 8122 ms (8.122 seconds)
```

**3.11.2** - `this.logger.info(...)`
- **Log Entry #5** (Final)
- Console: `info: ✓ Backup completed successfully in 8122ms: backups/my-neondb_2025-11-06T14-30-45-123Z.sql.tar.gz`

**3.11.3** - Return result object:
```javascript
{
  success: true,
  filePath: 'backups/my-neondb_2025-11-06T14-30-45-123Z.sql.tar.gz',
  duration: 8122
}
```

---

### **PHASE 4: Cleanup & Exit**

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4.1: Return to Command Handler                            │
│ File: src/cli/backupCmd.ts                                     │
│ Line: After performBackup() completes                          │
└─────────────────────────────────────────────────────────────────┘
```

**Code Context:**
```typescript
await backupService.performBackup(dbConfig, config.defaultBackupDir);
// Function returns here
// Action handler completes
```

**What Happens:**
- `performBackup()` promise resolves
- Returns to action handler
- Action handler function completes
- No more code to execute

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4.2: Commander Cleanup                                    │
│ File: src/main.ts                                               │
│ Line: After program.parse() completes                          │
└─────────────────────────────────────────────────────────────────┘
```

**What Happens:**
- Commander finishes command execution
- All async operations completed
- No pending promises

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4.3: Process Exit                                         │
│ System: Node.js runtime                                        │
└─────────────────────────────────────────────────────────────────┘
```

**What Happens:**

**4.3.1** - Event loop check:
- Node.js checks for pending operations
- No pending timers
- No pending I/O operations
- No pending promises

**4.3.2** - Cleanup:
- Closes log file handles
- Releases memory
- Closes database connections (if any still open)

**4.3.3** - Exit:
- Process exits with code `0` (success)
- Terminal control returns to user
- Command prompt reappears

---

### **Summary: Complete Execution Timeline**

```
0ms    - Process starts, imports loaded
5ms    - Logger initialized, logs/ directory created
10ms   - Commands registered
15ms   - Arguments parsed, backup command identified
20ms   - config.json loaded
25ms   - Database configuration found
30ms   - BackupService instantiated
35ms   - Backup process begins
40ms   - backups/ directory verified
45ms   - Filename generated with timestamp
50ms   - pg_dump availability checked
60ms   - Connection string built
100ms  - pg_dump process spawned
...    - [pg_dump running: 5-7 seconds]
7200ms - pg_dump completes, .sql file written (10 MB)
7250ms - Compression begins
7900ms - Compression completes, .tar.gz file written (2 MB)
7950ms - Original .sql file deleted
8000ms - Duration calculated
8100ms - Success logged
8122ms - Process exits
```

---

## Test Connection Command Execution Flow

### Command: `npm run dev -- test-connection --name my-neondb`

This flow is **much simpler** than backup, as it only tests connectivity without data transfer.

---

### **PHASE 1: Application Bootstrap**
*Same as backup command - Steps 1.1 through 1.4*

---

### **PHASE 2: Test Connection Command Execution**

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2.1: Action Handler Begins                                │
│ File: src/cli/testConnCmd.ts                                   │
│ Line: Action callback starts                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
.action(async (options) => {
  const logger = (global as any).logger;
  const config = loadConfig();
  
  // [Config validation same as backup]
  
  const dbConfig = config.databases.find((db) => db.name === options.name);
  await testConnection(dbConfig);
});
```

---

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2.2: Call Test Connection Function                        │
│ File: src/cli/testConnCmd.ts → src/db/connection.ts            │
│ Function: testConnection()                                      │
└─────────────────────────────────────────────────────────────────┘
```

**Code Executed:**
```typescript
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
      // ... other cases
    }
  } catch (error) {
    logger.error(`✗ Connection failed for ${config.name}:`, error);
    return false;
  }
}
```

**Detailed Steps:**

**2.2.1** - Create PostgreSQL client:
```javascript
client = new PgClient({
  host: 'ep-cool-darkness-a5a5a5a5.us-east-2.aws.neon.tech',
  port: 5432,
  user: 'myuser',
  password: 'mypassword',
  database: 'neondb',
  ssl: { rejectUnauthorized: false }
})
```

**2.2.2** - `await client.connect()`
- Initiates TCP connection to host:port
- Performs SSL/TLS handshake
- Sends authentication credentials
- Receives authentication response
- If successful, connection established

**What Happens Internally:**

1. **DNS Resolution:**
   - Resolves hostname to IP address
   - Example: `ep-cool-darkness.aws.neon.tech` → `34.123.45.67`

2. **TCP Connection:**
   - Opens socket to `34.123.45.67:5432`
   - Three-way handshake (SYN, SYN-ACK, ACK)

3. **SSL Handshake:**
   - Client sends SSL hello
   - Server sends certificate
   - Client verifies certificate (or skips if `rejectUnauthorized: false`)
   - Establishes encrypted channel

4. **Authentication:**
   - Client sends: `user: myuser, password: mypassword`
   - Server validates credentials
   - Server checks database permissions
   - Server responds: Success or Failure

**Time:** ~200-500ms (depending on network latency)

**2.2.3** - `await client.end()`
- Gracefully closes connection
- Sends disconnect packet
- Releases resources

**2.2.4** - `logger.info(...)`
- **Log Entry**
- Console: `info: ✓ PostgreSQL connection successful: my-neondb`
- File: Appends to `logs/backup.log`

**2.2.5** - Return `true`
- Indicates success
- Returns to command handler

---

### **PHASE 3: Cleanup & Exit**

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3.1: Process Exit                                         │
│ System: Node.js runtime                                        │
└─────────────────────────────────────────────────────────────────┘
```

**Timeline:**
```
0ms    - Process starts
20ms   - Config loaded
25ms   - Database config found
30ms   - testConnection() called
250ms  - Connection established
450ms  - Connection closed
500ms  - Success logged
550ms  - Process exits
```

---

## Detailed Function Call Traces

### Complete Call Stack for Backup Command

```
main.ts
  ├─ initLogger()
  │    └─ src/logger/logger.ts
  │         ├─ fs.ensureDirSync('logs')
  │         ├─ winston.createLogger()
  │         └─ (global).logger = logger
  │
  ├─ registerCommands(program)
  │    └─ src/cli/command.ts
  │         ├─ program.addCommand(backupCmd)
  │         ├─ program.addCommand(restoreCmd)
  │         └─ program.addCommand(testConnCmd)
  │
  └─ program.parse(process.argv)
       └─ Identifies 'backup' command
            └─ backupCmd.action(options)
                 └─ src/cli/backupCmd.ts
                      ├─ loadConfig()
                      │    └─ src/config/config.ts
                      │         ├─ path.resolve('config.json')
                      │         ├─ fs.existsSync(cfgPath)
                      │         ├─ fs.readJSONSync(cfgPath)
                      │         └─ return config object
                      │
                      ├─ new BackupService()
                      │    └─ src/backup/backupService.ts
                      │         └─ constructor()
                      │              └─ this.logger = (global).logger
                      │
                      └─ backupService.performBackup(dbConfig, backupDir)
                           └─ src/backup/backupService.ts
                                ├─ Date.now() → startTime
                                ├─ logger.info('Starting backup...')
                                ├─ fs.ensureDir(backupDir)
                                ├─ Generate filename with timestamp
                                │
                                ├─ this.backupPostgreSQL(config, backupPath)
                                │    ├─ const dumpFile = backupPath + '.sql'
                                │    ├─ which('pg_dump')
                                │    ├─ Build connection string
                                │    ├─ Build pg_dump command
                                │    ├─ logger.info('Executing pg_dump...')
                                │    ├─ execAsync(command)
                                │    │    └─ [Spawns child process]
                                │    │         └─ pg_dump executable
                                │    │              ├─ Connect to database
                                │    │              ├─ Read schema
                                │    │              ├─ Read all data
                                │    │              ├─ Generate SQL
                                │    │              └─ Write to file
                                │    └─ return dumpFile
                                │
                                ├─ this.compressBackup(dumpFile)
                                │    ├─ const compressedPath = dumpFile + '.tar.gz'
                                │    ├─ logger.info('Compressing...')
                                │    ├─ tar.create({ gzip: true, ... })
                                │    │    ├─ Read .sql file
                                │    │    ├─ Create tar archive
                                │    │    ├─ Apply gzip compression
                                │    │    └─ Write .tar.gz file
                                │    ├─ logger.info('✓ Compressed')
                                │    └─ return compressedPath
                                │
                                ├─ fs.remove(dumpFile)
                                ├─ Calculate duration
                                ├─ logger.info('✓ Completed in Xms')
                                └─ return { success: true, filePath, duration }
```

---

## File System Operations

### Files Read During Execution

```
1. config.json
   - Read by: src/config/config.ts → loadConfig()
   - When: Early in execution (before backup/test)
   - Purpose: Load database configurations
   - Format: JSON

2. Environment variables (optional)
   - Read by: dotenv.config() in src/config/config.ts
   - When: Before config.json read
   - Purpose: Override config with environment variables
   - Format: .env file
```

### Files Written During Execution

```
1. logs/backup.log
   - Written by: Winston logger
   - When: Throughout execution
   - Content: JSON log entries
   - Append mode: Yes (doesn't overwrite)
   - Example:
     {"level":"info","message":"Starting backup...","timestamp":"2025-11-06T14:30:45.123Z"}

2. backups/[name]_[timestamp].sql (temporary)
   - Written by: pg_dump / mysqldump / SQLite copy
   - When: During database dump
   - Content: SQL statements (CREATE TABLE, INSERT, etc.)
   - Size: Original database size (uncompressed)
   - Deleted: After compression

3. backups/[name]_[timestamp].sql.tar.gz
   - Written by: tar.create() with gzip
   - When: After SQL dump completes
   - Content: Compressed SQL file
   - Size: ~20% of original (depends on data)
   - Kept: Permanent (until manually deleted)
```

### Directories Created During Execution

```
1. logs/
   - Created by: initLogger() → fs.ensureDirSync()
   - When: Application startup
   - Purpose: Store log files

2. backups/
   - Created by: performBackup() → fs.ensureDir()
   - When: Before first backup
   - Purpose: Store backup files
```

---

## Error Handling Flow

### Error in Configuration Loading

```
┌─ loadConfig() throws error
│  (e.g., config.json has invalid JSON)
│
├─ Error bubbles up to backupCmd action handler
│
├─ No try-catch in action handler
│
├─ Error bubbles to Commander
│
├─ Commander prints error to console
│
├─ Process exits with code 1
│
└─ User sees error message
```

### Error in Database Connection (Test Command)

```
┌─ testConnection() → client.connect() throws error
│  (e.g., wrong password, host unreachable)
│
├─ Caught by try-catch in testConnection()
│
├─ logger.error('✗ Connection failed...')
│
├─ Returns false
│
├─ Command handler receives false
│
├─ Process completes normally
│
└─ User sees error log but no crash
```

### Error During Backup

```
┌─ performBackup() encounters error
│  (e.g., pg_dump not found, disk full)
│
├─ Caught by try-catch in performBackup()
│
├─ Calculate duration anyway
│
├─ logger.error('✗ Backup failed...')
│
├─ console.error('❌ Backup Error: ...')
│
├─ Return { success: false, error: message, duration }
│
├─ Command handler receives result
│
├─ Process completes normally (no throw)
│
└─ User sees error details but no crash
```

### Error During Compression

```
┌─ compressBackup() throws error
│  (e.g., out of disk space)
│
├─ Error bubbles to performBackup() try-catch
│
├─ Caught and logged
│
├─ SQL file may still exist (not deleted)
│
├─ Return failure result
│
└─ User sees error, SQL file remains for debugging
```

---

## Key Takeaways

### Execution Order Summary

1. **Initialization Phase** (20-30ms)
   - Logger setup
   - Command registration
   - Argument parsing

2. **Configuration Phase** (5-10ms)
   - Load config.json
   - Find database config
   - Validate settings

3. **Execution Phase** (Variable)
   - **Backup:** 5-60+ seconds (depends on DB size)
   - **Test:** 200-500ms (just connection test)

4. **Cleanup Phase** (50-100ms)
   - Close connections
   - Flush logs
   - Exit process

### Critical Dependencies

```
External Tools:
- pg_dump (for PostgreSQL backups)
- mysqldump (for MySQL backups)
- None (for SQLite backups)

Node Modules:
- commander (CLI framework)
- winston (logging)
- fs-extra (file operations)
- tar (compression)
- pg (PostgreSQL client)
- mysql2 (MySQL client)
```

### Performance Bottlenecks

```
1. Database Dump (80-90% of total time)
   - Network latency to database
   - Database size
   - Database server load

2. Compression (10-15% of total time)
   - CPU speed
   - Disk I/O speed
   - Compression ratio

3. Everything Else (<5% of total time)
   - Config loading
   - Logging
   - File operations
```

---

This document provides a **complete trace** of every function call, file operation, and system interaction that occurs during backup and test operations. Use it for debugging, optimization, or understanding the codebase architecture.

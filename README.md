# 🗄️ Database Backup Utility Tool

## 📖 Complete Documentation for Everyone

A comprehensive guide explaining **what this tool does**, **how it works**, and **how to use it** - written in a way that anyone can understand, even without technical background.

---

## 📚 Table of Contents

1. [What This Tool Does (Simple Explanation)](#-what-this-tool-does)
2. [Why You Need This Tool](#-why-you-need-this-tool)
3. [How It Works (Step-by-Step)](#-how-it-works)
4. [Project Structure Explained](#-project-structure-explained)
5. [Each File Explained](#-each-file-explained-in-detail)
6. [Quick Start Guide](#-quick-start-guide)
7. [Available Commands](#-available-commands)
8. [Complete Usage Examples](#-complete-usage-examples)
9. [Technologies Used](#-technologies-used)
10. [Troubleshooting](#-troubleshooting)

---

## 🎯 What This Tool Does

### In Simple Terms

Imagine you have important data stored in a database - like:
- Customer information for your business
- Blog posts for your website
- User accounts and profiles
- Transaction records

If something goes wrong (computer crashes, accidental deletion, server failure), you could **lose everything**. 

**This tool creates a "backup" (copy) of your entire database**, so you can:
- ✅ Restore your data if something goes wrong
- ✅ Save snapshots at different times
- ✅ Move your data to another computer
- ✅ Keep your data safe

Think of it like taking a photo of your database at a specific moment - if you need to go back to that moment, you can.

---

## 💡 Why You Need This Tool

**Without backups:**
- 😰 One mistake = all data lost forever
- 😰 Server crash = business stops
- 😰 Hacker attack = no recovery
- 😰 Accidental deletion = permanent

**With this tool:**
- ✅ Regular backups = safe data
- ✅ Easy restore = quick recovery
- ✅ Multiple copies = extra safety
- ✅ Automated process = no forgetting

---

## 🔄 How It Works

Let me explain the **complete process** in simple steps:

### The Big Picture

```
┌─────────────────┐
│  Your Database  │  ← Your data lives here (PostgreSQL, MySQL, or SQLite)
│  (In the Cloud  │     Maybe hosted on NeonDB, Supabase, or your computer
│   or Locally)   │
└────────┬────────┘
         │
         │ ①  Tool connects to database
         ▼
┌─────────────────┐
│   This Tool     │  ← Our backup utility (running on your computer)
│  (Your Computer)│
└────────┬────────┘
         │
         │ ②  Downloads all your data
         ▼
┌─────────────────┐
│   .sql File     │  ← All your data in a text file
│   (Temporary)   │     Contains tables, data, structure
└────────┬────────┘
         │
         │ ③  Compresses the file (makes it smaller)
         ▼
┌─────────────────┐
│ .tar.gz File    │  ← Compressed backup (small file size)
│  (In backups/   │     Saved with timestamp
│    folder)      │     Example: my-db_2025-10-27T14-30-45.sql.tar.gz
└─────────────────┘
```

### Detailed Process (What Happens Behind the Scenes)

**STEP 1: You Run the Command**
```bash
npm run dev -- backup --name my-database
```
You're telling the tool: "Please backup the database called 'my-database'"

**STEP 2: Tool Reads Configuration**
- Opens `config.json` file
- Finds database info: where it is, username, password
- Like looking up a phone number in your contacts

**STEP 3: Connects to Database**
- Uses the configuration to connect
- Like logging into a website with username/password
- If connection fails, tells you immediately

**STEP 4: Downloads All Data**
- Uses special programs (`pg_dump`, `mysqldump`, or file copy)
- Extracts EVERYTHING from the database:
  - All tables
  - All data in those tables
  - Database structure
  - Relationships between tables
- Saves to a `.sql` file (text file with all the data)

**STEP 5: Compresses the File**
- Takes the `.sql` file (might be 10 MB)
- Compresses it like making a ZIP file
- Creates `.tar.gz` file (might be 2 MB now - much smaller!)
- Saves space on your computer

**STEP 6: Names with Timestamp**
- Gives it a name like: `my-database_2025-10-27T14-30-45-123Z.sql.tar.gz`
- You know exactly when this backup was made
- Can have multiple backups from different times

**STEP 7: Saves to Folder**
- Saves in `backups/` folder
- Organizes everything neatly
- Easy to find later

**STEP 8: Logs Everything**
- Writes to `logs/backup.log`
- Records: what happened, when it happened, any errors
- Like a diary of all backup activities

---

## 🏗️ Project Structure Explained

Think of this project like a company with different departments:

```
db_backup_utility/                    🏢 The Company Building
│
├── src/                              📂 Main Office (All Code)
│   │
│   ├── main.ts                       🚪 Reception/Front Desk
│   │                                     First place visitors go
│   │                                     Directs to right department
│   │
│   ├── cli/                          💼 Customer Service Department
│   │   ├── command.ts                   📋 Service Menu (lists all services)
│   │   ├── backupCmd.ts                 👤 Backup Specialist
│   │   ├── testConnCmd.ts               👤 Connection Tester
│   │   └── restoreCmd.ts                👤 Restore Specialist (future)
│   │
│   ├── backup/                       🔧 Operations Department
│   │   └── backupService.ts             👷 The Worker (does actual backups)
│   │
│   ├── db/                           📞 Communications Department
│   │   └── connection.ts                📱 Phone Lines (connects to databases)
│   │
│   ├── config/                       ⚙️ Settings Department
│   │   └── config.ts                    📝 Settings Manager
│   │
│   ├── logger/                       📓 Records Department
│   │   └── logger.ts                    ✍️ Record Keeper (writes logs)
│   │
│   └── types/                        📐 Architecture Department
│       └── index.ts                     🏗️ Blueprints (type definitions)
│
├── backups/                          🗄️ Storage Warehouse
│                                         Where all backups are kept
│
├── logs/                             📚 Archive Room
│   └── backup.log                       📖 Activity Log Book
│
├── config.json                       🔐 Your Settings (Keep Secret!)
│                                         Contains database passwords
│
├── config.example.json               📄 Example Settings (Safe to Share)
│                                         Template you can copy
│
├── package.json                      📦 Supply List
│                                         Lists all tools/libraries needed
│
└── tsconfig.json                     🛠️ Building Instructions
                                          TypeScript settings
```

---

## 📂 Each File Explained in Detail

Let me explain **every single file** and what it does:

### 🚪 Entry Point

#### **`src/main.ts`** - The Front Door

**What it is:** The first file that runs when you start the program.

**What it does:**
1. Sets up the logging system (so we can record everything)
2. Registers all commands (backup, test-connection, etc.)
3. Reads what you typed in the terminal
4. Calls the right function based on your command

**The code (explained):**
```typescript
import { program } from 'commander';
import { registerCommands } from './cli/command.ts';
import { initLogger } from './logger/logger.ts';

// STEP 1: Initialize the logger
// This creates a system to record everything that happens
initLogger();

// STEP 2: Register all available commands
// This tells the program what commands exist (backup, test, etc.)
registerCommands(program);

// STEP 3: Parse user input
// This reads what you typed and decides what to do
program.parse(process.argv);
```

**Simple analogy:** Like a receptionist at a hotel - greets you, finds out what you need, directs you to the right department.

---

### 💼 CLI Commands (Customer Service)

#### **`src/cli/command.ts`** - Service Menu

**What it is:** A registry of all available commands.

**What it does:** Lists all the things the tool can do.

**The code (explained):**
```typescript
export function registerCommands(program: Command) {
  // Set program name and description
  program
    .name('db-backup')
    .description('CLI tool to backup and restore SQL databases')
    .version('0.1.0');

  // Add backup command
  program.addCommand(backupCmd);
  
  // Add restore command (placeholder for future)
  program.addCommand(restoreCmd);
  
  // Add test connection command
  program.addCommand(testConnCmd);
}
```

**Simple analogy:** Like a restaurant menu - shows you everything available to order.

---

#### **`src/cli/backupCmd.ts`** - Backup Specialist

**What it is:** Handles everything when you want to create a backup.

**What it does:**
1. Reads your command and options
2. Loads database configuration
3. Calls the backup service to do the work
4. Shows you what's happening

**The code (explained line by line):**
```typescript
export const backupCmd = new Command('backup')
  .description('Backup a database to local storage')
  .option('-n, --name <name>', 'Name of the database to backup')
  .option('-a, --all', 'Backup all databases')
  .action(async (options) => {
    const logger = (global as any).logger;
    
    // STEP 1: Load configuration file (config.json)
    const config = loadConfig();
    
    // STEP 2: Check if any databases are configured
    if (!config.databases || config.databases.length === 0) {
      logger.error('No databases configured in config.json');
      console.log('\nPlease add database configurations to config.json');
      return;
    }
    
    // STEP 3: Create the backup service (the worker)
    const backupService = new BackupService();
    
    // STEP 4: Handle user's choice
    if (options.all) {
      // User wants to backup ALL databases
      logger.info(`Starting backup for all ${config.databases.length} databases...`);
      
      for (const dbConfig of config.databases) {
        await backupService.performBackup(dbConfig, config.defaultBackupDir);
      }
    }
    else if (options.name) {
      // User wants to backup ONE specific database
      const dbConfig = config.databases.find((db) => db.name === options.name);
      
      if (!dbConfig) {
        logger.error(`Database not found: ${options.name}`);
        console.log('\nAvailable databases:');
        config.databases.forEach((db) => console.log(`  - ${db.name}`));
        return;
      }
      
      await backupService.performBackup(dbConfig, config.defaultBackupDir);
    }
    else {
      // No options provided - show help
      logger.info('Available databases:');
      config.databases.forEach((db) => {
        console.log(`  - ${db.name} (${db.type})`);
      });
      console.log('\nUsage:');
      console.log('  npm run dev -- backup --name <database-name>');
      console.log('  npm run dev -- backup --all');
    }
  });
```

**Simple analogy:** Like a bank teller - takes your request, verifies your account, processes your transaction, gives you a receipt.

---

#### **`src/cli/testConnCmd.ts`** - Connection Tester

**What it is:** Tests if you can connect to your database.

**What it does:**
1. Reads which database you want to test
2. Tries to connect to it
3. Shows ✓ if successful or ✗ if failed

**The code (explained):**
```typescript
export const testConnCmd = new Command('test-connection')
  .description('Test database connection')
  .option('-n, --name <name>', 'Name of database to test')
  .option('-a, --all', 'Test all databases')
  .action(async (options) => {
    const logger = (global as any).logger;
    const config = loadConfig();
    
    // Check if databases are configured
    if (!config.databases || config.databases.length === 0) {
      logger.error('No databases configured');
      return;
    }
    
    if (options.all) {
      // Test ALL databases
      logger.info(`Testing ${config.databases.length} databases...`);
      
      let successCount = 0;
      for (const dbConfig of config.databases) {
        const success = await testConnection(dbConfig);
        if (success) successCount++;
      }
      
      console.log(`\n${successCount}/${config.databases.length} connections successful`);
    }
    else if (options.name) {
      // Test ONE database
      const dbConfig = config.databases.find((db) => db.name === options.name);
      
      if (!dbConfig) {
        logger.error(`Database not found: ${options.name}`);
        return;
      }
      
      await testConnection(dbConfig);
    }
    else {
      // Show available databases
      logger.info('Available databases:');
      config.databases.forEach((db) => console.log(`  - ${db.name}`));
    }
  });
```

**Simple analogy:** Like testing your internet connection before downloading a large file - ensures everything works before you start.

---

### 🔧 Core Business Logic (The Engine Room)

#### **`src/backup/backupService.ts`** - The Worker

**What it is:** The heart of the application - does the actual backup work.

**What it does:** Everything related to creating backups.

**The code (explained step-by-step):**

```typescript
export class BackupService {
  private logger: any;
  
  constructor() {
    this.logger = (global as any).logger;
  }
  
  // ═══════════════════════════════════════════════════════════
  // MAIN BACKUP FUNCTION
  // ═══════════════════════════════════════════════════════════
  async performBackup(
    config: DatabaseConfig,
    backupDir: string
  ): Promise<BackupResult> {
    const startTime = Date.now(); // Record when we started
    this.logger.info(`Starting backup for database: ${config.name}`);
    
    try {
      // STEP 1: Make sure backup directory exists
      await fs.ensureDir(backupDir);
      
      // STEP 2: Create timestamp for filename
      // Format: 2025-10-27T14-30-45-123Z
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${config.name}_${timestamp}`;
      const backupPath = path.join(backupDir, fileName);
      
      // STEP 3: Call the appropriate backup method
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
      
      // STEP 4: Compress the backup file
      const compressedFile = await this.compressBackup(dumpFile);
      
      // STEP 5: Delete uncompressed file (save space)
      await fs.remove(dumpFile);
      
      // STEP 6: Calculate duration
      const duration = Date.now() - startTime;
      
      // STEP 7: Log success
      this.logger.info(`✓ Backup completed in ${duration}ms: ${compressedFile}`);
      
      return {
        success: true,
        filePath: compressedFile,
        duration,
      };
      
    } catch (error) {
      // If anything went wrong, log it
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      this.logger.error(`✗ Backup failed for ${config.name}:`, {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : ''
      });
      
      console.error('\n❌ Backup Error:', errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        duration,
      };
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // POSTGRESQL BACKUP
  // ═══════════════════════════════════════════════════════════
  private async backupPostgreSQL(
    config: DatabaseConfig,
    backupPath: string
  ): Promise<string> {
    const dumpFile = `${backupPath}.sql`;
    
    // Check if pg_dump is installed
    try {
      await which('pg_dump');
    } catch {
      throw new Error('pg_dump not found. Please install PostgreSQL client tools.');
    }
    
    // Build connection string
    // Format: postgresql://username:password@host:port/database
    const connString = `postgresql://${config.user}:${config.password}@${config.host}:${config.port || 5432}/${config.database}`;
    
    // Build command
    const sslOption = config.ssl ? '--no-password' : '';
    const command = `pg_dump "${connString}" ${sslOption} > "${dumpFile}"`;
    
    // Execute pg_dump command
    this.logger.info(`Executing: pg_dump for ${config.database}`);
    await execAsync(command);
    
    return dumpFile;
  }
  
  // ═══════════════════════════════════════════════════════════
  // MYSQL BACKUP
  // ═══════════════════════════════════════════════════════════
  private async backupMySQL(
    config: DatabaseConfig,
    backupPath: string
  ): Promise<string> {
    const dumpFile = `${backupPath}.sql`;
    
    // Check if mysqldump is installed
    try {
      await which('mysqldump');
    } catch {
      throw new Error('mysqldump not found. Please install MySQL client tools.');
    }
    
    // Build command
    const command = `mysqldump -h ${config.host} -P ${config.port || 3306} -u ${config.user!} -p${config.password!} ${config.database!} > "${dumpFile}"`;
    
    // Execute mysqldump command
    this.logger.info(`Executing: mysqldump for ${config.database}`);
    await execAsync(command);
    
    return dumpFile;
  }
  
  // ═══════════════════════════════════════════════════════════
  // SQLITE BACKUP
  // ═══════════════════════════════════════════════════════════
  private async backupSQLite(
    config: DatabaseConfig,
    backupPath: string
  ): Promise<string> {
    const dumpFile = `${backupPath}.db`;
    
    if (!config.filePath) {
      throw new Error('SQLite file path not specified');
    }
    
    // SQLite is just a file - simply copy it
    await fs.copy(config.filePath, dumpFile);
    
    this.logger.info(`SQLite database copied: ${config.filePath}`);
    return dumpFile;
  }
  
  // ═══════════════════════════════════════════════════════════
  // COMPRESSION
  // ═══════════════════════════════════════════════════════════
  private async compressBackup(filePath: string): Promise<string> {
    const compressedPath = `${filePath}.tar.gz`;
    
    this.logger.info(`Compressing backup: ${path.basename(filePath)}`);
    
    // Create compressed tar.gz file
    await tar.create(
      {
        gzip: true,                        // Use gzip compression
        file: compressedPath,              // Output filename
        cwd: path.dirname(filePath),       // Working directory
      },
      [path.basename(filePath)]            // Files to compress
    );
    
    this.logger.info(`✓ Backup compressed: ${path.basename(compressedPath)}`);
    return compressedPath;
  }
}
```

**What each method does:**

1. **`performBackup()`**: Main coordinator - manages the entire backup process
2. **`backupPostgreSQL()`**: Uses `pg_dump` to extract PostgreSQL data
3. **`backupMySQL()`**: Uses `mysqldump` to extract MySQL data
4. **`backupSQLite()`**: Copies the SQLite database file
5. **`compressBackup()`**: Compresses the backup file with gzip

**Simple analogy:** Like a factory assembly line:
- Raw materials come in (database data)
- Workers process it (extract, format, compress)
- Packaged product comes out (backup file)

---

#### **`src/db/connection.ts`** - Phone Lines

**What it is:** Manages connections to different database types.

**What it does:** Tests if you can connect to a database.

**The code (explained):**

```typescript
export async function testConnection(config: DatabaseConfig): Promise<boolean> {
  const logger = (global as any).logger;
  
  try {
    switch (config.type) {
      
      // ═══════════════════════════════════════════════════════
      // POSTGRESQL CONNECTION TEST
      // ═══════════════════════════════════════════════════════
      case 'postgresql': {
        // Create PostgreSQL client
        const client = new PgClient({
          host: config.host,           // Database server address
          port: config.port || 5432,   // Port (default: 5432)
          user: config.user,           // Username
          password: config.password,   // Password
          database: config.database,   // Database name
          ssl: config.ssl ? { rejectUnauthorized: false } : false,  // SSL settings
        });
        
        // Try to connect
        await client.connect();
        
        // If we reach here, connection worked!
        await client.end();
        logger.info(`✓ PostgreSQL connection successful: ${config.name}`);
        return true;
      }
      
      // ═══════════════════════════════════════════════════════
      // MYSQL CONNECTION TEST
      // ═══════════════════════════════════════════════════════
      case 'mysql': {
        // Create MySQL connection
        const connection = await mysql.createConnection({
          host: config.host!,
          port: config.port || 3306,
          user: config.user!,
          password: config.password!,
          database: config.database!,
        });
        
        // Close connection
        await connection.end();
        logger.info(`✓ MySQL connection successful: ${config.name}`);
        return true;
      }
      
      // ═══════════════════════════════════════════════════════
      // SQLITE CONNECTION TEST
      // ═══════════════════════════════════════════════════════
      case 'sqlite': {
        // SQLite doesn't need network connection testing
        logger.info(`✓ SQLite database: ${config.name}`);
        return true;
      }
      
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  } catch (error) {
    // Connection failed
    logger.error(`✗ Connection failed for ${config.name}:`, error);
    return false;
  }
}
```

**Simple analogy:** Like testing your phone before making an important call - ensures the line works before you need it.

---

### ⚙️ Configuration & Settings

#### **`src/config/config.ts`** - Settings Manager

**What it is:** Reads and writes configuration files.

**What it does:**
1. Loads `config.json` (your database settings)
2. Returns default settings if file doesn't exist
3. Can save new configurations

**The code (explained):**

```typescript
// ═══════════════════════════════════════════════════════════
// LOAD CONFIGURATION
// ═══════════════════════════════════════════════════════════
export const loadConfig = (): BackupConfig => {
  // Find config.json file
  const cfgPath = path.resolve('config.json');
  
  // If file exists, read it
  if (fs.existsSync(cfgPath)) {
    const config = fs.readJSONSync(cfgPath);
    return config;
  }
  
  // If file doesn't exist, return default settings
  return {
    defaultBackupDir: './backups',
    databases: []
  };
};

// ═══════════════════════════════════════════════════════════
// SAVE CONFIGURATION
// ═══════════════════════════════════════════════════════════
export const saveConfig = (config: BackupConfig): void => {
  const cfgPath = path.resolve('config.json');
  
  // Write configuration to file (with nice formatting)
  fs.writeJSONSync(cfgPath, config, { spaces: 2 });
};
```

**Simple analogy:** Like your phone's contacts app - stores important information and retrieves it when needed.

---

### 📝 Logging System

#### **`src/logger/logger.ts`** - Record Keeper

**What it is:** Sets up the logging system.

**What it does:** Records everything that happens (to console and file).

**The code (explained):**

```typescript
export function initLogger() {
  // Make sure logs directory exists
  fs.ensureDirSync(path.resolve('logs'));
  
  // Create winston logger
  const logger = winston.createLogger({
    level: 'info',  // Log level: info, warn, error
    
    // Format: Add timestamp and convert to JSON
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    
    // Where to write logs
    transports: [
      // 1. Write to file: logs/backup.log
      new winston.transports.File({
        filename: 'logs/backup.log'
      }),
      
      // 2. Write to console (terminal)
      new winston.transports.Console({
        format: winston.format.simple()
      })
    ],
  });
  
  // Make logger available globally
  (global as any).logger = logger;
}
```

**What gets logged:**
- When backup starts
- Each step of the backup process
- When backup completes
- Any errors that occur
- How long each operation took

**Simple analogy:** Like a security camera recording everything that happens in a store - you can review the footage later if needed.

---

### 📐 Type Definitions

#### **`src/types/index.ts`** - Blueprints

**What it is:** Defines the structure of data used in the application.

**What it does:** Tells TypeScript what information we need and in what format.

**The code (explained):**

```typescript
// ═══════════════════════════════════════════════════════════
// SUPPORTED DATABASE TYPES
// ═══════════════════════════════════════════════════════════
export type DatabaseType = 'postgresql' | 'mysql' | 'sqlite';

// ═══════════════════════════════════════════════════════════
// DATABASE CONFIGURATION
// ═══════════════════════════════════════════════════════════
export interface DatabaseConfig {
  name: string;           // Friendly name (e.g., "my-neondb")
  type: DatabaseType;     // Type: postgresql, mysql, or sqlite
  host?: string;          // Server address (e.g., "neon.tech")
  port?: number;          // Port number (e.g., 5432)
  user?: string;          // Username
  password?: string;      // Password
  database?: string;      // Database name
  filePath?: string;      // For SQLite: path to .db file
  ssl?: boolean;          // Use secure connection?
}

// ═══════════════════════════════════════════════════════════
// COMPLETE CONFIGURATION
// ═══════════════════════════════════════════════════════════
export interface BackupConfig {
  defaultBackupDir: string;      // Where to save backups
  databases: DatabaseConfig[];   // List of all databases
}

// ═══════════════════════════════════════════════════════════
// BACKUP RESULT
// ═══════════════════════════════════════════════════════════
export interface BackupResult {
  success: boolean;     // Did it work?
  filePath?: string;    // Where is the backup?
  error?: string;       // If failed, what went wrong?
  duration?: number;    // How long did it take?
}
```

**Why this matters:**
- TypeScript checks our code before running
- If we forget required information, TypeScript warns us
- Prevents bugs and mistakes
- Makes code more reliable

**Simple analogy:** Like a form at the doctor's office - has specific fields that must be filled out, ensures no important information is missed.

---

## 🚀 Quick Start Guide

### Prerequisites

**1. Install Node.js**
- Download from [nodejs.org](https://nodejs.org/)
- Version 16 or higher

**2. Install Database Tools**

For **PostgreSQL** (NeonDB, Supabase, etc.):
```bash
# macOS
brew install postgresql@17

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify
pg_dump --version
```

For **MySQL**:
```bash
# macOS
brew install mysql-client

# Verify
mysqldump --version
```

For **SQLite**: No tools needed!

---

### Setup Steps

**Step 1: Install Dependencies**
```bash
npm install
```

**Step 2: Create Configuration**
```bash
cp config.example.json config.json
```

**Step 3: Edit Configuration**

Open `config.json` and add your database:

```json
{
  "defaultBackupDir": "./backups",
  "databases": [
    {
      "name": "my-neondb",
      "type": "postgresql",
      "host": "ep-cool-database-123456.us-east-2.aws.neon.tech",
      "port": 5432,
      "user": "myusername",
      "password": "mypassword",
      "database": "mydatabase",
      "ssl": true
    }
  ]
}
```

**Step 4: Test Connection**
```bash
npm run dev -- test-connection --name my-neondb
```

Expected output:
```
✓ PostgreSQL connection successful: my-neondb
```

**Step 5: Create Backup**
```bash
npm run dev -- backup --name my-neondb
```

Expected output:
```
info: Starting backup for database: my-neondb
info: Executing: pg_dump for mydatabase
info: Compressing backup: my-neondb_2025-10-27T14-30-45-123Z.sql
info: ✓ Backup compressed
info: ✓ Backup completed successfully in 8122ms
```

**Step 6: Verify Backup**
```bash
ls -lh backups/
```

You should see:
```
-rw-r--r--  1 user  staff   3.5K Oct 27 14:30 my-neondb_2025-10-27T14-30-45-123Z.sql.tar.gz
```

---

## 🎮 Available Commands

### 1. Show Help
```bash
npm run dev -- --help
```
Shows all available commands and options.

### 2. List Databases
```bash
npm run dev -- backup
```
Shows all configured databases.

### 3. Test Connection
```bash
# Test one database
npm run dev -- test-connection --name my-neondb

# Test all databases
npm run dev -- test-connection --all
```

### 4. Create Backup
```bash
# Backup one database
npm run dev -- backup --name my-neondb

# Backup all databases
npm run dev -- backup --all
```

### 5. Command Help
```bash
# Help for specific command
npm run dev -- backup --help
npm run dev -- test-connection --help
```

---

## 💼 Complete Usage Examples

### Example 1: Backing Up NeonDB

**Your NeonDB details:**
- Host: `ep-fragrant-queen-123456.us-east-2.aws.neon.tech`
- User: `neondb_owner`
- Password: `npg_ksZoPLfp20Yb`
- Database: `neondb`

**Configuration (`config.json`):**
```json
{
  "defaultBackupDir": "./backups",
  "databases": [
    {
      "name": "production-neondb",
      "type": "postgresql",
      "host": "ep-fragrant-queen-123456.us-east-2.aws.neon.tech",
      "port": 5432,
      "user": "neondb_owner",
      "password": "npg_ksZoPLfp20Yb",
      "database": "neondb",
      "ssl": true
    }
  ]
}
```

**Commands:**
```bash
# Test connection
npm run dev -- test-connection --name production-neondb

# Create backup
npm run dev -- backup --name production-neondb

# Check backup
ls -lh backups/
```

---

### Example 2: Multiple Databases

**Configuration:**
```json
{
  "defaultBackupDir": "./backups",
  "databases": [
    {
      "name": "production-db",
      "type": "postgresql",
      "host": "prod.neon.tech",
      "port": 5432,
      "user": "prod_user",
      "password": "prod_pass",
      "database": "prod_db",
      "ssl": true
    },
    {
      "name": "staging-db",
      "type": "postgresql",
      "host": "staging.neon.tech",
      "port": 5432,
      "user": "staging_user",
      "password": "staging_pass",
      "database": "staging_db",
      "ssl": true
    },
    {
      "name": "local-mysql",
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "user": "root",
      "password": "root",
      "database": "wordpress"
    }
  ]
}
```

**Commands:**
```bash
# Test all connections
npm run dev -- test-connection --all

# Backup all databases at once
npm run dev -- backup --all

# Backup specific one
npm run dev -- backup --name production-db
```

---

### Example 3: Automated Daily Backups

**Create a script (`backup.sh`):**
```bash
#!/bin/bash

# Navigate to project directory
cd /path/to/db_backup_utility

# Set PATH for PostgreSQL tools
export PATH="/opt/homebrew/opt/postgresql@17/bin:$PATH"

# Run backup
npm run dev -- backup --all

# Clean old backups (keep last 7 days)
find backups/ -name "*.tar.gz" -mtime +7 -delete

# Log completion
echo "Backup completed at $(date)" >> /var/log/daily-backup.log
```

**Make executable:**
```bash
chmod +x backup.sh
```

**Schedule with cron (daily at 2 AM):**
```bash
crontab -e
```

Add:
```
0 2 * * * /path/to/backup.sh
```

---

## 🛠️ Technologies Used

### 1. **TypeScript**
- **What:** Programming language (JavaScript with types)
- **Why:** Catches errors before running, makes code reliable
- **Where:** All `.ts` files

### 2. **Node.js**
- **What:** JavaScript runtime
- **Why:** Lets us run JavaScript outside browsers
- **Where:** Foundation for everything

### 3. **commander.js**
- **What:** CLI framework
- **Why:** Easy command creation (backup, test-connection, etc.)
- **Where:** `src/cli/` files

### 4. **winston**
- **What:** Logging library
- **Why:** Records all activity to console and files
- **Where:** `src/logger/logger.ts`

### 5. **pg (PostgreSQL Client)**
- **What:** PostgreSQL connector
- **Why:** Connects to PostgreSQL databases
- **Where:** `src/db/connection.ts`

### 6. **mysql2 (MySQL Client)**
- **What:** MySQL connector
- **Why:** Connects to MySQL databases
- **Where:** `src/db/connection.ts`

### 7. **sqlite3 (SQLite Client)**
- **What:** SQLite connector
- **Why:** Works with SQLite databases
- **Where:** `src/db/connection.ts`

### 8. **fs-extra**
- **What:** File system library
- **Why:** Easy file operations (copy, move, delete)
- **Where:** Throughout codebase

### 9. **tar**
- **What:** Compression library
- **Why:** Creates compressed backup files
- **Where:** `src/backup/backupService.ts`

### 10. **which**
- **What:** Command finder
- **Why:** Checks if `pg_dump`/`mysqldump` are installed
- **Where:** `src/backup/backupService.ts`

### 11. **pg_dump** (External Tool)
- **What:** PostgreSQL's backup tool
- **Why:** Extracts all data from PostgreSQL
- **How:** Called from Node.js

### 12. **mysqldump** (External Tool)
- **What:** MySQL's backup tool
- **Why:** Extracts all data from MySQL
- **How:** Called from Node.js

---

## 🐛 Troubleshooting

### Issue: "pg_dump not found"

**Meaning:** PostgreSQL backup tool isn't installed.

**Fix:**
```bash
# macOS
brew install postgresql@17
echo 'export PATH="/opt/homebrew/opt/postgresql@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify
pg_dump --version
```

---

### Issue: "server version mismatch"

**Meaning:** Your `pg_dump` version doesn't match database version.

**Error Example:**
```
pg_dump: error: aborting because of server version mismatch
pg_dump: detail: server version: 17.5; pg_dump version: 16.10
```

**Fix:**
```bash
# Uninstall old version
brew uninstall postgresql@16

# Install correct version
brew install postgresql@17

# Update PATH
sed -i '' 's/postgresql@16/postgresql@17/g' ~/.zshrc
source ~/.zshrc
```

---

### Issue: "Connection failed"

**Meaning:** Can't connect to database.

**Solutions:**

1. **Check credentials:**
```bash
npm run dev -- test-connection --name your-db
```

2. **Verify config.json:**
- Host correct?
- Port correct? (PostgreSQL: 5432, MySQL: 3306)
- Username correct?
- Password correct?
- SSL enabled for cloud databases?

3. **Check firewall:**
- For NeonDB: Add your IP to whitelist
- For local: Check if firewall blocks port

4. **Test with native tool:**
```bash
# PostgreSQL
psql "postgresql://user:password@host:5432/database?sslmode=require"

# MySQL
mysql -h host -u user -p database
```

---

### Issue: Backup file is 0 bytes

**Meaning:** Backup ran but created empty file.

**Causes:**

1. **Database is empty** - no tables/data
2. **Permission issue** - user lacks SELECT privilege
3. **pg_dump error** - check logs: `cat logs/backup.log`

**Fix:**
```sql
-- Grant permissions (PostgreSQL)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO your_user;

-- Grant permissions (MySQL)
GRANT SELECT ON database_name.* TO 'your_user'@'%';
```

---

### Issue: "No space left on device"

**Meaning:** Disk is full.

**Fix:**
```bash
# Check disk space
df -h

# Delete old backups
find backups/ -name "*.tar.gz" -mtime +30 -delete

# Or change backup location in config.json
{
  "defaultBackupDir": "/path/to/larger/drive/backups"
}
```

---

## 📝 Logs Explained

### Console Output
```
info: Starting backup for database: my-neondb
info: Executing: pg_dump for neondb
info: Compressing backup: my-neondb_2025-10-27T14-30-45-123Z.sql
info: ✓ Backup compressed
info: ✓ Backup completed successfully in 8122ms
```

### Log File (`logs/backup.log`)
```json
{"level":"info","message":"Starting backup for database: my-neondb","timestamp":"2025-10-27T14:30:45.123Z"}
{"level":"info","message":"Executing: pg_dump for neondb","timestamp":"2025-10-27T14:30:45.456Z"}
{"level":"info","message":"✓ Backup completed successfully in 8122ms","timestamp":"2025-10-27T14:30:53.911Z"}
```

**View logs:**
```bash
# All logs
cat logs/backup.log

# Last 20 lines
tail -20 logs/backup.log

# Follow in real-time
tail -f logs/backup.log

# Pretty format
cat logs/backup.log | jq '.'
```

---

## 🔒 Security Tips

1. **Never commit config.json** - Contains passwords
2. **Use strong passwords** - Use password manager
3. **Enable SSL** - For cloud databases (`"ssl": true`)
4. **Limit permissions** - Backup user only needs SELECT
5. **Secure backups** - Encrypt if storing in cloud
6. **Rotate regularly** - Delete old backups

---

## 🎓 What You've Learned

By using this tool, you understand:

- ✅ How databases work
- ✅ How to backup/restore data
- ✅ Command-line interfaces
- ✅ Database connectivity
- ✅ File compression
- ✅ Logging and monitoring
- ✅ Error handling
- ✅ Configuration management
- ✅ TypeScript/Node.js development

---

## 📚 Additional Resources

- **SETUP.md** - Detailed setup guide
- **EXAMPLES.md** - More usage examples
- **CHECKLIST.md** - Setup checklist
- **IMPLEMENTATION.md** - Technical details

---

## 📄 License

ISC

---

**Made with ❤️ for safe and secure database backups**

*Keep your data safe. Backup regularly. Sleep peacefully.* 😊

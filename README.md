🗄️ Database Backup Utility Tool (CLI)

A command-line interface (CLI) tool built in TypeScript for performing secure and efficient database backups and restores across multiple SQL databases — all from your terminal.
The goal of this project is to create a lightweight, developer-friendly, and extensible utility to simplify database backup operations for developers, system administrators, and DevOps engineers.

⸻

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Your Database

Copy the example config:

```bash
cp config.example.json config.json
```

Edit `config.json` with your database credentials (e.g., NeonDB, Supabase, local PostgreSQL, MySQL, etc.):

```json
{
  "defaultBackupDir": "./backups",
  "databases": [
    {
      "name": "my-neondb",
      "type": "postgresql",
      "host": "your-host.neon.tech",
      "port": 5432,
      "user": "your-username",
      "password": "your-password",
      "database": "your-database-name",
      "ssl": true
    }
  ]
}
```

### 3. Test Connection

```bash
npm run dev -- test-connection --name my-neondb
```

### 4. Create Backup

```bash
npm run dev -- backup --name my-neondb
```

Your backup will be saved to `./backups/my-neondb_{timestamp}.sql.tar.gz`

📖 **For detailed setup instructions, see [SETUP.md](./SETUP.md)**

⸻

🚀 Project Overview

This tool automates the process of backing up and restoring SQL databases such as MySQL, PostgreSQL, and SQLite.
It is designed to be simple, modular, and performant, while maintaining flexibility for future features like cloud storage and scheduling.

**✅ Currently implemented:**
	•	✅ Local storage for backups
	•	✅ PostgreSQL, MySQL, and SQLite support
	•	✅ Connection testing
	•	✅ Automatic compression (gzip)
	•	✅ Detailed logging
	•	✅ Multi-database configuration

**🔜 Planned features:**
	•	Cloud storage (AWS S3, GCP, Azure)
	•	Automatic backup scheduling
	•	Restore functionality
	•	Incremental and differential backups
	•	Backup retention policies
	•	Notifications (Slack, email)

⸻

🎯 Core Features
	•	**Multi-Database Support**: Works with MySQL, PostgreSQL, and SQLite
	•	**Connection Management**: Test connections before backing up
	•	**Backup Types**: Full backups (incremental/differential planned)
	•	**Compression**: Automatic gzip compression to save storage
	•	**Local Storage**: Organized folder structure with timestamps
	•	**Restore Functionality**: Coming soon
	•	**Logging**: Comprehensive logs in console and files
	•	**CLI Interface**: Clean, intuitive commands using commander

⸻

⚙️ Tech Stack
	•	**Language**: TypeScript
	•	**Runtime**: Node.js
	•	**CLI Framework**: commander.js
	•	**Database Clients**: pg (PostgreSQL), mysql2 (MySQL), sqlite3 (SQLite)
	•	**Compression**: tar + gzip
	•	**Logging**: winston

⸻

🧩 Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `backup --name <db>` | Backup a specific database | `npm run dev -- backup --name my-neondb` |
| `backup --all` | Backup all configured databases | `npm run dev -- backup --all` |
| `test-connection --name <db>` | Test database connection | `npm run dev -- test-connection --name my-neondb` |
| `test-connection --all` | Test all database connections | `npm run dev -- test-connection --all` |
| `restore` | Restore from backup | Coming soon |
| `--help` | Show help for any command | `npm run dev -- backup --help` |

⸻

📁 Backup Structure

Backups are stored with the following structure:

```
backups/
├── my-neondb_2025-10-24T12-30-45-123Z.sql.tar.gz
├── my-mysql-db_2025-10-24T12-31-22-456Z.sql.tar.gz
└── local-sqlite_2025-10-24T12-32-10-789Z.db.tar.gz
```

Each backup file contains:
- Full database dump
- Compressed with gzip
- Timestamped filename for easy identification

⸻

🗂️ Project Structure

```
db_backup_utility/
├── src/
│   ├── cli/
│   │   ├── backupCmd.ts       # Backup command implementation
│   │   ├── restoreCmd.ts      # Restore command (coming soon)
│   │   ├── testConnCmd.ts     # Connection testing command
│   │   └── command.ts         # Command registry
│   ├── backup/
│   │   └── backupService.ts   # Core backup logic
│   ├── db/
│   │   └── connection.ts      # Database connection handlers
│   ├── config/
│   │   └── config.ts          # Configuration management
│   ├── logger/
│   │   └── logger.ts          # Winston logger setup
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── main.ts                # Entry point
├── logs/                       # Log files
├── backups/                    # Backup storage (created automatically)
├── config.json                 # Your database configurations (gitignored)
├── config.example.json         # Example configuration
├── SETUP.md                    # Detailed setup guide
├── tsconfig.json
└── package.json
```

⸻

🧪 Example Usage

```bash
# Show all commands
npm run dev -- --help

# List configured databases
npm run dev -- backup

# Test a specific database connection
npm run dev -- test-connection --name my-neondb

# Test all database connections
npm run dev -- test-connection --all

# Backup a specific database
npm run dev -- backup --name my-neondb

# Backup all databases
npm run dev -- backup --all
```

⸻

## 📋 Prerequisites

### For PostgreSQL (NeonDB, Supabase, etc.)
Install `pg_dump`:
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql-client`
- **Windows**: Install from [postgresql.org](https://www.postgresql.org/download/)

### For MySQL
Install `mysqldump`:
- **macOS**: `brew install mysql-client`
- **Linux**: `sudo apt-get install mysql-client`
- **Windows**: Install from [mysql.com](https://dev.mysql.com/downloads/)

### For SQLite
No additional tools needed! ✨

⸻

🔮 Future Enhancements
	•	Add cloud backup integration (AWS S3, Google Cloud Storage, Azure)
	•	Add automatic scheduling (cron-like feature)
	•	Add Slack/email notifications
	•	Add differential & incremental backups
	•	Add encryption for backup files
	•	Implement restore functionality
	•	Add backup retention policies
	•	Support for MongoDB and other NoSQL databases
	•	Web UI for backup management

⸻

## 📝 Logs

All operations are logged to:
- **Console**: Real-time output
- **File**: `logs/backup.log` (detailed JSON logs)

⸻

## 🔒 Security Note

**Never commit `config.json` to version control!** It contains sensitive database credentials. The file is already included in `.gitignore`.

⸻

## 🤝 Contributing

This is a learning project, but suggestions and improvements are welcome!

⸻

## 📄 License

ISC

⸻

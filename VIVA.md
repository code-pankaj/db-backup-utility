# 🎤 VIVA QUESTIONS - Database Backup Utility Project

## 📚 Table of Contents

1. [Basic Concept Questions](#basic-concept-questions)
2. [Technical Implementation Questions](#technical-implementation-questions)
3. [Architecture & Design Questions](#architecture--design-questions)
4. [Database Specific Questions](#database-specific-questions)
5. [Security & Best Practices Questions](#security--best-practices-questions)
6. [Testing & Validation Questions](#testing--validation-questions)
7. [Troubleshooting Questions](#troubleshooting-questions)
8. [Future Enhancement Questions](#future-enhancement-questions)

---

## Basic Concept Questions

### Q1: What is the purpose of your Database Backup Utility project?
**Expected Answer:** The project is a CLI-based tool that automates database backups for PostgreSQL, MySQL, and SQLite. It provides compression, logging, secure credential management, and supports local.

### Q2: Why is database backup important?
**Expected Answer:** Database backups protect against data loss from system failures, human errors, cyberattacks, or hardware failures. They are critical for disaster recovery, business continuity, and regulatory compliance.

### Q3: What databases does your tool support and why did you choose them?
**Expected Answer:** 
- PostgreSQL: Most popular open-source database, widely used in cloud platforms
- MySQL: Dominant in web applications and LAMP stack
- SQLite: Lightweight embedded database for small applications
These three cover 90% of common database use cases.

### Q4: What is the difference between backup and restore?
**Expected Answer:** Backup creates a copy of database data at a specific point in time. Restore recreates the database from a backup file. Our tool currently implements backup; restore is planned for future work.

### Q5: What type of backups does your tool perform - full, incremental, or differential?
**Expected Answer:** Our tool performs full backups, which means the entire database is backed up each time. Incremental/differential backups are not yet implemented but are in our future roadmap.

---

## Technical Implementation Questions

### Q6: Which programming language and runtime did you use? Why?
**Expected Answer:** TypeScript with Node.js. TypeScript provides type safety and better IDE support, reducing bugs. Node.js offers cross-platform compatibility and a rich ecosystem via npm.

### Q7: Explain the role of Commander.js in your project.
**Expected Answer:** Commander.js is our CLI framework that handles:
- Parsing command-line arguments
- Defining commands (backup, test-connection)
- Providing help documentation
- Managing command options and flags

### Q8: How does your tool execute database dumps?
**Expected Answer:** 
- PostgreSQL: Uses `pg_dump` via Node.js child_process
- MySQL: Uses `mysqldump` command
- SQLite: Direct file copy using fs module
We execute these native tools because they guarantee compatibility and data integrity.

### Q9: What compression algorithm do you use and why?
**Expected Answer:** We use gzip compression via the tar library. It provides:
- 80-95% size reduction
- Industry standard format (.tar.gz)
- Fast compression speed
- Universal compatibility

### Q10: Explain the logging mechanism in your project.
**Expected Answer:** We use Winston logger with:
- Dual transports: console (human-readable) + file (JSON format)
- Log levels: info, warn, error
- Automatic timestamps
- Stored in logs/backup.log for audit trails

### Q11: What is the purpose of config.json?
**Expected Answer:** config.json stores database credentials and settings:
- Database connection parameters
- Backup directory location
- Multiple database configurations
It's gitignored for security to prevent credential exposure.

### Q12: How do you handle TypeScript type safety?
**Expected Answer:** We created interfaces in `src/types/index.ts`:
- DatabaseConfig (database connection details)
- BackupConfig (application settings)
- BackupResult (operation outcomes)
TypeScript's strict mode catches errors at compile time.

---

## Architecture & Design Questions

### Q13: Explain your project's architecture.
**Expected Answer:** Layered architecture:
1. Entry Point (main.ts) - bootstraps application
2. CLI Layer - command parsing and routing
3. Service Layer - core backup logic
4. Database Layer - connection management
5. Logger - centralized logging
6. Config - configuration management

### Q14: What design pattern did you follow?
**Expected Answer:** We used:
- Modular design for separation of concerns
- Service pattern for business logic
- Command pattern for CLI commands
- Singleton pattern for logger

### Q15: How does data flow through your application?
**Expected Answer:** 
User → CLI Command → Config Loader → Backup Service → Native Dump Tool → SQL File → Compression → .tar.gz File → Log Success

### Q16: Why did you separate backup logic into different files?
**Expected Answer:** Following Single Responsibility Principle:
- Each file has one clear purpose
- Easier testing and debugging
- Better code maintainability
- Team members can work independently

### Q17: How is error handling implemented?
**Expected Answer:** 
- Try-catch blocks in service layer
- Detailed error logging with Winston
- User-friendly error messages in CLI
- Graceful process exit without crashes
- Cleanup of partial files on failure

---

## Database Specific Questions

### Q18: How do you connect to PostgreSQL databases?
**Expected Answer:** Using the `pg` library:
- Build connection string with credentials
- Support SSL for cloud databases
- Use pg_dump for backup execution
- Handle connection errors gracefully

### Q19: What is the difference between PostgreSQL and MySQL backup?
**Expected Answer:**
- PostgreSQL uses pg_dump, outputs SQL format
- MySQL uses mysqldump, similar SQL format
- PostgreSQL has better support for schemas and extensions
- Both require native tools installed

### Q20: How do you handle cloud databases like NeonDB?
**Expected Answer:** 
- SSL/TLS enabled connection (ssl: true in config)
- Connection string format specific to cloud provider
- Longer timeouts for network latency
- Same pg_dump command but with SSL flag

### Q21: Why is SQLite backup different?
**Expected Answer:** SQLite is file-based, so:
- No network connection needed
- Direct file copy instead of dump command
- Faster backup process
- No authentication required

### Q22: What permissions are needed for database backups?
**Expected Answer:**
- PostgreSQL: CONNECT privilege and SELECT on all tables
- MySQL: SELECT, LOCK TABLES, SHOW VIEW privileges
- SQLite: File system read permissions

---

## Security & Best Practices Questions

### Q23: How do you secure database credentials?
**Expected Answer:**
- Stored in config.json which is gitignored
- Never committed to version control
- No credentials appear in logs (passwords masked)
- SSL/TLS for encrypted connections
- Example config provided separately

### Q24: What security measures are implemented?
**Expected Answer:**
- Config file excluded from Git
- SSL support for remote connections
- Password masking in log output
- Secure file permissions on backups
- Documentation warnings about credential security

### Q25: Why did you choose JSON over environment variables?
**Expected Answer:** JSON provides:
- Multiple database configurations in one file
- Structured, validated format
- Easier to manage complex configurations
- Better for team sharing (via example file)

### Q26: How do you prevent SQL injection?
**Expected Answer:** Not applicable as we:
- Don't execute user-provided SQL queries
- Use native dump tools directly
- Don't concatenate user input into SQL
- Connection strings are from config, not user input

---

## Testing & Validation Questions

### Q27: How did you test your application?
**Expected Answer:**
- Manual testing with real databases (NeonDB)
- Connection testing with valid/invalid credentials
- Different database sizes (small to large)
- Error scenarios (wrong passwords, network issues)
- Cross-platform testing (macOS, Linux)

### Q28: What happens if pg_dump is not installed?
**Expected Answer:** 
- Application checks for tool availability using `which` command
- Throws clear error: "pg_dump not found. Please install PostgreSQL client."
- Logs the error for debugging
- Exits gracefully without crash

### Q29: How do you validate backup success?
**Expected Answer:**
- Check if .sql file was created
- Verify file size > 0
- Successful compression to .tar.gz
- Log file indicates success
- No errors in execution

### Q30: What performance metrics did you measure?
**Expected Answer:**
- Backup duration: 8 seconds for 10MB database
- Compression ratio: 80-95% size reduction
- Memory usage: < 200MB during operation
- Success rate: > 99% in testing

---

## Troubleshooting Questions

### Q31: What if the backup directory doesn't exist?
**Expected Answer:** We use `fs.ensureDir()` which:
- Automatically creates directory if missing
- Creates parent directories recursively
- No error if directory already exists

### Q32: How do you handle large database backups?
**Expected Answer:**
- Native dump tools handle streaming
- File system writes in chunks
- Compression reduces final size
- For very large DBs (> 1GB), backup time increases but process remains stable

### Q33: What if compression fails?
**Expected Answer:**
- Original .sql file is retained
- Error is logged with details
- User notified of failure
- Backup can still be used (just uncompressed)

### Q34: How do you debug connection issues?
**Expected Answer:**
- Use test-connection command first
- Check logs/backup.log for detailed errors
- Verify credentials in config.json
- Confirm firewall/network access
- Test SSL settings for cloud databases

### Q35: What happens if disk space is full?
**Expected Answer:**
- Dump command fails with disk space error
- Error is caught and logged
- Partial files are cleaned up
- User notified to free up space

---

## Future Enhancement Questions

### Q36: What features would you add next?
**Expected Answer:**
- Restore functionality to recreate databases
- Cloud storage integration (S3, Google Cloud)
- Built-in scheduling (cron-like)
- Retention policies (auto-delete old backups)
- Incremental backups for efficiency

### Q37: How would you implement restore functionality?
**Expected Answer:**
- Decompress .tar.gz file
- Parse SQL dump file
- Execute SQL commands to recreate database
- Validate restored data
- Log restoration process

### Q38: How could you improve performance?
**Expected Answer:**
- Parallel compression for multiple files
- Streaming backups (don't wait for complete dump)
- Incremental backups (only changes)
- Progress indicators for large backups
- Multi-threaded compression

### Q39: What about backup scheduling?
**Expected Answer:**
- Integrate node-cron for built-in scheduling
- Allow configuration of backup frequency
- Email notifications on success/failure
- Retention policy to manage disk space
- Or document cron job integration (current approach)

### Q40: How would you add MongoDB support?
**Expected Answer:**
- Add 'mongodb' to database types
- Install MongoDB client library
- Use mongodump command or native driver
- Handle MongoDB-specific connection strings
- Update TypeScript types and interfaces

---

## Individual Contribution Questions

### Q41: (For Pankaj) Explain the BackupService class architecture.
**Expected Answer:** BackupService is the core engine:
- performBackup() orchestrates the entire process
- Database-specific methods (backupPostgreSQL, backupMySQL, backupSQLite)
- Compression logic with tar/gzip
- Error handling and logging
- Returns BackupResult with success status

### Q42: (For Anjali) How did you design the CLI commands?
**Expected Answer:** Used Commander.js:
- Registered commands with descriptive names
- Added options/flags (--name, --all)
- Created help messages for each command
- Handled command routing to service layer
- Provided user-friendly output

### Q43: (For Kartik) How do you handle SSL connections?
**Expected Answer:** For PostgreSQL:
- Check ssl flag in config
- Add SSL parameter to connection string
- Use --no-password flag for pg_dump
- Handle SSL certificate validation
- Test with cloud providers (NeonDB, Supabase)

### Q44: (For Malik) Explain the logging strategy.
**Expected Answer:** Winston logger with:
- Two transports (console + file)
- JSON format for machine parsing
- Timestamp on every log entry
- Different log levels (info, warn, error)
- Log rotation for long-term storage

### Q45: (For Anshu) Why is TypeScript important for this project?
**Expected Answer:** TypeScript provides:
- Compile-time error detection
- Better IDE autocomplete
- Interface definitions for data structures
- Refactoring safety
- Self-documenting code through types

---

## Scenario-Based Questions

### Q46: A user reports backup is failing. How do you diagnose?
**Expected Answer:**
1. Check logs/backup.log for error details
2. Run test-connection to verify credentials
3. Confirm native tools (pg_dump/mysqldump) installed
4. Check disk space availability
5. Verify database user has required permissions

### Q47: How would you backup multiple databases automatically every night?
**Expected Answer:**
- Configure all databases in config.json
- Create shell script running backup --all
- Set up cron job: `0 2 * * * cd /path && npm run dev -- backup --all`
- Monitor logs for failures
- Implement retention policy to delete old backups

### Q48: Production database is 50GB. Will your tool handle it?
**Expected Answer:** Yes, but:
- Backup will take longer (30-60 minutes)
- Ensure sufficient disk space (50GB + compressed size)
- pg_dump streams data, doesn't load all in memory
- Compression will reduce final size significantly
- Monitor with logs for progress

### Q49: How do you migrate from MySQL to PostgreSQL using this tool?
**Expected Answer:**
- Backup MySQL database
- Extract SQL from .tar.gz
- Convert MySQL-specific syntax to PostgreSQL
- Create PostgreSQL database
- Import converted SQL (manual restore)
Note: Direct migration not supported, requires SQL conversion

### Q50: Your team member made changes. How do you integrate?
**Expected Answer:**
- Pull changes from Git
- Review code changes
- Run TypeScript compilation to check errors
- Test locally with config.json
- Verify no breaking changes
- Merge if all tests pass

---

## Project Management Questions

### Q51: How did you divide work among team members?
**Expected Answer:** Based on expertise:
- Pankaj: Architecture, core engine, documentation
- Anjali: CLI interface, user commands
- Kartik: Database integrations, security
- Malik: Logging system, monitoring
- Anshu: TypeScript types, MySQL implementation

### Q52: What challenges did you face during development?
**Expected Answer:**
- Version compatibility issues
- PATH configuration for native tools
- SSL/TLS setup for cloud databases
- Team coordination and code integration
- TypeScript strict mode errors

### Q53: How long did the project take to complete?
**Expected Answer:** 
- Total development time: 138+ hours over 7 weeks
- Planning & design: 1 week
- Core development: 4 weeks
- Testing & debugging: 1 week
- Documentation: 1 week

### Q54: What did you learn from this project?
**Expected Answer:**
- CLI application development
- Multi-database connectivity
- TypeScript best practices
- Team collaboration with Git
- Error handling and logging
- Documentation importance

### Q55: If you had more time, what would you improve?
**Expected Answer:**
- Add GUI/web interface
- Implement restore functionality
- Add automated testing suite
- Cloud storage integration
- Better progress indicators
- Email notifications

---

**End of Viva Questions**

*Total Questions: 55*
*Estimated Time: 45-60 minutes for complete viva*

**Preparation Tips:**
1. Understand the complete execution flow
2. Be ready to explain your specific contributions
3. Know the purpose of each file in the project
4. Practice explaining technical concepts simply
5. Be honest about limitations and future improvements
6. Demonstrate running the tool live if possible
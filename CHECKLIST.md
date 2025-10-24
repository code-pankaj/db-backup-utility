# Getting Started Checklist

Use this checklist to set up and start using the Database Backup Utility.

## ☑️ Initial Setup

- [ ] Clone/navigate to the project directory
- [ ] Run `npm install` to install dependencies
- [ ] Copy `config.example.json` to `config.json`
- [ ] Verify `config.json` is in `.gitignore` (it should be)

## ☑️ Configure Your Database

### For NeonDB (PostgreSQL):

- [ ] Log into your NeonDB dashboard
- [ ] Copy your connection details
- [ ] Edit `config.json` with your NeonDB credentials:
  ```json
  {
    "name": "my-neondb",
    "type": "postgresql",
    "host": "ep-xxxxx.region.aws.neon.tech",
    "port": 5432,
    "user": "your-username",
    "password": "your-password",
    "database": "your-database-name",
    "ssl": true
  }
  ```

### For Other Databases:

- [ ] See `config.example.json` for MySQL/SQLite examples
- [ ] Update `config.json` with appropriate credentials

## ☑️ Install Required Tools

### For PostgreSQL Backups:

**macOS:**
- [ ] Run: `brew install postgresql`
- [ ] Verify: `pg_dump --version`

**Linux:**
- [ ] Run: `sudo apt-get install postgresql-client`
- [ ] Verify: `pg_dump --version`

**Windows:**
- [ ] Download from https://www.postgresql.org/download/
- [ ] Add to PATH
- [ ] Verify: `pg_dump --version`

### For MySQL Backups:

**macOS:**
- [ ] Run: `brew install mysql-client`
- [ ] Verify: `mysqldump --version`

**Linux:**
- [ ] Run: `sudo apt-get install mysql-client`
- [ ] Verify: `mysqldump --version`

## ☑️ Test Your Setup

- [ ] List configured databases:
  ```bash
  npm run dev -- backup
  ```

- [ ] Test database connection:
  ```bash
  npm run dev -- test-connection --name your-db-name
  ```

- [ ] If connection fails, check:
  - [ ] Database credentials are correct
  - [ ] Host and port are correct
  - [ ] SSL setting matches your database
  - [ ] Firewall allows connection
  - [ ] Database user has appropriate permissions

## ☑️ Create Your First Backup

- [ ] Run the backup command:
  ```bash
  npm run dev -- backup --name your-db-name
  ```

- [ ] Verify the backup file was created:
  ```bash
  ls -lh backups/
  ```

- [ ] Check the logs for any errors:
  ```bash
  cat logs/backup.log
  ```

## ☑️ Verify Backup

- [ ] Backup file exists in `backups/` directory
- [ ] Filename follows pattern: `{db-name}_{timestamp}.sql.tar.gz`
- [ ] File size is reasonable (not 0 bytes)
- [ ] Logs show successful completion

## ☑️ Best Practices Setup

- [ ] Add `config.json` to `.gitignore` (already done)
- [ ] Create a backup schedule (cron job, scheduled task, etc.)
- [ ] Set up external backup storage location
- [ ] Document your backup retention policy
- [ ] Test restore procedure (when implemented)

## ☑️ Troubleshooting Checklist

If backups fail, check:

- [ ] Database connection works (use `test-connection` command)
- [ ] Required tools installed (pg_dump, mysqldump)
- [ ] Sufficient disk space for backups
- [ ] Database user has SELECT permissions
- [ ] No firewall blocking database connection
- [ ] Logs for detailed error messages: `cat logs/backup.log`

## 📝 Quick Reference

```bash
# Install dependencies
npm install

# Show help
npm run dev -- --help

# List databases
npm run dev -- backup

# Test connection
npm run dev -- test-connection --name <db-name>

# Create backup
npm run dev -- backup --name <db-name>

# Backup all
npm run dev -- backup --all

# View logs
cat logs/backup.log
```

## 🎯 You're Ready!

Once all items are checked, your database backup utility is ready to use!

For more details:
- See `README.md` for overview
- See `SETUP.md` for detailed instructions
- See `EXAMPLES.md` for real-world scenarios
- See `IMPLEMENTATION.md` for technical details

## 🆘 Need Help?

Common issues and solutions:

**Issue**: "pg_dump not found"
**Solution**: Install PostgreSQL client tools (see above)

**Issue**: "Connection failed"
**Solution**: Verify credentials and test with `test-connection` command

**Issue**: "Permission denied"
**Solution**: Ensure database user has SELECT privileges

**Issue**: "No space left"
**Solution**: Free up disk space or change `defaultBackupDir`

---

Happy backing up! 🎉

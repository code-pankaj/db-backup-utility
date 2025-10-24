# Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Your Database

Copy the example config file:

```bash
cp config.example.json config.json
```

Edit `config.json` with your actual database credentials:

```json
{
  "defaultBackupDir": "./backups",
  "databases": [
    {
      "name": "my-neondb",
      "type": "postgresql",
      "host": "your-neon-host.neon.tech",
      "port": 5432,
      "user": "your-username",
      "password": "your-password",
      "database": "your-database-name",
      "ssl": true
    }
  ]
}
```

### 3. Test Your Connection

```bash
npm run dev -- test-connection --name my-neondb
```

Or test all configured databases:

```bash
npm run dev -- test-connection --all
```

### 4. Create Your First Backup

Backup a specific database:

```bash
npm run dev -- backup --name my-neondb
```

Or backup all configured databases:

```bash
npm run dev -- backup --all
```

### 5. Check Your Backups

Backups are stored in the `./backups` directory by default. Each backup is:
- Timestamped with format: `{database-name}_{timestamp}.sql.tar.gz`
- Compressed with gzip
- Contains the full database dump

## Prerequisites

### PostgreSQL Backups

Install PostgreSQL client tools to get `pg_dump`:

**⚠️ IMPORTANT: Version Matching**

Your `pg_dump` version should match or be newer than your database server version. For example:
- If your NeonDB is running PostgreSQL 17.x, install PostgreSQL 17
- If your database is running PostgreSQL 16.x, install PostgreSQL 16

**macOS:**

```bash
# For PostgreSQL 17 (recommended for NeonDB)
brew install postgresql@17

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify installation
pg_dump --version
```

For other versions:
```bash
# PostgreSQL 16
brew install postgresql@16

# PostgreSQL 15
brew install postgresql@15
```

**Ubuntu/Debian:**

```bash
# Add PostgreSQL APT repository
sudo apt-get install wget ca-certificates
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Install PostgreSQL 17 client
sudo apt-get update
sudo apt-get install postgresql-client-17

# Verify installation
pg_dump --version
```

**Windows:**

1. Download PostgreSQL from [PostgreSQL Downloads](https://www.postgresql.org/download/)
2. Choose the version that matches your database server
3. During installation, select "Command Line Tools"
4. Add PostgreSQL bin directory to your PATH
5. Verify: Open CMD and run `pg_dump --version`

### MySQL Backups

Install MySQL client tools to get `mysqldump`:

**macOS:**
```bash
brew install mysql-client

# Add to PATH (if needed)
echo 'export PATH="/opt/homebrew/opt/mysql-client/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify installation
mysqldump --version
```

**Ubuntu/Debian:**
```bash
sudo apt-get install mysql-client

# Verify installation
mysqldump --version
```

**Windows:**

Download and install from [MySQL Downloads](https://dev.mysql.com/downloads/)

### SQLite Backups

No additional tools required - SQLite backups work out of the box.

## Configuration Reference

### Database Types

#### PostgreSQL (NeonDB, Supabase, etc.)

```json
{
  "name": "my-postgres-db",
  "type": "postgresql",
  "host": "hostname.provider.com",
  "port": 5432,
  "user": "username",
  "password": "password",
  "database": "database-name",
  "ssl": true
}
```

**Notes:**
- Set `"ssl": true` for cloud-hosted databases (NeonDB, Supabase, etc.)
- Set `"ssl": false` for local PostgreSQL instances
- Port 5432 is the default PostgreSQL port

#### MySQL

```json
{
  "name": "my-mysql-db",
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "user": "root",
  "password": "password",
  "database": "myapp"
}
```

**Notes:**
- Port 3306 is the default MySQL port
- Ensure user has SELECT privileges on the database

#### SQLite

```json
{
  "name": "my-sqlite-db",
  "type": "sqlite",
  "filePath": "./path/to/database.db"
}
```

**Notes:**
- Provide absolute or relative path to the SQLite database file
- Ensure read permissions on the file

## Common Commands

### View Help

```bash
# Main help
npm run dev -- --help

# Backup command help
npm run dev -- backup --help

# Test connection command help
npm run dev -- test-connection --help
```

### List Available Databases

```bash
npm run dev -- backup
```

### Backup Operations

```bash
# Backup single database
npm run dev -- backup --name my-neondb

# Backup all databases
npm run dev -- backup --all
```

### Connection Testing

```bash
# Test single connection
npm run dev -- test-connection --name my-neondb

# Test all connections
npm run dev -- test-connection --all
```

## Logs

All operations are logged to:
- **Console** (stdout) - Real-time feedback
- **File** `logs/backup.log` - Detailed JSON logs

View logs:
```bash
# View entire log
cat logs/backup.log

# View last 20 lines
tail -20 logs/backup.log

# Follow logs in real-time
tail -f logs/backup.log

# View logs with pretty formatting
cat logs/backup.log | jq '.'
```

## Tips & Best Practices

### 1. Keep config.json Secure

Never commit `config.json` with real credentials to version control. It's already in `.gitignore`.

### 2. Regular Backups

Set up a cron job or scheduled task to run backups automatically:

**macOS/Linux (cron):**
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /path/to/db_backup_utility && /opt/homebrew/opt/postgresql@17/bin/pg_dump && npm run dev -- backup --all >> /var/log/db-backup.log 2>&1
```

**Create a backup script:**
```bash
#!/bin/bash
cd /path/to/db_backup_utility
export PATH="/opt/homebrew/opt/postgresql@17/bin:$PATH"
npm run dev -- backup --all
```

### 3. Backup Storage Management

```bash
# Check backup directory size
du -sh backups/

# List backups by size
ls -lhS backups/

# Delete backups older than 30 days
find backups/ -name "*.tar.gz" -mtime +30 -delete
```

### 4. Test Restores Periodically

Periodically test restoring from backups to ensure they're valid and complete.

### 5. Multiple Backup Locations

Consider the 3-2-1 backup rule:
- 3 copies of your data
- 2 different storage media
- 1 offsite backup

### 6. Monitor Backup Success

Check logs regularly to ensure backups are completing successfully:

```bash
# Check if today's backup exists
ls -lh backups/ | grep $(date +%Y-%m-%d)

# Check logs for errors
grep -i error logs/backup.log | tail -10
```

## Troubleshooting

### "pg_dump not found"

**Problem:** PostgreSQL client tools are not installed or not in PATH.

**Solution:**
```bash
# macOS
brew install postgresql@17
echo 'export PATH="/opt/homebrew/opt/postgresql@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Linux
sudo apt-get install postgresql-client-17

# Verify
which pg_dump
pg_dump --version
```

### "server version mismatch"

**Problem:** Your `pg_dump` version doesn't match your database server version.

**Example Error:**
```
pg_dump: error: aborting because of server version mismatch
pg_dump: detail: server version: 17.5; pg_dump version: 16.10
```

**Solution:**

1. Check your database server version:
```bash
npm run dev -- test-connection --name your-db
# Or check your database provider's dashboard
```

2. Install matching PostgreSQL version:
```bash
# If database is PostgreSQL 17
brew uninstall postgresql@16
brew install postgresql@17

# Update PATH
sed -i '' 's/postgresql@16/postgresql@17/g' ~/.zshrc
source ~/.zshrc

# Verify
pg_dump --version
```

### "Connection failed"

**Problem:** Cannot connect to database.

**Solutions:**

1. **Verify credentials:**
```bash
npm run dev -- test-connection --name your-db
```

2. **Check config.json:**
- Ensure host, port, user, password, database are correct
- Verify SSL setting matches your database requirements

3. **Check firewall:**
- Ensure your IP is whitelisted (for cloud databases)
- Check if port is open

4. **Test with psql:**
```bash
psql "postgresql://user:password@host:5432/database?sslmode=require"
```

### "Permission denied"

**Problem:** Database user lacks necessary permissions.

**Solution:**

Ensure your database user has SELECT privileges:

```sql
-- PostgreSQL
GRANT SELECT ON ALL TABLES IN SCHEMA public TO your_user;

-- MySQL
GRANT SELECT ON database_name.* TO 'your_user'@'%';
```

### "No space left on device"

**Problem:** Insufficient disk space for backups.

**Solutions:**

1. **Check available space:**
```bash
df -h
```

2. **Clean old backups:**
```bash
# List backups by age
ls -lt backups/

# Delete old backups
find backups/ -name "*.tar.gz" -mtime +30 -delete
```

3. **Change backup directory:**
Edit `config.json` and set `defaultBackupDir` to a location with more space:
```json
{
  "defaultBackupDir": "/path/to/larger/drive/backups",
  "databases": [...]
}
```

### "mysqldump not found"

**Problem:** MySQL client tools are not installed.

**Solution:**
```bash
# macOS
brew install mysql-client

# Linux
sudo apt-get install mysql-client

# Verify
which mysqldump
mysqldump --version
```

### Backup file is empty or very small

**Problem:** Backup completed but file is 0 bytes or suspiciously small.

**Solutions:**

1. **Check logs:**
```bash
tail -50 logs/backup.log
```

2. **Test connection:**
```bash
npm run dev -- test-connection --name your-db
```

3. **Check database user permissions:**
User must have SELECT privileges on all tables.

4. **Verify database has data:**
Connect to your database and check if tables exist and contain data.

## Verification Checklist

After setup, verify everything is working:

- [ ] Dependencies installed (`npm install`)
- [ ] `config.json` created with real credentials
- [ ] PostgreSQL tools installed (`pg_dump --version`)
- [ ] PATH updated (tools accessible from terminal)
- [ ] Connection test successful
- [ ] Backup created successfully
- [ ] Backup file exists in `backups/` directory
- [ ] Backup file has reasonable size (not 0 bytes)
- [ ] Logs show no errors

## Next Steps

After successful setup:

1. **Set up automated backups** (cron jobs, scheduled tasks)
2. **Test restore procedures** (when implemented)
3. **Configure backup retention policy**
4. **Set up monitoring/alerts** for backup failures
5. **Document your backup strategy**

## Getting Help

If you encounter issues:

1. Check logs: `cat logs/backup.log`
2. Verify configuration: `cat config.json`
3. Test connection: `npm run dev -- test-connection --all`
4. Check tool versions: `pg_dump --version`, `mysqldump --version`
5. Review error messages carefully

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [NeonDB Documentation](https://neon.tech/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

For more examples and use cases, see [EXAMPLES.md](./EXAMPLES.md)

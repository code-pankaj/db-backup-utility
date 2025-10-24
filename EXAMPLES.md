# Usage Examples

## Real-World Scenarios

### Scenario 1: Backing Up a NeonDB PostgreSQL Database

**1. Get your NeonDB connection string:**

From your NeonDB dashboard, copy the connection details.

**2. Add to `config.json`:**

```json
{
  "defaultBackupDir": "./backups",
  "databases": [
    {
      "name": "production-neondb",
      "type": "postgresql",
      "host": "ep-cool-darkness-123456.us-east-2.aws.neon.tech",
      "port": 5432,
      "user": "myuser",
      "password": "npg_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456",
      "database": "myapp",
      "ssl": true
    }
  ]
}
```

**3. Test the connection:**

```bash
npm run dev -- test-connection --name production-neondb
```

Expected output:
```
info: ✓ PostgreSQL connection successful: production-neondb
```

**4. Create your first backup:**

```bash
npm run dev -- backup --name production-neondb
```

Expected output:
```
info: Starting backup for database: production-neondb
info: Executing: pg_dump for myapp
info: Compressing backup: production-neondb_2025-10-24T15-30-45-123Z.sql
info: ✓ Backup compressed: production-neondb_2025-10-24T15-30-45-123Z.sql.tar.gz
info: ✓ Backup completed successfully in 2341ms: ./backups/production-neondb_2025-10-24T15-30-45-123Z.sql.tar.gz
```

---

### Scenario 2: Multiple Databases (Staging + Production)

**config.json:**

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
      "password": "prod_password",
      "database": "myapp_prod",
      "ssl": true
    },
    {
      "name": "staging-db",
      "type": "postgresql",
      "host": "staging.neon.tech",
      "port": 5432,
      "user": "staging_user",
      "password": "staging_password",
      "database": "myapp_staging",
      "ssl": true
    }
  ]
}
```

**Backup all at once:**

```bash
npm run dev -- backup --all
```

**Or backup individually:**

```bash
npm run dev -- backup --name production-db
npm run dev -- backup --name staging-db
```

---

### Scenario 3: Local MySQL Development Database

**config.json:**

```json
{
  "defaultBackupDir": "./backups",
  "databases": [
    {
      "name": "local-wordpress",
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

**Test and backup:**

```bash
npm run dev -- test-connection --name local-wordpress
npm run dev -- backup --name local-wordpress
```

---

### Scenario 4: SQLite Database

**config.json:**

```json
{
  "defaultBackupDir": "./backups",
  "databases": [
    {
      "name": "local-app-db",
      "type": "sqlite",
      "filePath": "./data/app.db"
    }
  ]
}
```

**Backup:**

```bash
npm run dev -- backup --name local-app-db
```

---

### Scenario 5: Mixed Database Types

**config.json:**

```json
{
  "defaultBackupDir": "./backups",
  "databases": [
    {
      "name": "production-postgres",
      "type": "postgresql",
      "host": "neon.tech",
      "port": 5432,
      "user": "user",
      "password": "pass",
      "database": "prod",
      "ssl": true
    },
    {
      "name": "analytics-mysql",
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "user": "root",
      "password": "pass",
      "database": "analytics"
    },
    {
      "name": "cache-sqlite",
      "type": "sqlite",
      "filePath": "./data/cache.db"
    }
  ]
}
```

**Test all connections:**

```bash
npm run dev -- test-connection --all
```

**Backup everything:**

```bash
npm run dev -- backup --all
```

---

## Daily Workflow Examples

### Morning Backup Before Deployment

```bash
# Test connection first
npm run dev -- test-connection --name production-db

# Create backup
npm run dev -- backup --name production-db

# Deploy your changes...
```

### Weekly Full Backup

```bash
# Backup all databases
npm run dev -- backup --all

# Move backups to external storage
cp -r backups/ /Volumes/ExternalDrive/db-backups/$(date +%Y-%m-%d)/
```

### Quick Development Snapshot

```bash
# Before making major changes
npm run dev -- backup --name local-dev-db
```

---

## Automation Examples

### macOS/Linux Cron Job (Daily Backup at 2 AM)

```bash
# Edit crontab
crontab -e

# Add this line:
0 2 * * * cd /path/to/db_backup_utility && npm run dev -- backup --all >> /var/log/db-backup.log 2>&1
```

### Using a Shell Script

Create `backup-script.sh`:

```bash
#!/bin/bash
cd /path/to/db_backup_utility

echo "Starting daily backup at $(date)"
npm run dev -- backup --all

# Optional: Upload to cloud storage
# aws s3 sync ./backups s3://my-backup-bucket/$(date +%Y-%m-%d)/

# Optional: Clean old backups (keep last 7 days)
find ./backups -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed at $(date)"
```

Make it executable:

```bash
chmod +x backup-script.sh
```

Run it:

```bash
./backup-script.sh
```

---

## Troubleshooting Examples

### Connection Issues

```bash
# Test connection first
npm run dev -- test-connection --name my-db

# Check logs
cat logs/backup.log
```

### Finding Your Backups

```bash
# List all backups
ls -lh backups/

# Find backups from today
ls -lh backups/ | grep $(date +%Y-%m-%d)

# Check backup size
du -sh backups/
```

### Extracting a Backup (Manual)

```bash
# Extract the backup file
tar -xzf backups/my-db_2025-10-24T15-30-45-123Z.sql.tar.gz

# View the SQL file
less my-db_2025-10-24T15-30-45-123Z.sql
```

---

## Advanced Usage

### Custom Backup Directory Per Database

Modify the tool to support per-database backup paths (future enhancement).

### Encrypted Backups

Future feature - will support GPG encryption:

```bash
# Planned feature
npm run dev -- backup --name my-db --encrypt
```

### Incremental Backups

Future feature - will support incremental backups:

```bash
# Planned feature
npm run dev -- backup --name my-db --type incremental
```

---

## Best Practices

1. **Always test connections before backups**
   ```bash
   npm run dev -- test-connection --all
   ```

2. **Run backups during low-traffic periods**
   - Schedule for night time or early morning

3. **Verify backup files exist**
   ```bash
   ls -lh backups/ | tail -1
   ```

4. **Store backups in multiple locations**
   - Local disk
   - External drive
   - Cloud storage (future feature)

5. **Test restore procedures regularly**
   - Ensures backups are actually usable
   - Builds confidence in your backup strategy

6. **Monitor backup sizes**
   ```bash
   du -sh backups/
   ```

7. **Keep backup logs**
   ```bash
   tail -f logs/backup.log
   ```

---

## Quick Reference

```bash
# List databases
npm run dev -- backup

# Test one connection
npm run dev -- test-connection --name <db-name>

# Test all connections
npm run dev -- test-connection --all

# Backup one database
npm run dev -- backup --name <db-name>

# Backup all databases
npm run dev -- backup --all

# View help
npm run dev -- --help
npm run dev -- backup --help
npm run dev -- test-connection --help
```

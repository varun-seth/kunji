

```sql
-- Get current date in SQLite.
SELECT date('now');

-- Get current date and time
SELECT datetime('now');

-- Get it in a weird format like dd/mm/yyyy
SELECT strftime('%d/%m/%Y', 'now');
```

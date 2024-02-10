# sample SQL queries

## Group by query

SELECT store_id, SUM(sales) AS TotalSales
FROM sales_table
WHERE year = 2023  -- Filter data
GROUP BY store_id
HAVING SUM(sales) > 10000;  -- Filter groups after grouping

---
## String operations

```sql
SELECT substring('Sachin Tendulkar', -9, 3) ---> 7th from back, with 3 length = "Ten"
```


---

### Join

```sql
SELECT Employees.Name, Departments.DepartmentName
FROM Employees
INNER JOIN Departments
ON Employees.DepartmentID = Departments.DepartmentID;
-- alias of `USING (DepartmentID)`
```

### Ranks

```sql
SELECT
    column1,
    column2,
    RANK() OVER (ORDER BY column3 DESC) AS ranking
FROM
    your_table;
```


## SQLite


```sql
-- Get current date in SQLite.
SELECT date('now');

-- Get current date and time
SELECT datetime('now');

-- Get it in a weird format like dd/mm/yyyy
SELECT strftime('%d/%m/%Y', 'now');
```

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

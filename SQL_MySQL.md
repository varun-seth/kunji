## Installation

Mac OS: `brew install mysql` and `brew services start mysql`

Login root `mysql -u root -p`

```sql
CREATE DATABASE test_db;

USE test_db;

CREATE TABLE test_table (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

```

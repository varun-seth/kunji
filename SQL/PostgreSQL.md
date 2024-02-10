# PostgreSQL


## Installation
For Mac OS, use
`brew install postgresql`

Suppose I want to work on project named "acme". I want a DB named "acme_db" and a user/role named "acme_user"

Run `psql postgres` or `psql -U postgres` to login. 

Create a user:

```sql
CREATE USER acme_user WITH PASSWORD 'password';
CREATE DATABASE acme_db;
GRANT ALL PRIVILEGES ON DATABASE acme_db TO acme_user;
```


Sometimes homebrew postgres installation uses current user's name as default super user. Check the users with command `\du`


This commands help create user "postgres" as the superuser.

```sql
-- Also create user "postgres" if it does not exist.
CREATE ROLE postgres WITH LOGIN SUPERUSER;
``````

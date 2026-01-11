# Database Setup

1. Create the database and tables using `schema.sql` on your MySQL server (Aiven.io).
2. Run `seed_admin.js` to create the admin user.

## Example

```
mysql -u <user> -p <db> < schema.sql
node src/db/seed_admin.js
```

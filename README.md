# census-app

# Database Setup

1. Create the database and tables using `schema.sql` on your MySQL server (Aiven.io).
2. Run `seed_admin.js` to create the admin user.

## Example

```
mysql -u <user> -p <db> < schema.sql
node src/db/seed_admin.js
```
## Render
https://census-app-1499.onrender.com

# Environment variables for census-app
DB_HOST=mysql-1567db1f-stud-d26d.i.aivencloud.com
DB_USER=avnadmin
DB_PASSWORD=AVNS_BaNyDRRMrnwEV1xWP0K
DB_NAME=defaultdb
PORT=12404

// Purpose: Database connection
const mysql = require("mysql2");
const db = mysql.createConnection(
  {
    host: "localhost",
    database: "staff_db",
    user: "root",
    password: "rootpassword",
  },
  console.log("Connected to the staff_db")
);

// Export the database connection
module.exports = db;

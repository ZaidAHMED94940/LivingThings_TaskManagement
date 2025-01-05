const sqlite3 = require('sqlite3').verbose();
// Create a new database connection
const db = new sqlite3.Database('../backend2/db.sqlite3', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database');
  }
});

module.exports = {db};

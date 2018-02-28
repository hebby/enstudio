var mysql = require('mysql');
const dbconfig = require('../config/db.js')

const pool = mysql.createPool({
  host: dbconfig.HOST,
  user: dbconfig.USERNAME,
  password: dbconfig.PASSWORD,
  database: dbconfig.DATABASE
});

module.exports = {
  query: (sql, values) => {
    console.log("sql", sql);
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err)
        } else {
          connection.query(sql, values, (err, rows) => {
            if (err) {
              reject(err)
            } else {
              resolve(rows)
            }
            connection.release()
          })
        }
      })
    })
  }
}
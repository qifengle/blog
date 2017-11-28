// 连接MySQL
const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'lp251645731',
  database: 'lipper',
  dateStrings: true,
});

function query(sql, callback) {
  pool.getConnection((err, connection) => {
    // Use the connection
    connection.query(sql, (err, rows) => {
      callback(err, rows);
      connection.release();// 释放链接
    });
  });
}

exports.query = query;

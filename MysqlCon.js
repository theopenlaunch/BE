const mysql = require('mysql');
require('dotenv').config();

const optionsMysql = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

const pool = mysql.createPool(optionsMysql);

exports.pool = pool;

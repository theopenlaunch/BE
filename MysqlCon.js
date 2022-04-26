const mysql = require("mysql");

// connect ot mysql data for BE
const optionsMysql = {
	user: "admin",
	password: "passsssss",
	database: "Tonana_launchpad",
};

const pool = mysql.createPool(optionsMysql);

exports.pool = pool;

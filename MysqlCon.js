const mysql = require("mysql");

const optionsMysql = {
	user: "admin",
	password: "passsssss",
	database: "Tonana_launchpad",
};

const pool = mysql.createPool(optionsMysql);

exports.pool = pool;

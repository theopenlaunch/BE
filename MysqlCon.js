const mysql = require("mysql");

const optionsMysql = {
	user: "admin",
	password: "pass123",
	database: "Tonana_launchpad_sol",
};

const pool = mysql.createPool(optionsMysql);

exports.pool = pool;

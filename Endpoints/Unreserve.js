const pool = require("../MysqlCon.js").pool;
const { CreateImg } = require("./CreateImg");

// NEED TO START IT WITH CRONTAB EWERY 30 MIN

pool.getConnection((err, con) => {
	con.query(
		"UPDATE `NFTs` SET Status='Free', Time='" +
			Date.now() +
			"' WHERE Status='Reserved' AND Time<'" +
			(Date.now() - 30 * 60 * 1000) +
			"';",
		(errora, resultsInf1) => {
			// CreateImg();
			console.log(errora);
			console.log(resultsInf1);
		}
	);
});

const pool = require("../MysqlCon.js").pool;

const GetStatus = (app) => {
	app.get("/API/getStatus", function (req, res) {
		pool.getConnection((err, con) => {
			con.query(
				"SELECT * FROM `Projects` ORDER BY `Id`",
				(err1, resultsCom) => {
					resultsCom.forEach((e) => (e["WalletPrivat"] = null));
					res.send(JSON.stringify({ status: "ok", status: resultsCom }));
				}
			);
		});
	});
};

module.exports = GetStatus;

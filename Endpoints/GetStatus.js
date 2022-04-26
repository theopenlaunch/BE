const pool = require("../MysqlCon.js").pool;
const fs = require("fs");
console.log(2);
const GetStatus = (app) => {
	console.log(1);
	app.get("/API/getStatus", function (req, res) {
		pool.getConnection((err, con) => {
			con.query(
				"SELECT * FROM `Projects` ORDER BY `Id`",
				(err1, resultsCom) => {
					console.log(err1);
					console.log(resultsCom);
					res.send(JSON.stringify({ status: "ok", status: resultsCom }));
				}
			);
		});
	});
};

module.exports = GetStatus;

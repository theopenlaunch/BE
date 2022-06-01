const pool = require("../MysqlCon.js").pool;

const Payed = (app) => {
	app.post("/API/payedIds", function (req, res) {
		const data = req.body;

		try {
			pool.getConnection((err, con) => {
				con.query(
					"INSERT INTO `NFTs` (`Id`, `InvoiceId`, `ProjectId`, `Wallet`, `Hash`, `Status`, `Time`) VALUES (NULL, '" +
						data.invoiceId +
						"', " +
						data.invoiceId.slice(16) +
						",'','', 'Payed', " +
						Date.now() +
						" );",
					(_, resultsInf) => {
						console.log(_);
						console.log(resultsInf);
						res.send(JSON.stringify({ status: "ok" }));
					}
				);
			});
		} catch (e) {
			console.log("error3", e);
			res.send(JSON.stringify({ status: "error" }));
		}
	});
};

module.exports = Payed;

const pool = require("../MysqlCon.js").pool;
const { CreateImg } = require("./CreateImg");

const Reserve = (app) => {
	app.post("/API/reserveIds", function (req, res) {
		const IDsDeapasonStart = 1;
		const IDsDeapasonEnd = 10000;
		let i = 0;
		let data = req.body;
		let result = [];
		let hash = "____RESERVED____";
		let time = new Date();

		try {
			pool.getConnection((err, con) => {
				data.ids.forEach((e) => {
					// if (
					// 	data.ids.filter((e) => e >= IDsDeapasonStart && e <= IDsDeapasonEnd)
					// 		.length === data.ids.length
					// ) {
					con.query(
						"SELECT * FROM `NFTs` WHERE `Id`='" + e + "';",
						(errora, resultsInf) => {
							i++;

							result.push(resultsInf[0]["Status"]);
							if (data.ids.length === i) {
								if (
									result.filter((e) => e === "Free").length === data.ids.length
								) {
									let j = 0;
									data.ids.forEach((e) => {
										con.query(
											"UPDATE `NFTs` SET Status='Reserved', Wallet='" +
												"" +
												"', Hash='" +
												hash +
												"',Time='" +
												Date.now() +
												"' WHERE `Id`='" +
												e +
												"';",
											(errora, resultsInf1) => {
												console.log(errora);
												console.log(resultsInf1);
												j++;
												if (data.ids.length === j) {
													console.log("done");
													// CreateImg();

													res.send(JSON.stringify({ status: "ok" }));
													// unreserve(data);
												}
											}
										);
									});
								} else {
									console.log("error1");
									res.send(JSON.stringify({ status: "error" }));
								}
							}
						}
					);
					// } else {
					// 	console.log("error2");
					// 	res.send(JSON.stringify({ status: "error" }));
					// }
				});
			});
		} catch (e) {
			console.log("error3", e);
			res.send(JSON.stringify({ status: "error" }));
		}
	});
};

const unreserve = (data) => {
	setTimeout(() => {
		pool.getConnection((err, con) => {
			let result = [];
			let hash = "";
			let time = new Date();
			let i = 0;
			pool.getConnection((err, con) => {
				data.ids.forEach((e) => {
					con.query(
						"SELECT * FROM `NFTs` WHERE `Id`='" + e + "';",
						(errora, resultsInf) => {
							i++;
							result.push(resultsInf[0]["Status"]);
							if (resultsInf[0]["Status"] === "Reserved") {
								con.query(
									"UPDATE `NFTs` SET Status='Free', Wallet='" +
										data.wallet +
										"', Hash='" +
										hash +
										"',Time='" +
										Date.now() +
										"' WHERE `Id`='" +
										e +
										"';",
									(errora, resultsInf1) => {
										console.log(errora);
										console.log(resultsInf1);
									}
								);
							} else {
								console.log("already free");
							}
						}
					);
				});
			});
		});
	}, 30 * 60 * 1000);
};

// console.log(Date.now() - 30 * 60 * 1000);

module.exports = Reserve;

// pool.getConnection((err, con) => {
// 	data.ids.forEach((e) => {
// 		con.query(
// 			"UPDATE `NFTs` SET Status='Free', Wallet='" +
// 				data.wallet +
// 				"', Hash='" +
// 				hash +
// 				"',Time='" +
// 				Date.now() +
// 				"' WHERE Status='Reserved' AND Time<'" +
// 				Date.now() -
// 				30 * 60 * 1000 +
// 				"';",
// 			(errora, resultsInf1) => {
// 				console.log(errora);
// 				console.log(resultsInf1);
// 			}
// 		);
// 	});
// });

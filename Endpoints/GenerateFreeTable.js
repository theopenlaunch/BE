// FREE TABLE

// const pool = require("../MysqlCon.js").pool;

// let i = 0;
// pool.getConnection((err, con) => {
// 	while (i < 10000) {
// 		i++;
// 		console.log(i);
// 		con.query(
// 			"INSERT INTO Toncells.NFTs (ID, Status, Wallet, Hash, Time) VALUES (" +
// 				i +
// 				", 'Free', '', '', 10);",
// 			(e, a) => {
// 				console.log(e);
// 				console.log(a);
// 			}
// 		);
// 	}
// });

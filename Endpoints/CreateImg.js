const pool = require("../MysqlCon.js").pool;
const fs = require("fs");
const Jimp = require("jimp");

const arr = [
	1, 2, 3, 4, 17, 18, 19, 20, 33, 34, 35, 36, 49, 50, 51, 52, 65, 66, 67, 68,
	81, 82, 83, 84, 97, 98, 99, 100, 113, 114, 115, 116, 129, 130, 131, 132, 145,
	146, 147, 148, 161, 162, 163, 164, 177, 178, 179, 180, 193, 194, 195, 196,
	209, 210, 211, 212, 225, 226, 227, 228, 241, 242, 243, 244, 257, 258, 259,
	260, 273, 274, 275, 276, 289, 290, 291, 292, 305, 306, 307, 308, 321, 322,
	323, 324, 337, 338, 339, 340, 353, 354, 355, 356, 369, 370, 371, 372, 385,
	386, 387, 388,
];
const arr1 = [
	5, 6, 7, 8, 21, 22, 23, 24, 37, 38, 39, 40, 53, 54, 55, 56, 69, 70, 71, 72,
	85, 86, 87, 88, 101, 102, 103, 104, 117, 118, 119, 120, 133, 134, 135, 136,
	149, 150, 151, 152, 165, 166, 167, 168, 181, 182, 183, 184, 197, 198, 199,
	200, 213, 214, 215, 216, 229, 230, 231, 232, 245, 246, 247, 248, 261, 262,
	263, 264, 277, 278, 279, 280, 293, 294, 295, 296, 309, 310, 311, 312, 325,
	326, 327, 328, 341, 342, 343, 344, 357, 358, 359, 360, 373, 374, 375, 376,
	389, 390, 391, 392,
];
const arr2 = [
	9, 10, 11, 12, 25, 26, 27, 28, 41, 42, 43, 44, 57, 58, 59, 60, 73, 74, 75, 76,
	89, 90, 91, 92, 105, 106, 107, 108, 121, 122, 123, 124, 137, 138, 139, 140,
	153, 154, 155, 156, 169, 170, 171, 172, 185, 186, 187, 188, 201, 202, 203,
	204, 217, 218, 219, 220, 233, 234, 235, 236, 249, 250, 251, 252, 265, 266,
	267, 268, 281, 282, 283, 284, 297, 298, 299, 300, 313, 314, 315, 316, 329,
	330, 331, 332, 345, 346, 347, 348, 361, 362, 363, 364, 377, 378, 379, 380,
	393, 394, 395, 396,
];
const arr3 = [
	13, 14, 15, 16, 29, 30, 31, 32, 45, 46, 47, 48, 61, 62, 63, 64, 77, 78, 79,
	80, 93, 94, 95, 96, 109, 110, 111, 112, 125, 126, 127, 128, 141, 142, 143,
	144, 157, 158, 159, 160, 173, 174, 175, 176, 189, 190, 191, 192, 205, 206,
	207, 208, 221, 222, 223, 224, 237, 238, 239, 240, 253, 254, 255, 256, 269,
	270, 271, 272, 285, 286, 287, 288, 301, 302, 303, 304, 317, 318, 319, 320,
	333, 334, 335, 336, 349, 350, 351, 352, 365, 366, 367, 368, 381, 382, 383,
	384, 397, 398, 399, 400,
];

let mainarr = [arr, arr1, arr2, arr3];

const CreateImg = () => {
	// app.get("/API/getImg", function (req, res) {
	CreateImgFree();
	CreateImgMinted();
	pool.getConnection((err, con) => {
		con.query("SELECT * FROM `NFTs` ORDER BY `Id`", (err1, resultsCom) => {
			// res.send(JSON.stringify({ status: "ok", status: resultsCom }));/
			const pixels = [];
			const pixelsMatrix = [];
			// console.log(resultsCom);
			let j = 0;
			let resarr = [];

			for (let i = 0; i <= 25; i++) {
				resarr.push(...mainarr.map((e) => e.map((e) => e + 400 * i)));

				if (i === 25) {
					// GO
					const arr = resarr.map((arr) => arr.map((e) => resultsCom[e - 1]));

					arr.forEach((e) => {
						e.forEach((earr) => {
							if (earr) {
								let color = Jimp.rgbaToInt(255, 255, 255, 255);
								if (earr["Status"] === "Reserved")
									color = Jimp.rgbaToInt(255, 0, 0, 255);
								if (earr["Status"] === "Minted")
									color = Jimp.rgbaToInt(0, 255, 0, 255);
								if (earr["Status"] === "Payed")
									color = Jimp.rgbaToInt(0, 0, 255, 255);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								// console.log(color);
								j++;
								if (resultsCom.length === j) {
									for (let i = 0; i < 1600; i++) {
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
									}
									// console.log(pixelsMatrix[100].length);

									let image = new Jimp(1600, 1600, function (err, image) {
										if (err) console.log("throw : ", err);
										pixelsMatrix.forEach((row, y) => {
											row.forEach((color, x) => {
												image.setPixelColor(color, x, y);
											});
										});

										image.write(
											"/home/admin/web/testnet.app.toncells.org/public_html/MAP.png",
											(err) => {
												if (err) console.log("throw : ", err);
												return;
											}
										);
									});
								}
							}
						});
					});
				}
			}

			// console.log(pixel["Status"]);
		});
	});
};

const CreateImgMinted = () => {
	// app.get("/API/getImg", function (req, res) {
	pool.getConnection((err, con) => {
		con.query("SELECT * FROM `NFTs` ORDER BY `Id`", (err1, resultsCom) => {
			// res.send(JSON.stringify({ status: "ok", status: resultsCom }));/
			const pixels = [];
			const pixelsMatrix = [];
			// console.log(resultsCom);
			let j = 0;
			let resarr = [];

			for (let i = 0; i <= 25; i++) {
				resarr.push(...mainarr.map((e) => e.map((e) => e + 400 * i)));

				if (i === 25) {
					// GO
					const arr = resarr.map((arr) => arr.map((e) => resultsCom[e - 1]));

					arr.forEach((e) => {
						e.forEach((earr) => {
							if (earr) {
								let color = Jimp.rgbaToInt(255, 255, 255, 255);
								if (earr["Status"] === "Minted")
									color = Jimp.rgbaToInt(0, 255, 0, 255);

								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								// console.log(color);
								j++;
								if (resultsCom.length === j) {
									for (let i = 0; i < 1600; i++) {
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
									}
									// console.log(pixelsMatrix[100].length);

									let image = new Jimp(1600, 1600, function (err, image) {
										if (err) console.log("throw : ", err);
										pixelsMatrix.forEach((row, y) => {
											row.forEach((color, x) => {
												image.setPixelColor(color, x, y);
											});
										});

										image.write(
											"/home/admin/web/testnet.app.toncells.org/public_html/MAPMINTED.png",
											(err) => {
												if (err) console.log("throw : ", err);
												return;
											}
										);
									});
								}
							}
						});
					});
				}
			}

			// console.log(pixel["Status"]);
		});
	});
};

const CreateImgFree = () => {
	// app.get("/API/getImg", function (req, res) {
	pool.getConnection((err, con) => {
		con.query("SELECT * FROM `NFTs` ORDER BY `Id`", (err1, resultsCom) => {
			// res.send(JSON.stringify({ status: "ok", status: resultsCom }));/
			const pixels = [];
			const pixelsMatrix = [];
			// console.log(resultsCom);
			let j = 0;
			let resarr = [];

			for (let i = 0; i <= 25; i++) {
				resarr.push(...mainarr.map((e) => e.map((e) => e + 400 * i)));

				if (i === 25) {
					// GO
					const arr = resarr.map((arr) => arr.map((e) => resultsCom[e - 1]));

					arr.forEach((e) => {
						e.forEach((earr) => {
							if (earr) {
								let color = Jimp.rgbaToInt(255, 255, 255, 255);
								if (earr["Status"] === "Free")
									color = Jimp.rgbaToInt(0, 255, 0, 255);

								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								pixels.push(color);
								// console.log(color);
								j++;
								if (resultsCom.length === j) {
									for (let i = 0; i < 1600; i++) {
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
										pixelsMatrix.push(pixels.slice(i * 1600, (i + 1) * 1600));
									}
									// console.log(pixelsMatrix[100].length);

									let image = new Jimp(1600, 1600, function (err, image) {
										if (err) console.log("throw : ", err);
										pixelsMatrix.forEach((row, y) => {
											row.forEach((color, x) => {
												image.setPixelColor(color, x, y);
											});
										});

										image.write(
											"/home/admin/web/testnet.app.toncells.org/public_html/MAPFREE.png",
											(err) => {
												if (err) console.log("throw : ", err);
												return;
											}
										);
									});
								}
							}
						});
					});
				}
			}

			// console.log(pixel["Status"]);
		});
	});
};

exports.CreateImg = CreateImg;
// CreateImg();

// let j = 1;
// let i = 1;
// let n = [0, 1, 2, 3, 16];
// let nn = 0;
// let arr = [];
// let oldZ = 1;

// while (i <= 388) {
// 	// console.log(i);
// 	arr.push(i);
// 	// if (i === 388) {
// 	console.log(arr);
// 	// }

// 	nn++;

// 	if (nn === 4) {
// 		nn = 0;
// 		i += 13;
// 	} else {
// 		i++;
// 	}
// }
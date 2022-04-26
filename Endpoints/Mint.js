const TonWeb = require("tonweb");
const fs = require("fs");
const pool = require("../MysqlCon.js").pool;
const { checkCellId } = require("./CheckId");
const { CreateImg } = require("./CreateImg");
const { mintPublicKey, mintSecretKey, royaltyPublicKey } = require("./Keys");
const { NftCollection, NftItem } = TonWeb.token.nft;
const hashes = fs.readFileSync(
	"/Users/sepezho/Projects/TONANA_LAUNCHPAD/TONANA_BE/hashes.json"
);
const tonweb = new TonWeb(
	new TonWeb.HttpProvider("https://testnet.toncenter.com/api/v2/jsonRPC", {
		apiKey: "a8d8e24af2a27066b01f6362f513a29b2adacd6586a9a22af0abdecb4c9332aa",
	})
);

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const seqno = (wallet, seqnoOld) =>
	new Promise(async (resolve) => {
		let whileGo = true;
		while (whileGo) {
			await sleep(1000);
			const seqno = (await wallet.methods.seqno().call()) || 0;
			if (seqno !== seqnoOld || seqno === 0) {
				whileGo = false;
				resolve(seqno);
			}
		}
	});

const Mint = (app) => {
	app.post("/API/mintNfts", async function (APIrequest, APIresponse) {
		const price = 0.1;
		let time = 0;
		const data = APIrequest.body;
		// const data = { invoiceId: "71961299928e2b9d" };
		const WalletClass = tonweb.wallet.all["v3R1"];
		const wallet = new WalletClass(tonweb.provider, {
			publicKey: mintPublicKey,
			wc: 0,
		});
		const walletAddress = (await wallet.getAddress()).toString(
			true,
			true,
			true
		);

		const fetchFunc = () => {
			fetch(
				`https://testnet.toncenter.com/api/v2/getTransactions?address=${walletAddress}&limit=500&to_lt=0&archival=false`,
				{
					headers: {
						"X-API-Key":
							"a8d8e24af2a27066b01f6362f513a29b2adacd6586a9a22af0abdecb4c9332aa",
					},
				}
			)
				.then((e) => e.json())
				.then((tonResponse) => {
					if (tonResponse.result) {
						const tonResponseFiltered = tonResponse.result.filter(
							(e) => e.in_msg.message.slice(0, 16) === data.invoiceId
						);

						if (tonResponseFiltered[0]) {
							tonResponseFiltered.forEach((tonResponseChunk) => {
								const idsArray = tonResponseChunk.in_msg.message
									.slice(16)
									.split(".")
									.map((e) => Number(e));

								if (
									tonResponseChunk.in_msg.message.slice(0, 16) ===
										data.invoiceId &&
									Number(tonResponseChunk.in_msg.value).toFixed(2) ===
										Number(idsArray.length * price * 1000000000).toFixed(2) &&
									idsArray.length ===
										idsArray.filter((e) => checkCellId(e)).length
								) {
									pool.getConnection((_, con) => {
										con.query(
											"SELECT * FROM `NFTs` WHERE `Id` IN ('" +
												idsArray.join("', '") +
												"');",
											async (_, resultsStatus) => {
												const result = resultsStatus.map((e) => e["Status"]);

												if (
													result.filter((e) => e === "Reserved").length ===
													idsArray.length
												) {
													let nfthashes = [];
													let seqnoOld = 0;

													for await (const id of idsArray) {
														seqnoOld = await seqno(wallet, seqnoOld);
														await sleep(5000);

														const res = await mintTONNFT(
															id,
															tonResponseChunk.in_msg.source,
															idsArray
														);

														nfthashes.push({ id: id, hash: res });

														if (nfthashes.length === idsArray.length) {
															console.log(id);
															console.log(idsArray);
															console.log(nfthashes);

															let j = 0;

															nfthashes.forEach((nfthashspecific) => {
																con.query(
																	"UPDATE `NFTs` SET Status='Minted', Wallet='" +
																		tonResponseChunk.in_msg.source +
																		"', Hash='" +
																		nfthashspecific.hash +
																		"',Time='" +
																		Date.now() +
																		"' WHERE `Id`='" +
																		nfthashspecific.id +
																		"';",
																	() => {
																		j++;

																		if (nfthashes.length === j) {
																			console.log("GOGOOGOGOGO");
																			try {
																				console.log(nfthashes);
																				CreateImg();
																				APIresponse.send(
																					JSON.stringify({
																						status: "ok",
																						nfthashes: nfthashes,
																					})
																				);
																			} catch (e) {
																				console.log(e);
																			}

																			return;
																		}
																	}
																);
															});
														}
													}
												}

												// while (nmnn < idsArray.length) {
												// 	nmnn++;

												// 	// await	setTimeout(async () => {
												// 	console.log(nmnn, "gp");
												// }

												// if (!!nfthash) {
												// 	nfthashes.push({ id: id, hash: nfthash });
												// 	if (nfthashes.length === idsArray.length) {
												else {
													console.log("FUCk away from me");
												}
											}
										);
									});
								} else {
									console.log("error4");
									APIresponse.send(JSON.stringify({ status: "error" }));
									return;
								}
							});
						} else {
							console.log("error5");
							APIresponse.send(JSON.stringify({ status: "error" }));
							return;
						}
					} else {
						time++;
						if (time <= 7) {
							setTimeout(() => {
								console.log("Retry");
								fetchFunc();
							}, time * time * 1000);
						} else {
							console.log("error6");
							APIresponse.send(JSON.stringify({ status: "error" }));
							return;
						}
					}
				});
		};
		fetchFunc();
	});
};

const mintTONNFT = async (id, walletTO, idsArray) => {
	try {
		console.log("go-" + id);
		// console.log(
		// 	JSON.parse(hashes).filter((e) => Number(e.id) === Number(id))[0]
		// );
		const metaHash = JSON.parse(hashes).filter(
			(e) => Number(e.id) === Number(id)
		)[0].hash;
		console.log(metaHash);

		const WalletClass = tonweb.wallet.all["v3R1"];
		const wallet = new WalletClass(tonweb.provider, {
			publicKey: mintPublicKey,
			wc: 0,
		});
		const walletAddress = await wallet.getAddress();
		const rwallet = new WalletClass(tonweb.provider, {
			publicKey: royaltyPublicKey,
			wc: 0,
		});
		const rwalletAddress = await rwallet.getAddress();
		const wallet2add = new TonWeb.utils.Address(walletTO);

		const nftCollection = new NftCollection(tonweb.provider, {
			ownerAddress: walletAddress,
			royalty: 0.05,
			royaltyAddress: rwalletAddress,
			collectionContentUri:
				"https://gateway.pinata.cloud/ipfs/QmXzimYZN3hMoq5dmAyeqykg7tm3LsxNKm7HswnL5k82cK",
			nftItemContentBaseUri: "https://gateway.pinata.cloud/ipfs/",
			nftItemCodeHex: NftItem.codeHex,
		});

		const nftCollectionAddress = await nftCollection.getAddress();
		const seqno = (await wallet.methods.seqno().call()) || 0;
		const amount = TonWeb.utils.toNano(0.05); // CHANGE TO 10TON OR SOMETHING
		const colData = await nftCollection.getCollectionData();

		const item = await nftCollection.createMintBody({
			amount,
			itemIndex: colData.nextItemIndex,
			itemOwnerAddress: wallet2add,
			itemContentUri: metaHash,
		});

		await wallet.methods
			.transfer({
				secretKey: mintSecretKey,
				toAddress: nftCollectionAddress.toString(true, true, true),
				amount: amount,
				seqno: seqno,
				payload: item,
				sendMode: 3,
			})
			.send();

		const res = (
			await nftCollection.getNftItemAddressByIndex(colData.nextItemIndex)
		).toString(true, true, true);
		console.log(res);
		return res;
	} catch (e) {
		console.log(e);
		return false;
	}
};

module.exports = Mint;
// Mint();

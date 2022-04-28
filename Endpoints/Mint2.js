const TonWeb = require("tonweb");
const pool = require("../MysqlCon.js").pool;
const { NftCollection, NftItem } = TonWeb.token.nft;
const tonweb = new TonWeb(
	new TonWeb.HttpProvider("https://testnet.toncenter.com/api/v2/jsonRPC", {
		apiKey: "a8d8e24af2a27066b01f6362f513a29b2adacd6586a9a22af0abdecb4c9332aa",
	})
);

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

let i = 0;
const seqno = (wallet, seqnoOld) =>
	new Promise(async (resolve) => {
		let whileGo = true;
		while (whileGo) {
			await sleep(200);
			const seqno = (await wallet.methods.seqno().call()) || 0;
			console.log(seqnoOld, seqno);
			if (seqno !== seqnoOld || seqno === 0) {
				whileGo = false;
				resolve(seqno);
			}
		}
	});

const pub = [
	232, 184, 7, 111, 151, 15, 67, 224, 174, 30, 178, 190, 78, 240, 51, 52, 169,
	99, 59, 225, 195, 21, 125, 181, 253, 184, 89, 110, 152, 239, 92, 134,
];

const privat = [
	36, 211, 8, 52, 196, 164, 72, 180, 212, 101, 168, 1, 158, 122, 8, 189, 239,
	164, 189, 80, 122, 88, 63, 190, 95, 104, 89, 132, 102, 0, 143, 4, 232, 184, 7,
	111, 151, 15, 67, 224, 174, 30, 178, 190, 78, 240, 51, 52, 169, 99, 59, 225,
	195, 21, 125, 181, 253, 184, 89, 110, 152, 239, 92, 134,
];

const Mint = () => {
	pool.query(
		"SELECT * FROM `NFTs` WHERE  `Status`='Payed'",
		async (_, resultsStatusPayed) => {
			if (resultsStatusPayed[0]) {
				let seqnoOld = 0;
				let nfthashes = [];
				resultsStatusPayed.forEach((resultsStatusP) => {
					console.log(resultsStatusP);
					const price = 0.1;
					let time = 0;
					const data = {
						invoiceId: resultsStatusP["InvoiceId"].slice(0, 16),
						projectId: resultsStatusP["InvoiceId"].slice(16),
					};
					pool.query(
						"SELECT * FROM `Projects` WHERE `Id`='" + data.projectId + "'",
						async (_, resultProject) => {
							console.log(resultProject);
							if (resultProject[0]) {
								console.log(1);
								const fetchFunc = () => {
									fetch(
										`https://testnet.toncenter.com/api/v2/getTransactions?address=${resultProject[0].Wallet}&limit=500&to_lt=0&archival=false`,
										{
											headers: {
												"X-API-Key":
													"a8d8e24af2a27066b01f6362f513a29b2adacd6586a9a22af0abdecb4c9332aa",
											},
										}
									)
										.then((e) => e.json())
										.then(async (tonResponse) => {
											console.log(2);
											console.log(tonResponse);

											if (tonResponse.result) {
												const tonResponseFiltered = tonResponse.result.filter(
													(e) =>
														e.in_msg.message.slice(0, 16) === data.invoiceId
												);
												console.log(3);

												if (tonResponseFiltered[0]) {
													if (
														Number(tonResponseFiltered[0].in_msg.value).toFixed(
															2
														) === Number(price * 1000000000).toFixed(2)
													) {
														const WalletClass = tonweb.wallet.all["v3R1"];

														console.log(Uint8Array.from(privat));

														const wallet = new WalletClass(tonweb.provider, {
															publicKey: Uint8Array.from(
																// resultProject[0].WalletPub.slice(1, -1)
																// 	.split(",")
																// 	.map((e) => Number(e))
																// 	.slice(0, -1)
																pub
															),
															wc: 0,
														});
														const walletAddress = await wallet.getAddress();
														const wallet2add = new TonWeb.utils.Address(
															tonResponseFiltered[0].in_msg.source
														);
														console.log("walletAddress");
														console.log(
															walletAddress.toString(true, true, true)
														);
														const nftCollection = new NftCollection(
															tonweb.provider,
															{
																ownerAddress: walletAddress,
																royalty: 0.05,
																royaltyAddress: walletAddress,
																collectionContentUri:
																	resultProject[0].NFTCollectionURL,
																nftItemContentBaseUri:
																	"https://gateway.pinata.cloud/ipfs/",
																nftItemCodeHex: NftItem.codeHex,
															}
														);
														const nftCollectionAddress =
															await nftCollection.getAddress();
														console.log(
															nftCollectionAddress.toString(true, true, true)
														);
														seqnoOld = await seqno(wallet, seqnoOld);
														await sleep(200);
														console.log(
															(await wallet.methods.seqno().call()) || 0
														);

														//------- TO DEPLOY NEW COLLECTION USE CODE BELOW:
														// await wallet.methods
														// 	.transfer({
														// 		secretKey: Uint8Array.from([
														// 			36, 211, 8, 52, 196, 164, 72, 180, 212, 101,
														// 			168, 1, 158, 122, 8, 189, 239, 164, 189, 80,
														// 			122, 88, 63, 190, 95, 104, 89, 132, 102, 0,
														// 			143, 4, 232, 184, 7, 111, 151, 15, 67, 224,
														// 			174, 30, 178, 190, 78, 240, 51, 52, 169, 99,
														// 			59, 225, 195, 21, 125, 181, 253, 184, 89, 110,
														// 			152, 239, 92, 134,
														// 		]),
														// 		toAddress: nftCollectionAddress.toString(
														// 			true,
														// 			true,
														// 			true
														// 		),
														// 		amount: TonWeb.utils.toNano(0.5), // CHANGE TO 10TON OR SOMETHING
														// 		seqno:
														// 			(await wallet.methods.seqno().call()) || 0,
														// 		payload: null, // body
														// 		sendMode: 3,
														// 		stateInit: (
														// 			await nftCollection.createStateInit()
														// 		).stateInit,
														// 	})
														// 	.send();
														// --------------------

														const nftCollectionData =
															await nftCollection.getCollectionData();

														//TODO id of nft will depends on amount and project ID
														const res = await mintTONNFT(
															resultProject[0].NFTsMeta[0], // can be [0 - 4]
															tonResponseFiltered[0].in_msg.source,
															nftCollection,
															wallet,
															wallet2add,
															nftCollectionData.nextItemIndex,
															nftCollectionData,
															seqnoOld,
															Uint8Array.from(privat)
														);
														nfthashes.push({ number: i++, hash: res });
														console.log(nfthashes);
														if (
															nfthashes.length === resultsStatusPayed.length
														) {
															console.log(nfthashes);
															console.log("----DONE");
															nfthashes.forEach((nftHashMsg) => {
																pool.query(
																	"UPDATE `NFTs` SET `Status`='Minted', `Wallet`='" +
																		tonResponseFiltered[0].in_msg.source +
																		"', `Hash`='" +
																		nftHashMsg.hash +
																		"', `Time`='" +
																		Date.now() +
																		"' WHERE `ID`='" +
																		resultsStatusP.Id +
																		"';",
																	async (_, resultProjectasd) => {
																		console.log(_);
																		console.log(resultProjectasd);
																	}
																);
															});
														}
													}
												}
											} else {
												time++;
												if (time <= 100) {
													setTimeout(() => {
														console.log("Retry");
														fetchFunc();
													}, 5000);
												} else {
													console.log("error6");
													return;
												}
											}
										});
								};
								fetchFunc();
							} else {
								console.log("Nothing in DB");
								return;
							}
						}
					);
				});
			}
		}
	);
};

const mintTONNFT = async (
	hash,
	walletTO,
	nftCollection,
	wallet,
	wallet2add,
	itemNumberOld,
	colData,
	seqno,
	WaletPrivat
) => {
	try {
		const nftCollectionAddress = await nftCollection.getAddress();
		const amount = TonWeb.utils.toNano(0.01); // CHANGE TO 10TON OR SOMETHING

		const item = await nftCollection.createMintBody({
			amount,
			itemIndex: itemNumberOld,
			itemOwnerAddress: wallet2add,
			itemContentUri: hash,
		});

		await wallet.methods
			.transfer({
				secretKey: WaletPrivat,
				toAddress: nftCollectionAddress.toString(true, true, true),
				amount: amount,
				seqno: seqno,
				payload: item,
				sendMode: 3,
			})
			.send();

		await sleep(2000);

		const res = (
			await nftCollection.getNftItemAddressByIndex(itemNumberOld)
		).toString(true, true, true);

		console.log(res);
		return res;
	} catch (e) {
		console.log(e);
		return false;
	}
};

Mint();

console.log(
	JSON.stringify([
		36, 211, 8, 52, 196, 164, 72, 180, 212, 101, 168, 1, 158, 122, 8, 189, 239,
		164, 189, 80, 122, 88, 63, 190, 95, 104, 89, 132, 102, 0, 143, 4, 232, 184,
		7, 111, 151, 15, 67, 224, 174, 30, 178, 190, 78, 240, 51, 52, 169, 99, 59,
		225, 195, 21, 125, 181, 253, 184, 89, 110, 152, 239, 92, 134,
	])
);

console.log(
	JSON.stringify([
		232, 184, 7, 111, 151, 15, 67, 224, 174, 30, 178, 190, 78, 240, 51, 52, 169,
		99, 59, 225, 195, 21, 125, 181, 253, 184, 89, 110, 152, 239, 92, 134,
	])
);

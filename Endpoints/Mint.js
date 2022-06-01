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

const price = 0.1;

const Mint = () => {
	pool.query(
		"SELECT * FROM `NFTs` WHERE  `Status`='Payed'",
		async (_, resultsStatusPayed) => {
			if (resultsStatusPayed[0]) {
				resultsStatusPayed.forEach((resultsStatusP) => {
					let time = 0;
					const data = {
						invoiceId: resultsStatusP["InvoiceId"].slice(0, 16),
						projectId: resultsStatusP["InvoiceId"].slice(16),
					};

					pool.query(
						"SELECT * FROM `Projects` WHERE `Id`='" + data.projectId + "'",
						async (_, resultProject) => {
							if (resultProject[0]) {
								const privat = resultProject[0]["WalletPrivat"]
									.split(",")
									.map((e) => Number(e));
								console.log(privat);
								const pub = resultProject[0]["WalletPub"]
									.split(",")
									.map((e) => Number(e));
								console.log(pub);

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
															publicKey: Uint8Array.from(pub),
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
															"NFTcol add",
															nftCollectionAddress.toString(true, true, true)
														);

														const seqno =
															(await wallet.methods.seqno().call()) || 0;

														const nftCollectionData =
															await nftCollection.getCollectionData();

														console.log("begin mint");
														//TODO id of nft will depends on amount and project ID
														const res = await mintTONNFT(
															resultProject[0].NFTsMeta[0], // can be [0 - 4]
															tonResponseFiltered[0].in_msg.source,
															nftCollection,
															wallet,
															wallet2add,
															nftCollectionData.nextItemIndex,
															nftCollectionData,
															seqno,
															Uint8Array.from(privat)
														);
														console.log(res);
														pool.query(
															"UPDATE `NFTs` SET `Status`='Minted', `Wallet`='" +
																tonResponseFiltered[0].in_msg.source +
																"', `Hash`='" +
																res +
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
														console.log("done");
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
		const amount = TonWeb.utils.toNano(0.1); // CHANGE TO 10TON OR SOMETHING

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

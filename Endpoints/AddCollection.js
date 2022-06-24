const TonWeb = require("tonweb");
const nacl = TonWeb.utils.nacl;
const { NftCollection, NftItem } = TonWeb.token.nft;
const pool = require("../MysqlCon.js").pool;
const pinataSDK = require("@pinata/sdk");

const pinata = pinataSDK(
	"159b0a813c6df29451f4",
	"00e1f2204e3201618f3dde3bc1e65a50e548feba9912d18355aeffca06ecb0bc"
);

const tonweb = new TonWeb(
	new TonWeb.HttpProvider("https://testnet.toncenter.com/api/v2/jsonRPC", {
		apiKey: "a8d8e24af2a27066b01f6362f513a29b2adacd6586a9a22af0abdecb4c9332aa",
	})
);

// KEYS FOR FIRTS DEPO TO NEW PROJ WALLETS

const PUBLIC = Uint8Array.from([
	144, 60, 169, 93, 98, 231, 59, 18, 140, 99, 124, 158, 101, 249, 186, 163, 202,
	237, 191, 254, 60, 188, 203, 222, 164, 178, 78, 45, 44, 115, 210, 110,
]);

const PRIVATE = Uint8Array.from([
	160, 149, 193, 40, 4, 140, 90, 31, 133, 225, 87, 116, 48, 169, 54, 175, 153,
	244, 189, 83, 107, 110, 46, 83, 133, 81, 139, 3, 184, 161, 99, 66, 144, 60,
	169, 93, 98, 231, 59, 18, 140, 99, 124, 158, 101, 249, 186, 163, 202, 237,
	191, 254, 60, 188, 203, 222, 164, 178, 78, 45, 44, 115, 210, 110,
]);

const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

const trx = async (add) => {
	new Promise(async (resolve) => {
		let wallet = tonweb.wallet.create({
			publicKey: PUBLIC,
			wc: 0,
		});

		const transfer = await wallet.methods.transfer({
			secretKey: PRIVATE,
			toAddress: new tonweb.utils.Address(add).toString(true, true, false),
			amount: TonWeb.utils.toNano(0.1),
			seqno: (await wallet.methods.seqno().call()) || 0,
			payload: "Initialize",
			sendMode: 3,
		});

		await sleep(2000);
		await transfer.send();
		return resolve();
	});
};

const keys = async () =>
	new Promise(async (resolve) => {
		const keyPair = nacl.sign.keyPair();
		let wallet = tonweb.wallet.create({
			publicKey: keyPair.publicKey,
			wc: 0,
		});
		const address = await wallet.getAddress();
		const nonBounceableAddress = address.toString(true, true, false);
		console.log("nonBounceableAddress: ", nonBounceableAddress);
		await sleep(2000);
		const deploy = wallet.deploy(keyPair.secretKey);
		await trx(nonBounceableAddress);
		await deploy.send();
		return resolve(keyPair);
	});

const AddCollection = async (app) => {
	app.post("/API/addCollection", async function (req, res) {
		const data = req.body;
		const keyPair = await keys();

		let wallet = tonweb.wallet.create({
			publicKey: keyPair.publicKey,
			wc: 0,
		});

		const address = await wallet.getAddress();
		const nonBounceableAddress = address.toString(true, true, false);

		const WaletPrivat = keyPair.secretKey;
		const WalletPub = keyPair.publicKey;

		const collMeta = {
			name: data.title,
			description: data.description,
			image: data.image,
			external_link: data.externalUrl,
			seller_fee_basis_points: 100,
			fee_recipient: nonBounceableAddress,
		};

		const nftMetaL1 = {
			attributes: [
				{
					display_type: "projectTitle",
					value: data.title,
				},
				{
					trait_type: "EndDate",
					value: data.endDate,
				},
				{
					trait_type: "MaxFunding",
					value: data.maxFunding,
				},
				{
					trait_type: "Category",
					value: data.Category,
				},
				{
					trait_type: "VideoLink",
					value: data.VideoLink,
				},
				{
					trait_type: "PresentationLink",
					value: data.PresentationLink,
				},
				{
					trait_type: "WhitepaperLink",
					value: data.WhitepaperLink,
				},
				{
					trait_type: "Level",
					value: 1,
				},
			],
			description: data.description,
			external_url: data.externalUrl,
			image: data.image,
			name: data.title,
		};

		const nftMetaL2 = {
			attributes: [
				{
					display_type: "projectTitle",
					value: data.title,
				},
				{
					trait_type: "EndDate",
					value: data.endDate,
				},
				{
					trait_type: "MaxFunding",
					value: data.maxFunding,
				},
				{
					trait_type: "Level",
					value: 2,
				},
			],
			description: data.description,
			external_url: data.externalUrl,
			image: data.image,
			name: data.title,
		};

		let rescollMeta = (await pinata.pinJSONToIPFS(collMeta)).IpfsHash;
		let rescollMetaurl = "https://gateway.pinata.cloud/ipfs/" + rescollMeta;
		let resnftMetaL1 = (await pinata.pinJSONToIPFS(nftMetaL1)).IpfsHash;
		let resnftMetaL2 = (await pinata.pinJSONToIPFS(nftMetaL2)).IpfsHash;
		let nftsmeta = [resnftMetaL1, resnftMetaL2];

		const nftCollection = new NftCollection(tonweb.provider, {
			ownerAddress: address,
			royalty: 0.05,
			royaltyAddress: address,
			collectionContentUri: rescollMetaurl,
			nftItemContentBaseUri: "https://gateway.pinata.cloud/ipfs/",
			nftItemCodeHex: NftItem.codeHex,
		});
		const nftCollectionAddress = await nftCollection.getAddress();

		console.log(nftCollectionAddress.toString(true, true, false));

		await wallet.methods
			.transfer({
				secretKey: WaletPrivat,
				toAddress: nftCollectionAddress.toString(true, true, false),
				amount: TonWeb.utils.toNano(0.01),
				seqno: (await wallet.methods.seqno().call()) || 0,
				payload: null, // body
				sendMode: 3,
				stateInit: (await nftCollection.createStateInit()).stateInit,
			})
			.send();

		const godata = [
			data.title,
			nonBounceableAddress,
			WaletPrivat,
			WalletPub,
			nftsmeta,
			data.maxFunding,
			0,
			rescollMetaurl,
			data.image,
			data.description,
			data.endDate,
			nftCollectionAddress.toString(true, true, false),
			data.Category,
			data.VideoLink,
			data.PresentationLink,
			data.WhitepaperLink,
		];

		console.log(
			"INSERT INTO Tonana_launchpad_sol.Projects (Id, Title, Wallet,	WalletPrivat, WalletPub, NFTsMeta, Max, Rised, NFTCollectionURL,	Picture,	Description,	EndDate,	NFTCollHash, Category, VideoLink, PresentationLink, WhitepaperLink) VALUES (NULL, '" +
				godata.join("', '") +
				"');"
		);

		pool.getConnection((err, con) => {
			con.query(
				"INSERT INTO Tonana_launchpad_sol.Projects (Id, Title, Wallet,	WalletPrivat, WalletPub, NFTsMeta, Max, Rised, NFTCollectionURL,	Picture,	Description,	EndDate,	NFTCollHash, Category, VideoLink, PresentationLink, WhitepaperLink) VALUES (NULL, '" +
					godata.join("', '") +
					"');",
				(err1, resultsCom) => {
					console.log(err1, resultsCom);
					res.send(JSON.stringify({ status: "ok" }));
				}
			);
		});
	});
};

module.exports = AddCollection;

// fetch("https://launchpad.tonana.org:9967/API/addCollection", {
// 	method: "POST",
// 	headers: { "Content-Type": "application/json" },
// 	body: JSON.stringify({
// 		title: "Plastic by sisters Lapay",
// 		description:
// 			"Plastic is an ecosystem project that includes virtual bloggers with their own content on TikTok(2.2M) / Instagram (80K), an animated series with adult humor, a thematic metaverse for the plastics community, and a decentralized economy for co-creators.",
// 		image:
// 			"https://yt3.ggpht.com/45Bnpsp16jnYKQLW5oDVsYmUjXMbpq2VGg9sU-JZcjd883nPGy_ObrxpMw2E8Pi2FkosZq6f=s900-c-k-c0x00ffffff-no-rj",
// 		externalUrl: "https://www.tiktok.com/@plastic_by_sisters_lapay",
// 		endDate: 1669773947,
// 		maxFunding: 50000,
// 		Category: "NFTs",
// 		VideoLink: "https://google.com",
// 		PresentationLink: "https://google.com",
// 		WhitepaperLink: "https://google.com",
// 	}),
// })
// 	.then((e) => e.json())
// 	.then(console.log);

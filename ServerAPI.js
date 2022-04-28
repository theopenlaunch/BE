const express = require("express");
const https = require("https");
const fs = require("fs");

const app = express();
const port = 9967;

const GetStatus = require("./Endpoints/GetStatus.js");
const Payed = require("./Endpoints/Payed.js");

const privateKey = fs.readFileSync(
	"/home/admin/conf/web/ssl.launchpad.tonana.org.key",
	"utf8"
);
const certificate = fs.readFileSync(
	"/home/admin/conf/web/ssl.launchpad.tonana.org.crt",
	"utf8"
);
const ca = fs.readFileSync(
	"/home/admin/conf/web/ssl.launchpad.tonana.org.ca",
	"utf8"
);

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca,
};

app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(express.json());

var allowCrossDomain = function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	res.header("Access-Control-Allow-Headers", "Content-Type");

	next();
};
app.use(allowCrossDomain);

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, (err) => {
	if (err) {
		return console.log("something bad happened", err);
	}
	console.log("\n-------------------------------------------");
	console.log(`TONANA_LAUNCHPAD API server is listening on ${port}`);
	console.log("-------------------------------------------\n");
});

GetStatus(app);
Payed(app);

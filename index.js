// Imports
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");

// Sentry.io
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "https://ef807cd0162e4c59badc23cb67203989@sentry.io/1319079" });

// Google
var GoogleSignIn = require("google-sign-in");
var gsip = new GoogleSignIn.Project("598450024222-jqec444ofe8deh5of2ussga9dpc637he.apps.googleusercontent.com");

// Express
const app = express();
app.use(Sentry.Handlers.requestHandler());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Sentry.Handlers.errorHandler());

// Mongoose
const mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://xcloud-zr62s.gcp.mongodb.net/`, {
	useNewUrlParser: true,
	user: 'admin',
	pass: process.env.MONGO_PASSWORD,
	dbName: 'main'
});
const db = mongoose.connection;
db.on("error", error => {
	throw error;
	process.exit(1);
});
db.once("open", () => {
	// Log
	console.log("Connected to MongoDB database!");

	// Applications
	const applicationSchema = new mongoose.Schema({
		"name": String,
		"id": String,
		"uri": String,
		"fixed": Boolean,
		"width": Number,
		"height": Number,
		"creator": String
	}, { "collection": "applications" });
	const Application = mongoose.model("Application", applicationSchema);

	app.get("/applications", (req, res) => {
		Application.find((error, applications) => {
		  if (error) return console.error(error);
		  res.json(applications);
		});
	});

	// Startup Applications
	const startupApplicationSchema = new mongoose.Schema({ "id": String }, { "collection": "startup" });
	const StartupApplication = mongoose.model("StartupApplication", startupApplicationSchema);

	app.get("/applications/startup", (req, res) => {
		StartupApplication.find((error, startupApplications) => {
		  if (error) return console.error(error);
		  res.json(startupApplications);
		});
	});

	// Backgrounds
	const backgroundSchema = new mongoose.Schema({
		"name": String,
		"id": String,
		"solid": Boolean,
		"value": String,
		"accent": String,
		"creator": String
	}, { "collection": "backgrounds" });
	const Background = mongoose.model("Background", backgroundSchema);

	app.get("/backgrounds", (req, res) => {
		Background.find((error, backgrounds) => {
		  if (error) return console.error(error);
		  res.json(backgrounds);
		});
	});

	app.post("/create/background", (req, res) => {
		if (req.body.name && req.body.id && req.body.solid && req.body.value && req.body.accent && req.body.token) {
			gsip.verifyToken(req.body.token).then(data => {
				let created = new Background({
					"name": req.body.name,
					"id": req.body.id,
					"solid": req.body.solid,
					"value": req.body.value,
					"accent": req.body.accent,
					"creator": data.email
				});
				created.save();
			}, () => {
				res.status(403).send("Error 403: Error in token");
			})
		} else {
			res.status(400).send("Error 400: Bad request");
		}
	});

	// Built-in Backgrounds
	app.use("/background", express.static("backgrounds"));

	// Start Server
	const port = process.env.PORT ? process.env.PORT : 3000;
	app.listen(port, () => console.log(`Server started on port ${port}.`));
});

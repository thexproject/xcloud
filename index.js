// Imports
const express = require("express");
const cors = require("cors");
const fs = require("fs");

// Sentry.io
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "https://ef807cd0162e4c59badc23cb67203989@sentry.io/1319079" });

// Express
const app = express();
app.use(Sentry.Handlers.requestHandler());
app.use(cors());
app.use(Sentry.Handlers.errorHandler());

// Mongoose
const mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://admin:${process.env.MONGO_PASSWORD}@xcloud-zr62s.gcp.mongodb.net/main`);
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
		"fixed": { "type": Boolean, "default": false },
		"width": { "type": Number, "default": 300 },
		"height": { "type": Number, "default": 250 },
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
		"solid": { "type": Boolean, "default": false },
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

	// Built-in Applications and Backgrounds
	app.use("/background", express.static("backgrounds"));
	app.get("/application/:file", (req, res) => {
	  res.send(fs.readFileSync("applications/" + req.params.file.replace("..", ""), "utf-8"));
	});

	// Start Server
	const port = process.env.PORT ? process.env.PORT : 3000;
	app.listen(port, () => console.log(`Server started on port ${port}.`));
});
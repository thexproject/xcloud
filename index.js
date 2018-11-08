const express = require("express");
const cors = require("cors");
const fs = require("fs");

const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://ef807cd0162e4c59badc23cb67203989@sentry.io/1319079' });

const app = express();
app.use(Sentry.Handlers.requestHandler());
app.use(cors());
app.use(Sentry.Handlers.errorHandler());

app.get("/applications", (req, res) => {
	res.json({
      "data": [
        {
          "id": "clocky",
          "name": "Clocky",
          "uri": "https://xcloud-heroku.herokuapp.com/application/clocky.xb",
          "fixed": true,
          "height": 120
        },
        {
          "id": "background-manager",
          "name": "Background Manager",
          "uri": "https://xcloud-heroku.herokuapp.com/application/background-manager.xb",
          "width": 435,
          "height": 435
        },
				{
          "id": "calc",
          "name": "Calc",
          "uri": "https://xcloud-heroku.herokuapp.com/application/calc.xb",
					"fixed": true,
					"width": 265,
					"height": 316
        }
      ]
    });
});

app.get("/applications/startup", (req, res) => {
  res.json({
    "data": [
      "clocky"
    ]
  });
});

app.get("/backgrounds", (req, res) => {
  res.json({
    "data": [
      {
        "name": "Look Down",
        "id": "look-down",
        "value": "https://xcloud-heroku.herokuapp.com/background/look-down.jpg"
      },
      {
        "name": "Goodnight, Chicago",
        "id": "goodnight-chicago",
        "value": "https://xcloud-heroku.herokuapp.com/background/goodnight-chicago.jpg"
      },
      {
        "name": "Violet Sunset",
        "id": "violet-sunset",
        "value": "https://xcloud-heroku.herokuapp.com/background/violet-sunset.jpg"
      },
      {
        "name": "Black",
        "id": "solid-black",
        "value": "#000000",
        "solid": true
      }
    ]
  });
});

app.use("/background", express.static("backgrounds"));

app.get("/application/:file", (req, res) => {
  res.send(fs.readFileSync("applications/" + req.params.file, "utf-8"));
});

let port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port, () => console.log(`Server started on port ${port}.`));
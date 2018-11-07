const express = require("express");
const cors = require("cors");
const db = require("./db");
const fs = require("fs");

const app = express();
app.use(cors());

app.get("/applications", (req, res) => {
	res.json({
      "data": [
        {
          "id": "clocky",
          "name": "Clocky",
          "uri": "https://xCloud.felixmattick.repl.co/application/clocky.xb",
          "fixed": true,
          "height": 120
        },
        {
          "id": "background-manager",
          "name": "Background Manager",
          "uri": "https://xCloud.felixmattick.repl.co/application/background-manager.xb",
          "width": 435,
          "height": 435
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
        "value": "https://xCloud.felixmattick.repl.co/background/look-down.jpg"
      },
      {
        "name": "Goodnight, Chicago",
        "id": "goodnight-chicago",
        "value": "https://xCloud.felixmattick.repl.co/background/goodnight-chicago.jpg"
      },
      {
        "name": "Violet Sunset",
        "id": "violet-sunset",
        "value": "https://xCloud.felixmattick.repl.co/background/violet-sunset.jpg"
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

app.get("/backgrounds/default", (req, res) => {
  res.json({
    "data": "look-down"
  });
});

app.use("/background", express.static("backgrounds"));

app.get("/application/:file", (req, res) => {
  res.send(fs.readFileSync("applications/" + req.params.file, "utf-8"));
});

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}.`));
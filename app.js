const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = 80;

const logDir = path.join(__dirname, "/logs/");

const options = {
  key: fs.readFileSync("./public/isharu.in/private.key"),
  cert: fs.readFileSync("./public/isharu.in/certificate.crt")
};

var getDate = () => {
  var now = new Date();
  return (
    now.getFullYear() +
    "" +
    now.getMonth() +
    1 +
    "" +
    now.getDate() +
    "" +
    now.getHours() +
    "" +
    now.getMinutes() +
    "" +
    now.getSeconds()
  );
};

var ignoreFavicon = (req, res, next) => {
  if (req.originalUrl.includes("favicon.ico")) {
    res.status(204).end();
  } else {
    next();
  }
};

var logRequest = (req, res, next) => {
  const logIP =
    "Incoming Request from " +
    req.ip.split(":").pop() +
    " at " +
    new Date().toLocaleDateString() +
    " " +
    new Date().toLocaleTimeString() +
    "\n";

  const fileName = getFile();
  fs.appendFile(logDir + fileName, logIP, err => {
    if (err) console.error("Unable to log :", err);
  });
  next();
};

var getFile = () => {
  var files = fs.readdirSync(logDir);
  if (files.length) {
    files.sort();
    currentFile = `${files[files.length - 1]}`;
    const stats = fs.statSync(logDir + currentFile);
    if (stats.size < 2000) return currentFile;
  }
  return `${getDate()}.txt`;
};

app.use(ignoreFavicon);
app.use(express.static("public"));
app.use(logRequest);

app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect("https://" + req.headers.host + req.url);
  }
});

app.all("/", (req, res) => {
  console.log("I am hit");
  res.send(
    "<center><h1> Welcome to <font color='red'>Sharu Infotech</font> </h1></center>"
  );
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

httpServer.listen(80);
httpsServer.listen(443);

const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = 80;

const logDir = path.join(__dirname, "/logs/");

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
    req.ip.split(":")[1] +
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
app.use(logRequest);

app.all("/*", (req, res) => {
  res.send(
    "<center><h1> Welcome to <font color='red'>Sharu Infotech</font> </h1></center>"
  );
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

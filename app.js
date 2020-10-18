const express = require("express");
const app = express();

const PORT = 80;

app.all("/*", (req, res) => {
  res.send(
    "<center><h1> Welcome to <font color='red'>Sharu Infotech</font> </h1></center>"
  );
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

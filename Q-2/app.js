const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hey there");
});

PORT = 4001;
app.listen(PORT, () => {
  console.log(`Server started successfully. Listening at localhost:${PORT}`);
});

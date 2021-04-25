const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Listening at localhost:${PORT}`);
});

const express = require("express");
const ejs = require("ejs");
const multer = require("multer");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

const upload = multer({
  dest: "/uploads",
});

app.get("/", (req, res) => {
  res.render("form");
});

app.get("/image", (req, res) => {
  res.sendFile(`${__dirname}/uploads/image.png`);
});

app.post("/uploadImage", upload.single("file"), (req, res) => {
  // console.log(req.file);
  const filePath = req.file.path;
  const uploadPath = `${__dirname}/uploads/image.png`;

  const allowedType = ["image/png", "image/jpeg", "image/gif"];

  if (allowedType.includes(req.file.mimetype)) {
    fs.rename(filePath, uploadPath, (err) => {
      if (err) return;
      res.status(200).redirect("/image");
    });
  } else {
    fs.unlink(filePath, (err) => {
      if (err) return;
      res.send("Only png, jpeg and gif files are allowed");
    });
  }
});

PORT = 4001;
app.listen(PORT, () => {
  console.log(`Server started successfully. Listening at localhost:${PORT}`);
});

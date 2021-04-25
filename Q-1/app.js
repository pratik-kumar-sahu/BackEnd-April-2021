const express = require("express");
const ejs = require("ejs");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

const usersData = JSON.parse(
  fs.readFileSync(`${__dirname}/data/usersData.json`)
);

app.get("/", (req, res) => {
  res.render("signupForm");
});

app.get("/usersData", (req, res) => {
  res.json(usersData);
});

app.post("/userSignup", (req, res) => {
  newUser = Object.assign(req.body);
  usersData.push(newUser);

  fs.writeFile(
    `${__dirname}/data/usersData.json`,
    JSON.stringify(usersData),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          user: newUser,
        },
      });
    }
  );

  res.redirect("/usersData");
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Listening at localhost:${PORT}`);
});

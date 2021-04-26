const express = require("express");
const PORT = process.env.PORT || 4003;
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const path = require("path");
const layout = path.join("layouts", "index");
const Mongo = require("./Mongo/mongoInit");
const User = require("./Models/user");
const auth = require("./auth/auth");

Mongo();

// Middlewares
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: false }));

//View engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(cookie());

app.get("/", (req, res) => {
  if (req.cookies.token) {
    return res.redirect("/profile");
  }
  res.send("Hello World!! Please login or signup");
});

app.get("/login", (req, res) => {
  if (req.cookies.token) {
    return res.redirect("/profile");
  }

  res.render("login", { title: "Login", layout });
});

app.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const user = new User(data);
    await user.save();
    console.log("User Saved: ", user);
    res.send(user);
  } catch (error) {
    if (error) {
      console.log("error while saving!", error.message);
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      const user = await User.find({ email: req.body.email });
      console.log("user:", user);
      if (!user) {
        console.log("User doesn't exist");
        return res.render("login", {
          title: "Error in login",
          layout,
          error: "User not registered",
        });
      }
      if (req.body.password !== user[0].password) {
        console.log(req.body.password, "!==", user[0].password);
        console.log("Incorrect pwd");
        return res.render("login", {
          title: "Error in login",
          layout,
          error: "Incorrect password!",
        });
      }

      const token = await jwt.sign({ email: user[0].email }, "my_secret", {
        expiresIn: "1h",
      });
      console.log(token);
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000000,
        secure: false,
      });

      res.redirect(`/profile`);
    } else {
      console.log("Enter both email and password");
      return res.render("login", {
        title: "Error in login",
        layout,
        error: "Enter both email and password",
      });
    }
  } catch (error) {
    if (error) {
      console.log("Error: ", error.message);
      return res.render("login", {
        title: "Error in login",
        layout,
        error: "Unable to Login!",
      });
    }
  }
});

app.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    res.render("profile", { title: "Profile", user });
  } catch (error) {
    console.log("ERROR::", error);
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});

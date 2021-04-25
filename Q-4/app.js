const express = require("express");
const mongoose = require("mongoose");
const Movie = require("./models/movies");
const Director = require("./models/director");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(
    "mongodb+srv://backendpro:12334455@@cluster-backend-attainu.6rqij.mongodb.net/moviesData?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Movies DB connected"))
  .catch((err) => console.log("Error!!", err.message));

app.get("/movies", (req, res) => {
  res.send("Movies route");
});

app.get("/director", (req, res) => {
  res.send("Directors route");
});

app.post("/createMovie", async (req, res) => {
  try {
    let director = await Director.findOne({
      name: req.body.director,
    });

    if (!director) {
      director = new Director({
        name: req.body.director,
      });
      await director.save();
    }

    console.log(director);
    const movie = await Movie.create({ ...req.body, director });

    director.movies.push(movie);
    await director.save();

    res.send("success");
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/createDirector", async (req, res) => {
  try {
    await Director.create(req.body);
    res.send("success");
  } catch (err) {
    console.log(err.message);
  }
});

const PORT = 4002;
app.listen(PORT, () => {
  console.log(`Server running at localhost:${PORT}`);
});

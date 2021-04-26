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

app.get("/", (req, res) => {
  res.send({
    getMoviesApi: "/movies",
    getDirectorsApi: "/directors",
    createAndDeleteMovieApi: "/createMovie",
    updateMovieApi: "/createMovie/:id",
  });
});

app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find().populate("director", "-_id -__v -movies");
    // console.log(movies);
    if (movies) {
      res.status(200).json({
        success: true,
        data: {
          movies,
        },
      });
    } else {
      res.status(204).json({
        success: false,
        message: "No data available 🥴",
      });
    }
  } catch (err) {}
});

app.get("/directors", async (req, res) => {
  try {
    const directors = await Director.find().populate(
      "movies",
      "title rating year -_id"
    );
    if (directors) {
      res.status(200).json({
        success: true,
        data: {
          directors,
        },
      });
    } else {
      res.status(204).json({
        success: false,
        message: "No data available 🥴",
      });
    }
  } catch (err) {}
});

app.post("/createMovie", async (req, res) => {
  try {
    // console.log(req.body);
    let findDirector = await Director.findOne({
      name: req.body.director,
    });

    if (!findDirector) {
      findDirector = new Director({
        name: req.body.director,
      });
      await findDirector.save();
    }

    // console.log(findDirector);
    const directorName = findDirector.name;
    const movie = await Movie.create({
      ...req.body,
      director: findDirector,
    });

    findDirector.movies.push(movie);
    await findDirector.save();

    res.send("success");
  } catch (err) {
    console.log(err.message);
  }
});

app.put("/createMovie/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      rating: req.body.rating,
      year: req.body.year,
    });
    res.json({
      status: "updated movie",
      data: {
        updatedMovie: movie,
      },
    });
  } catch (err) {
    console.log(err.message);
  }
});

app.delete("/createMovie", async (req, res) => {
  const movie = await Movie.findOne({ title: req.body.title });
  movie.remove();
  res.json({
    status: "deleted",
    data: {
      deletedMovie: movie,
    },
  });
});

const PORT = 4002;
app.listen(PORT, () => {
  console.log(`Server running at localhost:${PORT}`);
});

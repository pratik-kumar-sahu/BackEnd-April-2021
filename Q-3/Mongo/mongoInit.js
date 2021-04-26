const mongoose = require("mongoose");

const MongoUri =
  "mongodb+srv://backendpro:12334455@@cluster-backend-attainu.6rqij.mongodb.net/usersDataToken?retryWrites=true&w=majority";

const MongoInit = () =>
  mongoose.connect(
    MongoUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, conn) => {
      if (conn) {
        console.log("DB successfully connected!!");
      }

      if (err) {
        console.log("Error in connecting DB: ", err.message);
      }
    }
  );

module.exports = MongoInit;

const mongoose = require("mongoose");

// Set the strictQuery option to false. This option allows Mongoose to be more lenient when validating queries.
mongoose.set("strictQuery", false);

// Define a constant called MONGO_URI. This constant contains the URI for the MongoDB database.
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1/lab-express-basic-auth";

// Connect to the MongoDB database.
mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

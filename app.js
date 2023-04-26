// Import the dotenv package.
const dotenv = require("dotenv");

// Load the environment variables from the .env file.
dotenv.config();

// Import the database connection module.
const db = require("./db");

// Import the Express framework.
const express = require("express");

// Create an Express app.
const app = express();

// Import the config function from the config folder.
const config = require("./config");

// Call the config function to set up the app.
config(app);

// Import the session configuration middleware.
const sessionConfig = require("./config/session.config");

// Add the session configuration middleware to the app.
sessionConfig(app);

// Set the default title for the app.
const projectName = "lab-express-basic-auth";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// Import the index routes.
const indexRoutes = require("./routes/index");

// Add the index routes to the app.
app.use(indexRoutes);

// Import the auth routes.
const authRoutes = require("./routes/auth.routes");

// Add the auth routes to the app.
app.use(authRoutes);

// Import the error handling middleware.
const errorHandling = require("./error-handling");

// Add the error handling middleware to the app.
errorHandling(app);

// Export the app.
module.exports = app;

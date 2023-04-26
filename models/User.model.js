// models/User.model.js
// Import the Mongoose Schema and model constructors.
const { Schema, model } = require("mongoose");

// Define a schema for the User model.
const userSchema = new Schema(
  {
    // The username of the user.
    username: {
      type: String,
      trim: true, // Trim whitespace from the beginning and end of the string.
      required: [true, "Username is required."],
      unique: true, // Ensure that the username is unique.
    },

    // The password hash of the user.
    passwordHash: {
      type: String,
      required: [true, "Password is required."],
    },
  },
  {
    timestamps: true, // Create timestamps for the model.
  }
);

// Export the User model.
module.exports = model("User", userSchema);

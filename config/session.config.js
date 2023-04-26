// Import required packages for session handling
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Export a function that takes an Express app instance as its argument and sets up the session middleware
module.exports = (app) => {
  // Trust the first proxy when running in production mode, this is necessary for secure cookies to work behind a proxy (e.g., load balancer or reverse proxy)
  app.set("trust proxy", 1);

  // Configure and use the session middleware
  app.use(
    session({
      // Provide a session secret for signing the session ID cookie
      secret: process.env.SESS_SECRET || "myFallbackSecret",
      // Force a session to be saved back to the store even if it was not modified during the request
      resave: true,
      // Save uninitialized session to the store; set to false to avoid saving new sessions without modifications
      saveUninitialized: false,
      // Configure the session cookie properties
      cookie: {
        // Set the cookie's sameSite attribute based on the environment
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        // Set the secure attribute of the cookie based on the environment (use secure cookies in production)
        secure: process.env.NODE_ENV === "production",
        // Prevent the cookie from being accessed by client-side scripts
        httpOnly: true,
        // Set the cookie expiration time (in milliseconds)
        maxAge: 30000, // 30 * 1000 ms === 30 secs
      },
      // Use the MongoStore to store session data in a MongoDB database
      store: MongoStore.create({
        // Set the MongoDB connection URL; use an environment variable or default to a local MongoDB instance
        mongoUrl:
          process.env.MONGODB_URI ||
          "mongodb://127.0.0.1:27017/lab-express-basic-auth",
      }),
    })
  );
};

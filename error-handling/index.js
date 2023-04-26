module.exports = (app) => {
  // This function is called when the Express app is created.
  // It is used to register middleware functions.

  // This middleware function runs whenever a requested page is not available.
  // It sets the response status code to 404 and renders the "not-found" template.
  app.use((req, res, next) => {
    console.log("Requested page not found.");
    res.status(404).render("not-found");
  });

  // This middleware function runs whenever an error occurs in the application.
  // It logs the error to the console and renders the "error" template.
  app.use((err, req, res, next) => {
    console.error("ERROR", req.method, req.path, err);

    // Only render the error template if the response headers have not been sent yet.
    if (!res.headersSent) {
      res.status(500).render("error");
    }
  });
};

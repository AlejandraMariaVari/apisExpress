const express = require("express");
const app = express();
const morgan = require("morgan");

// Settings
app.set("port", process.env.PORT || 4000);
app.set("json spaces", 2);

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use(require("./routes/index"));

// Server initialization
app.listen(app.get("port"), () => {
  console.log(`Server listening on port ${app.get("port")}`);
});

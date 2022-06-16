const express = require("express");
var cors = require("cors");
const app = express();
const morgan = require("morgan");
const item = require("./routes/item");

// Use of cors
app.use(cors());

// Settings
app.set("port", process.env.PORT || 4000);
app.set("json spaces", 2);

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/api/items", item);

// Server initialization
app.listen(4000, function () {
  console.log("CORS-enabled web server listening on port 4000");
});

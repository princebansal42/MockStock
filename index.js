const express = require("express");
const app = express();
// const cors = require("cors");
// Connecting Database
const connectDB = require("./config/db");
connectDB();

app.use(express.json({ extended: false }));

// Routes Defined here
const routes = require("./routes");
app.use(routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running at " + PORT));

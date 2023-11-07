const express = require("express");
const mongoose = require("mongoose");
const dontenv = require("dotenv");
const cors = require("cors");
const { doctorroutes } = require("./routes/doctorroutes");
dontenv.config();
const App = express();
App.use(express.json());
App.listen(process.env.PORT, () => {
  console.log("server started");
});
App.use(cors());
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
db.once("open", () => {
  console.log("MongoDB connected successfully");
});
App.use("/api", doctorroutes);

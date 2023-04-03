const mongoose = require("mongoose");
require("dotenv").config();

// mongoose.set("strictQuery", false);

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.cfh31bj.mongodb.net/?retryWrites=true&w=majority`,
  () => {
    console.log("connected to mongodb");
  }
);

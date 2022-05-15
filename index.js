const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//check server
app.get("/", async (req, res) => {
  res.send("Doctor Uncle Rocking!!!");
});
app.listen(port, () => {
  console.log("doctor uncle listening from", port);
});

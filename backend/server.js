require("dotenv").config();

const express = require("express");
const cors = require("cors");

const responseRoute = require("./routes/response");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/respond", responseRoute);

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
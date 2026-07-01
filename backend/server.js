const express = require("express");
const cors = require("cors");
require("dotenv").config();
const verifyImage = require("./routes/verifyImage");
const speechRoute = require("./routes/speechToText");
const ttsRoute = require("./routes/textToSpeech");
const graphRoute =require("./routes/graph");
const app = express();
const recommendationRoute = require("./routes/recommendation");

app.use(cors());
app.use(express.json());
app.use("/", speechRoute);
app.use("/", graphRoute);
app.use("/", ttsRoute);
app.use("/verify-image", verifyImage);
app.use("/", recommendationRoute);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
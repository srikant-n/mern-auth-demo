require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const router = require("./src/userRoutes");

const port = process.env.PORT || 5000;
const env = process.env.NODE_ENV || "development";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client", "build")));
app.use(express.static(path.join(__dirname, "public")));


const dbPath =
  env === "production"
    ? process.env.DB_PATH
    : env === "development"
    ? process.env.DB_PATH_DEV
    : process.env.DB_PATH_TEST;

mongoose
  .connect(dbPath, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true, useFindAndModify:false, useCreateIndex:true })
  .then(() => console.log("DB: Connected"))
  .catch((err) => console.error(err));

  app.use("/user", router);
  app.get("/google", (req,res)=>{
    const googleUrl = "https://accounts.google.com/o/oauth2/v2/auth?" + 
    "scope=https://www.googleapis.com/auth/userinfo.profile" + 
    "&include_granted_scopes=true" + 
    "&response_type=token" + 
    `&client_id=${process.env.GOOGLE_CLIENT_ID}` + 
    `&redirect_uri=${env === "production" ? process.env.GOOGLE_REDIRECT : process.env.GOOGLE_REDIRECT_DEV}`;
    res.send({url:googleUrl});
  });
  app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname, "client", "build", "index.html"))
  });

app.listen(port, () => {
  console.log(`Litening on port: ${port}`);
});

module.exports = app;
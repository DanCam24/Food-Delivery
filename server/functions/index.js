const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccountKey = require("./serviceAccountKey.json");

const express = require("express");
const app = express();

app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:3000"], // o tu frontend en producción
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

app.get("/", (req, res) => {
  return res.send("Hello, World!");
});

const userRoute = require("./routes/user");
const productRoute = require("./routes/products");

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);

exports.app = functions.https.onRequest(app);

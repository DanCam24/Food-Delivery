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
    origin: ["http://localhost:3000"],
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

/*

const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccountKey = require("./serviceAccountKey.json");

const express = require("express");
const cors = require("cors");
const app = express();

// firebase credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

const db = admin.firestore();

// Body parser for JSON data
app.use(express.json());

// CORS middleware: permitir solo localhost:3000
app.use(cors({ origin: "http://localhost:3000" }));

// API endpoints
app.get("/", (req, res) => {
  res.send("hello world");
});

const userRoute = require("./routes/user");
app.use("/api/users", userRoute);

const productRoute = require("./routes/products");
app.use("/api/products", productRoute);

exports.app = functions.https.onRequest(app);

module.exports = { db };
*/

const functions = require("firebase-functions");
const admin = require("firebase-admin");

const serviceAccount = require("voiceproject-b35fe.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors( {origin: true}));
app.get("/api/get", (request, response) => {
  db.collection("users").get().then((snap) => {
    const events = [];
    snap.forEach((doc) => {
      events.push(doc.data());
    });
    response.json(events.slice());
  })
      .catch((error) => response.status(500).send("some error occured"));
});
app.get("/api/get/:id", (request, response) => {
  db.collection("users").doc(request.params.id).get().then((snap) => {
    const event = [];
    event.push(snap.data());
    response.json(event.slice());
  })
      .catch((error) => response.status(500).send("some error occured"));
});
app.post("/api/create/:id", (req, res) => {
  const user = req.body;
  db.collection("users").doc("/"+req.params.id+"/").create(user);
  res.status(201).send();
});
exports.api = functions.https.onRequest(app);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


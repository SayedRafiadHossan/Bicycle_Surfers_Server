const {
  MongoClient,
  ServerApiVersion,
  MongoRuntimeError,
  ObjectId,
} = require("mongodb");
// const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();

// //firebase
// const serviceAccount = require("./sports-capturing-firebase-admin.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// middlewares

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fbybecg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//  token middleware

// async function verifyToken(req, res, next) {
//   if (req.headers?.authorization?.startsWith("Bearer ")) {
//     const idToken = req.headers.authorization.split(" ")[1];
//     try {
//       const decodedUser = await admin.auth().verifyIdToken(idToken);
//       req.decodedEmail = decodedUser.email;
//     } catch {}
//   }
//   next();
// }

async function run() {
  try {
    const database = client.db("bi-cycle-server");
    const allProductsCollection = database.collection("allProducts");
    const allBookingCollection = database.collection("allBooking");
    const allUsersCollection = database.collection("allUsers");

    //-------------GET AREA-----------------//

    //get all the products
    app.get("/allProducts", async (req, res) => {
      const query = {};
      const cursor = allProductsCollection.find(query);
      const allProducts = await cursor.toArray();
      res.send(allProducts);
    });

    //get all the booking
    app.get("/booking", async (req, res) => {
      const query = {};
      const cursor = allBookingCollection.find(query);
      const allBooking = await cursor.toArray();
      res.send(allBooking);
    });

    //-------------Post AREA-----------------//

    // post a new service
    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const result = await allBookingCollection.insertOne(booking);
      res.json(result);

      // post a new user
      app.post("/users", async (req, res) => {
        const user = req.body;
        const result = await allUsersCollection.insertOne(user);
        res.json(result);
      });
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome to Server");
});

app.listen(port, () => {
  console.log(`listen ${port}`);
});

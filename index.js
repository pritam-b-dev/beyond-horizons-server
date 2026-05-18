const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
dotenv.config();
const uri = process.env.MONGODB_URI;

const PORT = process.env.PORT;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("BeyondHorizons");
    const destinationCollection = db.collection("destination");

    app.get("/destination", async (req, res) => {
      const result = await destinationCollection.find().toArray();
      res.json(result);
    });

    app.post("/destination", async (req, res) => {
      const destinationData = req.body;
      const result = await destinationCollection.insertOne(destinationData);
      res.json(result);
    });

    app.get("/destination/:id", async (req, res) => {
      const { id } = req.params;
      const result = await destinationCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.patch("/destination/:id", (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      const result = destinationCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: updatedData },
      );
      res.json(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running fine");
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

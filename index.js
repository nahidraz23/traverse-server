const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5300;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { useSearchParams } = require('react-router-dom');

// middleware
app.use(express.json());
app.use(cors());

// mongodb 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.szws1et.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const usersCollection = client.db('traverseDB').collection('users');
    const packagesCollection = client.db('traverseDB').collection('packages');

    // users related api
    app.get('/users', async(req, res) => {
        const result = await usersCollection.find().toArray();
        res.send(result);
    })

    app.post('/users', async(req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
    })

    // packages related api
    app.get('/packageDetails', async(req, res) => {
        const result = await packagesCollection.find().toArray();
        res.send(result);
    })

    app.get('/packageDetails/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await packagesCollection.findOne(query);
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Traverse server is running.");
})

app.listen(port, () => {
    console.log(`Traverse server is running on port: ${port}`)
})

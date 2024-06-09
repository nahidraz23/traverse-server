const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5300
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const { useSearchParams } = require('react-router-dom')

// middleware
app.use(express.json())
app.use(cors())

// mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.szws1et.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function run () {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const usersCollection = client.db('traverseDB').collection('users')
    const packagesCollection = client.db('traverseDB').collection('packages')
    const guidesCollection = client.db('traverseDB').collection('guides')
    const wishlistCollection = client.db('traverseDB').collection('wishlist')
    const bookingsCollection = client.db('traverseDB').collection('bookings')

    // users related api
    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray()
      res.send(result)
    })

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const user = await usersCollection.findOne(query)
      let admin = false
      if (user) {
        admin = user?.role === 'admin'
      }
      res.send({ admin })
    })

    app.post('/users', async (req, res) => {
      const user = req.body
      const query = { email: user?.email }
      const existingUser = await usersCollection.findOne(query)
      if (existingUser) {
        return res.send({ message: 'Users already exist', insertedId: null })
      }
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })

    app.patch('/users/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const updatedDoc = {
        $set: {
          role: 'admin'
        }
      }
      const result = await usersCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })

    // bookings related api
    app.get('/bookings', async (req, res) => {
      const email = req.query.email
      const query = { email: email }
      const result = await bookingsCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/bookings', async (req, res) => {
      const bookings = req.body
      const result = await bookingsCollection.insertOne(bookings)
      res.send(result)
    })

    // wishlist related api
    app.get('/wishlist', async (req, res) => {
      const email = req.query.email
      const query = { email: email }
      const result = await wishlistCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/wishlist', async (req, res) => {
      const data = req.body
      const result = await wishlistCollection.insertOne(data)
      res.send(result)
    })

    app.delete('/wishlist/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await wishlistCollection.deleteOne(query)
      res.send(result)
    })

    // packages related api
    app.get('/packageDetails', async (req, res) => {
      const result = await packagesCollection.find().toArray()
      res.send(result)
    })

    app.get('/packageDetails/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await packagesCollection.findOne(query)
      res.send(result)
    })

    // tour guides related api
    app.get('/guides', async (req, res) => {
      const result = await guidesCollection.find().toArray()
      res.send(result)
    })

    app.get('/guides/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await guidesCollection.findOne(query)
      res.send(result)
    })

    app.post('/guides', async (req, res) => {
      const guideInfo = req.body
      const result = await guidesCollection.insertOne(guideInfo)
      res.send(result)
    })

    app.patch('/tourguides/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const updatedDoc = {
        $set: {
          role: 'tour guide'
        }
      }
      const result = await usersCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Traverse server is running.')
})

app.listen(port, () => {
  console.log(`Traverse server is running on port: ${port}`)
})

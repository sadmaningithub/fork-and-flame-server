const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.2vtceto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2vtceto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        await client.connect();

        const dishCollection = client.db('forkAndFlameDB').collection('dishCollection');
        const cartCollection = client.db('forkAndFlameDb').collection('cartCollection');

        app.get('/dishes', async(req, res)=>{
            const result = await dishCollection.find().toArray();
            res.send(result)
        })

        app.get('/dishes/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)};
            const result = await dishCollection.findOne(query);
            res.send(result)
        })

        // get cart

        app.get('/cart', async(req, res)=>{
            const result = await cartCollection.find().toArray();
            res.send(result);
        })

        // food/dish post

        app.post('/dishes', async(req, res)=>{
            const doc = req.body;
            // console.log(doc);
            const result = await dishCollection.insertOne(doc);
            res.send(result);
        })

        // cart post

        app.post('/cart', async(req, res)=>{
            const item = req.body;
            const result = await cartCollection.insertOne(item);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Fork & Flame server is running')
})

app.listen(port, () => {
    console.log(`Fork & Flame server is running on port: ${port}`)
})
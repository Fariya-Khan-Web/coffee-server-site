const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 2000;


// middlewere
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mhwjc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const coffeeCollection = client.db('coffeeDB').collection('coffee')
        const usersCollection = client.db('coffeeDB').collection('users')

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.findOne(query)
            res.send(result)
        })

        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee)
            const result = await coffeeCollection.insertOne(newCoffee)
            res.send(result)
        })

        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedcoffee = req.body;
            const coffee = {
                $set: {
                    name: updatedcoffee.name,
                    quantity: updatedcoffee.quantity,
                    supplier: updatedcoffee.supplier,
                    taste: updatedcoffee.taste,
                    category: updatedcoffee.category,
                    details: updatedcoffee.details,
                    photo: updatedcoffee.photo
                },
            };
            const result = await coffeeCollection.updateOne(filter, coffee, options)
            res.send(result)
        })

        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query)
            res.send(result)
        })
        
        
        // User related api

        app.post('/users', async(req, res)=>{
            const newUser = req.body;
            console.log(newUser)
            const result = await usersCollection.insertOne(newUser)
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
    res.send('Coffee store server is running')
})

app.listen(port, () => {
    console.log(`server running in port: ${port}`)
})

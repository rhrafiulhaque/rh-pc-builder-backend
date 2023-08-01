const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const bcrypt = require("bcrypt");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.x5fc9ya.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {


        client.connect();
        const productsCollection = client.db('pcbuilder').collection('products');
        const categoryCollection = client.db('pcbuilder').collection('categories');
        const usersCollection = client.db('pcbuilder').collection('users');

        // All Products fetch or get
        app.get('/api/products', async (req, res) => {
            const query = {};
            const products = await productsCollection.find(query).toArray();
            res.send({
                status: 200,
                message: "success",
                data: products
            })
        })
        // Get Product by ID
        app.get('/api/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.send(product);
        })


        // All Products fetch or get
        app.get('/api/categories', async (req, res) => {
            const query = {};
            const category = await categoryCollection.find(query).toArray();
            res.send({
                status: 200,
                message: "success",
                data: category
            })
        })


        // Get Category by Name
        app.get('/api/categories/:id', async (req, res) => {
            const category = req.params.id.toLowerCase()
            console.log(category)
            const query = { category: { $regex: new RegExp(category, 'i') } };
            const findCategory = await productsCollection.find(query).toArray();
            console.log(findCategory)
            res.send({
                status: 200,
                message: "success",
                data: findCategory
            })
        })

    }
    finally {

    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello From PC Builder Backend');
});
app.listen(port, () => {
    console.log(`PC Builder App Listening on Port ${port}`);
})

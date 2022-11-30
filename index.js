const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());

app.get('/', (req, res)=> {
    res.send("B sarees server is running on port 5000");
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fxdma7b.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function saree(){
    try{
        const categoryCollection = client.db('BSarees').collection('categories');
        const userCollection = client.db('BSarees').collection('users');
        const addProductCollection = client.db('BSarees').collection('addProducts');

        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = categoryCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        });

        app.post('/users', async(req,res)=>{
            const sareeUser = req.body;
            const result = await userCollection.insertOne(sareeUser)
            res.send(result);
        })

        app.post('/addProducts', async (req, res) => {
            const addProduct = req.body;
            const result = await addProductCollection.insertOne(addProduct)
            res.send(result);
        });

        app.get('/addProducts', async (req, res) => {
            const name = req.query.name;
            const query = {
                cat_name: name
            }
            const cursor = addProductCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

    }
    finally{

    }
}
saree().catch(err => console.error(err));

app.listen(port, ()=>{
    console.log(`B sarees server is running on port ${port}`)
})
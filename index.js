const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const wishlistCollection = client.db('BSarees').collection('wishlists');
        const advertiseCollection = client.db('BSarees').collection('advertise');

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

        app.get('/users', async (req, res) => {
            let query = {}
            if(req.query.role){
                query.role = req.query.role
            }
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/addProducts', async (req, res) => {
            const addProduct = req.body;
            const result = await addProductCollection.insertOne(addProduct)
            res.send(result);
        });

        app.get('/addProducts', async (req, res) => {
            const name = req.query.name;
            const email = req.query.email;

            let query = { }
            
            if(name){
                query = {
                    cat_name: name
                }
            }
            if(email){
                query = {
                    email
                }
            }
            const cursor = addProductCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/addProducts/:id', async (req, res) => {
            try {
                const id = req.params.id;
                // console.log(id)
                const query = { _id: ObjectId(id) }
                const product = await addProductCollection.findOne(query);
                res.send(product);
            } catch (error) {
                console.log(error);
            }
        });

        app.post('/wishlists', async(req,res)=>{
            const wish = req.body;
            const result = await wishlistCollection.insertOne(wish)
            res.send(result);
        })

        app.get('/wishlists', async (req, res) => {
            const email = req.query.email;

            let query = { }
            
            if(email){
                query = {
                    buyer_email: email
                }
            }
            const cursor = wishlistCollection.find(query);
            const wishlists = await cursor.toArray();
            res.send(wishlists);
        });

        app.delete('/wishlists/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await wishlistCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/advertise', async(req,res)=>{
            const advertise = req.body;
            const result = await advertiseCollection.insertOne(advertise)
            res.send(result);
        })

        app.get('/advertise', async (req, res) => {
            const query = {}
            const cursor = advertiseCollection.find(query);
            const advertise = await cursor.toArray();
            res.send(advertise);
        });

    }
    finally{

    }
}
saree().catch(err => console.error(err));

app.listen(port, ()=>{
    console.log(`B sarees server is running on port ${port}`)
})
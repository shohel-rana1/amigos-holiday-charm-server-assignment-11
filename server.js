const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 7000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qj16f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tour_planner');
        const placesCollection = database.collection('places');
        const ordersCollecttion = database.collection('orders');
        const trendingsCollecttion = database.collection('trendings');

        //POST API/ to add a Trending Place
        app.post('/trendings', async (req, res) => {

            const trending = req.body
            console.log('hit the post place api', trending);
            const result = await trendingsCollecttion.insertOne(trending);
            res.json(result)
        });

        //GET API/ Get all trendins 
        app.get('/trendings', async (req, res) => {
            const cursor = trendingsCollecttion.find({});
            const trendings = await cursor.toArray();
            res.send(trendings);
        });

        //GET API/ Get all data
        app.get('/places', async (req, res) => {
            const cursor = placesCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        });

        //GET API to get all the orders
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollecttion.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })


        //GET API to Have a single data
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id
            console.log('Getting particular id', id)
            const query = { _id: ObjectId(id) };
            const place = await placesCollection.findOne(query);
            res.json(place);
        })

        //POST API/ to post users
        app.post('/orders', async (req, res) => {

            const order = req.body
            console.log('hit the post place api', order);
            const result = await ordersCollecttion.insertOne(order);
            console.log(result)
            res.json(result)
        });
        //DELETE API for order delete
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = ordersCollecttion.deleteOne(query);
            console.log('delete the order by id', id)
            res.json(result)
        })

        //POST API/ to add a place
        app.post('/places', async (req, res) => {

            const place = req.body
            console.log('hit the post place api', place);
            const result = await placesCollection.insertOne(place);
            console.log(result)

            res.json(result)
        });

        //Delete API for single place delete
        app.delete('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await placesCollection.deleteOne(query);
            res.json(result);
        });

        //update API user
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateUser[0]
                }
            };
            const result = await ordersCollecttion.updateMany(filter, updateDoc, options);
            console.log(result)
            res.send(result);


        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    console.log('hitting the request');
    res.send('Running Amigo  Server');
})

app.listen(port, () => {
    console.log('Running Amigos server on port', port);
})
const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zl5hq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('design_printing');
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('orders');
        const usersCollection = database.collection('users');

        // GET services
        app.get('/services', async(req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET sengle service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async(req, res)=>{
            const services = req.body;
            console.log('hit the post api', services);

            const result = await serviceCollection.insertOne(services);
            console.log(result);
            res.json(result);
        } )

        // DELETE API
         app.delete('/services/:id', async(req, res) =>{
             const id = req.params.id;
             const query = {_id:ObjectId(id)};
             const result = await serviceCollection.deleteOne(query);
             res.json(result);
         })
         
         // DELETE API
         app.delete('/orders/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })
         
        // Add Order API
        app.post('/orders', async(req, res) =>{
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.json({result});
        }) 

        app.get('/orders', async(req, res) =>{
            const email = req.query.email;
            const orderQuery = {email: email}
            const orderCursor = orderCollection.find(orderQuery);
            const getOrder = await orderCursor.toArray();
            res.json(getOrder);
        }) 

        // post for user

        app.post('/users', async(req, res) =>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);;
            console.log(result);
            res.json(result)
        })

        app.put('/users', async(req, res) => {
            const user = req.body;
            const filter = {email:user.email};
            const options = {upsert: true};
            const updateDoc = {$set: user};
            const result = await usersCollection.updateOne(filter,updateDoc,options);
            res.json(result);
        });

        app.put('/users/admin', async(req, res) =>{
            const user = req.body;
            const filter = {email:user.email};
            const updateDoc = {$set: {role: 'admin'}};
            const result = await usersCollection.updateOne(filter,updateDoc);
            res.json(result);
        })
         
    }
    finally{
      // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Hello SB Printing and Design');
});

app.listen(port, ()=>{
    console.log('listening to port', port);
});
const express = require('express');
const { MongoClient } = require('mongodb');
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

        // GET services
        app.get('/services', async(req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // POST API
        app.post('/servicesdata', async(req, res)=>{
            const servicesdata = req.body;
            console.log('hit the post api', servicesdata);

            const result = await serviceCollection.insertOne(servicesdata);
            console.log(result);
            res.json(result);
        } )
    }
    finally{
      // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Hello mongodb, I am success install');
});

app.listen(port, ()=>{
    console.log('listening to port', port);
});
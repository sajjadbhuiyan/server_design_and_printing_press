const express = require('express');
const { MongoClient} = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

// user : myPracticeDB
// password : ly7Pyn69aCXuIWHy




const uri = "mongodb+srv://myPracticeDB:ly7Pyn69aCXuIWHy@cluster0.zl5hq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    const database = client.db("SexMaster");
    const usersCollection = database.collection("users");

    //GET API
    app.get('/users', async(req, res)=>{
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });
    
    // Post API
    app.post('/users', async (req, res)=>{
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser)
      console.log('hitting the post', req.body);
      console.log('added user', result);
      res.json(result);
    });

    // DELETE API
    app.delete('users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      console.log('deleting user with id', result);
      res.json(result);
    });

  } finally {
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
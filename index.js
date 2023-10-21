const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//addCars
//E1wKnAF3g11wJrqp
app.use(cors())
app.use(express.json());
// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vh2cr5s.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
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
    // await client.connect();
    const carsCollection = client.db('carsData').collection('carStore')
    const addToCartCollection = client.db('addCartData').collection('addCart')

    app.post('/allcar', async (req, res) => {
      const newCar = req.body;
      console.log(newCar)
      const result = await carsCollection.insertOne(newCar)
      res.send(result)
    })
    app.get('/allcar', async (req, res) => {
      const cursor = carsCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    //to find car
    app.get('/allcar/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await carsCollection.findOne(query);
      res.send(result)
    })

    //now update specific one particular product
    app.put('/allcar/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedCar = req.body;
      const Car = {
        $set: {
          name: updatedCar.name,
          brandName: updatedCar.brandName,
          type: updatedCar.type,
          price: updatedCar.price,
          photo: updatedCar.photo,
          rating: updatedCar.rating,
          description: updatedCar.description,
        }
      }
      const result = await carsCollection.updateOne(filter,Car,options)
      res.send(result)
    })

    //add to cart data to create
    app.post('/myCart/:id',async(req,res)=>{
      const newCart = req.body;
      console.log(newCart)
      const result = await addToCartCollection.insertOne(newCart)
      res.send(result)


    })

    //add to card data to get from database
    app.get('/myCart',async(req,res)=>{
      const cursor = addToCartCollection.find();
      const result = await cursor.toArray()
      res.send(result);
    })

    //to delete from cart
    app.delete('/myCart/:id',async(req,res)=>{
      const id = req.params.id
      const query ={_id:new ObjectId(id)};
      const result = await addToCartCollection.deleteOne(query)
      res.send(result);
    })

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//middleware


app.get('/', (req, res) => {
  res.send('Cars product making server is running');
})
app.listen(port, () => {
  console.log(`Cars server is running on the port :${port}`)
})
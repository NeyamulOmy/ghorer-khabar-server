const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const uri = "mongodb+srv://ghorer-khabar-admin:0Dbf9aeQBXBgTSrV@cluster0.bogje7w.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const servicesCollection = client.db('ghorer-khabar').collection('servicesCollection');
        const reviewCollection = client.db('ghorer-khabar').collection('reviewsCollection');

        app.get('/services3', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query).sort({ _id: -1 }).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = servicesCollection.findOne(query);
            const service = await cursor;
            res.send(service);
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { services: id };
            const cursor = reviewCollection.find(query).sort({ _id: -1 });
            const review = await cursor.toArray();
            res.send(review);
        });


    }
    finally {

    }
}
run();

app.get('/', (req, res) => {
    res.send('server running...')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

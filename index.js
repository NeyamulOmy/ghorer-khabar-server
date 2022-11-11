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
            const query = { serviceId: id };
            const cursor = reviewCollection.find(query).sort({ _id: -1 });
            const review = await cursor.toArray();
            res.send(review);
        });

        app.get('/reviews/update/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const cursor = reviewCollection.findOne(query);
            const review = await cursor;
            res.send(review)
        })

        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = reviewCollection.find(query).sort({ _id: -1 });
            const review = await cursor.toArray();
            res.send(review);
        });


        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result);
        });

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })


        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const message = req.body.message
            console.log(message)
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    message: message
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

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

const express = require('express')
const app = express()
const http = require('http')
const axios = require('axios')
const cors = require('cors')
const redis = require('redis')
const { json } = require('stream/consumers')
const { error } = require('console')


const server = http.createServer(app);
const redis_client = redis.createClient({
    url: 'redis://127.0.0.1:6379'
}); //use default config details
const DEFAULT_EXPIRATION_TIME = 3600
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true}))
const items = []

redis_client.on('error', (err) => {
    console.log('Redis error: ', err)
})


app.get ('/photos', async(req, res) => {
    try {
        const albumId = req.query.albumId;
        const cachedPhotos = await redis_client.get('photo')
        if(cachedPhotos){
            console.log('hit cache')
            return res.status(200).json({
                success: true,
                message: 'fetched photo successfully',
                data: JSON.parse(cachedPhotos)
            })
        } else{
            const { data } = await axios.get('https://jsonplaceholder.typicode.com/photos', { params: { albumId }})
            redis_client.setEx('photo', DEFAULT_EXPIRATION_TIME, JSON.stringify(data))
            return res.status(200).json({
                success: true,
                message: 'fetched photo successfully',
                data: data
            })
        }
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: 'an error occurred when fetching data from external API',
            data: null
        })
    }
})


app.get("/fetch", (req, res)=> {
    res.contentType("application/json")
    res.status(200).json({
        success: true,
        message: 'all store items fetched successfully',
        data: items
    })
})

app.post('/create', (req, res)=> {
    const item = {
        name: req.body.name,
        quantity: req.body.quantity
    }
    items.push(item)

    res.contentType("application/json");
    res.status(201).json({
        success: true,
        message: 'new item has been added to store successfully',
        data: items
    })
})


async function start_server(){
    try {
        await redis_client.connect()
        console.log('connected to redis server')
    } catch (error) {
        throw error
    }
    server.listen(6005, () => {
        console.log('test server running at port 6005')
    })
}

start_server()

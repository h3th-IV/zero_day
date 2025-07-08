const express = require('express')
const app = express()
const http = require('http')
const axios = require('axios')
const cors = require('cors')


const server = http.createServer(app);
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true}))
const items = []


app.get ('/photos', async(req, res) => {
    console.log('hit fetch photos')
    const albumId = req.query.albumId;
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/photos', { params: { albumId } })

    res.status(200).json({
        success: true,
        message: 'photos fetched from third party api successfully',
        data: data
    })
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


server.listen(6005, () => {
    console.log('test server running at port 6005')
})
require('dotenv').config()
const express = require('express');
const app = express()
const cors = require('cors');
const { initializeFirebase } = require('./model')
const initRoutes = require('./routes')

const corsOptions = {
    origin: process.env.origin,
    credentials: true,
    optionSuccessStatus: 200
};

initializeFirebase()

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
initRoutes(app)

app.listen(3000, () => console.log('Server is running on 3000!'))

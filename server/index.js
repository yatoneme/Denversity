const { initializeFirebase } = require('./model')
const cors = require('cors');
const express = require('express');
const Appointment = require('./routes/appointment');
const Categories = require('./routes/categories');
const app = express()
require('dotenv').config()

const corsOptions = {
    origin: process.env.origin,
    credentials: true,
    optionSuccessStatus: 200
};

initializeFirebase()

app.use(cors(corsOptions))
app.use(express.json()) // body-parser is now deprecated as of Express 4.16+
app.use(express.urlencoded({ extended: true }))
app.use('/appointment', Appointment)
app.use('/categories', Categories)

app.listen(3000, () => console.log('Server is running on 3000!'))
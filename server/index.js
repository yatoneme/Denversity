const { initializeFirebase } = require('./model')
const cors = require('cors');
const express = require('express');
const Appointment = require('./routes/appointment');
const Categories = require('./routes/categories');
const Universities = require('./routes/universities');
const Doctors = require('./routes/doctors');
const checkAuth = require('./middlewares/checkAuth')
const app = express()
require('dotenv').config()

const corsOptions = {
    origin: process.env.origin,
    credentials: true,
    optionSuccessStatus: 200
};

initializeFirebase()

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/appointment', Appointment)
app.use('/universities', Universities)
app.use('/categories', Categories)
app.use('/doctors', checkAuth, Doctors)

app.listen(3000, () => console.log('Server is running on 3000!'))

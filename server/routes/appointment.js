const { getFirestore } = require('firebase-admin/firestore')
const express = require('express')
const Appointment = express.Router()

Appointment.post('/', (req, res) => {
    const {body: appointment} = req
    const db = getFirestore()
    const appointments = db.collection('appointments')

    appointments.add(appointment).then(data => {
        res.sendStatus(200)
    }).catch(e => res.sendStatus(500))
})

module.exports = Appointment;
const { getFirestore } = require('firebase-admin/firestore')
const express = require('express')
const Universities = express.Router()

Universities.get('/', (req, res) => {
    const db = getFirestore()
    const universities = db.collection('university')

    universities.get().then(data => {
        const allUniversities = []

        data.forEach(doc => allUniversities.push(doc.data()))
        res.status(200).send({ data: allUniversities })
    }).catch(e => {
        console.error(e)
        res.sendStatus(500)
    })
})

module.exports = Universities;

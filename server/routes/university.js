const { getFirestore } = require('firebase-admin/firestore')
const admin = require('firebase-admin')
const express = require('express')
const { getAuth } = require('firebase-admin/auth')
const University = express.Router()

University.post('/doctors', (req, res) => {
    const { email } = req.user
    const db = getFirestore()
    const doctorsCollection = db.collection('doctors')
    const universitiesCollection = db.collection('university')

    universitiesCollection.where("email", "==", email).limit(1).get().then(data => {
        if(data.empty)
            return res.sendStatus(400)

        const university = data.docs[0].data()
        doctorsCollection.where("university", "==", university.name).get().then(data => {
            const doctors = data.docs.map(doc => doc.data())

            res.status(200).send({
                university,
                doctors
            })
        })
    }).catch(e => {
        console.error(e)
        res.sendStatus(500)
    })
})

University.post('/add-doctor', (req, res) => {
    const { new_doctor } = req.body
    const db = getFirestore()
    const doctorsCollection = db.collection('doctors')
    const { password, ...no_password_doctor } = new_doctor

    getAuth().createUser({
        email: new_doctor.email,
        password: new_doctor.password
    }).then(new_user => {
        doctorsCollection.add(no_password_doctor).then(doctor => {
            res.sendStatus(200)
        })
    }).catch(e => {
        switch(e.code){
            case 'auth/email-already-exists':
                res.sendStatus(409)
                break;
            default:
                console.error(e)
                res.sendStatus(500)
        }
    })
})

module.exports = University;

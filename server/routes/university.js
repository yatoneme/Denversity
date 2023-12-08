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
                displayName: req.user.name,
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

University.delete('/doctor', (req, res) => {
    const { doctor_email } = req.body

    const db = getFirestore()
    const doctorsCollection = db.collection('doctors')
    const auth = getAuth()

    auth.getUserByEmail(doctor_email).then(doctor => {
        if(!doctor)
            return res.sendStatus(404)

        auth.deleteUser(doctor.uid).then(() => {
            doctorsCollection.where("email", "==", doctor_email).limit(1).get().then(data => {
                data.docs[0].ref.delete().then(() => res.sendStatus(200));
            })
        })
    }).catch(e => {
        if(e.code === 'auth/user-not-found')
            return res.sendStatus(404)
        console.error(eZZ)
    })

})

module.exports = University;

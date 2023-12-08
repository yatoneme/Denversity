const { getFirestore } = require('firebase-admin/firestore')
const admin = require('firebase-admin')
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

Universities.post('/', (req, res) => {
    const { display_name, email, password, hashed_secret, link, address, name } = req.body

    if(hashed_secret !== process.env.HASHED_SECRET)
        return res.sendStatus(400)


    admin.auth().createUser({
        email,
        password,
        displayName: display_name
    }).then(user => {
        if(!user)
            return res.sendStatus(400)

        const db = getFirestore()
        const universities = db.collection('university')
        const university = {
            name,
            link,
            address,
            email
        }

        universities.add(university).then(ref => res.sendStatus(200))
    }).catch(e => {
        console.log(e);
        if(e.code === "auth/email-already-exists")
            return res.sendStatus(409)
        res.sendStatus(500)
    })
})

module.exports = Universities;

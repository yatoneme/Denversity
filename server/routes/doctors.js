const { getFirestore } = require('firebase-admin/firestore')
const express = require('express')
const Doctors = express.Router()

const getAppointments = (req, res) => {

    const db = getFirestore()
    const doctors = db.collection('doctors')

    doctors.where("email", "==", req.user.email).limit(1).get().then(data => {
        if(data.empty)
            return res.sendStatus(400)

        const doctor = {
            ...data.docs[0].data(),
            id: data.docs[0].id
        }

        db.collection('appointments').where("university_name", "==", doctor.university).get().then(data => {
            const pending_appointments = data.docs.map(doc => ({...doc.data(), id: doc.id })).filter(doc => doc.on_queue)
            const accepted_appointments = data.docs.map(doc => ({...doc.data(), id: doc.id })).filter(doc => !doc.on_queue && !doc.is_complete && doc.doctor_email === req.user.email)
            const completed_appointments = data.docs.map(doc => ({...doc.data(), id: doc.id })).filter(doc => doc.is_complete && doc.doctor_email === req.user.email)

            const doctor_data = {
                general: doctor,
                pending_appointments,
                accepted_appointments,
                completed_appointments
            }

            return res.status(200).send(doctor_data)
        })
    }).catch(e => {
        console.error(e)
        res.sendStatus(500)
    })

}

const updateAppointmentStatus = (req, res, next) => {
    const { caseId } = req.body
    const { user: { email } } = req

    const db = getFirestore()
    const doctors = db.collection('doctors')

    doctors.where("email", "==", email).limit(1).get().then(data => {
        if(data.empty)
            return res.sendStatus(400)

        const doctor = data.docs[0].data()
        const newAppointmentObj = req.path === "/accept" ? {
            doctor_email: doctor.email,
            on_queue: false
        } : {
            is_complete: true
        }

        db.collection('appointments').doc(caseId).update(newAppointmentObj).then(() => next())
        .catch(e => {
            console.error(e)
            res.sendStatus(400)
        })
    }).catch(e => {
        console.error(e)
        res.sendStatus(500)
    })
}


Doctors.post('/', getAppointments)
Doctors.put('/accept', updateAppointmentStatus, getAppointments)
Doctors.put('/complete', updateAppointmentStatus, getAppointments)

module.exports = Doctors;

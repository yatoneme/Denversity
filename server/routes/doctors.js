const { getFirestore } = require('firebase-admin/firestore')
const express = require('express')
const sendMail = require('../utility/sendMail')
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
        const newAppointmentObj = req.path === "/accept" 
        ? {
            doctor_email: doctor.email,
            on_queue: false
        } : {
            is_complete: true
        }

        req.dbuser = {
            university: doctor.university,
            name: doctor.name
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

const deleteCase = (req, res, next) => {
    const { caseId } = req.body

    const db = getFirestore()

    db.collection('appointments').doc(caseId).delete().then(() => next())
    .catch(e => {
        console.error(e)
        res.sendStatus(400)
    })
}

const sendAcceptEmail = (req, res, next) => {
    const { patient_name, patient_email, accepted_time, accepted_date } = req.body
    const { name: doctor_name, university: university_name } = req.dbuser

    sendMail('Your appointment has been accepted!', 'acceptedmail', {
        patient_email,
        patient_name,
        doctor_name,
        accepted_time,
        accepted_date,
        university_name
    }, (error) => {
        if(error)
            console.error(error)
    })

    next()
}

const sendExpiredEmail = (req, res, next) => {
    const { patient_name, patient_email, case_name } = req.body

    sendMail('Your appointment has been expired!', 'expiredmail', {
        patient_email,
        patient_name,
        case_name,
    }, (error) => {
        if(error)
            console.error(error)
    })

    next()
}


Doctors.post('/', getAppointments)
Doctors.delete('/remove-case', sendExpiredEmail, deleteCase, getAppointments)
Doctors.put('/accept', updateAppointmentStatus, sendAcceptEmail, getAppointments)
Doctors.put('/complete', updateAppointmentStatus, getAppointments)

module.exports = Doctors;

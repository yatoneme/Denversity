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

        db.collection('specialties').where("student_email", "==", doctor.email).get().then(specialties => {
            const specialty_array = specialties.docs.map(doc => doc.data().specialty)
            db.collection('appointments').where("university_name", "==", doctor.university).where("problem_category", "in", specialty_array).get().then(data => {
                const appointments = data.docs.map(doc => ({...doc.data(), id: doc.id }))
                const pending_appointments = appointments.filter(doc => doc.on_queue && !doc.is_accepted)
                const accepted_appointments = appointments.filter(doc => doc.is_accepted && !doc.is_complete && doc.doctor_email === req.user.email)
                const completed_appointments = appointments.filter(doc => doc.is_complete && doc.doctor_email === req.user.email)

                const doctor_data = {
                    general: doctor,
                    pending_appointments,
                    accepted_appointments,
                    completed_appointments
                }

                return res.status(200).send(doctor_data)
            })
        })
    }).catch(e => {
        console.error(e)
        res.sendStatus(400)
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
        const newAppointmentObj = {
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

const requestAcceptFromAdmin = (req, res, next) => {
    const { caseId } = req.body
    const { user: { email } } = req

    const db = getFirestore()
    const doctors = db.collection('doctors')

    doctors.where("email", "==", email).limit(1).get().then(data => {
        if(data.empty)
            return res.sendStatus(400)

        const doctor = data.docs[0].data()
        const newAppointmentObj = {
            doctor_email: doctor.email,
            on_queue: false,
            is_accepted: false,
            request_sent_at: new Date().toISOString(),
        }

        req.dbuser = {
            university: doctor.university,
            name: doctor.name
        }

        db.collection('appointments').doc(caseId).get().then(data => {
            const doc = data.data()

            if(doc.doctor_email !== "" || doc.doctor_email !== null)
                return res.sendStatus(409)

            data.ref.update(newAppointmentObj).then(() => next())
        })
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

const sendRemovedAppointmentEmail = (req, res, next) => {
    const { patient_name, patient_email, case_name } = req.body
    const remove_reason = req.path.split('/')[2]

    // Router only supports 2 routes: expired & late
    if(remove_reason !== "expired" && remove_reason !== "late")
        return res.sendStatus(404)

    const email_title = remove_reason === "expired" ? "Your appointment has been expired!" : "You've missed your appointment!"
    const email_filename = remove_reason === "expired" ? "expiredmail" : "missedmail"

    sendMail(email_title, email_filename, {
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
Doctors.delete('/remove-case/*', sendRemovedAppointmentEmail, deleteCase, getAppointments)
Doctors.put('/accept', requestAcceptFromAdmin, getAppointments)
Doctors.put('/complete', updateAppointmentStatus, getAppointments)

module.exports = Doctors;

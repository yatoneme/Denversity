const { getFirestore } = require('firebase-admin/firestore')
const { getAuth } = require('firebase-admin/auth')
const sendMail = require('../utility/sendMail')
const express = require('express')
const University = express.Router()

University.post('/doctors', (req, res) => {
    // TODO: Make pages for history
    const { email } = req.user
    const { page_no = 1, width = 30 } = req.body 
    const db = getFirestore()
    const doctorsCollection = db.collection('doctors')
    const universitiesCollection = db.collection('university')

    universitiesCollection.where("email", "==", email).limit(1).get().then(data => {
        if(data.empty)
            return res.sendStatus(400)

        const university = data.docs[0].data()

            db.collection('appointments').where("is_accepted", "==", false).where("request_sent_at", "!=", null).where("university_name", "==", university.name).get().then(data => {
                const pendingRequests = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))

                db.collection('categories').get().then(data => {
                    const categories = data.docs.map(category => category.data().name)
 
                    doctorsCollection.where("university", "==", university.name).get().then(data => {
                        if(data.empty)
                            return res.status(200).send({
                                displayName: req.user.name,
                                university,
                                doctors: [],
                                pendingRequests,
                                categories
                            })
            
                        const doctors = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
                        const doctors_emails = doctors.map(doctor => doctor.email)
                        
                        db.collection('specialties').where("student_email", "in", doctors_emails).get().then(data => {
                            const specialty_array = data.docs.map(doc => doc.data())
                            const finalDoctors = doctors.map(doctor => {
                                const doctor_specialties = specialty_array.filter(specialty => specialty.student_email === doctor.email)

                                return { ...doctor, doctor_specialties }
                            })

                            res.status(200).send({
                                displayName: req.user.name,
                                university,
                                doctors: finalDoctors,
                                pendingRequests,
                                categories
                            })
                        })
                })


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
    const specialtyCollection = db.collection('specialties')
    const { password, doctor_specialties, ...no_password_doctor } = new_doctor

    getAuth().createUser({
        email: new_doctor.email,
        password: new_doctor.password
    }).then(new_user => {
        doctorsCollection.add(no_password_doctor).then(async doctor => {
            const batch = db.batch()
            
            await doctor_specialties.forEach(async specialty => {
                const docRef = await specialtyCollection.doc()

                batch.create(docRef, { 
                student_email: new_doctor.email,
                specialty
                })
            })
            batch.commit().then(() => {
                res.sendStatus(200)
            })
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
                data.docs[0].ref.delete().then(() => {
                    const specialtiesCollection = db.collection('specialties')

                    specialtiesCollection.where('student_email', "==", doctor_email).get().then(data => {
                        const batch = db.batch()

                        data.docs.forEach(async doc => {
                            const docRef = specialtiesCollection.doc(doc.id);

                            batch.delete(docRef);
                        })
                        batch.commit().then(() => {
                            res.sendStatus(200)
                        })
                    })
                });
            })
        })
    }).catch(e => {
        if(e.code === 'auth/user-not-found')
            return res.sendStatus(404)

        console.error(e)
        res.sendStatus(400)
    })
})

const updateAppointmentStatus = (req, res, next) => {
    const { caseId, student_email } = req.body

    const db = getFirestore()
    const doctors = db.collection('doctors')

    doctors.where("email", "==", student_email).limit(1).get().then(data => {
        if(data.empty)
            return res.sendStatus(400)

        const doctor = data.docs[0].data()
        const newAppointmentObj = req.path === "/accept" ? {
            is_accepted: true,
            accepted_at: new Date().toISOString()
        } : {
            doctor_email: "",
            request_sent_at: null,
            on_queue: true
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

    res.sendStatus(200)
}

University.put('/accept', updateAppointmentStatus, sendAcceptEmail)
University.put('/reject', updateAppointmentStatus, (req, res) => res.sendStatus(200))

module.exports = University;

// TODO: Cron job -> Email for rescheduling
// and Remove completed cases every year ( maybe?? )
// TODO: Before removing the student, make sure the doctor transfers that student's accepted cases to another student, and notify him by using the color gold!
// TODO: Implement student request denial feature
// TODO: Implement history for moderators
// TODO: Do user if accepted did not show up:
/**
 * Patients did not show up // button when clicked send email to the patient for rescheduling and remove it completely
 */
window.onload = () => {
    firebase.auth().onAuthStateChanged( user => {
        if(!user)
        {
            window.location.href = "signin.html"
            return false
        }

        firebase.auth().currentUser.getIdToken(true).then(token => {
            fetch(`http://localhost:3000/doctors`, {
                method: "POST",
                body: JSON.stringify({
                    userId: token,
                    role: "doctor"
                }),
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if(!res.ok)
                {
                    window.location.href = "signin.html"
                    return
                }

                return res.json()
            }).then(data => {
                const { general, ...appointments } = data

                updateDoctorDisplay(data.general)
                renderTables(appointments)
            })
        })
    })
}

function renderTables(types) {
    const tbody = document.getElementById("status-table-body")
    tbody.innerHTML = ""
    const max_col =  Math.max(...Object.keys(types).map(el => types[el].length))

    Object.keys(types).forEach(type => {
        const patients = types[type]
        const class_type = type.split("_")[0]

        for(let i = 0; i < max_col; i++) {
            const patient = patients[i]

            let row = document.getElementById(`trow-status-${i+1}`)
            const cell = document.createElement('td')

            if(!row)
            {
                row = document.createElement('tr')
                row.id = `trow-status-${i+1}`
                tbody.appendChild(row)
            }

            if(!patient)
            {
                cell.className = "empty-cell"
                cell.id = `${class_type}-${i+1}`
                row.appendChild(cell)
                continue
            }
    
            const today = new Date();
            const birthDate = new Date(patient.birthday);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
                
            const text_container = document.createElement('div'),
            button_container = document.createElement('div'),
            category = document.createElement('h4'),
            patientDetails = document.createElement('p'),
            schedule = document.createElement('p'),
            description = document.createElement('p')
    
            const timeJs = new Date(`1970-01-01T${patient.time}`).toLocaleTimeString()
            const scheduleTimeSearch = new RegExp(/([0-9]{1,2}:[0-9]{2})(:[0-9]{2}) (AM|PM)/).exec(timeJs)
            const scheduleTime = scheduleTimeSearch[1] + scheduleTimeSearch[3].toLowerCase()
    
            category.innerHTML = patient.problem_category
            patientDetails.innerHTML = `${patient.fullname}, ${age}, ${patient.gender}`
            schedule.innerHTML = `Schedule: ${patient.appointment_date}, at: ${scheduleTime}`
            description.innerHTML = `Description: ${patient.problem_description}`
    
            cell.className = "status-cell"
            cell.id = `${class_type}-${i+1}`
            button_container.className = "case_button_container"
            text_container.appendChild(category)
            text_container.appendChild(patientDetails)
            text_container.appendChild(schedule)
            text_container.appendChild(description)
            cell.appendChild(text_container)
            cell.appendChild(button_container)
            row.appendChild(cell)

            // buttons for accepting cases and completing cases
            if(class_type !== "completed"){
                const acceptBtn = document.createElement('button')
                acceptBtn.onclick = () => class_type === "pending" ? acceptCase(acceptBtn, patient) : completeCase(acceptBtn, patient.id)
                acceptBtn.className = class_type === "pending" ? "acceptBtn" : "completeBtn"
                acceptBtn.innerHTML = '<svg fill= "white" xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'

                button_container.appendChild(acceptBtn)

                if(class_type === "pending")
                {
                    const late = new Date(`${patient.appointment_date}T${patient.time}`) < new Date()
                    
                    if(late){
                        const removeBtn = document.createElement('button')

                        // TODO: Make it work!
                        removeBtn.onclick = () => removeCase(removeBtn, patient)
                        removeBtn.className = "removeCaseBtn"
                        removeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>'
                        button_container.appendChild(removeBtn)
                        acceptBtn.remove()
                        cell.className += " case-late"
                    }
                }
            }
        }
    })
}

function removeCase(removeBtn, patient) {
    removeBtn.disabled=true;
    removeBtn.style.background = 'grey';
    firebase.auth().onAuthStateChanged( user => {
        if(!user)
        {
            window.location.href = "signin.html"
            return false
        }

        firebase.auth().currentUser.getIdToken(true).then(token => {
            fetch(`http://localhost:3000/doctors/remove-case`, {
                method: "DELETE",
                body: JSON.stringify({
                    role: "doctor",
                    userId: token,
                    caseId: patient.id,
                    patient_email: patient.email,
                    patient_name: patient.fullname,
                    case_name: patient.problem_category
                }),
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(data => {
                if(!data)
                {
                    setNotification(false, "Cannot remove that appointment!")
                    return
                }
                setNotification(true, "Appointment is removed, an email is sent to the patient!")
                
                const { general, ...appointments } = data
                renderTables(appointments)
            }).catch(e => {
                removeBtn.disabled=false;
                removeBtn.style.background = '';
                setNotification(false, "Sorry, an error has occured!")
            })

        })
    })
}

function updateDoctorDisplay(doctor) {
    if(!doctor)
        return

    const container = document.getElementsByClassName('details')[0]    
    const name = document.createElement('h3')
    const email = document.createElement('h3')
    const university = document.createElement('h3')

    name.innerHTML = "Dr. " + doctor.name
    email.innerHTML = doctor.email
    university.innerHTML = "University: " + doctor.university


    container.innerHTML = ""
    container.appendChild(name)
    container.appendChild(email)
    container.appendChild(university)
}

function acceptCase(button, patient) {
    button.disabled=true;
    button.style.background = 'grey';
    firebase.auth().onAuthStateChanged( user => {
        if(!user)
        {
            window.location.href = "signin.html"
            return false
        }

        firebase.auth().currentUser.getIdToken(true).then(token => {
            fetch(`http://localhost:3000/doctors/accept`, {
                method: "PUT",
                body: JSON.stringify({
                    role: "doctor",
                    userId: token,
                    caseId: patient.id,
                    patient_name: patient.fullname,
                    patient_email: patient.email,
                    accepted_time: patient.time,
                    accepted_date: patient.appointment_date
                }),
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(data => {
                if(!data)
                {
                    setNotification(false, "Cannot accept that appointment!")
                    return
                }
                setNotification(true, "Appointment is accepted, an email is sent to the patient!")
                
                const { general, ...appointments } = data
                renderTables(appointments)

            })

        })
    })
}


function completeCase(button, caseId) {
    button.disabled=true;
    button.style.background = 'grey';
    firebase.auth().onAuthStateChanged( user => {
        if(!user)
        {
            window.location.href = "signin.html"
            return false
        }

        firebase.auth().currentUser.getIdToken(true).then(token => {
            fetch(`http://localhost:3000/doctors/complete`, {
                method: "PUT",
                body: JSON.stringify({
                    userId: token,
                    caseId,
                    role: "doctor"
                }),
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(data => {
                if(!data)
                {
                    setNotification(false, "Cannot complete that appointment!")
                    return
                }
                setNotification(true, "Appointment is completed, well done!")

                const { general, ...appointments } = data
                renderTables(appointments)

            })

        })
    })
}
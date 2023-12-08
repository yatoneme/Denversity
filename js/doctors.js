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
                acceptBtn.onclick = () => class_type === "pending" ? acceptCase(acceptBtn, patient.id) : completeCase(acceptBtn, patient.id)
                acceptBtn.className = class_type === "pending" ? "acceptBtn" : "completeBtn"
                acceptBtn.innerHTML = '<svg fill= "white" xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'
                button_container.appendChild(acceptBtn)
            }
        }
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

function acceptCase(button, caseId) {
    button.disabled=true;
    button.style.fontSize = "25px";
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
    button.style.fontSize = "25px";
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
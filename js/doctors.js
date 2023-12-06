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
                    userId: token
                }),
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(data => {
                const { general, ...appointments } = data

                updateDoctorDisplay(data.general)
                renderTables(appointments)
            })
        })
    })
}

function renderTables(data) {
    const tbody = document.getElementById("status-table-body")
    tbody.innerHTML = ""
    const max_col =  Math.max(...Object.keys(data).map(el => data[el].length))

    console.log(data);
    Object.keys(data).forEach((type, idx) => {
        const patients = data[type]
        const class_type = type.split("_")[0]
        console.log(class_type);


        for(let i = 0; i < max_col; i++) {
            const patient = patients[i]

            let row = document.getElementById(`trow-status-${i+1}`)
            const cell = document.createElement('td')

            if(!row)
            {
                console.log("w");
                row = document.createElement('tr')
                row.id = `trow-status-${i+1}`
                tbody.appendChild(row)
            }

            if(!patient)
            {
                cell.className = "empty-cell"
                cell.id = `${class_type}-${i+1}`
                row.appendChild(cell)
                break
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
            schedule.innerHTML = scheduleTime
            description.innerHTML = patient.problem_description
    
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
                acceptBtn.onclick = () => class_type === "pending" ? acceptCase(patient.id) : null
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

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "front.html"
      }).catch((error) => {
        console.error(error)
      });
}

function acceptCase(caseId) {
    firebase.auth().onAuthStateChanged( user => {
        if(!user)
        {
            window.location.href = "signin.html"
            return false
        }

        firebase.auth().currentUser.getIdToken(true).then(token => {
            fetch(`http://localhost:3000/doctors`, {
                method: "PUT",
                body: JSON.stringify({
                    userId: token,
                    caseId
                }),
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(data => {
                if(!data)
                {
                    // notification false
                    return
                }
 
                const { general, ...appointments } = data
                renderTables(appointments)

            })

        })
    })
}
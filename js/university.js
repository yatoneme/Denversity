window.onload = () => {
    firebase.auth().onAuthStateChanged(user => {
        if(!user)
        {
            window.location.href = "universitylogin.html"
            return false
        }

        firebase.auth().currentUser.getIdToken(true).then(token => {
            fetch(`http://localhost:3000/university/doctors`, {
                method: "POST",
                body: JSON.stringify({
                    userId: token,
                    role: 'university'
                }),
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if(res.status === 400)
                {
                    window.location.href = "universitylogin.html"
                    return
                }
                return res.json()
            }).then(data => {
                const { university, doctors, displayName, pendingRequests, categories } = data

                if(!university){
                    window.location.href = "universitylogin.html"
                    return
                }

                const welcome = document.getElementById("welcome-header")
                welcome.innerHTML = `Welcome, ${displayName}!`

                window.loggedInUniversity = university

                renderDoctorsTable(doctors)
                renderPendingRequestsTable(pendingRequests)
                renderCategories(categories)
            }).catch(e => {
                console.error(e)
                setNotification(false, 'Sorry, and error has occured!')
            })
        })
    })
}

function renderPendingRequestsTable(requests) {    
    const table = document.getElementById("std_history");
    requests.forEach(request => {
        const row = document.createElement('tr')
        // Doctor email, time of request, date of appointment, case type
        const cel1 = document.createElement('td')
        const cel2 = document.createElement('td')
        const cel3 = document.createElement('td')
        const confirmBtn = document.createElement('button')
        const rejectBtn = document.createElement('button')
        const timedate = new Date(request.request_sent_at)
        const requestedAt = `${timedate.toDateString()} at ${timedate.toLocaleTimeString()}`

        confirmBtn.className = "accept-request-btn"
        confirmBtn.onclick = e => confirmCase(request)
        confirmBtn.title = "Accept the request"

        rejectBtn.className = "decline-request-btn"
        rejectBtn.onclick = e => declineCase(request)
        confirmBtn.title = "Decline the request"

        row.id = request.id
        cel1.innerHTML = `<p class="student-request-category">${request.problem_category}</p>`
        cel2.innerHTML = `<div class="student-request-details"><p>${request.doctor_email}</p><p>${requestedAt}</p></div>`
        confirmBtn.innerHTML = `<svg fill= "white" xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`
        rejectBtn.innerHTML = `<svg fill="white" xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`

        row.appendChild(cel1)
        row.appendChild(cel2)
        cel3.appendChild(confirmBtn)
        cel3.appendChild(rejectBtn)
        row.appendChild(cel3)
        table.appendChild(row)
    })
}

function confirmCase(patient) {
    firebase.auth().onAuthStateChanged( user => {
        if(!user)
        {
            window.location.href = "universitylogin.html"
            return false
        }

        firebase.auth().currentUser.getIdToken(true).then(token => {
            fetch(`http://localhost:3000/university/accept`, {
                method: "PUT",
                body: JSON.stringify({
                    role: 'university',
                    userId: token,
                    caseId: patient.id,
                    patient_name: patient.fullname,
                    patient_email: patient.email,
                    accepted_time: patient.time,
                    accepted_date: patient.appointment_date,
                    student_email: patient.doctor_email
                }),
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if(!res.ok)
                {
                    setNotification(false, "Cannot accept that appointment!")
                    return
                }
                const row = document.getElementById(patient.id)

                setNotification(true, "Approved, an email is sent to the patient!")
                row.remove()
            })

        })
    })
}

function declineCase(patient) {
    firebase.auth().onAuthStateChanged( user => {
        if(!user)
        {
            window.location.href = "universitylogin.html"
            return false
        }

        firebase.auth().currentUser.getIdToken(true).then(token => {
            fetch(`http://localhost:3000/university/reject`, {
                method: "PUT",
                body: JSON.stringify({
                    role: 'university',
                    userId: token,
                    caseId: patient.id,
                    student_email: patient.doctor_email
                }),
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if(!res.ok)
                {
                    setNotification(false, "Cannot reject that appointment!")
                    return
                }
                const row = document.getElementById(patient.id)

                setNotification(true, "Request is denied successfully!")
                row.remove()
            })

        })
    })
}

function renderCategories(categories) {
    const categories_container = document.getElementById("categories-select")

    categories.forEach(category => {
        const categoryBox = document.createElement("input")
        const label = document.createElement("label")

        label.htmlFor = category.split(' ').join('')
        label.innerText = category
        categoryBox.name = category
        categoryBox.id = category.split(' ').join('')
        categoryBox.type = "checkbox"
        categoryBox.value = category

        categories_container.appendChild(label)
        categories_container.appendChild(categoryBox)
    })
}

function renderDoctorsTable(doctors) {    
    const tbody = document.getElementById("std_data-body")
    const empty = document.getElementById('empty-table-row')

    if(empty)
        empty.remove()

    if(!doctors.length)
    {
        const table_container = document.getElementsByClassName('std_data_table')[0]
        const no_data = document.createElement('p')

        table_container.appendChild(no_data)
        no_data.innerHTML = "No doctors are added yet!"
        no_data.id = "empty-table-row"
        return
    }

    doctors.forEach(doctor => {
        addToTable(doctor, tbody, 0)
    })
}

function savedata() {
    event.preventDefault();
    const selectedSpecialties = [...document.querySelectorAll("input[type='checkbox']:checked")].map(specialtyInput => specialtyInput.value)

    if(!selectedSpecialties.length)
        return alert("You must check at least one category.");

    const tbody = document.getElementById("std_data-body")
    const currentIndex = tbody.childNodes.length;
  
    const doctor = {
      name: document.getElementById("sname").value,
      email: document.getElementById("semail").value,
      university: window.loggedInUniversity.name,
      password: document.getElementById("spassword").value,
      doctor_specialties: selectedSpecialties
    };
    
    storeNewDoctor(doctor).then(() => {
        addToTable(doctor, tbody, currentIndex)
        document.getElementById("regform").reset();
        setNotification(true, `${doctor.email} is added`)
    }, (reason_not_stored) => {
        if(reason_not_stored === 409)
            setNotification(false, 'Email is already used!')
        else
            setNotification(false, 'Unknown error!')
    }).catch(e => {
        console.error(e)
    })
}

function storeNewDoctor(doctor) {
    return new Promise((success, failure) => {
        firebase.auth().onAuthStateChanged(user => {
            if(!user)
            {
                window.location.href = "universitylogin.html"
                return false
            }
    
            firebase.auth().currentUser.getIdToken(true).then(token => {
                fetch(`http://localhost:3000/university/add-doctor`, {
                    method: "POST",
                    body: JSON.stringify({
                        userId: token,
                        role: 'university',
                        new_doctor: doctor
                    }),
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(res => {
                    if(!res.ok)
                        return failure(res.status)

                    return success()
                }).catch(e => {
                    console.error(e)
                    setNotification(false, 'Sorry, and error has occured!')
                })
            })
        })
    })
}

function delStudent(doctor_name, doctor_email, rowToDelete) {
    const canDelete = confirm(`You sure you want to delete the following student: ${doctor_name}? This change cannot be undone.`)

    if(!canDelete)
        return

    firebase.auth().currentUser.getIdToken(true).then(token => {
        fetch(`http://localhost:3000/university/doctor`, {
            method: "DELETE",
            body: JSON.stringify({
                userId: token,
                role: 'university',
                doctor_email
            }),
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if(res.status === 400)
            {
                window.location.href = "universitylogin.html"
                return
            }

            if(res.ok){
                updateTable(rowToDelete)
                setNotification(true, `Student: ${doctor_email} is removed!`)
            }
        }).catch(e => {
            console.error(e)
            setNotification(false, 'Sorry, and error has occured!')
        })
    })
}

function updateTable(rowToDelete) {
    const empty = document.getElementById("empty-table-row")
    const tbody = document.getElementById("std_data-body")

    rowToDelete.parentNode.removeChild(rowToDelete);

    if(!tbody.childNodes.length)
    {
        if(empty)
            empty.remove()

        const table_container = document.getElementsByClassName('std_data_table')[0]
        const no_data = document.createElement('p')

        table_container.appendChild(no_data)
        no_data.innerHTML = "No doctors are added yet!"
        no_data.id = "empty-table-row"
        return
    }
}

function addToTable(doctor, tbody, atIndex) {
    const newRow = tbody.insertRow(atIndex);
    const cel1 = newRow.insertCell(0);
    const cel2 = newRow.insertCell(1);
    const cel3 = newRow.insertCell(2);
    const cel4 = newRow.insertCell(3);
    const empty = document.getElementById("empty-table-row")

    if(empty)
        empty.remove()

    cel1.innerHTML = doctor.name;
    cel2.innerHTML = doctor.email;
    
    doctor.doctor_specialties.forEach((specialty, idx) => {
        
        cel3.innerHTML += specialty.specialty || specialty;
        
        if(idx !== doctor.doctor_specialties.length - 1){
            cel3.innerHTML += ',';
        }
    })

    cel3.style.fontSize = "10px"

    cel4.innerHTML = `<input type="button" name="Del" value="Delete" onclick="delStudent('${doctor.name}', '${doctor.email}', this.parentNode.parentNode);" class="btn btn-danger">`;
}

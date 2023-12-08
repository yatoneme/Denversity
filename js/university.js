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
            }).then(res => res.json()).then(data => {
                const { university, doctors } = data

                if(!university){
                    window.location.href = "universitylogin.html"
                    return
                }

                window.loggedInUniversity = university

                renderDoctorsTable(doctors)
            }).catch(e => {
                console.error(e)
                setNotification(false, 'Sorry, and error has occured!')
            })
        })
    })
}

function renderDoctorsTable(doctors) {    
    const tbody = document.getElementById("std_data-body")
    const empty = document.getElementById('empty-table-row')

    if(empty)
        empty.remove()

    if(!doctors)
    {
        const table_container = document.getElementsByClassName('std_data_table')[0]
        const no_data = document.createElement('p')

        table_container.appendChild(no_data)
        no_data.innerHTML = "No doctors are added yet!"
        no_data.id = "empty-table-row"
        return
    }
    console.log(doctors);
    doctors.forEach(doctor => {
        const newRow = tbody.insertRow(0);
        const cel1 = newRow.insertCell(0);
        const cel2 = newRow.insertCell(1);
        const cel3 = newRow.insertCell(2);
        const cel4 = newRow.insertCell(3);
    
        cel1.innerHTML = doctor.name;
        cel2.innerHTML = doctor.email;
        cel3.innerHTML = "*****";
        cel4.innerHTML = '<input type="button" name="Del" value="Delete" onclick="delStudent(this.parentNode.parentNode);" class="btn btn-danger">';
    })
}

function savedata() {
    event.preventDefault();

    const tbody = document.getElementById("std_data-body")
    const currentIndex = tbody.childNodes.length;
  
    const doctor = {
      name: document.getElementById("sname").value,
      email: document.getElementById("semail").value,
      university: window.loggedInUniversity.name,
      password: document.getElementById("spassword").value
    };
    
    storeNewDoctor(doctor).then(() => {
        const newRow = tbody.insertRow(currentIndex);
        const cel1 = newRow.insertCell(0);
        const cel2 = newRow.insertCell(1);
        const cel3 = newRow.insertCell(2);
        const cel4 = newRow.insertCell(3);

        cel1.innerHTML = doctor.name;
        cel2.innerHTML = doctor.email;
        cel3.innerHTML = "*****";
        cel4.innerHTML = '<input type="button" name="Del" value="Delete" onclick="delStudent(this.parentNode.parentNode);" class="btn btn-danger">';
        document.getElementById("regform").reset();
        setNotification(true, `${doctor.email} is added`)        
    }, (reason_not_stored) => {
        if(reason_not_stored === 409)
            setNotification(false, 'Email already exists!')
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
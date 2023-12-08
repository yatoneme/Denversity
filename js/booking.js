window.onload = () => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const category = params.get('cat')

    if(!category){
        window.location.href = "categories.html";
    }

    const caseType = document.getElementById("header-case-type")
    caseType.innerHTML = "Type: " + localStorage.getItem('currentCategory')

    fetch('http://localhost:3000/universities', {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json()).then(data => renderUniversityList(data))
}

function renderUniversityList({ data }) {
    const uniList = document.getElementById('uni-options')
    data.map(({ name, link, address }, idx) => {
        const uniOption = document.createElement('option')
        uniOption.value = name
        uniOption.title = name + ": " + address
        uniOption.innerHTML = name

        uniList.appendChild(uniOption);
    })
}

var sub=document.getElementById("sub");

sub.addEventListener("click",sendform);

function sendform(e){ //should send form data to doctors.html and display it in a paragraph in the pending column
    e.preventDefault();
    sub.disabled = true;

    const appointment = {
        "fullname": document.getElementById("name").value,
        "email": document.getElementById("email").value,
        "phone": document.getElementById("number").value,
        "birthday": document.getElementById("bd").value,
        "appointment_date": document.getElementById("appointment-date").value,
        "gender": document.getElementById("check").value,
        "time": document.getElementById("timee").value,
        "university_name": document.getElementById("uni-options").value,
        "problem_description": document.getElementById("notes").value,
        "problem_category": localStorage.getItem('currentCategory'),
        "on_queue": true
    }

    fetch('http://localhost:3000/appointment', {
        method: "POST",
        body: JSON.stringify(appointment),
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json()).then(data => {
        setNotification(data)

        if(!data)
            sub.disabled = false;
        else
            window.location.href = 'front.html?successfulAppointment=1';
    })

    return false;
}

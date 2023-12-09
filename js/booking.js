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

    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()
    const dayNextMonth = new Date(year, month, day).getDate()
    const nextMonth = new Date(year, month, day).getMonth() + 1
    const nextYear = new Date(year, month, day).getFullYear()

    document.getElementById("appointment-date").min = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
    document.getElementById("appointment-date").max = `${nextYear}-${nextMonth < 10 ? `0${nextMonth}` : nextMonth}-${dayNextMonth < 10 ? `0${dayNextMonth}` : dayNextMonth}`
    document.getElementById("bd").max = `${year - 1}-01-01`
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



function sendform(e){
    const sub = document.getElementById("sub");
    sub.disabled = true;

    const appointment = {
        "fullname": document.getElementById("name").value,
        "email": document.getElementById("email").value,
        "phone": document.getElementById("number").value,
        "birthday": document.getElementById("bd").value,
        "appointment_date": document.getElementById("appointment-date").value,
        "gender": document.querySelector("input[name='gender']:checked").value,
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
    }).then(res =>  {
        sub.disabled = false;
        if(!res.ok){
            sub.disabled = false;
            return false;
        }
        else
            window.location.href = 'front.html?successfulAppointment=1';
    }).catch(e => false)

    return false
}

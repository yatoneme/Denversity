window.onload = () => { 
    const queryString = window.location.search;    // Get the query string parameters from the current URL

    const params = new URLSearchParams(queryString);  // Get the value of the 'cat' parameter from the query string

    const category = params.get('cat')
        // Get the value of the 'currentCategory' from the localStorage

    const caseT = localStorage.getItem('currentCategory')
    // If the 'cat' parameter is not present in the query string, redirect to "categories.html"

    if(!category) // If the 'cat' parameter is not present in the query string, the code redirects the user to "categories.html."
        window.location.href = "categories.html"; 

    const caseType = document.getElementById("header-case-type")
    caseType.innerHTML = "Type: " + caseT // assign 3mleya type for booking page

    fetch('http://localhost:3000/universities', { // fetch clinics from db
        method: "GET", 
        mode: "cors",
        headers: {
            "Content-Type": "application/json" // 
        }
    }).then(res => res.json()).then(data => renderUniversityList(data))

    // Min values
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1 // index start from 0
    const day = new Date().getDate() + 1 // min value is tmrw

    // Max values, within a month
    const dayNextMonth = new Date(year, month, day).getDate()
    const nextMonth = new Date(year, month, day).getMonth() + 1
    const nextYear = new Date(year, month, day).getFullYear()

    document.getElementById("appointment-date").min = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
    document.getElementById("appointment-date").max = `${nextYear}-${nextMonth < 10 ? `0${nextMonth}` : nextMonth}-${dayNextMonth < 10 ? `0${dayNextMonth}` : dayNextMonth}`

    // Only youth ( <= 16 y.o ).
    if(caseT === "Pediatric dentistry"){
        document.getElementById("bd").max = `${year - 1}-01-01`
        document.getElementById("bd").min = `${year - 16}-01-01` // max 16 yrs old
    } else {
        // Only above 16 years old.
        document.getElementById("bd").max = `${year - 15}-01-01`
    }


}

function renderUniversityList({ data }) { // render universties option list
    const uniList = document.getElementById('uni-options')
    data.map(({ name, link, address }, idx) => {
        const uniOption = document.createElement('option')
        uniOption.value = name
        uniOption.title = name + ": " + address
        uniOption.innerHTML = name

        uniList.appendChild(uniOption);
    })
}



function sendform(e){ //submit booking form 
    const sub = document.getElementById("sub");
    sub.disabled = true;

    const appointment = { //send values to backend to store in db
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

    fetch('http://localhost:3000/appointment', { // post data to backend
        method: "POST",
        body: JSON.stringify(appointment),
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res =>  { 
        sub.disabled = false; // manage spamming
        if(!res.ok)
            return false;
        else
            window.location.href = 'front.html?successfulAppointment=1'; // button is not clicked yet
    }).catch(e => false)

    return false
}

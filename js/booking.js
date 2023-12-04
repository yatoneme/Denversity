window.onload = () => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const category = params.get('cat')

    if(!category){
        window.location.href = "categories.html";
    }

    const caseType = document.getElementById("header-case-type")
    caseType.innerHTML = "Type: " + localStorage.getItem('currentCategory')
}

var sub=document.getElementById("sub");
sub.addEventListener("click",sendform);
function sendform(e){ //should send form data to doctors.html and display it in a paragraph in the pending column
    e.preventDefault();
    sub.disabled = true;

    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);

    // where is date of appointment ?
    // where is doctors page ?
    // where is doctors registeration page ?
    const appointment = {
        "fullname": document.getElementById("name").value,
        "email": document.getElementById("email").value,
        "phone": document.getElementById("number").value,
        "birthday": document.getElementById("bd").value,
        "gender": document.getElementById("check").value,
        "time": document.getElementById("timee").value,
        "university_name": document.getElementById("uni").value,
        "problem_description": document.getElementById("notes").value,
        "problem_category": localStorage.getItem('currentCategory')
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
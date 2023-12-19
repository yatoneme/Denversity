var logoImage = document.getElementById('logoImage');
logoImage.addEventListener('click', function() { 
    window.location.href = 'front.html';
});

window.onload = () => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    
    // Check if the user is redirected from another page, with successfulAppointment 
    if(params.get('successfulAppointment') && document.referrer !== '' && document.referrer !== window.location.href)
        setNotification(true)

    fetch('http://localhost:3000/universities', {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json()).then(data => renderUniversities(data))
}

function renderUniversities({ data }) {
    const uniList = document.getElementsByClassName('university-list')[0]
    data.forEach(({ name, link }, idx) => {
        const cell = document.createElement('li')
        const uniLink = document.createElement('a')

        uniLink.href = `clinics_details/${link}`
        uniLink.target = "_blank"
        uniLink.innerHTML = name

        cell.appendChild(uniLink);
        uniList.appendChild(cell);
    })
}




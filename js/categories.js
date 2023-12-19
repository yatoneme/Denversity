window.onload = () => {
    fetch('http://localhost:3000/categories', {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json()).then(data => renderCategoryPage(data))
}

function renderCategoryPage({ data }) {
    const catBody = document.getElementsByClassName("categoriesbody")[0]

    data.forEach(({ name, description }, idx) => {
        const cell = document.createElement('div')        
        const title = document.createElement('h2')
        const descr = document.createElement('p')
        const btn = document.createElement('button')
        const bookLink = document.createElement('a')

        cell.className = "card card-" + (idx+1);
        btn.className = "btn"
        btn.innerHTML = "Book now"

        btn.onclick = e => {
            localStorage.setItem('currentCategory', name)
        }

        bookLink.href = "booking.html?cat=" + name;
        title.innerHTML = name;
        descr.innerHTML = description;

        cell.appendChild(title);
        cell.appendChild(descr);
        bookLink.appendChild(btn);
        cell.appendChild(bookLink);
        catBody.appendChild(cell);
    })
}
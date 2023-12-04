function setNotification(data) {
    const notification = document.getElementById("notification");
    notification.querySelector("#text").innerHTML = 
    data ? "Appointment is successfully sent!" : "Sorry, an error has occured"

    notification.dataset.status = data ? "success" : "failed"
    if(!data)
        setTimeout(() => {
            notification.dataset.status = ""
        }, 3000)
}

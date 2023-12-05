const defaultText = {
    success: "Appointment is successfully sent!",
    fail: "Sorry, an error has occured"
}

function setNotification(data, text) {
    const notification = document.getElementById("notification");
    notification.querySelector("#text").innerHTML = 
    text ? text : data ? defaultText.success : defaultText.fail

    notification.dataset.status = data ? "success" : "failed"
    if(!data)
        setTimeout(() => {
            notification.dataset.status = ""
        }, 3000)
}

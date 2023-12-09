const defaultText = {
    success: "Appointment is successfully sent!",
    fail: "Sorry, an error has occured"
}

function setNotification(data, text) {
    const notification = document.getElementById("notification");
    const notiText = notification.querySelector("#text")
    notiText.innerHTML = 
    text ? text : data ? defaultText.success : defaultText.fail

    notification.dataset.status = data ? "success" : "failed"

    // Reset animation
    notification.style.animation = 'none';
    notiText.style.animation = 'none';

    setTimeout(function() {
        notiText.style.animation = '';
        notification.style.animation = '';
    }, 10);
}

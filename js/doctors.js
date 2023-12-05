window.onload = () => {
    firebase.auth().onAuthStateChanged( user => {
        if(!user)
            window.location.href = "signin.html"
        
    })
}
function login() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    if (email === "") {
        alert("Please Enter Email");
        return;
    }
    else if (password === "") {
        alert("Please Enter Password");
        return;
    }
    else {
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
            window.location.href = "doctors.html"
        }).catch(function(error) {
            switch(error.code){
                case 'auth/invalid-email':
                case 'auth/invalid-login-credentials':
                    setNotification(false, 'Invalid email or password')
                    break;
                default:
                    setNotification(false, 'Sorry, an error has occured')
                    break;
            }
        });
    }
}
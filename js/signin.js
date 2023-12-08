function login(role, redirectPage) {
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
        firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
            firebase.auth().currentUser.getIdToken(true).then(token => {
                fetch('http://localhost:3000/check-role', {
                    method: "POST",
                    body: JSON.stringify({
                        userId: token,
                        role
                    }),
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(res => {
                    if(!res.ok)
                        return setNotification(false, 'Invalid email or password')
    
                    window.location.href = redirectPage
                })

            })
        }).catch(error => {
            switch(error.code){
                case 'auth/invalid-email':
                case 'auth/invalid-login-credentials':
                    setNotification(false, 'Invalid email or password')
                    break;
                default:
                    setNotification(false, 'Sorry, an error has occured')
                    break;
            }
        })
    }
}

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
    if (email === "drdr@mail.com" && password === "1111") {
        window.location.replace("doctors.html");
    }
    else {
        alert("Wrong Email and Password");
    }
}
document.getElementById("name").value = "";
                document.getElementById("email").value = "";
                document.getElementById("number").value = "";
                document.getElementById("bd").value = "";
                document.getElementById("check").value = "";
                document.getElementById("uni").value = "";
                document.getElementById("notes").value = "";
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
document.getElementById("timee").value="";

function popup(){
alert('Submitted Succesfully')
}

var data=[];
var n=1;
var x=0;
function sendform(){ //should send form data to doctors.html and display it in a paragraph in the pending column
var addcell=document.getElementById('form')
var fullname=document.getElementById("name")
var email=document.getElementById("email")
var phone=document.getElementById("number")
var bday=document.getElementById("bd")
var gender=document.getElementById("check")
var time=document.getElementById("timee")
var uni=document.getElementById("uni")
var notes=document.getElementById("notes")
}
function showapptname(){ //should show case name on top of the booking page
   //windowlocation.href="/categories.html"+ev.target.innerhtml
}
function acceptappt(){ //checkmark for accepting appts

}
function completeappt(){ //checkmark for completion

}
// optional functions
// deleteappt()
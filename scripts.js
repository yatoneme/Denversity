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
function popup(){
alert('Submitted Succesfully');
};
sub.addEventListener("click", function(){ window.location.replace("front.html");});

var sub=document.getElementById("sub");
sub.addEventListener("click",sendform);
var data=[name,email,number,bd,check,timee,uni,notes];
var row=1;
function sendform(){ //should send form data to doctors.html and display it in a paragraph in the pending column
var fullname=document.getElementById("name").value;
var email=document.getElementById("email").value;
var phone=document.getElementById("number").value;
var bday=document.getElementById("bd").value;
var gender=document.getElementById("check").value;
var time=document.getElementById("timee").value;
var uni=document.getElementById("uni").value;
var notes=document.getElementById("notes").value;
var taable=document.getElementById("taable");
var nRow=taable.insertRow(row);
var cell=nRow.insertCell(0);
cell.innerTHML=document.getElementById[name,email,number,bd,check,timee,uni,notes];
row++;
}
function showapptname(){ /*should show case name on top of the booking page
   window.location.href="/categories.html"+ev.target.innerhtml
*/
let aptname= document.getElementById()
};
function acceptappt(){ //checkmark for accepting appts

};
function completeappt(){ //checkmark for completion

};
// optional functions
// deleteappt()
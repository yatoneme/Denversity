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
function unilogin() {
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
    if (email === "uni@mail.com" && password === "1534") {
        window.location.replace("university.html");
    }
    else {
        alert("Wrong Email and Password");
    }
}

var studentData = [];

function savedata() {
  event.preventDefault();

  var AddRown = document.getElementById('std_data');
  var currentIndex = studentData.length;

  var student = {
    name: document.getElementById("sname").value,
    number: document.getElementById("snumber").value,
    email: document.getElementById("semail").value,
    password: document.getElementById("spassword").value
  };

  studentData.push(student);

  var NewRow = AddRown.insertRow(currentIndex + 1);

  var cel1 = NewRow.insertCell(0);
  var cel2 = NewRow.insertCell(1);
  var cel3 = NewRow.insertCell(2);
  var cel4 = NewRow.insertCell(3);
  var cel5 = NewRow.insertCell(4);

  cel1.innerHTML = student.name;
  cel2.innerHTML = student.number;
  cel3.innerHTML = student.email;
  cel4.innerHTML = student.password;
  cel5.innerHTML = '<input type="button" name="Del" value="Delete" onclick="delStudent(this.parentNode.parentNode);" class="btn btn-danger">';
  
  document.getElementById("regform").reset();
}

function delStudent(rowToDelete) {
  var index = rowToDelete.rowIndex - 1;
  studentData.splice(index, 1);
  rowToDelete.parentNode.removeChild(rowToDelete);
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
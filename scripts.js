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
    // alert('Submitted Succesfully');
};
// sub.addEventListener("click", function(){ window.location.replace("front.html");});

// var data=[name,email,number,bd,check,timee,uni,notes];
var row=1;

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



// const firebaseConfig = {
//     apiKey: "AIzaSyDjy4NSv68_sufMAP5yLw0j8zCt7JzMxeI",
//     authDomain: "restaurant-803b1.firebaseapp.com",
//     projectId: "restaurant-803b1",
//     storageBucket: "restaurant-803b1.appspot.com",
//     messagingSenderId: "852933597028",
//     appId: "1:852933597028:web:290277457034f5a74b4c71",
//     measurementId: "G-Q7Y9M5BKK4"
// };

// const app = firebase.initializeApp(firebaseConfig);
// const db = app.firestore();
// db.settings({ timestampsInSnapshots: true });
// const plates = db.collection('plates');
// const platesAdded = []
// // CRUD - Create Read Update Delete // 4 operations
// // read
// const platesDocument = plates.get().then(initPlates);


// // get one document by id
// //        plates.doc(platesAdded[0].id)


// // function sum(a,b, callback){
// //     callback(a+b);
// // }
// // function print(val){
// //     console.log(val);
// // }

// // sum(a, b, print);
// function initPlates(documents){
// documents.docs.forEach(document => {
//     const newPlate = {
//         ...document.data(),
//         id: document.id
//     };

//     platesAdded.push(newPlate);
//     console.log(document.data());
//     console.log(document.id);
//     // display on table or anything...
// });

// // create
// const newPlate = {
//     price: 50,
//     name: 'Pizza',
//     size: 'large',
//     currency: '$',
// };

// // plates.add(newPlate)

// // update
// plates.doc(platesAdded[5].id).update({
//     price: 5,
//     name: 'Pizza',
//     size: 'small',
//     currency: '$',
// });

// // delete
// // plates.doc(platesAdded[5].id).delete();
// }

window.onload = () => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);

    if(params.get('successfulAppointment') && document.referrer != ''){
        setNotification(true)
    }
}
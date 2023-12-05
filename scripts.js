
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

    
    if(params.get('successfulAppointment') && document.referrer !== '' && document.referrer !== window.location.href){
        setNotification(true)
    }

    fetch('http://localhost:3000/universities', {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json()).then(data => renderUniversities(data))
}

function renderUniversities({ data }) {
    const uniList = document.getElementsByClassName('university-list')[0]
    data.map(({ name, link }, idx) => {
        const cell = document.createElement('li')
        const uniLink = document.createElement('a')

        uniLink.href = link
        uniLink.target = "_blank"
        uniLink.innerHTML = name

        cell.appendChild(uniLink);
        uniList.appendChild(cell);
    })
}
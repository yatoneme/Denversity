const admin = require("firebase-admin");
const { initializeApp } = require('firebase-admin/app');
var serviceAccount = require("../save-me.json");

const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount)
};

module.exports = {
    initializeFirebase: () => initializeApp(firebaseConfig)
};
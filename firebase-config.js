
var admin = require("firebase-admin");

var serviceAccount = require("./we-chat-fa031-e8b2ac1a848a.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://we-chat-fa031.firebaseio.com"
})
console.log(serviceAccount)
module.exports.admin = admin
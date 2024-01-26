
const firebase = require('firebase-admin')
const serviceAccount = require('./we-chat-fa031-e8b2ac1a848a.json')
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://we-chat-fa031.firebaseio.com'
    })

const registrationToken = 'fX7zUmqV1wtpWAqJPRaPZb:APA91bEUHfQ0e8n4GSsMoD4OXmQ-Hy6ZzXbL-wihBt1m0UfR5U8ZKFBJZKxSrRgxcepHPstFuVwHB-CuVe3vwVtIdLES236-nfG1qOXnLVhhJalWOZalslqWJdcWrfmvDAThiBW1ozlU';

const message = {
  data: {
    score: '850',
    time: '2:45'
  },
  token: registrationToken
};

// Send a message to the device corresponding to the provided
// registration token.
firebase.getMessaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
module.exports= {firebase}
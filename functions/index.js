
// Initialize Firebase
var firebase = require("firebase");
var functions = require('firebase-functions');
var admin=require('firebase-admin');

var config = {
    
    apiKey: "AIzaSyA_Rlm_vczdAvtIaLVKU3RettwjmbNNx10",
    authDomain: "td-dev-1086b.firebaseapp.com",
    databaseURL: "https://td-dev-1086b.firebaseio.com",
    projectId: "td-dev-1086b",
    storageBucket: "td-dev-1086b.appspot.com",
    messagingSenderId: "744066468477"
};
admin.initializeApp(functions.config().firebase);
const ref=admin.database().ref();

firebase.initializeApp(config);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.sanitizePost=functions.database.ref('/posts/{pushId}').onWrite(event => {
//     const post=event.data.val()
//     if(post.sanitized){
//         return
//     }
//     console.log("sanitized new post"+event.params.pushId)
//     console.log(post)
//     post.sanitized=true
//     console.log("main",post)
//     post.title=sanitize(post.title)
//     post.body=sanitize(post.body)
//     return event.data.ref.set(post)
// })
exports.signUpWithEmailAndPassword=functions.https.onRequest((request,response)=>{
    const auth=firebase.auth();
     const promise=auth.createUserWithEmailAndPassword(request.body.username,request.body.password);
     promise.then(output =>{
         return response.send("you are signed up")
     })
    promise.catch(error =>{
        console.log("signup",error)
        return response.status(400).send("signup failled")
    })
    
    if (request.method === 'PUT') {
        response.status(403).send('Forbidden!');
  }
})
exports.signInWithEmailAndPassword=functions.https.onRequest((request,response)=>{
    const auth=firebase.auth();
    //const email=request.body.email;
    //const displayName='hady';
     const promise=auth.signInWithEmailAndPassword(request.body.username,request.body.password);
     promise.then(output =>{
        console.log(output.uid);
        const uid=output.uid;
        const email=output.email;
        let newUserRef=ref.child('/users/'+uid);
        // Attach an asynchronous callback to read the data at our posts reference
  return      newUserRef.once("value", function(snapshot) {
            let returnedValues=snapshot.val()
            returnedValues.counterIncremented=false
  console.log('snapshot',snapshot.val());

if(typeof returnedValues.counter !=='number'){
    returnedValues.counter=0
}
let counter=returnedValues.counter;
if(!returnedValues.counterIncremented){
    counter++
    returnedValues.counterIncremented=true
}

           return   newUserRef.update({
            counter:counter
                       // displayName:displayName
      //displayName:displayName
  }).then(()=>{
          return response.send(" logged in");

  })

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
        })
    
})


// admin.database().ref("-Users/Oer5c1NxFOVw5DpzN4miuu7j2").update({ AccessDate: formattedDate });

// exports.signedIn=functions.database.ref('/users/{id}').onWrite(event=>{
//     const user=event.data.val();
//     // if(user.counterIncremented){
//     //     console.log("user.counterIncremented"+user.counterIncremented)
//     //      return
//     //     }
//     console.log(user.email+" just looged in "+event.params.pushId);
//     console.log(user);
     
//     // user.counterIncremented=true;
//     // user.counter++;
//     return event.data.ref.set(user);
// })

exports.createProfile = functions.auth.user().onCreate( event => {
  // Do something after a new user account is created
  //counter=0
  //console.log("User created: " + JSON.stringify(event));
  const user=event.data;
  //user.counter=0;
  //const counter=user.counter;
  console.log(user)
   console.log('id',user.id)
    console.log('uid',user.uid)
const uid=user.uid;
  const email=user.email;
  //const displayName=user.displayName;
//   const photoUrl=user.photoUrl;
  const newUserRef=ref.child('/users/'+uid)
  return newUserRef.set({
    //   photoUrl: photoUrl,
      email:email,
      //displayName:displayName

  })

});

function sanitize(s){
    console.log("inside the function",s)
    var sanitizedText=s
    sanitizedText=sanitizedText.replace(/\bstupid\b/ig,"wonderful")
    return sanitizedText
}

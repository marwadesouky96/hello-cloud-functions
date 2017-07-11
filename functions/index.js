const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.sanitizePost=functions.database
.ref('/posts/{pushId}')
onWrite(event => {
    const post=event.data.val()
    if(post.sanitized){
        return
    }
    console.log("sanitized new post"+event.params.pushId)
    console.log(post)
    post.sanatized=true
    post.title=sanitize(post.title)
    post.body=sanitize(post.body)
    return event.data.ref.set(post)
})
function sanitize(s){
    var sanitizedText=s
    sanitizedText=sanitizedText.replace(/\bstupid\b/ig,"wonderful")
    return sanitizedText
}
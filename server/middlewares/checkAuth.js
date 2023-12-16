const { getFirestore } = require('firebase-admin/firestore')
const { getAuth } = require('firebase-admin/auth')

const checkAuth = (req, res, next) => {
    const { userId } = req.body

    getAuth().verifyIdToken(userId).then(user => {
        if(user.uid)
        {
            // User is attached to request for future use!
            req.user = user

            return next()
        }
        else
            res.sendStatus(400);
    }).catch(e => {
        console.error(e.code);
        res.sendStatus(400);
    })
}

const checkRole = (req, res, next) => {
    const { role } = req.body
    const { email } = req.user

    const db = getFirestore()
    const roleCollection = role === "doctor" ? 'doctors' : "university"
    const collection = db.collection(roleCollection)

    collection.where("email", "==", email).limit(1).get().then(user => {
        if(user.empty)
            return res.sendStatus(400);
    
        return next()
    }).catch(e => {
        console.error(e.code);
        res.sendStatus(400);
    })
}

module.exports = {
    checkAuth,
    checkRole
}
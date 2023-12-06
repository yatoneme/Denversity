const { getAuth } = require('firebase-admin/auth')

module.exports = (req, res, next) => {
    const { userId } = req.body

    getAuth().verifyIdToken(userId).then(user => {
        if(user.uid)
        {
            console.log(`user: ${user.email} is authenticated!`);
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
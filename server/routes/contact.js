const express = require('express')
const Contact = express.Router()
const sendMailToMe = require('../utility/sendMailToMe')

Contact.post('/', (req, res) => {
    const {fullname,phone,email,message}=req.body

    sendMailToMe(`${fullname} has sent his feedback!`, {
        fullname,
        phone,
        email,
        message
    }, error => {
        if(!error)
            return res.sendStatus(200)

        return res.sendStatus(500)
    })

})

module.exports = Contact;

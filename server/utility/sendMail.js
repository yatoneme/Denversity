const fs = require('node:fs')
const nodemailer = require('nodemailer')

const readMail = (type, data) => {
    let html = fs.readFileSync(`./public/${type}.html`, 'utf8')
    const regx = new RegExp(/"\((\w+)\)"/g)
    const replacements = Array.from(html.matchAll(regx))

    replacements.forEach(replacement => {
        const key = replacement[1]
        const value = data[key]
        const to_replace = replacement[0]

        html = html.replace(`${to_replace}`, value)
    })

    return html
}

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "denversity.noreply@gmail.com",
      pass: "yjnd rdra tnqk tnlk",
    },
});

const sendMail = (title, type, data, done) => {
    const mailOptions = {
        from: "denversity.noreply@gmail.com",
        to: data.patient_email,
        subject: title,
        html: readMail(type, data),
        attachments: [{
            filename: 'logoo.png',
            path: '../images/logoo.png',
            cid: 'logo'
        }]
    };
    
    transporter.sendMail(mailOptions, (error, info) => done(error));
}

module.exports = sendMail

const nodemailer = require('nodemailer')

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

const sendMailToMe = (title, data, done) => {
    const mailOptions = {
        from: "denversity.noreply@gmail.com",
        to: "denversity.noreply@gmail.com",
        subject: title,
        html: `<html>
            <body>
                <p>name: ${data.fullname}</p>
                <p>email: ${data.email}</p>
                <p>phone: ${data.phone}</p>
                <p>message: ${data.message}</p>
            </body>
        </html>`,
    };
    
    transporter.sendMail(mailOptions, (error, info) => done(error));
}

module.exports = sendMailToMe
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: '126',
    auth: {
        user: 'lipper251645731@126.com',
        pass: 'lipper251645731'
    }
});

exports.send = function (mailOptions) {
    mailOptions = mailOptions ? mailOptions : {
        from: '"lipper251645731" <lipper251645731@126.com>', // login user must equel to this user  
        to: '251645731@qq.com',
        subject: 'Title Nodejs Send',
        text: 'Some simple words.',
        html: '<b>The main content of the mail. You have successfully logged in to Nodejs.</b>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}
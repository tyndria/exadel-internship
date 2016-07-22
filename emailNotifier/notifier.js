var nodemailer = require('nodemailer');

class MessageNotifier{

    static sendNotificationEmail(user, message) {
        // Not the movie transporter!
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'austenlangnotify@gmail.com', // Your email id
                pass: 'notifyaustenlang' // Your password
            }
        });
        var mailOptions = {
            from: 'austenlangnotify@gmail.com>', // sender address
            to: user.mail, // list of receivers
            subject: 'Austen lang nonify service', // Subject line
            text: message //, // plaintext body
            // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
        };


        transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        };
    });
    };
}

module.exports = MessageNotifier;

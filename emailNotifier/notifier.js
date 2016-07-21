var nodemailer = require('nodemailer');


function sendNotificationEmail(user, res) {
    // Not the movie transporter!
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'austenlangnotify@gmail.com', // Your email id
            pass: 'notifyaustenlang' // Your password
        }
    });
    var text = 'Hello from austenlangn';
    var mailOptions = {
        from: 'austenlangnotify@gmail.com>', // sender address
        to: user.mail, // list of receivers
        subject: 'Austen lang nonify service', // Subject line
        text: text //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };


    transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
    };
});
}
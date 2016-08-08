var nodemailer = require('nodemailer');
var fs = require('fs');
var _jade = require('jade');
var htmlToText = require('nodemailer-html-to-text').htmlToText;


class MessageNotifier{

    static getHTML() {
        var template = process.cwd() + '/views/index.jade';

        fs.readFile(template, 'utf8', function(err, file){
            if(err){
                console.log('ERROR!');
                return res.send('ERROR!');
            }
            else {
                  //compile jade template into function
                var compiledTmpl = _jade.compile(file, {filename: template});
                  // set context to be used in template
                var context = {title: 'Express'};
                  // get html back as a string with the context applied;
                var html = compiledTmpl(context);
                console.log(html);
                return html.toString();
            }
        });
    }

    static sendNotificationEmail(user, message) {
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'austenlangnotify@gmail.com', // Your email id
                pass: 'notifyaustenlang' // Your password
            }
        });
        transporter.use('compile', htmlToText());

        var mailOptions = {
            from: 'austenlangnotify', // sender address
            to: user.mail, // list of receivers
            subject: 'Austen lang nonify service', // Subject line
            text: 'hello',
            html: MessageNotifier.getHTML()
        };
        console.
         transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                return console.log(err);
            } else {
                console.log(info);
            }
         });
    };
}




module.exports = MessageNotifier;

var nodemailer = require('nodemailer');
var fs = require('fs');

class MessageNotifier{


    constructor() {
         var template = process.cwd() + '/views/index.jade';

  // get template from file system
          fs.readFile(template, 'utf8', function(err, file){
            if(err){
              //handle errors
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

              sendMail(TO_ADDRESS, 'test', html, function(err, response){
                if(err){
                  console.log('ERROR!');
                  return res.send('ERROR');
                }
                res.send("Email sent!");
              });
            }
          });
    }

    static sendNotificationEmail(user, message, content) {
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'austenlangnotify@gmail.com', // Your email id
                pass: 'notifyaustenlang' // Your password
            }
        });
        var mailOptions = {
            from: 'austenlangnotify', // sender address
            to: user.mail, // list of receivers
            subject: 'Austen lang nonify service', // Subject line
            text: message,
            html: content
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

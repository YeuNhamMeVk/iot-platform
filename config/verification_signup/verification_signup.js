module.exports = function(req){

const crypto = require('crypto');
const async = require('async');
const User = require('./../../models/users');
const nodemailer = require('nodemailer');
const flash = ('connect-flash');

  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ 'email': req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/');
        }
        console.log(user)
        user.verifyToken = token;
        user.verifyExpires = Date.now() + 3600000;

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var Transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'gabatorii3@gmail.com',
          pass: 'gaba@123!'
        }
      });
      var mailOptions = {
          to: user.email,
          subject: 'Confirm IoT account!',
          text: 'Hello ' + user.username + '!.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/register/' + token + '\n\n' +
          'If you did not request this, please ignore this email. bye\n'
          };
      Transporter.sendMail(mailOptions, function(err,info) {

        if(err){
            console.log(err)
        }else{

            console.log('Email sent: '+ info.response);
            req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        }
      });
    }
    ]
    );
}
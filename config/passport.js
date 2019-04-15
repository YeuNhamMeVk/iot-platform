// Config for Passport login and register
let LocalStrategy = require('passport-local').Strategy;
let User = require('./../models/users'); // database

const { check, validationResult } = require('express-validator/check');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with username
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) {
        // callback with username and password from our form
        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
            User.findOne({
                'username': username
            }, function (err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // if user is not verification
                if(user.isVerified!=true)
                    return done(null, false, req.flash('loginMessage', 'Your account is not verification!'));
                // all is well, return successful user
                return done(null, user);
            });

        }));

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            check('password').isLength({min : 5})
            console.log('123: '+validationResult(password).isEmpty())
            // if (!validationResult(req).isEmpty())
            //     return done(null, false, req.flash('signupMessage', 'type right email and Length of pw is than 5'));
            process.nextTick(function () {
                User.findOne({
                    'username': username,
                }, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) 
                        return done(null, false, req.flash('signupMessage', 'username existed.'));
                    else {
                        User.findOne({
                            'email': req.body.email
                        }, function(err,email){
                            if (err) 
                                return done(err)
                            if (email)
                                return done(null, false, req.flash('signupMessage', 'email existed.'));
                            else{
                                
                                let newUser = new User();
                                newUser.email = req.body.email;
                                newUser.username = username;
                                newUser.password = newUser.generateHash(password);
                                newUser.role = 'user';
                                newUser.isVerified = false;
                                newUser.save(function (err) {
                                    require('./verification_signup/verification_signup')(req)
                                });
                                return done(null, false, req.flash('signupMessage','Access your email to comfirm!'));
                            }
                        })
                    }
                });
            }

            );
        
        })
    );
};

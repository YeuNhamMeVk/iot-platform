module.exports = function (router, passport) {
    // Import modules
    const crypto = require('crypto');
    const async = require('async');
    const User = require('./../models/users');
    const nodemailer = require('nodemailer');
    const flash = ('connect-flash');

    const { sanitizeBody } = require('express-validator/filter');
    const { check, validationResult } = require('express-validator/check');


    /* GET home page. */
    router.get('/', function (req, res, next) {
        res.render('pages/index', {title: 'LHV IoT Platform'});
    });

    /* GET home page. */
    router.get('/home', function (req, res, next) {
        res.render('pages/home', {title: 'LHV IoT - Home'});
    });


    /* GET register page. */
    router.get('/register', function (req, res, next) {
        res.render('pages/register', {
            title: 'LHV IoT - Register',
            message: req.flash('signupMessage')
        });
    });

    /* POST register page */
    // router.post('/register', [ check('email').isEmail(),check('password').isLength({min : 8})], function(req, res){
    //         if (!validationResult(req).isEmpty()){
    //             req.flash('signupMessage','Wrong pass or email!')
    //             res.redirect('/register')
    //         } else {
    //             passport.authenticate('local-signup', {
    //             successRedirect: '/profile', // Điều hướng tới trang hiển thị sigup de confirm
    //             failureRedirect: '/signup', // Trở lại trang đăng ký nếu lỗi
    //             // failureFlash: true
    // })
    //         }
    //     }
    //     );
        /* POST register page */
    router.post('/register', passport.authenticate('local-signup', {
                successRedirect: '/register', // Điều hướng tới trang hiển thị sigup de confirm
                failureRedirect: '/login', // Trở lại trang đăng ký nếu lỗi
                // failureFlash: true
    })
        );

    // GET register verification
    router.get('/register/:token', function (req, res, next) {
        require('./verifycation_signup/verification')(req, res, User)
    })

    /* GET log in page. */
    router.get('/login', function (req, res, next) {
        res.render('pages/login', {
            title: 'LHV IoT - Log in',
            message: req.flash('loginMessage')
        });
    });

    /* POST login page */
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    }));


    

    /* GET forgot-password page. */
    router.get('/forgot-password', function (req, res, next) {
        res.render('pages/forgot-password', {title: 'LHV IoT - Forgot password',message: req.flash('ForgotpassMessage')});
    });

    // POST forgot-password.
    router.post('/forgot-password', [check('email').isEmail()], function(req, res, next) {
        if(!validationResult(req).isEmpty()){
            console.log(validationResult(req).isEmpty())
            req.flash('ForgotpassMessage','type an email!')
            res.redirect('/forgot-password')
        }
        else{
            require('./reset_pass/sendmail')(req,res);
        }
    })

    // GET reset password
    router.get('/forgot-password/:token', function(req, res, next) {
        require('./reset_pass/formresetpass')(req,res,User)
    })

    //POST reset password
    router.post('/forgot-password/:token',function(req, res, next) {
        require('./reset_pass/resetpass')(req,res,User)
    })

    /* GET Error 500 page. */
    router.get('/500', function (req, res, next) {
        res.render('pages/500', {title: 'LHV IoT - 500'});
    });

    /* GET Error 404 page. */
    router.get('/404', function (req, res, next) {
        res.render('pages/404', {title: 'LHV IoT - 404'});
    });

    /* GET dashboard page. */
    router.get('/dashboard', function (req, res, next) {
        res.render('dashboard/dashboard', {title: 'LHV IoT - Dashboard'});
    });

    /* GET add user page. */
    router.get('/users', function (req, res, next) {
        res.render('users/users', {title: 'LHV IoT - Add User'});
    });

    /* GET devices page. */
    router.get('/all-devices', function (req, res, next) {
        res.render('devices/all', {title: 'LHV IoT - All Devices'});
    });

    /* GET devices page. */
    router.get('/add-devices', function (req, res, next) {
        res.render('devices/add', {title: 'LHV IoT - Add Devices'});
    });

    /* GET devices page. */
    router.get('/delete-devices', function (req, res, next) {
        res.render('devices/delete', {title: 'LHV IoT - Delete Devices'});
    });

    /* GET logs page. */
    router.get('/logs', function (req, res, next) {
        res.render('logs', {title: 'LHV IoT - Logs'});
    });

    /* GET charts page. */
    router.get('/charts', function (req, res, next) {
        res.render('charts', {title: 'LHV IoT - Charts'});
    });

    /* GET logs page. */
    router.get('/tables', function (req, res, next) {
        res.render('tables', {title: 'LHV IoT - Tables'});
    });

    /* GET test page. */
    router.get('/test', function (req, res, next) {
        res.render('test', {title: 'LHV IoT - Test'});
    });

    /* GET logout page. */
    router.get('/logout', function (req, res, next) {
        req.logout();
        res.redirect('/login');
    });

};

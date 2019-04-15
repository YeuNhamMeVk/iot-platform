const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const acl = require('express-acl');
const i18n = require('i18n');

// Express
const app = express();

// Mongoose
const configDB = require('./config/database.js');
mongoose.connect(configDB.url, {useNewUrlParser: true}, (err) => {
    if (err) throw err;
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'static')));

app.use(logger('dev'));
app.use(morgan('dev')); // sử dụng để log mọi request ra console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); // sử dụng để đọc thông tin từ cookie
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'nmhwYUznRN'
}));

// Passport
require('./config/passport')(passport); //
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());

// ACL
acl.config({
    // filename: 'acl.json',
    filename: 'test.json',
    path: './config'
});
acl.config({
    roleSearchPath: 'user._doc.role'
});
app.use(acl.authorize);

// I18n
i18n.configure({
    locales:['en', 'vi'],
    directory: __dirname + '/locales',
    cookie: 'lang',
    defaultLocale: 'en',
});
app.use(i18n.init);
app.use('/change-lang/:lang', (req, res) => {
    console.log(req.params.lang);
    res.cookie('lang', req.params.lang, { maxAge: 900000 });
    res.redirect('back');
});

// Setup route
require('./routes/index.js')(app, passport); // load các routes từ các nguồn

// Create HTTP server on port 3000.
let port = '3000';
app.set('port', port);
let server = http.createServer(app);
server.listen(port);
server.on('error', onError);
console.log("Starting server on port 3000")

// Callback if server start error
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

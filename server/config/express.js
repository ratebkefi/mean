var express       = require('express');
var bodyParser    = require('body-parser');
var multer        = require('multer');
var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var stylus = require('stylus');

module.exports = function(app, config) {
    function compile(str, path) {
        return stylus(str).set('filename', path);
    }
    app.set('views', config.rootPath + '/server/views');
    app.set('view engine', 'jade');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    multer();
    app.use(session({
        secret: 'this is the secret',
        resave: true,
        saveUninitialized: true
    }));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(stylus.middleware(
        {
            src: config.rootPath + '/public',
            compile: compile
        }
    ));
    app.use(express.static(config.rootPath + '/public'));
}
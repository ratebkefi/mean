var express       = require('express');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app           = express();
var config = require('./server/config/config')[env];
require('./server/config/express.js')(app, config);
var mongoose      = require("mongoose");
var bodyParser    = require('body-parser');
var multer        = require('multer');
var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var userModel = require("./server/config/mongoose.js")(config);
require('./server/config/passport')(userModel);
require("./server/config/routes.js")(app,userModel);
app.use(function (req, res, next) {
    console.log(req.user);
    next();

});
app.listen(config.port);
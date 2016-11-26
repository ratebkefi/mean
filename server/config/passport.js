var passport = require('passport'),
    mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy;


module.exports = function(userModel){


passport.use(new LocalStrategy(localStrategy));

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

function localStrategy(username, password, done) {
    userModel
        .findUserByCredentials({username: username, password: password})
        .then(
            function(user) {
                if (!user) { return done(null, false); }
                else if(user && user.authenticate(password))
                {return done(null, user);}

            },
            function(err) {
                if (err) { return done(err); }
            }
        );
}

function serializeUser(user, done) {
    done(null, user);
}
function localStrategy(username, password, done) {
    userModel
        .findUserByCredentials({username: username, password: password})
        .then(
            function(user) {
                if (!user) { return done(null, false); }
                else if(user && user.authenticate(password))
                {return done(null, user);}

            },
            function(err) {
                if (err) { return done(err); }
            }
        );
}

function serializeUser(user, done) {
    done(null, user);
}

function deserializeUser(user, done) {
    userModel
        .findUserById(user._id)
        .then(
            function(user){
                done(null, user);
            },
            function(err){
                done(err, null);
            }
        );
}

}
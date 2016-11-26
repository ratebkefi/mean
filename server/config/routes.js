var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose      = require("mongoose");


module.exports = function(app,userModel){

    var UserModel = userModel.getMongooseModel();
    var user = require('../controllers/users')(userModel);
    var courses = require('../controllers/courses');
    //var auth = authorized;


    app.post  ('/api/users', user.createUser);
    app.post  ('/login', passport.authenticate('local'), user.login);
    app.get('/api/users', user.requiresRole('admin'), user.getUsers);
    app.get('/api/courses/:id', courses.getCourseById);
    app.get('/api/courses', courses.getCourses);

    app.get('/partials/*', function(req, res){
        res.render('../../public/app/' + req.params[0]);
    });
    app.get('*', function(req, res) {
        res.render('index', {
            bootstrappedUser: req.user
        });
    });
    app.post  ('/logout',         user.logout);
    app.put('/api/users', user.updateUser);
    app.all('/api/*', function(req, res) {
        res.send(404);
    });

    /*

     app.post  ('/api/user',     auth, createUser);
     app.get   ('/api/loggedin',       loggedin);
     app.get   ('/api/user',     auth, findAllUsers);
     app.put   ('/api/user/:id', auth, updateUser);
     app.delete('/api/user/:id', auth, deleteUser);*/

    /*
    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function logout(req, res) {
        req.logOut();
        res.end();
    }

    function register(req, res) {
        var newUser = req.body;
        newUser.roles = ['student'];

        userModel
            .findUserByUsername(newUser.username)
            .then(
                function(user){
                    if(user) {
                        res.json(null);
                    } else {
                        return userModel.createUser(newUser);
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(user){
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function findAllUsers(req, res) {
        if(isAdmin(req.user)) {
            userModel
                .findAllUsers()
                .then(
                    function (users) {
                        res.json(users);
                    },
                    function () {
                        res.status(400).send(err);
                    }
                );
        } else {
            res.status(403);
        }
    }

    function deleteUser(req, res) {
        if(isAdmin(req.user)) {

            userModel
                .removeUser(req.params.id)
                .then(
                    function(user){
                        return userModel.findAllUsers();
                    },
                    function(err){
                        res.status(400).send(err);
                    }
                )
                .then(
                    function(users){
                        res.json(users);
                    },
                    function(err){
                        res.status(400).send(err);
                    }
                );
        } else {
            res.status(403);
        }
    }

    function updateUser(req, res) {
        var newUser = req.body;
        if(!isAdmin(req.user)) {
            delete newUser.roles;
        }
        if(typeof newUser.roles == "string") {
            newUser.roles = newUser.roles.split(",");
        }

        userModel
            .updateUser(req.params.id, newUser)
            .then(
                function(user){
                    return userModel.findAllUsers();
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(users){
                    res.json(users);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function createUser(req, res) {
        var newUser = req.body;
        if(newUser.roles && newUser.roles.length > 1) {
            newUser.roles = newUser.roles.split(",");
        } else {
            newUser.roles = ["student"];
        }

        // first check if a user already exists with the username
        userModel
            .findUserByUsername(newUser.username)
            .then(
                function(user){
                    // if the user does not already exist
                    if(user == null) {
                        // create a new user
                        return userModel.createUser(newUser)
                            .then(
                                // fetch all the users
                                function(){
                                    return userModel.findAllUsers();
                                },
                                function(err){
                                    res.status(400).send(err);
                                }
                            );
                        // if the user already exists, then just fetch all the users
                    } else {
                        return userModel.findAllUsers();
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(users){
                    res.json(users);
                },
                function(){
                    res.status(400).send(err);
                }
            )
    }

    function isAdmin(user) {
        if(user.roles.indexOf("admin") > 0) {
            return true
        }
        return false;
    }

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(403);
            res.end();
        } else {
            next();
        }
    };


    function requiresRole(role) {
        return function(req, res, next) {
            if(!req.isAuthenticated() || req.user.roles.indexOf(role) === -1) {
                res.status(403);
                res.end();
            } else {
                next();
            }
        }
    }
    */


}
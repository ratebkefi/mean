var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose      = require("mongoose");
var encrypt = require('../utilities/encryption');
var crypto = require('crypto');

module.exports = function(userModel) {

var userModel=userModel;
var UserModel = userModel.getMongooseModel();

  var api = {
    requiresRole: requiresRole,
    login:login,
    getUsers:getUsers,
    createUser:createUser,
    logout:logout,
    updateUser:updateUser

  };
  return api;

  var UserModel = userModel.getMongooseModel();
  function getUsers(req, res) {
    UserModel.find({}).exec(function(err, collection) {
      res.send(collection);
    })
  }

  function createUser(req, res) {
    var newUser = req.body;
    newUser.username = newUser.username.toLowerCase();
    newUser.salt = createSalt();
    newUser.hashed_pwd = hashPwd(newUser.salt, newUser.password);
    // first check if a user already exists with the username
    UserModel.create(newUser, function(err, user) {
      if(err) {
        if(err.toString().indexOf('E11000') > -1) {
          err = new Error('Duplicate Username');
        }
        res.status(400);
        return res.send({reason:err.toString()});
      }
      req.logIn(user, function(err) {
        if(err) {return next(err);}
        res.send(user);
      })
    })

  }

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

function updateUser(req, res) {
    var userUpdates = req.body;

    if(req.user._id != userUpdates._id && !req.user.hasRole('admin')) {
      res.status(403);
      return res.end();
    }

    req.user.firstName = userUpdates.firstName;
    req.user.lastName = userUpdates.lastName;
    req.user.username = userUpdates.username;
    if(userUpdates.password && userUpdates.password.length > 0) {
      req.user.sale = encrypt.createSalt();
      req.user.hashed_pwd = encrypt.hashPwd(req.user.sale, userUpdates.password);
    }
    req.user.save(function(err) {
      if(err) { res.status(400); return res.send({reason:err.toString()});}
      res.send(req.user);
    });
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
}


function createSalt() {
    return crypto.randomBytes(128).toString('base64');
}

function hashPwd(salt, pwd) {
    var hmac = crypto.createHmac('sha1', salt);
    return hmac.update(pwd).digest('hex');
}
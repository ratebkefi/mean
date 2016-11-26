var mongoose      = require("mongoose"),
    crypto = require('crypto'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    encrypt = require('../utilities/encryption');
    userModel = require('../models/User'),
    courseModel = require('../models/Course');


module.exports = function(config) {
    mongoose.connect(config.db);

    userModel.createDefaultUsers();
    UserModel=userModel.UserModel;
    courseModel.createDefaultCourses();
    var api = {
        findUserByCredentials: findUserByCredentials,
        findUserByUsername: findUserByUsername,
        findUserById: findUserById,
        findAllUsers: findAllUsers,
        createUser: createUser,
        removeUser: removeUser,
        updateUser: updateUser,
        getMongooseModel: getMongooseModel
    };
    return api;

    function updateUser(userId, user) {
        return UserModel.update({_id: userId}, {$set: user});
    }

    function removeUser(userId) {
        return UserModel.remove({_id: userId});
    }

    function findAllUsers() {
        return UserModel.find();
    }
    function createUser(user) {
        return UserModel.create(user);
    }

    function findUserByUsername(username) {
        return UserModel.findOne({username: username});
    }

    function getMongooseModel() {
        return UserModel;
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function findUserByCredentials(credentials) {


        return UserModel.findOne(
            {
                username: credentials.username
            }
        );
    }
}
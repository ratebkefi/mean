
var mongoose = require('mongoose');
crypto = require('crypto'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    encrypt = require('../utilities/encryption');
userModel = require('../models/User');

var UserSchema =mongoose.Schema({
    firstName: {type:String, required:'{PATH} is required!'},
    lastName: {type:String, required:'{PATH} is required!'},
    username: {
        type: String,
        required: '{PATH} is required!',
        unique:true
    },
    salt: {type:String, required:'{PATH} is required!'},
    hashed_pwd: {type:String, required:'{PATH} is required!'},
    roles: [String]
}, {collection: "user_tet"});

UserSchema.methods = {
    authenticate: function(passwordToMatch) {
        return hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
    },
    hasRole: function(role) {
        return this.roles.indexOf(role) > -1;
    }
};

var UserModel = mongoose.model('UserModel', UserSchema);

function createDefaultUsers() {


  UserModel.find({}).exec(function (err, collection) {
        if (collection.length === 0) {
            var salt, hash;
            salt = createSalt();
            hash = hashPwd(salt, 'joe');
            UserModel.create({
                firstName: 'Joe',
                lastName: 'Eames',
                username: 'joe',
                salt: salt,
                hashed_pwd: hash,
                roles: ['admin']
            });
            salt = createSalt();
            hash = hashPwd(salt, 'john');
            UserModel.create({
                firstName: 'John',
                lastName: 'Papa',
                username: 'john',
                salt: salt,
                hashed_pwd: hash,
                roles: []
            });
            salt = createSalt();
            hash = hashPwd(salt, 'dan');
            UserModel.create({firstName: 'Dan', lastName: 'Wahlin', username: 'dan', salt: salt, hashed_pwd: hash});
        }
    })

}
function createSalt() {
    return crypto.randomBytes(128).toString('base64');
}

function hashPwd(salt, pwd) {
    var hmac = crypto.createHmac('sha1', salt);
    return hmac.update(pwd).digest('hex');
}
exports.createDefaultUsers = createDefaultUsers;
exports.UserModel = UserModel;



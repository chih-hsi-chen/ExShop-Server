var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
    username: { type: String, index: true },
    password: { type: String },
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.passowrd, salt, function(err, hash) {
            newUser.passowrd = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function(username, callback) {
    var query = { username: username };
    User.findOne(query, callback);
}
module.exports.getUserById = function(id, callback) {
    User.findOne(id, callback);
}
module.exports.comparePassword = function(candidatePasswd, hash, callback) {
    bcrypt.compare(candidatePasswd, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}
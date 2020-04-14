var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcryptjs');

const isValidPassword = function(user, password) {
    return bcrypt.compareSync(password, user.password);
}

module.exports = (passport) => {
    passport.use('login', new LocalStrategy(
        {
            passReqToCallback: true,
        },
        function(req, username, password, done) {
            User.getUserByUsername(username, function(err, user) {
                // if server returns error message, then provide passport error info
                if(err) return done(err);
                // if user cannot be found in database, also not provide user info
                if(!user) return done(null, false, { message: 'User not found' });
                // if found, but password cannot match, then reject
                if(!isValidPassword(user, password)) return done(null, false, { message: 'Incorrect password' });

                return done(null, user);
            });
        }
    ));
    passport.use('signup', new LocalStrategy(
        {
            passReqToCallback: true
        },
        function(req, username, password, done) {
            User.findOne({ username: username }, function(err, user) {
                if(err) return done(err);

                if(user) {
                    return done(null, false, { message: 'User already exists' });
                } else {
                    var newUser = new User();
                    newUser.username = username;
                    newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);

                    newUser.save(function(err, user) {
                        if(err) throw err;

                        return done(null, user);
                    });
                }


            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
        User.getUserById({ _id: id }, function(err, user) {
            done(err, user);
        });
    });
};
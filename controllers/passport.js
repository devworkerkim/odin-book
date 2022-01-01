const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../models/user');

passport.use('local', new LocalStrategy(
    function(username, password, done) {
        User.findOne({ email: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (user.password !== password) { return done(null, false); }
            return done(null, user);
        });
    }
));

const opts = {
    jwtFromRequest: function(req) {
        var token = null;
        if (req && req.cookies) token = req.cookies['jwt'];
        return token;
    },
    secretOrKey: process.env.TOKEN_SECRET
}

passport.use('jwt', new JwtStrategy(opts, function(jwt_payload, done) {
    User.findById(jwt_payload._id, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
/* eslint-disable no-unused-vars */
const UserService = require('../../services/UserService');

/**
 * This module sets up and configures passport
 * @param {*} config
 */
module.exports = (config) => {
  passport.use(
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'username', // set the name that passport looks for the field in model User
        passwordField: 'password', // line 13 and 14 shows the default values
      },
      async (req, username, password, done) => {
        try {
          const user = await UserService.findByUsername(req.body.username);
          if (!user) {
            req.session.messages.push({
              text: 'Invalid username or password.',
              type: 'danger',
            });
            return done(null, false);
          }
          if (user && !user.verified) {
            req.session.messages.push({
              text: 'Please verify your email address!',
              type: 'danger',
            });
            return done(null, false);
          }
          const isValid = await user.comparePassword(req.body.password);
          if (!isValid) {
            req.session.messages.push({
              text: 'Invalid username or password',
              type: 'danger',
            });
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id); // serializatiion of the user
  });
  passport.deserializeUser(async (userId, done) => {
    try {
      const user = await UserService.findById(userId); // deserialization of the userId
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });
  return passport;
};

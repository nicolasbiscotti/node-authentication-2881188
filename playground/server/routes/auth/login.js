const { Router } = require('express');
const passport = require('passport');
// eslint-disable-next-line no-unused-vars
const UserService = require('../../services/UserService');

const router = Router();

module.exports = () => {
  /**
   * GET route to display the login form
   */
  router.get('/login', (req, res) => {
    res.render('auth/login', { page: 'login' });
  });

  /**
   * POST route to process the login form or display it again along with an error message in case validation fails
   */
  router.post(
    '/login',
    passport.authenticate('local', {
      failureRedirect: '/auth/login',
    }),
    async (req, res, next) => {
      try {
        /**
         * @todo: Don't forget about 'Remember me'!
         */
        req.session.messages.push({
          text: 'You are logged in now!!',
          type: 'seccess',
        });
        if (req.body.remember) {
          req.sessionOptions.maxAge = 24 * 60 * 60 * 1000 * 14;
          req.session.rememberme = req.sessionOptions.maxAge;
        } else {
          req.session.remember = null;
        }
        return res.redirect(req.session.returnTo || '/'); // res.session.rediretTo is provided for connect-ensure-login
        // for remember the route the user try to navigate before loggen in
      } catch (err) {
        return next(err);
      }
    }
  );

  /**
   * GET route to log a user out
   * @todo: Implement
   */
  router.get('/logout', (req, res) => {
    req.logout(); // passport function provided for handling logout
    req.session.remember = null;
    req.session.messages.push({
      text: 'You are logged out now!!',
      type: 'info',
    });
    return res.redirect('/');
  });

  return router;
};

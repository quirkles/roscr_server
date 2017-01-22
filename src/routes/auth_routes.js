import passport from 'passport';

import user_model from '../models/user_model';
import cuid from 'cuid';

const ROSCR_CLIENT_HOST = process.env.ROSCR_CLIENT_HOST || 'http://localhost:3000';

const init_auth_routes = app => {
  app.get('/login', (req, res) => {
    res.render('login.html');
  });

  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (authenticate_err, user, info) => {
      if (authenticate_err) {
        return next(authenticate_err);
      } else if (!user) {
        return res.status(401).json({
          success: false,
          message: info.message
        });
      } else {
        return req.logIn(user, login_err => {
          if (login_err) {
            return next(login_err);
          } else {
            return res.json({
              success: true,
              user
            });
          }
        });
      }
    })(req, res, next);
  });

  app.get('/api/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));

  app.get('/api/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/#/loginfailure'
  }), (req, res) => {
    res.redirect(`${ROSCR_CLIENT_HOST}/users/${req.user && req.user.id}`);
  });

  app.post('/api/logout', (req, res) => {
    req.logout();
    return res.json({success: true});
  });

  app.post('/signup', (req, res, next) => {

    const user_data = Object.assign({
      _id: cuid(),
      activity: {
        activity_type: 'USER_CREATED'
      }
    }, req.body);

    user_model.create(user_data, (err, user) => {
      if (err) {
        console.log(err);
        if (err.code === 11000) {
          return res.status(400).json({
            success: false,
            error_code: 'EMAIL_ALREADY_EXISTS',
            taken_email_address: req.body.email_address
          });
        } else {
          return next(err);
        }
      } else {
        return req.logIn(user, login_err => {
          if (login_err) {
            return next(login_err);
          } else {
            return res.json({
              success: true,
              user,
            });
          }
        });
      }
    });
  });
};

export default init_auth_routes;

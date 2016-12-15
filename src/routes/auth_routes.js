import passport from 'passport';

import user_model from '../models/user_model';
import cuid from 'cuid';

const init_auth_routes = app => {
  app.get('/login', (req, res) => {
    res.render('login.html');
  });

  app.post('/login', (req, res, next) => {
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

  app.post('/signup', (req, res, next) => {
    user_model.create(Object.assign({}, req.body, {_id: cuid()}), (err, user) => {
      if (err) {
        console.log(err);
        return next(err);
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

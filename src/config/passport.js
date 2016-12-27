import passport from 'passport';
import {Strategy as local_strategy} from 'passport-local';

import user_model, {compare_password_with_hash} from '../models/user_model.js';

const init_passport = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    user_model.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new local_strategy({
    usernameField: 'email_address',
  }, (email_address, password, done) => {
      user_model.findOne({ email_address }, function (err, user) {
        if (err) {
          return done(err);
        } else if (!user) {
          return done(null, false, { message: 'No matching user.' });
        } else if (!compare_password_with_hash(password, user.password)) {
          return done(null, false, { message: 'Incorrect password.' });
        } else {
          return done(null, user);
        }
      });
    }
  ));
};

export default init_passport;

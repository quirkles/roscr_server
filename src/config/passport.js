import passport from 'passport';
import {Strategy as local_strategy} from 'passport-local';
import {Strategy as facebook_strategy} from 'passport-facebook';

import user_model, {compare_password_with_hash} from '../models/user_model.js';
import {FACEBOOK_APP_ID, FACEBOOK_APP_SECRET} from './facebook';

const ROSCR_SERVER_HOST = process.env.ROSCR_SERVER_HOST || 'http://localhost:5000';

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

  passport.use(new facebook_strategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: `${ROSCR_SERVER_HOST}/api/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'name', 'emails', 'photos']
  }, function (accessToken, refreshToken, profile, cb) {
    const user_data = {
      facebook_id: profile.id,
      email_address: profile.emails.map(email => email.value).pop(),
      user_name: profile.username || profile.displayName || 'n/a'
    };

    const new_user_model = new user_model(user_data);

    user_model.findOne({
      $or: [
        {
          facebook_id: profile.id
        },
        {
          email_address: user_data.email_address
        }
      ]
    }, (findErr, user) => {
      if (findErr) {
        return cb(findErr);
      } else if (user) {
        return cb(null, user);
      } else {
        return new_user_model.save((err, u) => {
          if (err) {
            return cb(err);
          } else {
            return cb(null, u);
          }
        });
      }
    });
  }
));
};

export default init_passport;

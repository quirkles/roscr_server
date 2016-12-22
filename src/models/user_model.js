import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cuid from 'cuid';
import {omit} from 'ramda';

import {rename_keys} from '../utils/object';

const SALT_WORK_FACTOR = 10;

const user_schema = new mongoose.Schema({
  _id: String,
  username: {
    type: String,
    unique: true
  },
  email_address: {
    type: String
  },
  password: {
    type: String
  },
  last_modified: Date,
  created: Date
});

export const compare_password_with_hash = (password, hash) => bcrypt.compareSync(password, hash);

user_schema.pre('save', function (next) {
  const user = this;

  this.created = this.created || new Date();
  this._id = this._id || cuid();
  this.last_modified = new Date();

  if (!user.isModified('password')) {
    return next();
  } else {
    return bcrypt.genSalt(SALT_WORK_FACTOR, (gen_salt_err, salt) => {
      if (gen_salt_err) {
        return next(gen_salt_err);
      } else {
        return bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) {
            return next(err);
          } else {
            user.password = hash;
            return next();
          }
        });
      }
    });
  }
});

if (!user_schema.options.toJSON) {
  user_schema.options.toJSON = {};
}

user_schema.options.toJSON.transform = (doc, ret) => omit(['_id', 'password'], rename_keys({_id: 'id'}, ret));

const user_model = mongoose.model('User', user_schema);

export default user_model;

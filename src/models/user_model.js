import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

const user_schema = new mongoose.Schema({
  _id: String,
  username: {
    type: String,
    unique: true
  },
  password: String,
  last_modified: Date,
  created: Date
});

export const compare_password_with_hash = (password, hash) => bcrypt.compareSync(password, hash);

user_schema.pre('save', function (next) {
  const user = this;
  this.created = this.created || new Date();
  this.last_modified = new Date();
  if (!user.isModified('password')) {
    return next();
  } else {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) {
        return next(err);
      } else {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) {
            return next(err);
          } else {
            user.password = hash;
            next();
          }
        });
      }
    });
  }
});

const user_model = mongoose.model('User', user_schema);

export default user_model;

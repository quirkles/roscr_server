import mongoose from 'mongoose';
import {uri} from '../../src/config/mongodb';

import user_model from '../../src/models/user_model';

import {generate_random_user} from '../../src/utils/user';

const db = mongoose.connect(uri);

const generate_users = n => Array.from({length: n}, generate_random_user);

user_model.create(generate_users(100), (err, circle) => {
  if (err) {
    console.log(err);
  } else {
    db.disconnect();
  }
});

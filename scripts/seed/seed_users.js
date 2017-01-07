import mongoose from 'mongoose';
import {uri} from '../../src/config/mongodb';

import user_model from '../../src/models/user_model';

import {generate_random_user} from '../../src/utils/user';
import {generate_random_circle} from '../../src/utils/circle';

const db = mongoose.connect(uri);

const generate_users = n => Array.from({length: n}, generate_random_user);

const seed_circles = users => {
  console.log(users);
  db.disconnect()
};

user_model.create(generate_users(100), (err, users) => {
  if (err) {
    console.log(err);
  } else {
    seed_circles(users);
  }
});

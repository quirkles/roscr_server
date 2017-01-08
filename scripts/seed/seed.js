import mongoose from 'mongoose';
import {uri} from '../../src/config/mongodb';
import {merge, mergeWith, assoc, concat} from 'ramda';

import user_model from '../../src/models/user_model';
import circle_model from '../../src/models/circle_model';

import {generate_random_user} from '../../src/utils/user';
import {generate_random_circle} from '../../src/utils/circle';
import {get_n_random_elements_from_array, get_random_element_from_array} from '../../src/utils/array';

const db = mongoose.connect(uri);

const generate_users = n => Array.from({length: n}, generate_random_user);
const generate_circles = n => Array.from({length: n}, generate_random_circle);

const modify_circle_users = (circle, members) => merge(circle, {
  created_by: get_random_element_from_array(members),
  members
});

const seed_circles = unsaved_users => {
  const user_ids = unsaved_users.map(u => u._id);
  const circles =
    generate_circles(50)
      .map(circle => modify_circle_users(circle, get_n_random_elements_from_array(circle.members.length, user_ids)));

  circle_model.create(circles, (circle_create_err, created_circles) => {
    if (circle_create_err) {
      console.log(circle_create_err);
    } else {
      const user_circle_relations =
        created_circles
          .reduce(
            (total_reduction, circle)=>
              mergeWith((existing_user_record, new_user_record) => ({
                circles_created: concat(existing_user_record.circles_created || [], new_user_record.circles_created || []),
                circles_as_member: concat(existing_user_record.circles_as_member || [], new_user_record.circles_as_member || [])
              }), total_reduction, circle.members.reduce(
                (circle_reduction, member_id) => assoc(
                  member_id,
                  circle.created_by === member_id ? {circles_created: [circle._id]} : {circles_as_member: [circle._id]},
                  circle_reduction
                ),
                {}
              )),
            {}
          );
      const modified_users = unsaved_users.map(u => merge(u, user_circle_relations[u._id]));
      user_model.create(modified_users, (user_create_err, saved_users) => {
        if (user_create_err) {
          console.log(user_create_err);
        } else {
          console.log(`Successfully saved ${saved_users.length} users and ${created_circles.length} circles.`);
          db.disconnect();
        }
      });
    }
  });
};

seed_circles(generate_users(100));

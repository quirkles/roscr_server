import user_model from '../models/user_model';
import {merge, evolve, assoc} from 'ramda';

const get_query_params = query => {
  const default_query_params = {
    limit: 10,
    skip: 0,
    query: '',
    sort_by: 'name',
    min_trust_score: null
  };

  const transformer = {
    limit: limit => parseInt(limit, 10),
    skip: skip => parseInt(skip, 10),
    sort_by: value =>
      assoc(
        value.split('-').pop(),
        value.charAt(0) === '-' ? 'desc' : 'asc',
        {}
      )
  };
  return evolve(transformer, merge(default_query_params, query));
};

export const fetch_user_by_id = (req, res) => {
  user_model
    .findById(req.params.user_id)
    .select(req.user && req.user.id === req.params.user_id ? '' : '-notifications')
    .exec((find_user_error, user) => {
    if (find_user_error) {
      return find_user_error;
    } else if (user === null) {
      return res.status(404).json({
        success: false,
        error_code: 'USER_NOT_FOUND',
        message: `Unable to find user with id: ${req.params.user_id}`
      });
    } else {
      return res.json({
        success: true,
        user
      });
    }
  });
};

export const fetch_users = (req, res, next) => {
  const {limit, skip, query, sort_by, min_trust_score} = get_query_params(req.query);
  const find_query = {};
  const query_regexp = new RegExp(query.trim(), 'i');


  if (query.trim().length) {
    Object.assign(find_query, {
      $or: [
        {
          firstname: query_regexp
        },
        {
          lastname: query_regexp
        },
        {
          email_address: query_regexp
        }
      ]
    });
  }

  if (min_trust_score) {
    Object.assign(find_query, {
      'trust_score': {
          $gt: min_trust_score - 1
        }
    });
  }

  user_model.find(find_query)
  .limit(limit)
  .skip(skip)
  .select('-notifications')
  .sort(sort_by)
  .exec((find_users_err, users) => {
      if (find_users_err) {
        return next(find_users_err);
      } else {
        return user_model.count(find_query).exec((get_count_err, count) => {
          if (get_count_err) {
            return next(get_count_err);
          } else {
            return res.json({
                users,
                query: ({limit, skip, sort_by}),
                count
            });
          }
        });
      }
  });
};

export const update_user_with_id = (req, res) => {
  user_model.findOneAndUpdate({_id: req.params.user_id}, Object.assign(req.body, {last_modified: new Date()}), {new: true})
  .exec((find_and_update_error, user) => {
    if (find_and_update_error) {
      return find_and_update_error;
    } else if (user === null) {
      return res.status(404).json({
        success: false,
        error_code: 'USER_NOT_FOUND',
        message: `Unable to find user with id: ${req.params.user_id}`
      });
    } else {
      return res.json({
        success: true,
        user
      });
    }
  });
};

export const invite_user = (req, res) => {
  return res.json({
    success: true,
    invitee_email_address: req.body.invitee_email_address
  });
};

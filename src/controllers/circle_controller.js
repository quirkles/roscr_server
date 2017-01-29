import cuid from 'cuid';
import {merge, evolve, assoc} from 'ramda';

import circle_model from '../models/circle_model';

const get_query_params = query => {
  const default_query_params = {
    limit: 10,
    skip: 0,
    cycle_period: '',
    participant_count: '',
    query: '',
    sort_by: 'name'
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

export const fetch_circle_by_id = (req, res) => {
  circle_model.findById(req.params.circle_id)
  .exec((find_user_error, circle) => {
    if (find_user_error) {
      return find_user_error;
    } else if (circle === null) {
      return res.status(404).json({
        success: false,
        error_code: 'CIRCLE_NOT_FOUND',
        missing_circle_id: req.params.circle_id,
        message: `Unable to find circle with id: ${req.params.circle_id}`
      });
    } else {
      return res.json({
        success: true,
        circle
      });
    }
  });
};

export const create_circle = (req, res, next) => {
  circle_model.create(Object.assign({}, req.body, {
    _id: cuid(),
    created_by: req.user && req.user.id || null,
    activity: [{
      activity_type: 'CIRCLE_CREATED',
      originator: req.user.id
    }]
  }), (circle_create_err, circle) => {
    if (circle_create_err) {
      return next(circle_create_err);
    } else {
      req.user.circles_created.push(circle.id);
      return req.user.save(user_save_err => {
        if (user_save_err) {
          return next(user_save_err);
        } else {
          return res.json({
            success: true,
            circle,
          });
        }
      });
    }
  });
};

export const fetch_circles = (req, res, next) => {
  const {limit, skip, query, participant_count, cycle_period, sort_by} = get_query_params(req.query);
  const find_query = {};

  if (query.trim().length) {
    Object.assign(find_query, {
      circle_name: new RegExp(query.trim(), 'i')
    });
  }

  if (participant_count.length) {
    Object.assign(find_query, {
      participant_count: parseInt(participant_count, 10)
    });
  }

  if (cycle_period.length) {
    Object.assign(find_query, {
      cycle_period
    });
  }

  circle_model.find(find_query)
  .limit(limit)
  .skip(skip)
  .populate('created_by')
  .sort(sort_by)
  .exec((find_circles_err, circles) => {
      if (find_circles_err) {
        return next(find_circles_err);
      } else {
        return circle_model.count().exec((get_count_err, count) => {
          if (get_count_err) {
            return next(get_count_err);
          } else {
            return res.json({
                circles,
                query: ({limit, skip, sort_by}),
                count
            });
          }
        });
      }
  });
};

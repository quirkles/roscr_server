import cuid from 'cuid';
import {merge, evolve, assoc, any} from 'ramda';

import circle_model from '../models/circle_model';

const get_query_params = query => {
  const default_query_params = {
    limit: 25,
    skip: 0,
    cycle_period: '',
    participant_count: '{\"min\":8,\"max\":12}',
    withdrawal_amount: '{\"min\":50,\"max\":750}',
    query: '',
    sort_by: 'start_date'
  };

  const transformer = {
    limit: limit => parseInt(limit, 10),
    skip: skip => parseInt(skip, 10),
    participant_count: participant_count => {
      const {min, max} = JSON.parse(participant_count);
      return {$gte: min, $lte: max};
    },
    withdrawal_amount: withdrawal_amount => {
      const {min, max} = JSON.parse(withdrawal_amount);
      return {$gte: min, $lte: max};
    },
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
  .populate('created_by')
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
    }],
    members: [req.user && req.user.id]
  }), (circle_create_err, circle) => {
    if (circle_create_err) {
      return next(circle_create_err);
    } else {
      return circle_model.populate(circle, {path: 'created_by'}, (populate_err, populated_circle) => {
        req.user.circles_created.push(circle.id);
        return req.user.save(user_save_err => {
          if (user_save_err) {
            return next(user_save_err);
          } else {
            return res.json({
              success: true,
              circle: populated_circle,
            });
          }
        });
      });
    }
  });
};

export const fetch_circles = (req, res, next) => {
  const {limit, skip, query, participant_count, withdrawal_amount, cycle_period, sort_by} = get_query_params(req.query);
  const find_query = {
    is_public: true
  };

  if (query.trim().length) {
    Object.assign(find_query, {
      circle_name: new RegExp(query.trim(), 'i')
    });
  }

  if (participant_count) {
    Object.assign(find_query, {participant_count});
  }

  if (withdrawal_amount) {
    Object.assign(find_query, {withdrawal_amount});
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
        return circle_model.count(find_query).exec((get_count_err, count) => {
          if (get_count_err) {
            return next(get_count_err);
          } else {
            return res.json({
                circles,
                query: {limit, skip, sort_by},
                count
            });
          }
        });
      }
  });
};

export const update_savings_goal = (req, res) => {
  // TODO: Validations here
  circle_model.findById(req.params.circle_id)
  .exec((find_circle_error, circle) => {
    if (find_circle_error) {
      return find_circle_error;
    } else {
      if (any(savings_goal => savings_goal.user_id === req.params.user_id, circle.savings_goals)) {
        circle.savings_goals = circle.savings_goals
          .map(savings_goal => {
            if (savings_goal.user_id === req.params.user_id) {
              savings_goal.savings_goal = req.body.savings_goal;
              return savings_goal;
            } else {
              return savings_goal;
            }
          });
      } else {
        circle.savings_goals.push({
          _id: cuid(),
          user_id: req.params.user_id,
          savings_goal: req.body.savings_goal
        });
      }
      return circle.save(circle_save_err => {
        if (circle_save_err) {
          return circle_save_err;
        } else {
          return res.json({
            success: true
          });
        }
      });
    }
  });
};

import cuid from 'cuid';

import circle_model from '../models/circle_model';

export const fetch_circle_by_id = (req, res) => {
  circle_model.findById(req.params.circle_id)
  .populate('activity.originator')
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
      console.log(circle_create_err);
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

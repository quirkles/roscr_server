import user_model from '../models/user_model';

export const fetch_user_by_id = (req, res) => {
  user_model.findById(req.params.user_id)
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

export const update_user_with_id = (req, res) => {
  console.log(req.body);
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

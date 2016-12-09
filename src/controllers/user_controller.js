import user_model from '../models/user_model';

export const fetch_users = (req, res) => {
  user_model.find({}, (err, users) => res.json({success: true, users}));
};

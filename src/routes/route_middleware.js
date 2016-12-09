export const require_logged_in = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res
    .status(401)
    .send({
      success: false,
      error: 'User not authenticated'
    });
  }
};

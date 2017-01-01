import init_auth_routes from './auth_routes';
import init_user_routes from './user_routes';
import init_circle_routes from './circle_routes';

const init_routes = app => {

  // Init Auth routes
  init_auth_routes(app);

  // Init user routes
  init_user_routes(app);

  //Init circle routes
  init_circle_routes(app);

  app.get('/api/session', (req, res) => {
    if (!req.user) {
      return res.json({
        active_Session: false,
      });
    } else {
      return res.json({
        active_Session: true,
        session_user: req.user
      });
    }
  });
};

export default init_routes;

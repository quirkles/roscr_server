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

  app.get('/me', (req, res)=>{
    res.json({
      user: req.user || 'not logged in'
    });
  });
};

export default init_routes;

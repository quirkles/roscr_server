import init_auth_routes from './auth_routes';
import init_user_routes from './user_routes';

const init_routes = app => {

  // Init Auth routes
  init_auth_routes(app);

  // Init user routes
  init_user_routes(app);

  app.get('/me', (req, res)=>{
    console.log(req.user);
    res.json({user: req.user});
  });

  app.get('*', (req, res) => {
    res.render('index.html');
  });
};

export default init_routes;

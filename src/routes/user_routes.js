import {require_logged_in} from './route_middleware';
import {fetch_users} from '../controllers/user_controller';

const init_user_routes = app => {
  app.get('/api/users', require_logged_in, fetch_users);
};

export default init_user_routes;

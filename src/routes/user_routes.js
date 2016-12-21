import {require_logged_in} from './route_middleware';
import {fetch_user_by_id} from '../controllers/user_controller';

const init_user_routes = app => {
  app.get('/api/users/:user_id', fetch_user_by_id);
};

export default init_user_routes;

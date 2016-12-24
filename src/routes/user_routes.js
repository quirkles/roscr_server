import {require_logged_in} from './route_middleware';
import {
  fetch_user_by_id,
  update_user_with_id
} from '../controllers/user_controller';

const init_user_routes = app => {
  app.get('/api/users/:user_id', fetch_user_by_id);

  app.post('/api/users/:user_id', update_user_with_id);
};

export default init_user_routes;



import {fetch_circle_by_id} from '../controllers/circle_controller';

const init_circle_routes = app => {
  app.get('/api/circles/:circle_id', fetch_circle_by_id);
};

export default init_circle_routes;

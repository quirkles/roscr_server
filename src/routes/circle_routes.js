import {
  fetch_circle_by_id,
  create_circle
} from '../controllers/circle_controller';

const init_circle_routes = app => {
  app.get('/api/circles/:circle_id', fetch_circle_by_id);

  app.post('/api/circles', create_circle);
};

export default init_circle_routes;

import {
  fetch_circles,
  fetch_circle_by_id,
  create_circle,
  update_savings_goal
} from '../controllers/circle_controller';

const init_circle_routes = app => {
  app.get('/api/circles', fetch_circles);

  app.get('/api/circles/:circle_id', fetch_circle_by_id);

  app.post('/api/circles', create_circle);

  app.put('/api/circles/:circle_id/users/:user_id/savings_goal', update_savings_goal);
};

export default init_circle_routes;

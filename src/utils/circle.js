import cuid from 'cuid';
import D from 'date-fp';

import {get_random_element_from_array} from './array';
import {get_random_int_in_range} from './number';
import {get_random_circle_name, periods} from './circle_attrs';


export const generate_random_circle = () => {
  const date_now = new Date();
  const participant_count = get_random_int_in_range(8, 12);
  const members = Array.from({length: get_random_int_in_range(1, participant_count)}, cuid);
  const withdrawal_amount = get_random_int_in_range(25, 50) * 10;
  return ({
    _id: cuid(),
    circle_name: get_random_circle_name(),
    created_by: get_random_element_from_array(members),
    withdrawal_amount,
    contribution_amount: withdrawal_amount / participant_count,
    participant_count,
    cycle_period: get_random_element_from_array(periods),
    start_date: D.add('days', get_random_int_in_range(1, 100), date_now),
    members,
    is_public: true,
    activity: [],
    payout_events: [],
    savings_goals: [],
    created: date_now,
    last_modified: date_now
  });
};

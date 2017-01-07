import {adjectives} from './adjectives';
import {nouns} from './nouns';
import {get_random_element_from_array} from './array';

export const get_random_circle_name = () => {
  const date_now = new Date();
  return `${get_random_element_from_array(adjectives)}-${get_random_element_from_array(nouns)}-${date_now.getMilliseconds()}`;
};

export const periods = ['weekly', 'bi-weekly', 'monthly'];

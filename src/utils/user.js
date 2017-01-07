import cuid from 'cuid';

import {firstnames, lastnames, cities, countries, professions} from './user_attrs';
import {capitalize} from './string';
import {get_random_element_from_array} from './array';

const email_domains = [
  'email',
  'gmail',
  'yahoo',
  'hotmail',
  'googlemail',
  'outlook'
];


export const generate_random_user = () => {
  const date_now = new Date();
  const firstname = get_random_element_from_array(firstnames).toLowerCase();
  const lastname = get_random_element_from_array(lastnames).toLowerCase();
  const email_address = `${firstname}.${lastname}_${date_now.getMilliseconds()}@${get_random_element_from_array(email_domains)}.com`;

  return ({
    _id: cuid(),
    firstname: capitalize(firstname),
    lastname: capitalize(lastname),
    email_address,
    password: 'passy',
    city: get_random_element_from_array(cities),
    country: get_random_element_from_array(countries),
    about_me: null,
    profession: get_random_element_from_array(professions),
    last_modified: date_now,
    created: date_now,
    activity: [],
    circles_created: [],
    circles_as_member: []
  });
};

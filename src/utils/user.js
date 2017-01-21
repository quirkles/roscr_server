import cuid from 'cuid';

import {firstnames, lastnames, cities, countries, professions} from './user_attrs';
import {adjectives} from './adjectives';
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
  const email_address = `${get_random_element_from_array(adjectives)}_${firstname}_${lastname}_${date_now.getSeconds()}${date_now.getMilliseconds()}@${get_random_element_from_array(email_domains)}.com`;

  return ({
    _id: cuid(),
    firstname: capitalize(firstname),
    lastname: capitalize(lastname),
    email_address,
    password: 'passy',
    city: get_random_element_from_array(cities),
    country: get_random_element_from_array(countries),
    profession: get_random_element_from_array(professions),
    last_modified: date_now,
    created: date_now,
    trust_score: 75 + Math.floor(Math.random() * 25),
    activity: [],
    circles_created: [],
    circles_as_member: []
  });
};

export const get_default_user = () => {
  const date_now = new Date();
  const firstname = 'alex';
  const lastname = 'quirk';
  const email_address = 'user@email.com';

  return ({
    _id: cuid(),
    firstname: capitalize(firstname),
    lastname: capitalize(lastname),
    email_address,
    password: 'passy',
    city: get_random_element_from_array(cities),
    country: get_random_element_from_array(countries),
    profession: get_random_element_from_array(professions),
    last_modified: date_now,
    created: date_now,
    activity: [],
    circles_created: [],
    circles_as_member: []
  });
};

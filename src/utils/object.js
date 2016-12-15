import {reduce, keys} from 'ramda';

export const rename_keys = (keysMap, obj) =>
  reduce((acc, key) => {
    acc[keysMap[key] || key] = obj[key];
    return acc;
  }, {}, keys(obj));

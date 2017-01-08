export const get_random_element_from_array = items => items[Math.floor(Math.random() * items.length)];

export const randomize_array = array => {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export const get_n_random_elements_from_array = (n, items) =>
  n >= items.length ?
    items :
    randomize_array(items).slice(0, n);


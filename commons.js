export const submitRequest = (request, handleDisplay) => {
  console.log(request);
  fetch('https://hotels4.p.rapidapi.com/' + request + '&locale=en_US', {
    'method': 'GET',
    'headers': {
      'x-rapidapi-key': '2694d91abamsh6d866c83318bb1ap1b4be6jsn0b24258dc1e0',
      'x-rapidapi-host': 'hotels4.p.rapidapi.com'
    }
  })
    .then(response => response.json())
    .then(data => handleDisplay(data))
    .catch(err => console.error(err));
};

export const pad = (num, size) => {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
};

export const shallowClone = (object) => {
  const clone = {};
  let x;
  for (x in object) {
    clone[x] = object[x];
  }
  return clone;
};
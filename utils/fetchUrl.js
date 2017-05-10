// Many thanks for to Marius Schulz https://github.com/mariusschulz/egghead-async-await
// for the Async/Await course on eggehead.io

const fetch = require('node-fetch');

const fetchUrl = async (url) => {
  const response = await fetch(url);

  const json = await response.json();

  if (response.status !== 200) {
    throw Error(json.message);
  }

  return json;
};

module.exports = fetchUrl;

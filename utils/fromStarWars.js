// Many thanks for to Marius Schulz https://github.com/mariusschulz/egghead-async-await
// for the Async/Await course on eggehead.io

const fetch = require('node-fetch');

const fromStarWars = async (endpoint) => {
  const response = await fetch(`https://swapi.co${endpoint}`);

  const json = await response.json();

  if (response.status !== 200) {
    throw Error(json.message);
  }

  return json;
};

module.exports = fromStarWars;

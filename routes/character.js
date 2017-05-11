const express = require('express');
const router = express.Router();

const fromStarWars = require('../utils/fromStarWars');
const fetchUrl = require('../utils/fetchUrl');

router.get('/', async (req, res) => {
  const data = {
    name: '',
    characters: [],
  };

  res.render('character', data);
});

router.post('/', async (req, res) => {
  req.sanitize('name').escape();
  req.sanitize('name').trim();
  res.redirect(`character/${req.body.name}`);
});

router.get('/:name', async (req, res) => {
  const { results } = await fromStarWars(`/api/people/?search=${req.params.name}`);

  const allPromises = await Promise.all([
    Promise.all(
      results.map(result => (
        Promise.all(result.films.map(url => fetchUrl(url)))
          .then(charactersFilms => charactersFilms)
      ))
    ).then(filmsPromise => filmsPromise),
    Promise.all(
      results.map(result => (
        Promise.all(result.species.map(url => fetchUrl(url)))
          .then(charactersSpecies => charactersSpecies)
      ))
    ).then(speciesPromise => speciesPromise),
    Promise.all(
      results.map(result => (
        Promise.all(result.vehicles.map(url => fetchUrl(url)))
          .then(charactersVehicles => charactersVehicles)
      ))
    ).then(vehiclesPromise => vehiclesPromise),
    Promise.all(
      results.map(result => (
        Promise.all(result.starships.map(url => fetchUrl(url)))
          .then(charactersStarships => charactersStarships)
      ))
    ).then(starshipsPromise => starshipsPromise),
    Promise.all(
      results.map(result => (
        fetchUrl(result.homeworld)
          .then(charactersHomeworld => charactersHomeworld)
      ))
    ).then(homeworldPromise => homeworldPromise),
  ]);

  const films = allPromises[0].map(
    charactersFilms => (
      charactersFilms.map(film => film.title)
    )
  );

  const species = allPromises[1].map(
    charactersFilms => (
      charactersFilms.map(spec => spec.name)
    )
  );

  const vehicles = allPromises[2].map(
    charactersFilms => (
      charactersFilms.map(vehicle => vehicle.name)
    )
  );

  const starships = allPromises[3].map(
    charactersFilms => (
      charactersFilms.map(starship => starship.name)
    )
  );

  const homeworlds = allPromises[4].map(planets => planets.name);

  const formattedResults = results.reduce((acc, val, index) => {
    const { name, height, mass, skin_color, eye_color, hair_color, birth_year, gender } = val;
    const character = {
      name,
      height,
      mass,
      skin_color,
      eye_color,
      hair_color,
      birth_year,
      gender,
      homeworld: homeworlds[index],
      films: films[index],
      species: species[index],
      vehicles: vehicles[index],
      starships: starships[index],
    };
    return [...acc, character];
  }, []);

  const data = {
    name: req.params.name,
    characters: formattedResults,
  };

  res.render('character', data);
});

module.exports = router;

const express = require('express');
const router = express.Router();

const fromStarWars = require('../utils/fromStarWars');
const fetchUrl = require('../utils/fetchUrl');

router.get('/', async (req, res) => {
  const page = req.query.page === undefined ? 1 : parseInt(req.query.page, 10);

  const { results } = await fromStarWars(`/api/planets/?page=${page}`);

  const residents = await Promise.all(
    results.map(result => (
      Promise.all(result.residents.map(url => fetchUrl(url)))
        .then(planetsResidents => planetsResidents)
    ))
  );

  const formattedResults = results.reduce((obj, item, index) => {
    const newObj = Object.assign({}, obj);
    newObj[item.name] = residents[index].map(resident => resident.name);
    return newObj;
  }, {});

  res.json(formattedResults);
});


module.exports = router;

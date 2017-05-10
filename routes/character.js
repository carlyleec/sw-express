const express = require('express');
const router = express.Router();
const fromStarWars = require('../utils/fromStarWars');

router.get('/', async (req, res) => {
  const data = {
    name: '',
    characters: [],
  };

  res.render('character', data);
});


router.get('/:name', async (req, res) => {
  const character = await fromStarWars(`/api/people/?search=${req.params.name}`);

  const data = {
    name: req.params.name,
    characters: character.results,
  };

  res.render('character', data);
});

module.exports = router;

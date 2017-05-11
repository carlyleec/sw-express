const express = require('express');
const router = express.Router();
const { reduce, sortBy, slice, flow } = require('lodash/fp');
const fromStarWars = require('../utils/fromStarWars');

router.get('/', async (req, res) => {
  const rawResults = await Promise.all([
    fromStarWars('/api/people/?page=1'),
    fromStarWars('/api/people/?page=2'),
    fromStarWars('/api/people/?page=3'),
    fromStarWars('/api/people/?page=4'),
    fromStarWars('/api/people/?page=5'),
  ]);

  const page = req.query.page === undefined ? 1 : parseInt(req.query.page, 10);
  const page10x = page * 10;

  const results = flow(
    reduce((acc, val) => (
      acc.concat(val.results)
    ), []),
    sortBy(x => (
      req.query.sort === 'mass' || req.query.sort === 'height'
      ? parseInt(x[req.query.sort], 10)
      : x[req.query.sort])
    ),
    slice(page10x - 10, page10x)
  )(rawResults);

  const formatUrl = (pageNum, sort) => (
    req.query.sort !== undefined ? `/characters?page=${pageNum}&sort=${sort}` : `/characters?page=${pageNum}`
  );

  const data = {
    count: 50,
    previous: page === 1 ? null : formatUrl(page - 1, req.query.sort),
    next: page === 5 ? null : formatUrl(page + 1, req.query.sort),
    results,
  };

  res.json(data);
});


module.exports = router;

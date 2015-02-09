var Stickshift = require('./src/index.js');

Stickshift(
  document.getElementById('page'),
  {
    endpoint: 'http://localhost:3000/query',
    branch: 'db',
    username: 'mapbox',
    repo: 'stickshift'
  });

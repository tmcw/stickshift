var Stickshift = require('./src/index.js');
var cookie = require('cookie');

Stickshift(
  document.getElementById('page'),
  {
    endpoint: 'http://localhost:3000/query',
    branch: 'db',
    username: 'mapbox',
    access_token: cookie.parse(document.cookie).access_token,
    mapboxToken: 'pk.eyJ1IjoidG1jdyIsImEiOiJIZmRUQjRBIn0.lRARalfaGHnPdRcc-7QZYQ',
    repo: 'stickshift'
  });

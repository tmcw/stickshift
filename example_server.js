var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
var http = require('http');
var concat = require('concat-stream');
var st = require('st');

var mount = st({ path: __dirname, cache: false, index: 'index.html' });

// Create fake data for the testing server, so that your queries show something.
db.serialize(function() {
  db.run('CREATE TABLE fake(x, y, z)');
  db.run('CREATE TABLE places(name, lat, lng)');
  db.run('CREATE TABLE cats(name, whiskers, feet)');
  for (var i = 0; i < 100; i++) {
    // truly random data and totally sin-wave data looks weird, so we
    // have a slowly-changing random offset
    db.run('INSERT INTO fake VALUES (?, ?, ?)', [
      (new Date((+new Date() - (i * 1000 * 60 * 60)))).toString(),
      ((Math.sin(i / 10) + 1) * 10) + Math.random() * 20,
      ((Math.cos(i / 5) + 1) * 40) + Math.random() * 5
    ]);
  }

  // create a bunch of random places in france, thanks to geonames
  require('./example/france.json').forEach(function(place) {
    db.run('INSERT INTO places VALUES (?, ?, ?)', place);
  });

  ['bella', 'socks', 'jack', 'oreo'].forEach(function(name) {
    db.run('INSERT INTO cats VALUES (?, ?, ?)', [
      name, ~~(Math.random() * 50), 4
    ]);
  });
});

var server = http.createServer(function(req, res) {
  var stHandled = mount(req, res);
  if (!stHandled) {
    req.pipe(concat(function(query) {
      try {
        var q = JSON.parse(query);
        db.all(q.query, function(err, rows) {
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(err || rows));
        });
      } catch(e) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('error');
      }
    }));
  }
});

server.listen(3000, function(err) {
  if (err) console.error(err);
  console.log('listening on port 3000');
});

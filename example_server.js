var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
var http = require('http');
var concat = require('concat-stream');
var st = require('st');

var mount = st({ path: __dirname, url: '/', cache: false });

// Create fake data for the testing server, so that your queries show something.
db.serialize(function() {
  db.run('CREATE TABLE fake(x, y, z)');
  for (var i = 0; i < 100; i++) {
    // truly random data and totally sin-wave data looks weird, so we
    // have a slowly-changing random offset
    db.run('INSERT INTO fake VALUES (?, ?, ?)', [
      (new Date((+new Date() - (i * 1000 * 60 * 60)))).toString(),
      ((Math.sin(i/10) + 1) * 10) + Math.random() * 20,
      ((Math.cos(i/5) + 1) * 40) + Math.random() * 5
    ]);
  }
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

server.listen(3000, function(err, res) {
  console.log('listening on port 3000');
});

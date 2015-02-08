var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
var http = require('http');
var concat = require('concat-stream');
var st = require('st');

var mount = st({ path: __dirname, url: '/', cache: false });

db.serialize(function() {
  db.run('CREATE TABLE fake(x, y)');
  for (var i = 0; i < 1000; i++) {
    db.run('INSERT INTO fake VALUES (?, ?)', [
      (new Date((+new Date() - (i * 1000 * 60 * 60)))).toString(), Math.random() * 1000]);
  }
});

var server = http.createServer(function(req, res) {
  var stHandled = mount(req, res);
  if (!stHandled) {
    req.pipe(concat(function(query) {
      try {
        var q = JSON.parse(query);
        db.all(q.query, function(err, rows) {
          console.log(arguments);
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

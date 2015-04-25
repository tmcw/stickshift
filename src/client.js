var xhr = require('xhr');
var config = require('./config.js');
var Hubdb = require('hubdb');

var db = new Hubdb({
    token: config.access_token,
    branch: config.branch,
    username: config.username,
    repo: config.repo
});

module.exports.runQuery = runQuery;
module.exports.saveQuery = saveQuery;
module.exports.deleteQuery = deleteQuery;
module.exports.list = function(cb) { return db.list(cb); };

function runQuery(query, callback) {
  if (typeof config.endpoint === 'string') {
    xhr({
      uri: config.endpoint,
      method: 'POST',
      json: {
        query: query
      },
    }, (err, res, body) => {
      callback(err, body);
    });
  } else if (typeof config.endpoint === 'function') {
    config.endpoint(query, callback);
  }
}

function saveQuery(name, query, callback) {
    db.add({
        name: name,
        query: query
    }, callback);
}

function deleteQuery(id, callback) {
    db.remove(id, callback);
}

var RowConstants = require('./constants/row_constants.js'),
    QueryConstants = require('./constants/query_constants.js'),
    client = require('./client.js'),
    Dispatcher = require('./dispatcher.js');

var actions = {
  listQueries(callback) {
    client.list((err, res) => {
        if (!err) {
          Dispatcher.handleViewAction({
            actionType: QueryConstants.QUERY_LISTED,
            value: res
          });
          if (callback) callback();
        }
    });
  },

  deleteQuery(id) {
    client.deleteQuery(id, (err, res) => {
        if (!err) {
            actions.listQueries();
        }
    });
  },

  saveQuery(name, query) {
    client.saveQuery(name, query, (err, res) => {
        console.log(arguments);
    });
  },

  runQuery(query) {
    Dispatcher.handleViewAction({
      actionType: RowConstants.QUERY_START
    });
    client.runQuery(query, (err, res) => {
      if (!err && res) {
        Dispatcher.handleViewAction({
          actionType: RowConstants.QUERY_DONE,
          value: res
        });
      }
    });
  }
};

module.exports = actions;

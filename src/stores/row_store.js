var Dispatcher = require('../dispatcher.js'),
  RowConstants = require('../constants/row_constants.js'),
  makeStore = require('../make_store.js');

var _results = [];
var _loading = false;

var RowStore = makeStore({
  all: () => _results,
  loading: () => _loading,
  dispatcherIndex: Dispatcher.register(payload => {
    var action = payload.action;
    switch (action.actionType) {
      case RowConstants.QUERY_START:
        _results = [];
        _loading = true;
        break;
      case RowConstants.QUERY_DONE:
        _results = action.value;
        _loading = false;
        break;
      default:
        return true;
    }
    RowStore.emitChange(action.actionType);
    return true;
  })
});

RowStore.setMaxListeners(1000);
module.exports = RowStore;

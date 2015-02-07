var Dispatcher = require('../dispatcher.js'),
  EventConstants = require('../constants/event_constants.js'),
  Immutable = require('immutable'),
  makeStore = require('../make_store.js');

var _results = [];
var _loading = false;

var EventStore = makeStore({
  all: () => _results,
  loading: () => _loading,
  dispatcherIndex: Dispatcher.register(payload => {
    var action = payload.action;
    switch (action.actionType) {
      case EventConstants.QUERY_START:
        _results = [];
        _loading = true;
        break;
      case EventConstants.QUERY_DONE:
        _results = action.value;
        _loading = false;
        break;
      default:
        return true;
    }
    EventStore.emitChange(action.actionType);
    return true;
  })
});

EventStore.setMaxListeners(1000);
module.exports = EventStore;

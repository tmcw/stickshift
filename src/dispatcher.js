var Dispatcher = require('flux').Dispatcher,
    xtend = require('xtend/mutable');

var AppDispatcher = xtend(new Dispatcher(), {
  handleViewAction(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  },
});

module.exports = AppDispatcher;

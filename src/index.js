Object.assign = require('object-assign');
var React = require('react');
var Router = require('react-router');
var config = require('./config.js');
var { Route, DefaultRoute, RouteHandler } = Router;
var Events = require('./components/rows.js');

var App = React.createClass({
  render: function () {
    return (
      <div>
        <RouteHandler />
      </div>
    );
  }
});

module.exports = function(element, inputConfig) {
  Object.assign(config, inputConfig);

  var routes = (
    <Route handler={App} path='/'>
      <DefaultRoute handler={Events} />
      <Route name='permalink' path='/query/:query' handler={Events} />
    </Route>
  );

  Router.run(routes, function (Handler) {
    React.render(<Handler />, element);
  });
};

Object.assign = require('object-assign');

module.exports = function(element, inputConfig) {

  var config = require('./config.js');
  Object.assign(config, inputConfig);

  var React = require('react');
  var Router = require('react-router');
  var { Route, DefaultRoute, RouteHandler } = Router;
  var Rows = require('./components/rows.js');

  var App = React.createClass({
    render: function () {
      return (
        <div>
          <RouteHandler />
        </div>
      );
    }
  });

  var routes = (
    <Route handler={App} path='/'>
      <DefaultRoute handler={Rows} />
      <Route name='permalink' path='/query/:query' handler={Rows} />
    </Route>
  );

  Router.run(routes, function (Handler) {
    React.render(<Handler />, element);
  });
};

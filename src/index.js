Object.assign = require('object-assign');
var React = require('react');

var EventStore = require('./stores/event_store.js'),
    QueryStore = require('./stores/query_store.js'),
    actions = require('./actions.js');

var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Navigation, State } = Router;

var QueryList = require('./components/query_list.js'),
    EventTable = require('./components/event_table.js'),
    ExportTable = require('./components/export_table.js'),
    Chart = require('./components/chart.js');

var Events = React.createClass({
  mixins: [EventStore.listenTo, State, Navigation],
  componentWillMount() {
      window.addEventListener('resize', this.measure);
  },
  componentWillUnmount() {
      window.removeEventListener('resize', this.measure);
  },
  componentDidMount() {
      this.measure();
      if (this.getParams().query) {
        actions.listQueries(() => {
          this.chooseQuery(QueryStore.getByPath(this.getParams().query));
        });
      }
  },
  measure() {
    this.setState({
        width: this.refs.tablesizer.getDOMNode().offsetWidth
    });
  },
  getInitialState() {
    return {
      events: [],
      list: false,
      query: 'select * from information_schema.tables',
      width: 500
    };
  },
  setQuery(e) {
    this.setState({ query: e.target.value });
  },
  runQuery() {
    actions.runQuery(this.state.query);
  },
  saveQuery() {
    var name = prompt('Name this query');
    actions.saveQuery(name, this.state.query);
  },
  listQueries() {
    actions.listQueries();
    this.setState({ list: !this.state.list });
  },
  chooseQuery: function(q) {
    this.setState({
      list: false,
      query: q.data.query
    }, () => {
        this.runQuery();
        this.transitionTo('permalink', { query: q.path });
    });
  },
  _onChange: function() {
    this.setState({
      events: EventStore.all(),
      loading: EventStore.loading()
    });
  },
  render: function() {
    return <div className='unlimiter'>
      {this.state.list ? <QueryList chooseQuery={this.chooseQuery} /> : ''}
      <div className='pad2y fill-navy dark pad2x'>
        <div className='col12 truncate space-bottom1'>
          <div className='contain'>
            <strong>Query</strong>
            <div className='pin-topright'>
              <a
                onClick={this.listQueries}
                className='icon menu pad2x'>List</a>
              <a
                onClick={this.saveQuery}
                className='icon floppy'>Save</a>
            </div>
          </div>
        </div>
        <textarea
          value={this.state.query}
          className='col12 pad1 row2 code'
          onChange={this.setQuery} />
        <a
          onClick={this.runQuery}
          className='col12 unround fill-green button'>Query</a>
      </div>
      <div className='col12 pad2x pad1y fill-grey text-right'>
        <ExportTable />
        <div ref='tablesizer'>
        </div>
      </div>
      <div>
        <Chart width={this.state.width} />
        <div className='pad2'>
            <EventTable
              width={this.state.width}
              events={this.state.events} />
        </div>
      </div>
      {this.state.loading ?
        <div className='pin-bottom'>
          <div className='pad1 fill-yellow'>Loading...</div>
        </div> : ''}
    </div>;
  }
});

var App = React.createClass({
  render: function () {
    return (
      <div>
        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={Events} />
    <Route name='permalink' path="/query/:query" handler={Events} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('page'));
});

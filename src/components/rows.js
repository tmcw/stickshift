var React = require('react');
var Router = require('react-router');
var { Navigation, State } = Router;
var RowStore = require('../stores/row_store.js'),
    QueryStore = require('../stores/query_store.js'),
    actions = require('../actions.js');

var QueryList = require('./query_list.js'),
    RowTable = require('./row_table.js'),
    ExportTable = require('./export_table.js'),
    Chart = require('./chart.js');

var Rows = React.createClass({
  mixins: [RowStore.listenTo, State, Navigation],
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
      query: '',
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
      events: RowStore.all(),
      loading: RowStore.loading()
    });
  },
  render: function() {
    return <div className='unlimiter'>
      {this.state.list ? <QueryList chooseQuery={this.chooseQuery} /> : ''}
      <div className='pad2y fill-navy-dark dark pad2x'>
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
      <div className='col12 pad2x'>
        <div ref='tablesizer'>
        </div>
      </div>
      <div>
        <Chart width={this.state.width} />
        <div className='pad2 fill-grey keyline-top'>
            <div className='col12 pad0 space-bottom0 text-right hide-mobile'>
            <ExportTable />
            </div>
            <RowTable
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

module.exports = Rows;

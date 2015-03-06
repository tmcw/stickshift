var React = require('react/addons');
var Router = require('react-router');
var DocumentTitle = require('react-document-title');
var ReactCodeMirror = require('react-code-mirror');
require('codemirror/mode/sql/sql.js');
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
      list: false,
      query: '',
      width: 500
    };
  },
  setQuery(e) {
    this.setState({ query: e.target.value, queryName: '' });
  },
  runQuery() {
    actions.runQuery(this.state.query);
  },
  saveQuery() {
    var name = prompt('Name this query');
    actions.saveQuery(name, this.state.query);
    this.setState({ queryName: name });
  },
  listQueries() {
    actions.listQueries();
    this.setState({ list: !this.state.list });
  },
  chooseQuery: function(q) {
    this.setState({
      list: false,
      query: q.data.query,
      queryName: q.data.name
    }, () => {
        this.runQuery();
        this.transitionTo('permalink', { query: q.path });
    });
  },
  _onChange: function() {
    this.setState({
      loading: RowStore.loading()
    });
  },
  render: function() {
    return <DocumentTitle title={'Stickshift' +
      (this.state.queryName ?  `: ${this.state.queryName}` : '')}>
      <div className='unlimiter'>
        {this.state.list ? <QueryList chooseQuery={this.chooseQuery} /> : ''}
        <div className='pad2y fill-navy-dark dark pad2x'>
          <div className='col12 truncate space-bottom1'>
            <div className='contain'>
              <strong>Query</strong>
              {this.state.queryName ?
                <strong className='pad2x quiet code'>{this.state.queryName}</strong> : ''}
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
          <div className='col12 row2'>
            <ReactCodeMirror
              style={{height:80}}
              value={this.state.query}
              mode='text/x-sql'
              theme='vibrant-ink'
              onChange={this.setQuery} />
          </div>
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
              <RowTable width={this.state.width} />
          </div>
        </div>
        {this.state.loading ?
          <div className='pin-bottom'>
            <div className='pad1 fill-yellow'>Loading...</div>
          </div> : ''}
      </div>
    </DocumentTitle>;
  }
});

module.exports = Rows;

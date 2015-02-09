var React = require('react');
var actions = require('../actions');
var { Navigation } = require('react-router');
var QueryStore = require('../stores/query_store.js');

var QueryList = React.createClass({
    mixins: [QueryStore.listenTo, Navigation],
    getInitialState() {
        return { queries: [] };
    },
    _onChange() {
        this.setState({ queries: QueryStore.all() });
    },
    chooseQuery(q) {
        this.props.chooseQuery(q);
    },
    deleteQuery(q) {
        actions.deleteQuery(q.path);
    },
    render() {
        return <div className='fill-navy-dark dark pad2'>
          {this.state.queries.map((q, i) =>
              <div
                key={q.data.query + '-' + i}
                className='col12 clearfix contain pad0y'>
                <div className='col3 right pad1 fill-darken2'>
                  <a
                      onClick={this.chooseQuery.bind(this, q)}
                      className='icon down'>{q.data.name}</a>
                </div>
                <div className='col9 contain small'>
                  <pre className='truncate fill-dark unround'>{q.data.query}</pre>
                  {false ? <a
                    onClick={this.deleteQuery.bind(this, q)}
                    className='icon trash pin-topright'></a> : ''}
                </div>
              </div>)}
        </div>;
    }
});

module.exports = QueryList;

var React = require('react');
var actions = require('../actions');
var { Navigation } = require('react-router');
var QueryStore = require('../stores/query_store.js');

var QueryList = React.createClass({
    mixins: [QueryStore.listenTo, Navigation],
    getInitialState() {
        return { queries: QueryStore.all(), error: QueryStore.error() };
    },
    _onChange() {
        this.setState({
          queries: QueryStore.all(),
          error: QueryStore.error()
        });
    },
    chooseQuery(q) {
        this.props.chooseQuery(q);
    },
    deleteQuery(q) {
      if (confirm('Are you sure you want to delete this query?')) {
        actions.deleteQuery(q.path);
      }
    },
    render() {
        if (this.state.queries.length && !this.state.error) {
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
                  <a onClick={this.deleteQuery.bind(this, q)}
                    className='icon trash pin-topright pad1'></a>
                </div>
              </div>)}
            </div>;
        } else if (!this.state.queries.length && this.state.error) {
          return <div className='fill-navy-dark dark pad2'>
            <div className='icon close strong center pad1'>
              Error retrieving queries: {this.state.error}
            </div>
          </div>;
        } else if (this.state.queries.length === 0) {
          return <div className='fill-navy-dark dark pad2'>
            <div className='icon info strong center pad1'>
              No queries saved
            </div>
          </div>;
        }
    }
});

module.exports = QueryList;

var QueryStore = require('../stores/query_store.js');
var React = require('react');

var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

var RowTable = React.createClass({
  rowGetter(rowIndex) {
    return this.props.events[rowIndex];
  },
  render() {
    if (this.props.events.length === 0) {
      return <div className='pad2 fill-grey center'>No data</div>;
    } else if (typeof this.props.events === 'string') {
      return  <div className='fill-yellow'>
      <div className='pad2 fill-lighten3 center'>{this.props.events}</div>
      </div>;
    } else {
      return  <Table
          rowHeight={50}
          rowGetter={this.rowGetter}
          rowsCount={this.props.events.length}
          width={this.props.width}
          height={300}
          headerHeight={50}>
          {Object.keys(this.props.events[0]).map(prop =>
              <Column
                label={prop}
                flexGrow={1}
                width={100}
                dataKey={prop}
              />)}
        </Table>;
    }
  }
});

module.exports = RowTable;

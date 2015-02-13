var React = require('react/addons');
var RowStore = require('../stores/row_store.js');

var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

var RowTable = React.createClass({
  mixins: [RowStore.listenTo, React.addons.PureRenderMixin],
  getInitialState() {
    return { rows: RowStore.all() };
  },
  _onChange() {
    this.setState({ rows: RowStore.all() });
  },
  rowGetter(rowIndex) {
    return this.state.rows[rowIndex];
  },
  render() {
    if (this.state.rows.length === 0) {
      return <div className='pad2 fill-grey center'>No data</div>;
    } else if (!Array.isArray(this.state.rows)) {
      return  <div className='fill-yellow'>
        <div className='pad2 fill-lighten3 center'>
          {JSON.stringify(this.state.rows)}
        </div>
      </div>;
    } else {
      return  <Table
          rowHeight={50}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          width={this.props.width}
          height={300}
          headerHeight={50}>
          {Object.keys(this.state.rows[0]).map(prop =>
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

Object.assign = require('object-assign');

var RowStore = require('../stores/row_store.js');
var xtend = require('xtend');
var React = require('react/addons');
var stackedBarChart = require('../charts/stacked_bar.js');

/**
 * A chart of current data.
 */
var Chart = React.createClass({
  mixins: [RowStore.listenTo, React.addons.PureRenderMixin],
  _onChange: function() {
    this.setState({
      events: RowStore.all()
    });
  },
  getInitialState() {
    return { events: RowStore.all(), tooltip: '' };
  },
  resize() {
    this.setState(xtend(this.state, { tall: !this.state.tall }));
  },
  drawChart() {
    if (!this.isMounted() || !this.refs.chart) return;

    this.refs.chart.getDOMNode().style.display = 'block';
    if (this.state.events.length && this.makeSpec()) {
      vg.parse.spec(this.makeSpec(), chart => {
        try {
          var c = chart({
              el: this.refs.chart.getDOMNode()
          }).update();
          c.on('mouseover', (e, d) => {
            this.refs.tooltip.getDOMNode().innerHTML = d.datum.data.c + ' = ' + d.datum.data.y +
              ' on ' +
              d3.time.format('%x')(new Date(d.datum.data.x));
          });
          c.on('mouseout', (e, d) => {
            this.refs.tooltip.getDOMNode().innerHTML = '';
          });
        } catch(e) {
          this.refs.chart.getDOMNode().style.display = 'none';
        }
      });
    }
  },
  share() {
    var a = document.createElement('a');
    a.download = 'chart.png';
    a.href = this.refs.chart.getDOMNode().getElementsByTagName('canvas')[0].toDataURL('image/png');
    a.click();
  },
  componentDidUpdate() {
    this.drawChart();
  },
  componentDidMount() {
    this.drawChart();
  },
  canChart() {
    return (this.state.events.length && typeof this.state.events[0] === 'object');
  },
  makeSpec() {
    if (!this.canChart()) { return {}; }
    return stackedBarChart(this.state.events, this.props.width, this.state.tall);
  },
  render() {
    if (this.canChart()) {
        return (<div>
          <div className='col12 pad2 contain'>
            <div ref='tooltip' className='pin-top pad0y center fill-lighten0'></div>
            <div className='text-right hide-mobile'>
                <a className='icon u-d-arrow pad2x'
                  onClick={this.resize}>resize</a>
                <a className='icon share'
                  onClick={this.share}>save</a>
            </div>
            <div ref='chart'></div>
          </div>
        </div>);
    } else {
        return <div></div>;
    }
  }
});

module.exports = Chart;

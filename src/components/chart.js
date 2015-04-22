/*global vg*/
Object.assign = require('object-assign');

var RowStore = require('../stores/row_store.js');
var RoundedToggle = require('./rounded_toggle.js');
var xtend = require('xtend');
var React = require('react/addons');
var charts = require('../charts/index.js');

function isLat(f) { return !!f.match(/(Lat)(itude)?/gi); }
function isLon(f) { return !!f.match(/(L)(on|ng)(gitude)?/i); }

function drawMap(element, events) {
  var map = L.mapbox.map(element, 'tmcw.l12c66f2', {
    scrollWheelZoom: false
  }).fitBounds([
    [-90, -180],
    [90, 180]
  ]);
  var latfield, lonfield;
  for (var f in events[0]) {
    if (!latfield && isLat(f)) latfield = f;
    if (!lonfield && isLon(f)) lonfield = f;
  }
  if (latfield && lonfield) {
    var geojson = {
      type: 'FeatureCollection',
      features: events
        .map(event => {
          event[lonfield] = parseFloat(event[lonfield]);
          event[latfield] = parseFloat(event[latfield]);
          return event;
        })
        .filter(event => {
          return !(isNaN(event[latfield]) || isNaN(event[lonfield]));
        })
        .map(event => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(event[lonfield]), parseFloat(event[latfield])]
        },
        properties: event
      }))
    };
    L.geoJson(geojson, {
      pointToLayer: (geojson, latlng) =>
        L.circleMarker(latlng, {
          radius: 7,
          weight: 1,
          opacity: 0.9,
          fillOpacity: 0.6,
          color: '#56b881',
          fillColor: '#56b881'
        }).bindPopup('<pre>' + JSON.stringify(geojson.properties, null, 2) + '</pre>', {
          minWidth: 400
        })
      }).addTo(map);
  }
}

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
    return { events: RowStore.all(), tooltip: '', chartType: 'stacked' };
  },
  resize() {
    this.setState(xtend(this.state, { tall: !this.state.tall }));
  },
  drawChart() {
    if (!this.isMounted() || !this.refs.chart) return;

    this.refs.chart.getDOMNode().innerHTML = '';

    if (this.state.chartType === 'map') {
      var mapContainer = this.refs.chart.getDOMNode().appendChild(
        document.createElement('div'));
      mapContainer.style.display = 'block';
      mapContainer.style.height = '600px';
      drawMap(mapContainer, this.state.events);
      return;
    }

    this.refs.chart.getDOMNode().style.height = 'auto';
    this.refs.chart.getDOMNode().style.display = 'block';
    if (this.state.events.length && this.makeSpec()) {
      var { spec, tip } = this.makeSpec();
      vg.parse.spec(spec, chart => {
        try {
          var c = chart({
              el: this.refs.chart.getDOMNode()
          }).update();
          c.on('mouseover', (e, d) => {
            this.refs.tooltip.getDOMNode().innerHTML = tip(d.datum.data);
          });
          c.on('mouseout', () => {
            this.refs.tooltip.getDOMNode().innerHTML = '';
          });
        } catch(e) {
          this.refs.chart.getDOMNode().style.display = 'none';
          console.error(e);
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
  setChartType(type) {
    this.setState({ chartType: type });
  },
  makeSpec() {
    if (!this.canChart()) { return {}; }
    return charts[this.state.chartType](this.state.events, this.props.width, this.state.tall);
  },
  render() {
    if (this.canChart()) {
        return (<div>
          <div className='col12 pad2x pad1y contain clearfix'>
            <div className='col12 clearfix'>
              <div className='col6'>
                <RoundedToggle
                    className='inline'
                    options={[
                      { key: 'stacked', value: 'stacked' },
                      { key: 'line', value: 'line' },
                      { key: 'map', value: 'map' }
                    ]}
                    active={this.state.chartType}
                    update={this.setChartType} />
              </div>
              <div className='col6 text-right hide-mobile pad1y'>
                <a className='icon u-d-arrow pad2x'
                  onClick={this.resize}>resize</a>
                <a className='icon share'
                  onClick={this.share}>save</a>
              </div>
            </div>
            <div ref='tooltip' className='pin-top pad0y center fill-lighten0'></div>
          </div>
          <div ref='chart'></div>
        </div>);
    } else {
        return <div></div>;
    }
  }
});

module.exports = Chart;

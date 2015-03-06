/*global d3*/
module.exports = function stackedBar(events, width, tall) {
  var padding = {top: 10, left: 40, bottom: 15, right: 10};

  var chartWidth = width - padding.left - padding.right;
  var chartHeight = tall ?
    (window.innerHeight - padding.top - padding.bottom) * 0.75 : 200;
  var columns = Object.keys(events[0]);
  events = JSON.parse(JSON.stringify(events));
  var values = [], dates = [], yValues = [];
  // parsing dates outside of vega will not work: vega does a json
  // stringify loop internally
  if (isNaN(+new Date(events[0][columns[0]]))) return false;

  var datecolumn = columns[0];
  events.forEach(function(e) {
    for (var i = 1; i < columns.length; i++) {
      var parsed = parseFloat(e[columns[i]]);
      dates.push(new Date(e[datecolumn]));
      yValues.push(parsed);
      if (!isNaN(parsed)) {
          values.push({
            x: e[columns[0]],
            y: parsed,
            c: columns[i]
          });
        }
    }
  });

  var spec = {
    width: chartWidth,
    height: chartHeight,
    padding: padding,
    data: [{
      name: 'table',
      format: {
        type:'json', parse: {x:'date'}
      },
      values: values
    }],
    scales: [{
      name: 'x',
      type: 'time',
      clamp: true,
      range: 'width',
      domain: {data: 'table', field: 'data.x'}
    }, {
      name: 'y',
      type: 'linear',
      range: 'height',
      nice: true,
      domain: {data: 'table', field: 'data.y'}
    }, {
      name: 'color',
      type: 'ordinal',
      domain: {data: 'table', field: 'data.c'},
      range: ['#56b881','#3887be','#8a8acb','#ee8a65']
    }],
    axes: [{
      type: 'x',
      scale: 'x',
      format:'%x',
      ticks: Math.floor(chartWidth / 100),
      tickSize: 0,
      properties: {
        labels: {
          fill: {value:'#b3b3b1'}
        },
        axis: {
          stroke: {value: '#b3b3b1'}
        }
      }
    }, {
      type: 'y',
      tickSize: 0,
      format: ',s',
      scale: 'y',
      properties: {
        labels: { fill: {value:'#b3b3b1'} },
        axis: { stroke: {value: '#b3b3b1'} }
      }
    }],
    marks: [{
        type: 'group',
        from: {
          data: 'table',
          transform: [
            {type: 'facet', keys: ['data.c']}
          ]
        },
        marks: [{
          type: 'line',
          properties: {
            enter: {
              x: { 'scale': 'x', field: 'data.x' },
              y: { scale: 'y', field: 'data.y' },
              stroke: { scale: 'color', field: 'data.c'},
              strokeWidth: { value: 2 }
            },
            update: { fillOpacity: {value: 1} },
            hover: { fillOpacity: {value: 0.5} }
          }
        }]
    }]
  };

  return {
    spec: spec,
    tip: function(d) {
      return `${d.c} = ${d.y} on ${d3.time.format('%x')(new Date(d.x))}`;
    }
  };
};

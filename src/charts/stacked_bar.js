/*global d3*/

module.exports = function stackedBar(events, width, tall) {
  var columns = Object.keys(events[0]);
  events = JSON.parse(JSON.stringify(events));
  // parsing dates outside of vega will not work: vega does a json
  // stringify loop internally
  if (!isNaN(+new Date(events[0][columns[0]]))) {
    return timeBars(events, columns, width, tall);
  } else {
    return anyBars(events, columns, width, tall);
  }
};

function timeBars(events, columns, width, tall) {
  var padding = {top: 10, left: 40, bottom: 15, right: 10};
  var chartWidth = width - padding.left - padding.right;
  var chartHeight = tall ?
    (window.innerHeight - padding.top - padding.bottom) * 0.75 : 200;
  var yValues = [], values = [], dates = [];
  var datecolumn = columns[0];
  events.forEach(function(e) {
    for (var j = 1; j < columns.length; j++) {
      var parsed = parseFloat(e[columns[j]]);
      dates.push(new Date(e[datecolumn]));
      yValues.push(parsed);
      if (!isNaN(parsed)) {
          values.push({
            x: e[columns[0]],
            y: parsed,
            c: columns[j]
          });
        }
    }
  });

  var dateRange = d3.extent(dates);
  dates.sort(function(a, b) { return a - b; });
  var gaps = [];
  for (var i = 0; i < dates.length - 1; i++) {
    gaps.push(dates[i + 1] - dates[i]);
  }
  // avoid gaps of 0
  gaps = gaps.filter(function(_) { return _; });
  var minGap = d3.min(gaps);
  var barWidth = Math.max(1,
    Math.floor(chartWidth / ((dateRange[1] - dateRange[0]) / minGap)) - 2);

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
      }, {
        name: 'stats',
        source: 'table',
        transform: [
          {type: 'facet', keys: ['data.x']},
          {type: 'stats', value: 'data.y'}
        ]
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
      domain: {data: 'stats', field: 'sum'}
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
            {type: 'facet', keys: ['data.c']},
            {type: 'stack', point: 'data.x', height: 'data.y'}
          ]
        },
        marks: [{
          type: 'rect',
          properties: {
            enter: {
              x: { 'scale': 'x', field: 'data.x' },
              width: { value: barWidth },
              y: { scale: 'y', field: 'y' },
              y2: { scale: 'y', field: 'y2' },
              fill: { scale: 'color', field: 'data.c'}
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
}

function anyBars(events, columns, width, tall) {
  var padding = {top: 10, left: 40, bottom: 15, right: 10};
  var chartWidth = width - padding.left - padding.right;
  var chartHeight = tall ?
    (window.innerHeight - padding.top - padding.bottom) * 0.75 : 200;
  var values = [];
  events.forEach(function(e) {
    for (var j = 1; j < columns.length; j++) {
      var parsed = parseFloat(e[columns[j]]);
      if (!isNaN(parsed)) {
          values.push({
            category: e[columns[0]],
            value: parsed,
            subcategory: columns[j]
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
          type:'json'
        },
        values: values
    }],
    scales: [{
      name: 'cat',
      type: 'ordinal',
      range: 'width',
      padding: 0.05,
      domain: { data: 'table', field: 'data.category' }
    }, {
      name: 'val',
      range: 'height',
      round: true,
      nice: true,
      domain: {'data': 'table', field: 'data.value'}
    }, {
      name: 'color',
      type: 'ordinal',
      domain: {data: 'table', field: 'data.c'},
      range: ['#56b881','#3887be','#8a8acb','#ee8a65']
    }],
    axes: [{
      type: 'x',
      scale: 'cat',
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
      scale: 'val',
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
          {'type':'facet', 'keys': ['data.category']}
        ]
      },
      properties: {
        enter: {
          x: {'scale': 'cat', 'field': 'key'},
          width: { 'scale': 'cat', 'band': true }
        }
      },
      scales: [
        {
          name: 'pos',
          type: 'ordinal',
          range: 'width',
          domain: { field: 'data.subcategory' }
        }
      ],
      marks: [{
        type: 'rect',
        properties: {
          enter: {
            y: {scale: 'val', field: 'data.value'},
            y2: {scale: 'val', value: 0},
            width: {scale: 'pos', band: true},
            x: {scale: 'pos', field: 'data.subcategory'},
            fill: {scale: 'color', field: 'data.subcategory'}
          }
        }
      }]
    }]
  };

  return {
    spec: spec,
    tip: function(d) {
      return `${d.category} ⇢ ${d.subcategory} = ${d.value}`;
    }
  };
}

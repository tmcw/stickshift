/*global d3*/
module.exports = function stackedBar(events, width, tall) {
  var chartWidth = width;
  var chartHeight = tall ? window.innerHeight * 1 : 200;
  var sphereData = {
    "data": "sphere",
    "transform": [{
      "type": "geopath",
      "value": "data",
      "projection": "eckert4",
      "scale": 100 * (chartHeight / 320),
      "translate": [chartWidth/2, chartHeight/2]
    }]
  };

  var spec = {
    "width": chartWidth,
    "height": chartHeight,
    "viewport": [chartWidth, chartHeight],
    "data": [
      {
        "name": "world",
        "values": require('./data/world-110m.json'),
        "format": {"type": "topojson", "feature": "countries"}
      },
      {
        "name": "sphere",
        "values": [{ type: 'Sphere' }],
        "format": {"type": "json"}
      }
    ],
    "marks": [
      {
        "type": "path",
        "from": sphereData,
        "properties": {
          "enter": {
            "path": {"field": "path"},
            "fill": { "value": "#d6d6d6" }
          }
        }
      },
      {
        "type": "path",
        "from": {
          "data": "world",
          "transform": [{
            "type": "geopath",
            "value": "data",
            "projection": "eckert4",
            "scale": 100 * (chartHeight / 320),
            "translate": [chartWidth/2, chartHeight/2]
          }]
        },
        "properties": {
          "enter": {
            "stroke": {"value": "#777"},
            "strokeWidth": {"value": 0.5},
            "path": {"field": "path"}
          },
          "update": {"fill": {"value": "#efefef"}},
          "hover": {"fill": {"value": "pink"}}
        }
      },
      {
        "type": "path",
        "from": sphereData,
        "properties": {
          "enter": {
            "stroke": {"value": "#444"},
            "strokeWidth": {"value": 2},
            "path": {"field": "path"}
          }
        }
      }
    ]
  };

  console.log(spec);

  return {
    spec: spec,
    tip: function(d) {
      return `${d.c} = ${d.y} on ${d3.time.format('%x')(new Date(d.x))}`;
    }
  };
};

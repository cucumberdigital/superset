// JS
import d3 from 'd3';

// CSS
require('./cal_heatmap.css');
require('../node_modules/cal-heatmap/cal-heatmap.css');

const CalHeatMap = require('cal-heatmap');

function calHeatmap(slice) {
  const div = d3.select(slice.selector);

  const render = function () {
    d3.json(slice.jsonEndpoint(), function (error, json) {
      const data = json.data;
      const form = json.form_data;
      
      if (error !== null) {
        slice.error(error.responseText, error);
        return;
      }

      const steps = [];
      for (var e = form.legend_domain_from; e < form.legend_domain_to; e += form.legend_domain_step) {
        steps.push(e);
      }

      div.selectAll('*').remove();
      const cal = new CalHeatMap();

      const timestamps = data.timestamps;
      const extents = d3.extent(Object.keys(timestamps), (key) => timestamps[key]);
      const step = (extents[1] - extents[0]) / 5;

      try {
        cal.init({
          start: data.start,
          data: timestamps,
          itemSelector: slice.selector,
          tooltip: false,
          domain: data.domain,
          subDomain: data.subdomain,
          range: data.range,
          browsing: true,
          legend: steps, //[extents[0], extents[0] + step, extents[0] + step * 2, extents[0] + step * 3],
          legendColors: [ form.legend_color_range_from, form.legend_color_range_to ]
        });
      } catch (e) {
        slice.error(e);
      }

      slice.done(json);
    });
  };

  return {
    render,
    resize: render,
  };
}

module.exports = calHeatmap;

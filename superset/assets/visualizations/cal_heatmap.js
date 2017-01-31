// JS
import d3 from 'd3';

// CSS
require('./cal_heatmap.css');
require('../node_modules/cal-heatmap/cal-heatmap.css');

const CalHeatMap = require('cal-heatmap');

function calHeatmap(slice, payload) {
  const div = d3.select(slice.selector);
  const data = payload.data;
  const form = payload.form_data;

  const steps = [];
  for (var e = form.legend_domain_from; e < form.legend_domain_to; e += form.legend_domain_step) {
    steps.push(e);
  }

  div.selectAll('*').remove();
  const cal = new CalHeatMap();

  const timestamps = data.timestamps;
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
      legend: steps,
      legendColors: [ form.legend_color_range_from, form.legend_color_range_to ]
    });
  } catch (e) {
    slice.error(e);
  }
}

module.exports = calHeatmap;
// JS
import d3 from 'd3';

import { fixDataTableBodyHeight } from '../javascripts/modules/utils';
const $ = require('jquery');

require('./pivot_table.css');

require('datatables-bootstrap3-plugin/media/css/datatables-bootstrap3.css');
import 'datatables.net';
import dt from 'datatables.net-bs';
dt(window, $);

module.exports = function (slice, payload) {
  const fd = payload.form_data;
  const container = slice.container;
  container.html(payload.data);
  
  const steps = [];
  for (let e = fd.legend_domain_from; e < fd.legend_domain_to; e += fd.legend_domain_step) {
    steps.push(e);
  }

  function convertHex(hex, opacity) {
    hex = hex.replace('#','');
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);

    return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity/100 + ')';
  } 

  let max = 0;
  let min = 0;
  $(container).find('td').each(function() {
    const $this = parseInt( $(this).text() );
    if ($this > max) max = $this;
    if ($this < min) min = $this;
  });

  var colorScale = d3.scale.linear()
    .range([fd.legend_color_range_from, fd.legend_color_range_to])
    .interpolate(d3.interpolateHcl)
    .domain([fd.legend_domain_from, fd.legend_domain_to]);//[d3.min(_legend), d3.max(_legend)]);

  var colors = steps.map(function(element) { return colorScale(element); });

  if (fd.groupby.length === 1) {
    const height = container.height();
    const table = container.find('table').DataTable({
      paging: false,
      searching: false,
      bInfo: false,
      scrollY: height + 'px',
      scrollCollapse: true,
      scrollX: true,
      createdRow: function ( row, data, index ) {
        for(let i = 0; i < data.length; i++) {
          const value = data[i].replace(/[\$,]/g, '') * 1;
          let position = 0;
          for(let j = 0; j < steps.length; j++) {
            if(steps[j] > value) break;
            position = j;
          }
          $('td', row).eq(i - 1).css('background-color', convertHex(colors[position], 25));
        }
      }
    });
    table.column('-1').order('desc').draw();
    fixDataTableBodyHeight(
        container.find('.dataTables_wrapper'), height);
  }
};
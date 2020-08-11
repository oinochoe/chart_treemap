import * as d3 from 'd3';
import { data } from './data';
import './styles/main.scss';

const width = 100;
const height = 100;
const snap = snap || 0.0001;
const x = d3.scaleLinear().domain([0, width]).range([0, width]);
const y = d3.scaleLinear().domain([0, height]).range([0, height]);
const colorMap = ['#4e74b2', '#3e5b94', '#223162', '#282e4a', '#3e3f4c', '#4b4944', '#ae8f59', '#d8ad62', '#dcaf5c', '#dfb257', '#e2b752'];

let resizeTimer;
let currentDepth;

const color = d3.scaleOrdinal().range(
    colorMap.map(function (c) {
        c = d3.rgb(c);
        return c;
    }),
);
const treemap = d3.treemap().size([width, height]).tile(d3.treemapSquarify).paddingInner(0).round(false);
const nodes = d3.hierarchy(data).sum(function (d) {
    return d.value ? 1 : 0;
});

const chart = d3.select('#chart');
const cells = chart
    .selectAll('.node')
    .data(nodes.descendants())
    .enter()
    .append('div')
    .attr('class', function (d) {
        return 'node level-' + d.depth;
    })
    .attr('title', function (d) {
        return d.data.name ? d.data.name : 'null';
    });

treemap(nodes);
cells
    .style('left', function (d) {
        return nearest(x(d.x0), snap) + '%';
    })
    .style('top', function (d) {
        console.log(y(d.y0) + ' => ' + nearest(y(d.y0), snap));
        return nearest(y(d.y0), snap) + '%';
    })
    .style('width', function (d) {
        return nearest(x(d.x1) - x(d.x0), snap) + '%';
    })
    .style('height', function (d) {
        console.log(y(d.y1) - y(d.y0) + ' => ' + nearest(y(d.y1) - y(d.y0), snap));
        return nearest(y(d.y1) - y(d.y0), snap) + '%';
    })
    //.style("background-image", function(d) { return d.value ? imgUrl + d.value : ""; })
    .style('background-color', function (d) {
        while (d.depth > 1) d = d.parent;
        return color(d.data.value);
    })
    .on('click', zoom);

cells
    .append('p')
    .attr('class', 'label')
    .text(function (d) {
        return d.data.name ? d.data.name : 'null';
    });

var parent = d3.select('.back').datum(nodes).on('click', zoom);

// can't resquarify as we use 100*100% treemap size. Doh!
d3.select(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(redraw, 250);
});

showPath(nodes.ancestors());

function zoom(d) {
    // http://jsfiddle.net/ramnathv/amszcymq/

    showPath(d.ancestors());

    currentDepth = d.depth;
    parent.datum(d.parent || nodes);

    x.domain([d.x0, d.x1]);
    y.domain([d.y0, d.y1]);

    var t = d3.transition().duration(800).ease(d3.easeCubicOut);

    cells
        .transition(t)
        .style('left', function (d) {
            return nearest(x(d.x0), snap) + '%';
        })
        .style('top', function (d) {
            return nearest(y(d.y0), snap) + '%';
        })
        .style('width', function (d) {
            return nearest(x(d.x1) - x(d.x0), snap) + '%';
        })
        .style('height', function (d) {
            return nearest(y(d.y1) - y(d.y0), snap) + '%';
        });

    cells // hide this depth and above
        .filter(function (d) {
            return d.ancestors();
        })
        .classed('hide', function (d) {
            return d.children ? true : false;
        });

    cells // show this depth + 1 and below
        .filter(function (d) {
            return d.depth > currentDepth;
        })
        .classed('hide', false);

    // if currentDepth == 3 show prev/next buttons
}

function redraw() {
    console.log('window resized');

    treemap(nodes); //?
    //cells
    //  .datum(nodes)
    //  .call(zoom);
}

function showPath(p) {
    var path = d3
        .select('.breadcrumb')
        .selectAll('a')
        .data(
            p
                .map(function (d) {
                    return d;
                })
                .reverse(),
        );

    path.exit().remove();

    path.enter()
        .append('a')
        .attr('href', '#')
        .html(function (d) {
            return d.data.name;
        })
        .on('click', zoom);
}

function nearest(x, n) {
    return n * Math.round(x / n);
}

import * as d3 from 'd3';
import { data } from './data';
import './styles/main.scss';

const width = 100;
const height = 100;
const snap = snap || 0.0001;
const x = d3.scaleLinear().domain([0, width]).range([0, width]);
const y = d3.scaleLinear().domain([0, height]).range([0, height]);
const colorMap = ['#4e74b2', '#3e5b94', '#223162', '#282e4a', '#3e3f4c', '#4b4944', '#ae8f59', '#d8ad62', '#dcaf5c', '#dfb257', '#e2b752'];
const parent = d3.select('.back').datum(nodes).on('click', zoom);
const navWrap = document.querySelector('nav');
const chartWrap = document.querySelector('#chart');

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
    .append('text')
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
        return nearest(y(d.y0), snap) + '%';
    })
    .style('width', function (d) {
        return nearest(x(d.x1) - x(d.x0), snap) + '%';
    })
    .style('height', function (d) {
        return nearest(y(d.y1) - y(d.y0), snap) + '%';
    })
    .style('background-color', function (d) {
        return color(d.data.value);
    })
    .on('click', zoom);

cells
    .append('text')
    .attr('class', 'label')
    .text(function (d) {
        return d.data.name ? d.data.name : 'null';
    });

cells
    .append('text')
    .attr('class', 'value')
    .text(function (d) {
        return d.data.value ? d.data.value : '';
    });

d3.select(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(redraw, 250);
});

showPath(nodes.ancestors());

function zoom(d) {
    showPath(d.ancestors());

    currentDepth = d.depth;
    parent.datum(d.parent || nodes);

    x.domain([d.x0, d.x1]);
    y.domain([d.y0, d.y1]);

    const t = d3.transition().duration(300).ease(d3.easeCubicOut);

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

    cells
        .filter(function (d) {
            return d.ancestors();
        })
        .classed('hide', function (d) {
            return d.children ? true : false;
        });

    cells
        .filter(function (d) {
            return d.depth > currentDepth;
        })
        .classed('hide', false);

    if (currentDepth != 0) {
        navWrap.classList.add('on');
        chartWrap.classList.add('on');
    } else {
        navWrap.classList.remove('on');
        chartWrap.classList.remove('on');
    }
}

function redraw() {
    treemap(nodes);
}

function showPath(p) {
    const path = d3
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

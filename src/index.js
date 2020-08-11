import * as d3 from 'd3';
import './styles/main.scss';

var width = 100, // % units for CSS responsiveness
    height = 100,
    //snap = 100/8,
    snap = snap || 0.0001,
    x = d3.scaleLinear().domain([0, width]).range([0, width]),
    y = d3.scaleLinear().domain([0, height]).range([0, height]),
    //blue = d3.hsl(216, 0.92, 0.68),
    color = d3
        .scaleOrdinal()
        //.range([
        //  d3.rgb(blue).brighter([0.25]),
        //  d3.rgb(blue),
        //  d3.rgb(blue).darker([0.25])
        //]
        .range(
            d3.schemeDark2.map(function (c) {
                c = d3.rgb(c);
                //c.opacity = 0.5;
                return c;
            }),
        ),
    treemap = d3
        .treemap()
        .size([width, height])
        .tile(
            d3.treemapSquarify,
            //.ratio(1)
        )
        .paddingInner(0)
        .round(false), //true
    data = {
        name: 'Works',
        children: [
            {
                name: 'Identity',
                children: [
                    {
                        name: 'Auto Lenart',
                        children: [
                            { name: 'Photo 1', value: 'cgi-1.jpg' },
                            { name: 'Photo 2', value: 'cgi-2.jpg' },
                            { name: 'Photo 3', value: 'cgi-3.jpg' },
                        ],
                    },
                    {
                        name: 'PrintHouse Corporation',
                        children: [
                            { name: 'Photo 1', value: 'photo-1.jpg' },
                            { name: 'Photo 2', value: 'photo-2.jpg' },
                            { name: 'Photo 3', value: 'photo-3.jpg' },
                            { name: 'Photo 4', value: 'photo-4.jpg' },
                            { name: 'Photo 5', value: 'photo-5.jpg' },
                        ],
                    },
                    {
                        name: 'Mertz',
                        children: [
                            { name: 'Photo 1', value: 'epc-1.jpg' },
                            { name: 'Photo 2', value: 'epc-2.jpg' },
                            { name: 'Photo 3', value: 'epc-3.jpg' },
                        ],
                    },
                    {
                        name: 'Floor Plans',
                        children: [
                            { name: 'Photo 1', value: 'floorplan-1.jpg' },
                            { name: 'Photo 2', value: 'floorplan-2.jpg' },
                        ],
                    },
                ],
            },
            {
                name: 'Web',
                children: [
                    {
                        name: 'Litho',
                        children: [
                            { name: 'Photo 1', value: 'litho-1.jpg' },
                            { name: 'Photo 2', value: 'litho-2.jpg' },
                            { name: 'Photo 3', value: 'litho-3.jpg' },
                            { name: 'Photo 4', value: 'litho-4.jpg' },
                            { name: 'Photo 5', value: 'litho-5.jpg' },
                            { name: 'Photo 6', value: 'litho-6.jpg' },
                        ],
                    },
                    {
                        name: 'Digital',
                        children: [
                            { name: 'Photo 1', value: 'digital-1.jpg' },
                            { name: 'Photo 2', value: 'digital-2.jpg' },
                            { name: 'Photo 3', value: 'digital-3.jpg' },
                            { name: 'Photo 4', value: 'digital-4.jpg' },
                        ],
                    },
                ],
            },
            {
                name: 'Finish',
                children: [
                    {
                        name: 'Folding',
                        children: [
                            { name: 'Photo 1', value: 'folding-1.jpg' },
                            { name: 'Photo 2', value: 'folding-2.jpg' },
                            { name: 'Photo 3', value: 'folding-3.jpg' },
                        ],
                    },
                    {
                        name: 'Stitched',
                        children: [
                            { name: 'Photo 1', value: 'stitched-1.jpg' },
                            { name: 'Photo 2', value: 'stitched-2.jpg' },
                            { name: 'Photo 3', value: 'stitched-3.jpg' },
                            { name: 'Photo 4', value: 'stitched-4.jpg' },
                            { name: 'Photo 5', value: 'stitched-5.jpg' },
                        ],
                    },
                    {
                        name: 'Sewn',
                        children: [
                            { name: 'Photo 1', value: 'sewn-1.jpg' },
                            { name: 'Photo 2', value: 'sewn-2.jpg' },
                            { name: 'Photo 3', value: 'sewn-3.jpg' },
                        ],
                    },
                    {
                        name: 'Softback',
                        children: [
                            { name: 'Photo 1', value: 'softback-1.jpg' },
                            { name: 'Photo 3', value: 'softback-2.jpg' },
                        ],
                    },
                    {
                        name: 'Hardback',
                        children: [
                            { name: 'Photo 1', value: 'hardback-1.jpg' },
                            { name: 'Photo 2', value: 'hardback-2.jpg' },
                            { name: 'Photo 3', value: 'hardback-3.jpg' },
                            { name: 'Photo 4', value: 'hardback-4.jpg' },
                        ],
                    },
                ],
            },
        ],
    },
    nodes = d3.hierarchy(data).sum(function (d) {
        return d.value ? 1 : 0;
    }),
    resizeTimer,
    currentDepth;

treemap(nodes);

var chart = d3.select('#chart');
var cells = chart
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

cells
    //.style("transform", function(d) { return "translateY(" + chart.node().clientHeight * y(d.y0) / 100 + ")"; })
    .style('left', function (d) {
        //console.log( x(d.x0) + " => " + nearest(x(d.x0), snap) );
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
        return color(d.data.name);
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

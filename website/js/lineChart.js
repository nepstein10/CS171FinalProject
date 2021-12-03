
class LineChart {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        let vis = this;

    }


    initVis() {
        let vis = this;

        vis.margin = {top: 100, right: 150, bottom: 60, left: 100};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Overlay with path clipping
        vis.svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        // Scales and axes
        vis.x = d3.scaleLinear()
            .range([0, vis.width])
            .domain(d3.extent(vis.data, d=> d.Year));

        console.log(vis.x(2010))

        console.log(vis.data)

        vis.y = d3.scaleLinear()
            .range([vis.height, 0])
            .domain([0, 50])

        console.log(vis.y(0.15))

        //console.log(vis.data)

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .tickFormat(d=>d);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .tickFormat(d=>d+"%");

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // TO-DO: Initialize brush component
        let brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.height]])
            .on("brush", brushed);

        // TO-DO: Append brush component here
        vis.svg.append("g")
            .attr("class", "x brush")
            .call(brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", vis.height + 7);

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        //Draw the line
        vis.svg.append("path")
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return vis.x(d.Year) })
                .y(function(d) { return vis.y(100*d['3P']) })
            )

        vis.svg.append("path")
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "crimson")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return vis.x(d.Year) })
                .y(function(d) { return vis.y(100*d['16 ft to 3P']) })
            )

        //Draw the line
        vis.line = d3.line()
            .x(d => vis.x(d.Year))
            .y(d => vis.y(100*d['3P']))
            .curve(d3.curveLinear);

        console.log(vis.line(vis.data))

        /*vis.path = vis.svg.selectAll('path').data(vis.data);
        vis.path.enter().append('path')
            .attr('d', vis.line(vis.data))
            .attr("fill", "none")
            .attr('stroke', '#1C9A3D')*/
            
        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);

    }



}



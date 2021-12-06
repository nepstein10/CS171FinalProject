
class LineChart {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        let vis = this;

    }


    initVis() {
        let vis = this;

        vis.margin = {top: 25, right: 20, bottom: 25, left: 50};

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

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .tickFormat(d=>d)
            .ticks(5)

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .tickFormat(d=>d+"%");

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        let brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.height]])
            .on("brush", brushed);

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
            .attr("stroke", "#4e79a7")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return vis.x(d.Year) })
                .y(function(d) { return vis.y(100*d['3P']) })
            )

        vis.svg.append("path")
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", "#e15759")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return vis.x(d.Year) })
                .y(function(d) { return vis.y(100*d['16 ft to 3P']) })
            )
            
        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);

        vis.svg.append("circle")
            .attr("fill", "#e15759")
            .attr("cx", 20)
            .attr("cy", 100)
            .attr("r", 4)

        vis.svg.append("text")
            .attr("transform", "translate(28, 104)")
            .attr("class", "linechartlabel")
            .text("16 ft to 3P")

        vis.svg.append("circle")
            .attr("fill", "#4e79a7")
            .attr("cx", 20)
            .attr("cy", 80)
            .attr("r", 4)

        vis.svg.append("text")
            .attr("transform", "translate(28, 84)")
            .attr("class", "linechartlabel")
            .text("3P")

    }



}



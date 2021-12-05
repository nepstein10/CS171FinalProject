/* * * * * * * * * * * * * *
*         PieChart         *
* * * * * * * * * * * * * */


class PieChart {

    // constructor method to initialize PieChart object
    constructor(parentElement, data, title) {
        this.parentElement = parentElement;
        this.circleColors = ['#d94d09', '#B54213'];
        // this.circleColors = ['#E47041', '#B54213'];
        this.data = data;
        this.title = title;

        // initialize vis
        this.initVis();
    }

    initVis() {
        let vis = this;

        // margin conventions
        vis.margin = {top: 10, right: 0, bottom: 10, left: 0};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // add title
        vis.svg.append('g')
            .attr('class', 'title pie-title')
            .append('text')
            .text(vis.title)
            .attr('transform', `translate(${51}, 90)`)
            .attr('text-anchor', 'middle');

        // pie chart setup
        vis.pieChartGroup = vis.svg
            .append('g')
            .attr('class', 'pie-chart')
            .attr("transform", "translate(" + 51 + "," + ((vis.height / 2) - 15) + ")");

        // Define a default pie layout
        vis.pie = d3.pie()
            .value(d => d.value);

        // Pie chart settings
        vis.outerRadius = 50;
        vis.innerRadius = 0;      // Relevant for donut charts

        // Path generator for the pie segments
        vis.arc = d3.arc()
            .innerRadius(vis.innerRadius)
            .outerRadius(vis.outerRadius);

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "pieTooltip")
            .attr('id', 'pieTooltip');

        // create gradient fills
        vis.gradient0 = vis.svg.append("svg:defs")
            .append("svg:radialGradient")
            .attr("id", "gradient0")
            .attr("cx", "0%")
            .attr("cy", "0%")
            .attr("r", "50%")
            .attr("fx", "0%")
            .attr("fy", "0%")
            .attr("spreadMethod", "pad")
            .attr("gradientUnits", "userSpaceOnUse");

        vis.gradient0.append("svg:stop")
            .attr("offset", "0%")
            .attr("stop-color", '#e06a1c')
            .attr("stop-opacity", 1);

        vis.gradient0.append("svg:stop")
            .attr("offset", "100%")
            .attr("stop-color", '#161616')
            .attr("stop-opacity", 1);

        vis.gradient1 = vis.svg.append("svg:defs")
            .append("svg:radialGradient")
            .attr("id", "gradient1")
            .attr("cx", "0%")
            .attr("cy", "0%")
            .attr("r", "50%")
            .attr("fx", "0%")
            .attr("fy", "0%")
            .attr("spreadMethod", "pad")
            .attr("gradientUnits", "userSpaceOnUse");

        vis.gradient1.append("svg:stop")
            .attr("offset", "0%")
            .attr("stop-color", vis.circleColors[1])
            .attr("stop-opacity", 1);

        vis.gradient1.append("svg:stop")
            .attr("offset", "100%")
            .attr("stop-color", "#161616")
            .attr("stop-opacity", 1);

        // call next method in pipeline
        this.wrangleData();
    }

    // wrangleData method
    wrangleData() {
        let vis = this;

        vis.displayData = [];

        vis.displayData.push({
                label: "2PA",
                value: vis.data["2PA"] / vis.data["FGA"],
            });

        vis.displayData.push({
            label: "3PA",
            value: vis.data["3PA"] / vis.data["FGA"],
        });

        vis.updateVis();

    }

    // updateVis method
    updateVis() {
        let vis = this;

        // Bind data
        vis.arcs = vis.pieChartGroup.selectAll(".arc")
            .data(vis.pie(vis.displayData));

        // Draw arcs
        vis.arcs.enter()
            .append("path")
            .attr("class", "arc")
            .attr("d", vis.arc)
            .attr('stroke-width', '2px')
            .attr('stroke', 'black')
            .attr('fill', function(d, index) { return `url(#${'gradient' + index })`})
            .on('mouseover', function(event, d){
                // highlight selected segment
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .style('opacity', 0.5);

                // pop up tooltip with more information
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                     <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                         <h4>${d.data.label}</h4>
                         <h4> value: ${Math.round(d.value * 100)}%</h4>           
                     </div>`);

            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', `url(#${'gradient' + d.index })`)
                    .style('opacity', 1);

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

        // labels
        vis.arcs
            .enter()
            .append('text')
            .text(function(d){ return d.data.label })
            .attr("transform", function(d) { return "translate(" + vis.arc.centroid(d) + ")";  })
            .style("text-anchor", "middle")
            .style("font-size", 10)
            .style("fill", "white");
    }
}
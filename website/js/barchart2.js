class BarChart2 {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        let vis = this;

    }


    initVis() {
        let vis = this;

        vis.margin = {top: 100, right: 20, bottom: 60, left: 60};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        //Create y-scale
        vis.y = d3.scaleLinear()
            .range([vis.height, 0])

        //Create x-scale
        vis.x = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner(0.05);

        //Create y-axis
        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .tickFormat(d3.format(".0%"))

        //Create x-axis
        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        //Draw y-axis
        vis.svg.append("g")
            .attr("class", "y-axis axis")
            .attr("transform", "translate(" + 0 + "," + 0 + ")");

        //Draw x-axis
        vis.svg.append("g")
            .attr("class", "x-axis bar-x-axis")
            .attr("transform", "translate(" + 0 + "," + vis.height + ")");

        vis.svg.append("text")
            .attr("transform", "translate(0, -10)")
            .attr("id", "ylabel")
            .text("Career 3P%")

        vis.wrangleData();
    }


    wrangleData() {
        let vis = this;
        vis.data.forEach(entry=>{
            entry['3PA'] = parseFloat(entry['3PA'])
            entry['Percent'] = parseFloat(entry['Percent'])
        })

        vis.data.sort((a,b) => {return b['Percent'] - a['Percent']})

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        console.log(vis.data)

        vis.x.domain(['Ray Allen', 'Reggie Miller', 'Grayson Allen', 'Malik Beasley', 'Ryan Anderson', 'Larry Bird',
            'P.J. Tucker', 'Kent Bazemore', 'Jae Crowder', 'Kyle Kuzma', 'Kelly Oubre Jr.', 'Luguentz Dort',
            'Marcus Smart']);
        vis.y.domain([0, d3.max(vis.data, d=>d['Percent'])]);

        //Draw rectangles
        vis.bars = vis.svg.selectAll("rect")
            .data(vis.data)

        vis.bars
            .enter()
            .append("rect")
            .attr("class", "bars")
            .merge(vis.bars)
            .transition()
            .duration(300)
            .attr("y", d => vis.y(d['Percent']))
            .attr("x", d => vis.x(d.Player))
            .attr("height", d=> vis.height - vis.y(d['Percent']))
            .attr("width", vis.x.bandwidth())
            .attr("fill", function(d){
                return d.Player == "Ray Allen" || d.Player == "Reggie Miller" || d.Player == "Larry Bird" ? "#e15759" : "#666666"});

        // Exit
        vis.bars.exit().remove();

        vis.line = d3.line()([[0, vis.y(0.345)], [vis.width, vis.y(0.345)]])

        vis.svg.append('path')
            .attr("class", "leagueaverage")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("fill", "none")
            .attr('d', vis.line)

        //Update axis
        vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);

        vis.svg.append("text")
            .attr("transform", "translate(" + (vis.width - 165) + "," + (vis.y(0.345) - 10) + ")")
            .attr("id", "leagueavglabel")
            .text("Current Season Average")
    }



}
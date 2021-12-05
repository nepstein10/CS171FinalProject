
class BarChart {

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
            .scale(vis.y);

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
            .text("Career 3PA Per 100 Possessions")

        vis.wrangleData();
    }


    wrangleData() {
        let vis = this;
        vis.data.forEach(entry=>{
            entry['3PA'] = parseFloat(entry['3PA'])
            entry['Percent'] = parseFloat(entry['Percent'])
        })

        vis.data.sort((a,b) => {return b['3PA'] - a['3PA']})

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.x.domain(['Malik Beasley', 'Ryan Anderson', 'Luguentz Dort', 'Kyle Kuzma', 'Jae Crowder', 'Ray Allen',
            'Grayson Allen', 'Marcus Smart', 'Kelly Oubre Jr.', 'Reggie Miller', 'Kent Bazemore', 'P.J. Tucker',
            'Larry Bird']);
        vis.y.domain([0, d3.max(vis.data, d=>d['3PA'])]);

        console.log(vis.x("Luguentz Dort"))

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
            .attr("y", d => vis.y(d['3PA']))
            .attr("x", d => vis.x(d.Player))
            .attr("height", d=> vis.height - vis.y(d['3PA']))
            .attr("width", vis.x.bandwidth())
            .attr("fill", function(d){
                return d.Player == "Ray Allen" || d.Player == "Reggie Miller" || d.Player == "Larry Bird" ? "#e15759" : "#666666"});

        // Exit
        vis.bars.exit().remove();


        //Update axis
        vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);
    }



}
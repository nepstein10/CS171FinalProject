
class BarChart {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        let vis = this;

    }


    initVis() {
        let vis = this;

        vis.margin = {top: 25, right: 20, bottom: 100, left: 60};

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

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'playerChartToolTip')

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

        //console.log(vis.x("Luguentz Dort"))

        //Draw rectangles
        vis.bars = vis.svg.selectAll("rect")
            .data(vis.data)
        
        vis.bars
            .enter()
            .append("rect")
            .attr("class", "bars")
            //Mouseover
            .on('mouseover', function(event, d) {
                console.log(d)
                //Fill color on hover
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div>
                             <h6>${d['3PA']}<h6>
                         </div>`);
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '0px')

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
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

        vis.line = d3.line()([[0, vis.y(6.67)], [vis.width, vis.y(6.67)]])

        vis.svg.append('path')
            .attr("class", "leagueaverage")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("fill", "none")
            .attr('d', vis.line)


        //Update axis
        vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis)
            .selectAll("text")
            .attr("x", 0)
            .attr("y", 9)
            .attr("dy", "-.75rem")
            .attr("dx", ".75rem")
            .attr("transform", `rotate(90)`)
            .style("text-anchor", "start");


        vis.svg.append("text")
            .attr("transform", "translate(" + (vis.width - 165) + "," + (vis.y(6.67) - 10) + ")")
            .attr("id", "leagueavglabel")
            .text("2021 League Average")

        vis.svg.append("circle")
            .attr("fill", "#e15759")
            .attr("cx", 3 * vis.width / 4)
            .attr("cy", 0)
            .attr("r", 4)

        vis.svg.append("text")
            .attr("transform", "translate(" + (3 * vis.width / 4 + 10) + ", 4)")
            .attr("class", "barchartlabel")
            .text("Historic Shooters")

        vis.svg.append("circle")
            .attr("fill", "#666666")
            .attr("cx", 3 * vis.width / 4)
            .attr("cy", 20)
            .attr("r", 4)

        vis.svg.append("text")
            .attr("transform", "translate(" + (3 * vis.width / 4 + 10) + ", 24)")
            .attr("class", "barchartlabel")
            .text("Modern Day Players")
    }
}

class PlayerChart {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 40, right: 40, bottom: 60, left: 40};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.x = d3.scaleLinear()
            .range([0, vis.width])

        vis.y = d3.scaleLinear()
            .range([vis.height, 0])

        vis.colorscale = d3.scaleLinear()
            .range(["#ccdcf9", "#113d8e"])

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .tickFormat(d => d);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        //Add Tooltip placeholder
        vis.svg.append("text")
            .attr("transform", "translate(" + vis.width / 1.15 + ",20)")
            .attr("id", "player")
            .text("Player")

        vis.svg.append("text")
            .attr("transform", "translate(5, 20)")
            .attr("id", "ylabel")
            .text("Cumulative Career 3PA")

        vis.wrangleData()

    }

    wrangleData() {
        let vis = this;

        vis.players = []

        vis.data.forEach(i => vis.players.push(i['Player']))

        vis.uniqueplayers = vis.players.filter((item, i, k) => k.indexOf(item) === i)

        vis.counter = 0
        vis.uniqueplayers.forEach(player => {
            vis.array = []
            vis.filtered = vis.data.filter(d => d.Player == player)
            vis.filtered.forEach(i => {
                let num = i['3PA']
                vis.array.push(num)
            })

            vis.array = d3.cumsum(vis.array)

            for (let i = 0; i < vis.array.length; i++) {
                vis.data[vis.counter]['3PA'] = vis.array[i]
                vis.counter = vis.counter + 1
            }
        })

        vis.updateVis()
    }



    updateVis() {
        let vis = this;

        vis.x.domain(d3.extent(vis.data, d=> d.Season));

        vis.y.domain(d3.extent(vis.data, d=> +d["3PA"]));

        vis.colorscale.domain(d3.extent(vis.data, d=>+d['3PA']))

        //use .nest()function to group data so the line can be computed for each group
        vis.sumstat = d3.group(vis.data, d=>d.Player)

        vis.path = vis.svg.selectAll('path').data(vis.sumstat);

        // Draw the line
        vis.path.enter().append('path')
            .attr("class", "playerlines")
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .attr("stroke", function(d) {
                return vis.colorscale(d[1][d[1].length-1]['3PA'])
            })
            .attr("d", function(d){
                return d3.line().curve(d3.curveNatural)
                    .x(d => vis.x(d.Season))
                    .y(d => vis.y(+d["3PA"]))
                    (d[1])
            })
            .on("mouseover", function(event, d) {
                document.getElementById("player").innerHTML = d[0]
                d3.selectAll(".playerlines").style('stroke', 'lightgrey')
                d3.select(this).style('stroke', 'crimson')
            })
            .on("mouseout", function(event, d) {
                d3.selectAll(".playerlines").style('stroke', function(d) {
                    return vis.colorscale(d[1][d[1].length-1]['3PA'])
                });
            })

        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);

    }

    playerSelect() {
        if(selectedPlayer1 != "NA" || selectedPlayer2 != "NA") {
            d3.selectAll(".playerlines").style('stroke', 'lightgrey')
        }
    }


}
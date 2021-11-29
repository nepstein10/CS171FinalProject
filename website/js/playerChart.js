
class PlayerChart {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 40, right: 150, bottom: 60, left: 100};

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

        vis.svg.append("text")
            .attr("transform", "translate(5, 20)")
            .attr("id", "ylabel")
            .text("Cumulative Career 3PA")

        //Set up tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'playerChartToolTip')

        // Initialize buttons
        d3.select("#playerSelectButtons").html(
            `<select id='playerSelector1' className="custom-select align-self-center" style="width: 50%"
                    onChange="playerChange()">
                <option value="NA" selected>Player 1</option>
                <option value="LebronJames">Lebron James</option>
                <option value="StephCurry">Steph Curry</option>
                <option value="MichaelJordan">Michael Jordan</option>
                <option value="ReggieMiller">Reggie Miller</option>
                <option value="RayAllen">Ray Allen</option>
            </select>
            <select id='playerSelector2' className="custom-select align-self-center" style="width: 50%"
                onChange="playerChange()">
                <option value="NA" selected>Player 2</option>
                <option value="LebronJames">Lebron James</option>
                <option value="StephCurry">Steph Curry</option>
                <option value="MichaelJordan">Michael Jordan</option>
                <option value="ReggieMiller">Reggie Miller</option>
                <option value="RayAllen">Ray Allen</option>
            </select>`
        )

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

        vis.sumstat = d3.group(vis.data, d=>d.Player)

        console.log(vis.data)

        vis.colorscale.domain(d3.extent(vis.sumstat, d=>
            (d[1][d[1].length-1]['3PA']) / (d[1][d[1].length-1]['Season'] - d[1][0]['Season'])))

        vis.path = vis.svg.selectAll('path').data(vis.sumstat);

        // Draw the line
        vis.paths = vis.path.enter().append('path')
            .attr("class", "playerlines")
            .attr("id", function(d) {
                return d[0].replace(/\s+/g, '')
            })
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("stroke", function(d) {
                return vis.colorscale((d[1][d[1].length-1]['3PA']) /
                    (d[1][d[1].length-1]['Season'] - d[1][0]['Season']))
            })
            .attr("d", function(d){
                return d3.line().curve(d3.curveNatural)
                    .x(d => vis.x(d.Season))
                    .y(d => vis.y(+d["3PA"]))
                    (d[1])
            })
            .on("mouseover", function(event, d) {
                d3.selectAll(".playerlines").style('stroke', 'lightgrey')
                d3.select(this).style('stroke', 'crimson')
                d3.select(this).raise()
                vis.svg.select(".x-axis").raise()

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; background: none; padding: 5px;">
                             <p>${d[0]}<p>
                         </div>`);

                d3.selectAll(".selectedPlayerLabel").remove()

                document.getElementById("playerSelector1").value = "NA"
                document.getElementById("playerSelector2").value = "NA"
            })
            .on("mouseout", function(event, d) {
                d3.selectAll(".playerlines").style('stroke', function(d) {
                    return vis.colorscale((d[1][d[1].length-1]['3PA']) /
                        (d[1][d[1].length-1]['Season'] - d[1][0]['Season']))
                });

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .attr("stroke-dasharray", 700 + " " + 700)
            .attr("stroke-dashoffset", 700)
            .transition()
            .delay(function(d, i) { return i * 500; })
            .duration(4000)
            .attr("stroke-dashoffset", 0);

            //console.log(vis.paths.node().getTotalLength())

        // Call axis functions with the new domain
        vis.svg.select(".x-axis")
            .call(vis.xAxis)
            .raise();
        vis.svg.select(".y-axis").call(vis.yAxis);

        /*vis.eras = [1980, 1990, 2000, 2010]

        vis.eras.forEach( era => {
            console.log(era) //Works fine
            vis.data.erafiltered = vis.data.filter(d => d.Era == era)
            console.log(vis.data.erafiltered) //Looks correct
            vis.sumstatera = d3.group(vis.data.erafiltered, d=>d.Player)
            console.log(vis.sumstatera) //Looks correct

            vis.path = vis.svg.selectAll('path').data(vis.sumstatera);
            console.log(vis.path) //Looks wrong

            vis.paths = vis.path.enter().append('path')
                .attr("class", "playerlines")
                .attr("id", function(d) {
                    return d[0].replace(/\s+/g, '')
                })
                .attr("fill", "none")
                .attr("stroke-width", 3)
                .attr("stroke", function(d) {
                    return vis.colorscale((d[1][d[1].length-1]['3PA']) /
                        (d[1][d[1].length-1]['Season'] - d[1][0]['Season']))
                })
                .attr("d", function(d){
                    return d3.line().curve(d3.curveNatural)
                        .x(d => vis.x(d.Season))
                        .y(d => vis.y(+d["3PA"]))
                        (d[1])
                })
                /!*.attr("stroke-dasharray", 700 + " " + 700)
                .attr("stroke-dashoffset", 700)
                .transition()
                .delay(function(d, i) { return i * 1000; })
                .duration(4000)
                .attr("stroke-dashoffset", 0);*!/

            //console.log(vis.paths.node().getTotalLength())

        })*/

    }

    playerSelect() {

        let vis = this;
        console.log(selectedPlayer1, selectedPlayer2)

        if(selectedPlayer1 != "NA" || selectedPlayer2 != "NA") {
            d3.selectAll(".selectedPlayerLabel").remove()

            d3.selectAll(".playerlines").style('stroke', 'lightgrey')

            vis.selectedPlayers = [selectedPlayer1, selectedPlayer2]

            vis.index = 1

            vis.selectedPlayers.forEach(player=> {
                d3.select("#"+player).style('stroke', 'crimson')
                d3.select("#"+player).raise()

                vis.distance = d3.select("#"+player)._groups[0][0].getTotalLength()
                vis.xcoord = d3.select("#"+player)._groups[0][0].getPointAtLength(vis.distance).x
                vis.ycoord = d3.select("#"+player)._groups[0][0].getPointAtLength(vis.distance).y

                vis.selector = document.getElementById("playerSelector"+vis.index)
                vis.playerText = vis.selector.options[vis.selector.selectedIndex].text

                vis.svg.append("text")
                    .attr("transform", "translate(" + vis.xcoord + "," + vis.ycoord + ")")
                    .attr("class", "selectedPlayerLabel")
                    .text(vis.playerText)

                vis.index = vis.index + 1
            })
        }
    }


}
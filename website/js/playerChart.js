
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

        vis.colorScale = d3.scaleOrdinal()
            .domain([1980, 2010])
            .range(d3.schemeTableau10);

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

        vis.svg.append("text")
            .attr("transform", "translate(" + (vis.width - vis.margin.right) + "," + (vis.height + vis.margin.top) + ")")
            .attr("id", "xlabel")
            .text("Career Games Played")

        //Set up tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'playerChartToolTip')

        //Create legend
        vis.colors = ["#4e79a7", "#e15759", "#76b7b2", "#f28e2c"]
        vis.eras = ["1980", "1990", "2000", "2010"]

        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(${vis.width + 20}, ${0})`)

        vis.legendtext = vis.svg.append("g")
            .attr('class', 'legendtext')
            .attr('transform', `translate(${vis.width + 50}, ${0})`)

        vis.svg.append("text")
            .attr("transform", "translate(" + (vis.width + 20) + "," + (-15) + ")")
            .attr("id", "legendtitle")
            .text("Player's Main Era")


        // Initialize buttons
        d3.select("#playerSelectButtons").html(
            `<select id='playerSelector1' className="custom-select align-self-center" style="width: 50%"
                    onChange="playerChange()">
                <option value="NA" selected>Select Player 1 for Comparison</option>
                <option value="LebronJames">Lebron James</option>
                <option value="StephCurry">Steph Curry</option>
                <option value="MichaelJordan">Michael Jordan</option>
                <option value="ReggieMiller">Reggie Miller</option>
                <option value="RayAllen">Ray Allen</option>
                <option value="KobeBryant">Kobe Bryant</option>
            </select>
            <select id='playerSelector2' className="custom-select align-self-center" style="width: 50%"
                onChange="playerChange()">
                <option value="NA" selected>Select Player 2 for Comparison</option>
                <option value="LebronJames">Lebron James</option>
                <option value="StephCurry">Steph Curry</option>
                <option value="MichaelJordan">Michael Jordan</option>
                <option value="ReggieMiller">Reggie Miller</option>
                <option value="RayAllen">Ray Allen</option>
                <option value="KobeBryant">Kobe Bryant</option>
            </select>`
        )

        /*d3.select("#positionFilter").html(
            `<select id='positionSelector' className="custom-select align-self-center" style="width: 50%"
                    onChange="positionChange()">
                <option value="NA" selected>Filter by Player Position</option>
                <option value="Guard">Guard</option>
                <option value="Wing">Wing</option>
                <option value="Big">Big</option>
            </select>`
        )*/

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

        console.log(vis.data)

        vis.updateVis()

    }


    positionSelect() {
        let vis = this
        vis.position = selectedPosition
        console.log(vis.position)
        vis.updateVis()
        d3.selectAll(".playerlines").style('stroke', function(d) {
            return vis.colorScale(parseInt(d[1][0]['Era']))
        });
    }


    updateVis() {
        let vis = this;

        console.log(vis.position)

        if (vis.position == "Big" || vis.position == "Wing" || vis.position == "Guard") {
            vis.sumstat = d3.group(vis.data.filter(d=> d.Position==vis.position), d=>d.Player)
            console.log(vis.sumstat)
            vis.x.domain(d3.extent(vis.data.filter(d=> d.Position==vis.position), d=> parseInt(d["Total GP"])));
            vis.y.domain(d3.extent(vis.data.filter(d=> d.Position==vis.position), d=> +d["3PA"]));
            d3.selectAll(".selectedPlayerLabel").remove()
            document.getElementById("playerSelector1").value = "NA"
            document.getElementById("playerSelector2").value = "NA"
        }
        else {
            vis.sumstat = d3.group(vis.data, d=>d.Player)
            console.log(vis.sumstat)
            vis.x.domain(d3.extent(vis.data, d=> parseInt(d["Total GP"])));
            vis.y.domain(d3.extent(vis.data, d=> +d["3PA"]));
        }

        vis.path = vis.svg.selectAll('path').data(vis.sumstat);

        // Draw the line
        vis.paths = vis.path
            .enter()
            .append('path')
            .attr("class", "playerlines")
            //.attr("class", d => `playerlines pEra${d[1][1]['Era']}`)
            .attr("id", function(d) {
                return d[0].replace(/\s+/g, '')
            })
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("stroke", function(d) {
                return vis.colorScale(parseInt(d[1][0]['Era']))
            })
            .attr("d", function(d){
                return d3.line().curve(d3.curveNatural)
                    .x(d => vis.x(d["Total GP"]))
                    .y(d => vis.y(+d["3PA"]))
                    (d[1])
            })

        vis.path
            .merge(vis.path)
            .transition()
            .attr("stroke", function(d) {
                return vis.colorScale(parseInt(d[1][0]['Era']))
            })
            .attr("d", function(d){
                return d3.line().curve(d3.curveNatural)
                    .x(d => vis.x(d["Total GP"]))
                    .y(d => vis.y(+d["3PA"]))
                    (d[1])
            })

        vis.path.exit().remove();

        vis.paths
            .on("mouseover", function(event, d) {
                d3.selectAll(".playerlines").style('stroke', '#AEAEAE')
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
                    return vis.colorScale(parseInt(d[1][0]['Era']))
                });

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })


        //vis.length = vis.paths.node().getTotalLength()

        vis.paths
            .attr("stroke-dasharray", 1180 + " " + 1180)
            .attr("stroke-dashoffset", 1180)
            .transition()
            .delay(function(d, i) { return i; })
            .duration(6000)
            .attr("stroke-dashoffset", 0);

        // Call axis functions with the new domain
        vis.svg.select(".x-axis")
            .transition()
            .duration(800)
            .call(vis.xAxis)

        vis.svg.select(".x-axis").raise();

        vis.svg.select(".y-axis")
            .transition()
            .duration(800)
            .call(vis.yAxis);

        for (let i=0; i<4; i++) {
            vis.legend.selectAll().data(vis.colors)
                .enter()
                .append("rect")
                .attr("y", 20 * i)
                .attr("height",20)
                .attr("width", 20)
                .attr("fill", vis.colors[i])

            vis.legendtext
                .append("text")
                .text(vis.eras[i])
                .attr("y", 20 * i + 15)
        }

    }


    playerSelect() {

        let vis = this;
        console.log(selectedPlayer1, selectedPlayer2)

        if(selectedPlayer1 != "NA" || selectedPlayer2 != "NA") {
            d3.selectAll(".selectedPlayerLabel").remove()

            d3.selectAll(".playerlines").style('stroke', '#AEAEAE')

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
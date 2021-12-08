class ShotChart {
    constructor(parentElement, data, initialSeason=2000, loadSeasonShots) {
        this.parentElement = parentElement
        this.data = data
        this.season = initialSeason
        this.loadSeasonShots = loadSeasonShots

        this.displayData = []
        this.filters = {
            label: "",
            players:[], teams:[], playoffs: "all",
            color: "", // options would include "team" and "made"
            subset: 0.1 // fraction of data to include
        }

        this.startMessage = "Here is a chart with all NBA shot attempts from the 1997-98 season " +
            "until the 2019-20 season. That's over 4 million shots! We've started you off by " +
            "showing you a random 10% of the shots from the 1999-2000 season, and recommend you " +
            "start by using the slider to see how shots change over time. Afterwards, click the " +
            "buttons to see some specific interesting players and trends, or explore your favorite " +
            "team's shot selection!"
        this.message = this.startMessage

        //this.filters.players.push("Tim Legler")
        //this.filters.teams.push("Golden State Warriors")
        //this.season = 2013
    }

    initVis() {
        let vis = this
        console.log(vis.data)

        let H_W_RATIO = 1455.0 / 1365.0 // Ratio of court jpg, want to maintain that

        vis.margin = {top: 10, right: 10, bottom: 50, left: 10}
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        console.log(vis.height)
        vis.width = vis.height * H_W_RATIO
        // vis.width = Math.max(vis.height * H_W_RATIO, document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right)
        //vis.height = vis.width / H_W_RATIO

        // SVG Area
        vis.svg = d3.select('#' + vis.parentElement).append("svg")
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
            .domain([-250, 250]) // Values correspond to the x values of the sidelines in the shot data

        vis.y = d3.scaleLinear()
            .range([vis.height, 0])
            .domain([-52, 418]) // Values correspond to the y values of the shot data from base to half

        // Add the background court image
        vis.svg.append("image")
            .attr("href", "./img/nba_court.jpg")
            .attr("width", vis.width)
            .attr("height", vis.height)

        // Add the season slider
        let sliderScale = d3.scaleLinear(
            [1998, 2020],
            [10, vis.width - 10])

        vis.slider = d3.sliderHorizontal(sliderScale)
            .step(1)
            .default(2000)
            .tickFormat(s => s)
            .on("onchange", val =>
                vis.sliderChange(val)
            )

        vis.svg.append("g")
            .attr("class", "slider")
            .attr("transform", `translate(0,${vis.height + 10})`)
            .call(vis.slider)

        // Show loading message
        vis.svg.append("text")
            .text("Data Loading...")
            .attr("id", "shot-message-text")
            .attr("x", vis.width/2)
            .attr("y", vis.height/4)
            .attr("text-anchor", "middle")
            .attr("font-size", `${vis.height/20}px`)
        vis.loading(true)

        // Add meaning message
        vis.messageP = d3.select('#shotChartMessage').append('p')
            .attr("class", "story-text small")
            .html(vis.message)

        //vis.wrangleData()
    }

    wrangleData() {
        let vis = this

        vis.loading(true)

        let parseDate = d3.timeParse("%Y%m")
        // Filter data as needed
        vis.displayData = vis.data[vis.season]

        let filterBools = []

        if(vis.filters.players.length) {
            filterBools.push(row => {
                let retVal = false
                vis.filters.players.forEach(n => {
                        if (row.name.toLowerCase().includes(n.toLowerCase())) {
                            retVal = true
                        }
                    }
                )
                return retVal
            })
        }
        if(vis.filters.teams.length) {
            filterBools.push(row => {return vis.filters.teams.includes(row.team)})
        }
        if(vis.filters.playoffs === "playoffs") {
            filterBools.push(row => {return row.playoffs})
        } else if (vis.filters.playoffs === "regular") {
            filterBools.push(row => {return !row.playoffs})
        }
        //console.log(vis.displayData)

        let playerSet = new Set()
        vis.displayData = vis.displayData.filter(row => {
            let retVal = true
            filterBools.forEach(b => {
                if(!b(row)) {
                    retVal = false
                }
            })
            if (retVal && vis.filters.subset < 1 && Math.random() > vis.filters.subset) {
                retVal = false
            }
            if (retVal && vis.filters.players.length) {
                playerSet.add(row.name)
            }
            return retVal
        })
        //console.log("Display data:", vis.displayData)
        if (vis.filters.players.length && playerSet.size) {vis.listPlayers(playerSet)}
        console.log("Players shown: ", playerSet)

        // Apply keys
        let keyCounters = {"BC": 0, "C": 0, "LC": 0, "RC": 0, "R": 0, "L": 0}
        vis.displayData = vis.displayData.map(row => {
            let zone = row.zone
            row.key = zone + keyCounters[zone]
            keyCounters[zone]++
            return row
        } )
        console.log("# to Display: ", vis.displayData.length)

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        vis.messageP.html(vis.message)

        let durTime = vis.displayData.length >= 10000 ? 0 : 2000

        let circles = vis.svg.selectAll("circle")
            .data(vis.displayData, d => d.key)
        circles.join(
            enter => {enter.append("circle")
                .attr("cx", d => vis.x(d.shotx))
                .attr("cy", d => vis.y(d.shoty))
                .attr("r", 8)
                .attr("fill", function(d) {
                    if(vis.filters.color === "made") {
                        return d.made ? "green" : "red"
                    } else if (vis.filters.color === "team") {
                        return returnDualColor(d.team, true)
                    } else {
                        return "black"
                    }
                })
                .style("opacity", 0)
                .transition().duration(durTime)
                .attr("r", 2)
                .style("opacity", function(d) {
                    return 1/Math.log10(vis.displayData.length) //["made", "team"].includes(vis.filters.color) ?
                    //1 - (1 - 1/Math.log10(vis.displayData.length))/2 : 1/Math.log10(vis.displayData.length)
                })
                .selection()}
            , update => {update
                .transition().duration(durTime)
                .attr("cx", d => vis.x(d.shotx))
                .attr("cy", d => vis.y(d.shoty))
                .attr("r", 2)
                .attr("fill", function(d) {
                    if(vis.filters.color === "made") {
                        return d.made ? "green" : "red"
                    } else if (vis.filters.color === "team") {
                        return returnDualColor(d.team, true)
                    } else {
                        return "black"
                    }
                })
                .style("opacity", function(d) {
                    return 1/Math.log10(vis.displayData.length) //["made", "team"].includes(vis.filters.color) ?
                        //1 - (1 - 1/Math.log10(vis.displayData.length))/2 : 1/Math.log10(vis.displayData.length)
                })
                .selection()}
            , exit => {exit
                .transition().duration(durTime)
                .style("opacity", 0)
                .remove()}
        )

        vis.loading(false)
        if (vis.displayData.length == 0) {vis.noData(true)}
        else {vis.noData(false)}
    }

    loading(b){
        d3.select("#shot-message-text")
            .text("Data Loading...")
            .attr("display", b ? "block" : "none")
    }

    noData(b){
        d3.select("#shot-message-text")
            .text("No Data: Try a season this player played")
            .attr("display", b ? "block" : "none")
    }

    async sliderChange(year) {
        let vis = this
        console.log("slider change to " + year)
        vis.loading(true)
        vis.season = year
        if (!vis.data[year]) {
            await loadSeasonShots(year)
        }
        vis.wrangleData()
    }

    listPlayers(pset) {
        let vis = this
        let str = "Players shown: "
        pset.forEach(val => {
            str += val + ', '
        })
        function getIndex() {
            let ind = vis.message.lastIndexOf('<br/>')
            return ind ? ind + 5 : 0
        }
        vis.message = str.slice(0, -2) + "<br/> <br/>" + vis.message.slice(getIndex())
    }
}
class ShotChart {
    constructor(parentElement, data, initialSeason=2000, loadSeasonShots) {
        this.parentElement = parentElement
        this.data = data
        this.season = initialSeason
        this.loadSeasonShots = loadSeasonShots

        this.displayData = []
        this.filters = {
            players:[], teams:[], playoffs: "all",
            color: "" // options would include "team" and "made"
        }

        //this.filters.players.push("Tim Legler")
        this.filters.teams.push("Golden State Warriors")
        //this.season = 2013
    }

    initVis() {
        let vis = this
        console.log(vis.data)

        let H_W_RATIO = 1455.0 / 1365.0 // Ratio of court jpg, want to maintain that

        vis.margin = {top: 10, right: 10, bottom: 60, left: 10}
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.width = vis.height * H_W_RATIO
            //document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;

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

        let slider = d3.sliderHorizontal(sliderScale)
            .step(1)
            .default(2000)
            .on("onchange", val =>
                vis.sliderChange(val)
            )

        vis.svg.append("g")
            .attr("class", "slider")
            .attr("transform", `translate(0,${vis.height + 10})`)
            .call(slider)

        // Show loading message
        vis.svg.append("text")
            .text("Data Loading...")
            .attr("id", "shot-loading-text")
            .attr("x", vis.width/2)
            .attr("y", vis.height/2)
        vis.loading(true)

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
            filterBools.push(row => {return vis.filters.players.includes(row.name)})
        }
        if(vis.filters.teams.length) {
            filterBools.push(row => {return vis.filters.teams.includes(row.team)})
        }
        if(vis.filters.playoffs === "playoffs") {
            filterBools.push(row => {return row.playoffs})
        } else if (vis.filters.playoffs === "regular") {
            filterBools.push(row => {return !row.playoffs})
        }
        // console.log("Filter bools", filterBools)
        // console.log(vis.filters)
        // console.log(vis.displayData[10])
        // filterBools.forEach(b => {
        //     console.log(b, b(vis.displayData[10]))
        // })
        // console.log(vis.displayData.length)
        vis.displayData = vis.displayData.filter(row => {
            let retVal = true
            filterBools.forEach(b => {
                if(!b(row)) {
                    retVal = false
                }
            })
            return retVal
        })
        console.log("Display data:", vis.displayData)

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

        let circles = vis.svg.selectAll("circle")
            .data(vis.displayData, d => d.key)
        circles.enter().append("circle")
            .merge(circles)
            //.transition()
            .attr("cx", d => vis.x(d.shotx))
            .attr("cy", d => vis.y(d.shoty))
            .attr("r", 2)
            .attr("fill", "black")//d => d.made ? "green" : "red")
            .attr("opacity", 1/Math.log10(vis.displayData.length))

        circles.exit().remove()
        vis.loading(false)
    }

    loading(b){
        d3.select("#shot-loading-text").attr("display", b ? "block" : "none")
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
}
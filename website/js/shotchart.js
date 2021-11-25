class ShotChart {
    constructor(parentElement, data) {
        this.parentElement = parentElement
        this.data = data
        Object.keys(this.data).forEach(d => {
            this.data[d] = this.processData(this.data[d])})
        this.displayData = []
    }

    initVis() {
        let vis = this
        console.log(vis.data)

        let H_W_RATIO = 1455.0 / 1365.0 // Ratio of court jpg, want to maintain that

        vis.margin = {top: 10, right: 10, bottom: 10, left: 10}
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

        vis.wrangleData()
    }

    wrangleData() {
        let vis = this

        let season = 1998
        let parseDate = d3.timeParse("%Y%m")
        // Filter data as needed
        vis.displayData = vis.data[season]

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
            .data(vis.displayData)
        circles.enter().append("circle")
            .merge(circles)
            .transition()
            .attr("cx", d => vis.x(d.shotx))
            .attr("cy", d => vis.y(d.shoty))
            .attr("r", 2)
            .attr("fill", "black")
            .attr("opacity", 0.01)

        circles.exit().remove()
    }

    processData(data) {
        let parseDate = d3.timeParse("%Y%m%d")
        let processedData = data.map(function(row) {
            let newrow = {
                date: parseDate(row["Game Date"]),
                name: row["Player Name"],
                distance: +row["Shot Distance"],
                made: row["Shot Made Flag"] === "1" ? true : false,
                three: row["Shot Type"] === "3PT Field Goal" ? true : false,
                zone: row["Shot Zone Area"].slice(
                        row["Shot Zone Area"].indexOf('(') + 1,
                        row["Shot Zone Area"].indexOf(')')),
                team: row["Team Name"],
                shotx: +row["X Location"],
                shoty: +row["Y Location"],
                playoffs: row["Season Type"] === "Playoffs" ? true : false
            }
            return newrow
        })

        return processedData
    }
}
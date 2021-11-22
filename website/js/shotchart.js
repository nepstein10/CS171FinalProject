class ShotChart {
    constructor(parentElement, data) {
        this.parentElement = parentElement
        this.data = data
        this.displayData = []
    }

    initVis() {
        let vis = this
        console.log(vis.data)

        vis.margin = {top: 10, right: 10, bottom: 10, left: 10}
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

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
            .range([vis.width, 0])

        vis.y = d3.scaleLinear()
            .range([vis.height, 0])

        // Add the background court image
        vis.svg.append("image")
            .attr("href", "./img/nba_court.jpg")
            .attr("width", vis.width)
            .attr("height", vis.height)

        vis.wrangleData()
    }

    wrangleData() {
        let vis = this

        vis.displayData = vis.data

        vis.updateVis()
    }

    updateVis() {

    }
}

/*
 * StackedAreaChart - ES6 Class
 * @param  parentElement 	-- the HTML element in which to draw the visualization
 * @param  data             -- the data the that's provided initially
 * @param  displayData      -- the data that will be used finally (which might vary based on the selection)
 *
 * @param  focus            -- a switch that indicates the current mode (focus or stacked overview)
 * @param  selectedIndex    -- a global 'variable' inside the class that keeps track of the index of the selected area
 */

class StackedAreaChart {

// constructor method to initialize StackedAreaChart object
constructor(parentElement, data) {
    this.parentElement = parentElement;
    this.data = data;
    this.displayData = [];

    let colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99'];

    // grab all the keys from the key value pairs in data (filter out 'year' ) to get a list of categories
    this.dataCategories = Object.keys(this.data[0]).filter(d=>d !== "Year")

    // prepare colors for range
    let colorArray = this.dataCategories.map( (d,i) => {
        return colors[i%10]
    })
    // Set ordinal color scale
    this.colorScale = d3.scaleOrdinal()
        .domain(this.dataCategories)
        .range(colorArray);
}


	/*
	 * Method that initializes the visualization (static content, e.g. SVG area or axes)
 	*/
	initVis(){
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

		// Overlay with path clipping
		vis.svg.append("defs").append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("width", vis.width)
			.attr("height", vis.height);

		// Scales and axes
		vis.x = d3.scaleLinear()
			.range([0, vis.width])
			.domain(d3.extent(vis.data, d=> d.Year));

		vis.y = d3.scaleLinear()
			.range([vis.height, 0])

		vis.xAxis = d3.axisBottom()
			.scale(vis.x)
			.tickFormat(d=>d);

		vis.yAxis = d3.axisLeft()
			.scale(vis.y)
			.tickFormat(d=>d*100+"%");

		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")");

		vis.svg.append("g")
			.attr("class", "y-axis axis");

		let stack = d3.stack()
			.keys(vis.dataCategories);

		vis.stackedData = stack(vis.data);

		console.log(vis.stackedData)

		vis.area = d3.area()
			.curve(d3.curveCardinal)
			.x(d=> vis.x(d.data.Year))
			.y0(d=> vis.y(d[0]))
			.y1(d=> vis.y(d[1]));

		// TO-DO (Activity IV): Add Tooltip placeholder
		vis.svg.append("text")
			.attr("id", "label")
			.text("Category")

		// Tooltip
		vis.tooltip = vis.svg.append("g")
			.attr("class", "areacharttooltip")
			.style("display", "none");

		vis.tooltip.append("circle")
			.attr("r", 5);

		vis.tooltip.append("text")
			.attr("x", 10)

		vis.bisectDate = d3.bisector(d=>d.Year).left;

		vis.wrangleData();

	}


	wrangleData(){
		let vis = this;
        
        vis.displayData = vis.stackedData;

		vis.updateVis();
	}


	updateVis(){
		let vis = this;

        vis.y.domain([0, d3.max(vis.displayData, function(d) {
            return d3.max(d, function(e) {
                return e[1];
            });
        })
        ]);

		// Draw the layers
		let categories = vis.svg.selectAll(".area")
			.data(vis.displayData);

		categories.enter().append("path")
			.attr("class", "area")
			.merge(categories)
			.style("fill", d => {
				return vis.colorScale(d)
			})
			.attr("d", d => vis.area(d))
			// TO-DO (Activity IV): update tooltip text on hover
			.on("mouseover", function(event, d) {document.getElementById("label").innerHTML = d.key});

		categories.exit().remove();

		// Call axis functions with the new domain
		vis.svg.select(".x-axis").call(vis.xAxis);
		vis.svg.select(".y-axis").call(vis.yAxis);


		vis.svg.append("rect")
			.attr("class", "overlay")
			.attr("opacity", 0)
			.attr("width", vis.width)
			.attr("height", vis.height)
			.on("mouseover", function() {
				vis.tooltip.style("display", null);
			})
			.on("mouseout", function() {
				vis.tooltip.style("display", "none");
			})
			.on("mousemove", mousemove);


		function mousemove(event) {

			vis.xpos = d3.pointer(event)[0];
			vis.tooltip.attr("transform", "translate(" + vis.xpos + ", 0)")
			vis.xValue = vis.x.invert(vis.xpos)
			vis.index = vis.bisectDate(vis.data, vis.xValue);
			vis.dataelement = vis.data[vis.index]['3P'];
			vis.tooltip.select("text").text(vis.dataelement);
			vis.svg.selectAll(".areacharttooltip").raise()

		}


	}
}

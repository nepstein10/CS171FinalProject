
class StackedAreaChart {

constructor(parentElement, data) {
    this.parentElement = parentElement;
    this.data = data;
    this.displayData = [];

	let vis = this;

    vis.colors = ['#1d428a','#2a60c9','#4c7cda','#769be3','#a0baec'];

    // grab all the keys from the key value pairs in data (filter out 'year' ) to get a list of categories
    this.dataCategories = Object.keys(this.data[0]).filter(d=>d !== "Year")

    // prepare colors for range
    let colorArray = this.dataCategories.map( (d,i) => {
        return vis.colors[i%10]
    })
    // Set ordinal color scale
    this.colorScale = d3.scaleOrdinal()
        .domain(this.dataCategories)
        .range(colorArray);
}


	initVis(){
		let vis = this;

		vis.margin = {top: 100, right: 150, bottom: 60, left: 100};

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

		vis.area = d3.area()
			.curve(d3.curveCardinal)
			.x(d=> vis.x(d.data.Year))
			.y0(d=> vis.height - vis.y(d[0]))
			.y1(d=> vis.height - vis.y(d[1]));

		// Tooltips
		vis.tooltip1 = vis.svg.append("g")
			.attr("class", "areacharttooltip")
			.style("display", "none");
		vis.tooltip1.append("circle")
			.attr("r", 5);
		vis.tooltip1.append("text")
			.attr("x", 10)

		vis.tooltip2 = vis.svg.append("g")
			.attr("class", "areacharttooltip")
			.style("display", "none");
		vis.tooltip2.append("circle")
			.attr("r", 5);
		vis.tooltip2.append("text")
			.attr("x", 10)

		vis.tooltip3 = vis.svg.append("g")
			.attr("class", "areacharttooltip")
			.style("display", "none");
		vis.tooltip3.append("circle")
			.attr("r", 5);
		vis.tooltip3.append("text")
			.attr("x", 10)

		vis.tooltip4 = vis.svg.append("g")
			.attr("class", "areacharttooltip")
			.style("display", "none");
		vis.tooltip4.append("circle")
			.attr("r", 5);
		vis.tooltip4.append("text")
			.attr("x", 10)

		vis.tooltip5 = vis.svg.append("g")
			.attr("class", "areacharttooltip")
			.style("display", "none");
		vis.tooltip5.append("circle")
			.attr("r", 5);
		vis.tooltip5.append("text")
			.attr("x", 10)

		vis.tooltip6 = vis.svg.append("g")
			.attr("class", "areacharttooltip")
			.style("display", "none");
		vis.tooltip6.append("line")
			.style("stroke", "black")
			.style("stroke-width", 1)
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", 0)
			.attr("y2", vis.height);
		vis.tooltip6.append("text")
			.attr("x", 0)
			.attr("y", -25)

		vis.bisectDate = d3.bisector(d=>d.Year).left;

		vis.legend = vis.svg.append("g")
			.attr('class', 'legend')
			.attr('transform', `translate(${vis.width + 20}, ${vis.height - 100})`)

		vis.legendtext = vis.svg.append("g")
			.attr('class', 'legendtext')
			.attr('transform', `translate(${vis.width + 50}, ${vis.height - 100})`)

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
				vis.tooltip1.style("display", null);
				vis.tooltip2.style("display", null);
				vis.tooltip3.style("display", null);
				vis.tooltip4.style("display", null);
				vis.tooltip5.style("display", null);
				vis.tooltip6.style("display", null);
			})
			.on("mouseout", function() {
				vis.tooltip1.style("display", null);
				vis.tooltip2.style("display", null);
				vis.tooltip3.style("display", null);
				vis.tooltip4.style("display", null);
				vis.tooltip5.style("display", null);
				vis.tooltip6.style("display", null);
			})
			.on("mousemove", mousemove);

		for (let i=0; i<5; i++) {
			vis.legend.selectAll().data(vis.colors)
				.enter()
				.append("rect")
				.attr("y", 20 * i)
				.attr("height",20)
				.attr("width", 20)
				.attr("fill", vis.colors[i])

			vis.legendtext
				.append("text")
				.text(Object.keys(vis.data[0])[i+1])
				.attr("y", 20 * i + 15)
		}

		function mousemove(event) {

			vis.percentformat = d3.format(".1%")
			vis.xpos = d3.pointer(event)[0];
			vis.xValue = vis.x.invert(vis.xpos)
			vis.index = vis.bisectDate(vis.data, vis.xValue);

			vis.stat1 = vis.data[vis.index]['3P'];
			vis.ypos1 = vis.y(vis.stat1)
			vis.tooltip1.attr("transform", "translate(" + vis.xpos + "," + vis.ypos1 + ")")
			vis.tooltip1.select("text").text("3P: "+ vis.percentformat(vis.stat1));

			vis.stat2 = vis.data[vis.index]['16 ft to 3P'];
			vis.ypos2 = vis.height - vis.y(1 - vis.stat1) - vis.y(1 - vis.stat2)
			vis.tooltip2.attr("transform", "translate(" + vis.xpos + "," + vis.ypos2 + ")")
			vis.tooltip2.select("text").text("16 ft-3P: " + vis.percentformat(parseFloat(vis.stat2)));

			vis.stat3 = vis.data[vis.index]['10 to 16 ft'];
			vis.ypos3 = vis.ypos2 - vis.y(1 - vis.stat3)
			vis.tooltip3.attr("transform", "translate(" + vis.xpos + "," + vis.ypos3 + ")")
			vis.tooltip3.select("text").text("10-16 ft: " + vis.percentformat(parseFloat(vis.stat3)));

			vis.stat4 = vis.data[vis.index]['3 to 10 ft'];
			vis.ypos4 = vis.ypos3 - vis.y(1 - vis.stat4)
			vis.tooltip4.attr("transform", "translate(" + vis.xpos + "," + vis.ypos4 + ")")
			vis.tooltip4.select("text").text("3-10 ft: " + vis.percentformat(parseFloat(vis.stat4)));

			vis.stat5 = vis.data[vis.index]['0 to 3 ft'];
			vis.ypos5 = vis.ypos4 - vis.y(1 - vis.stat5)
			vis.tooltip5.attr("transform", "translate(" + vis.xpos + "," + vis.ypos5 + ")")
			vis.tooltip5.select("text").text("0-3 ft: " + vis.percentformat(parseFloat(vis.stat5)));

			vis.stat6 = vis.data[vis.index]['Year'];
			vis.tooltip6.attr("transform", "translate(" + vis.xpos + ", 0)")
			vis.tooltip6.select("text").text(parseFloat(vis.stat6));

			vis.svg.selectAll(".areacharttooltip").raise()

		}


	}
}

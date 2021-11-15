
// Variables for the visualization instances
let areachart, timeline;


// Start application by loading the data
loadData();

function loadData() {

	d3.csv("data/percentfg.csv"). then(fgdata=>{
		console.log(fgdata)

		// TO-DO (Activity I): instantiate visualization objects
		areachart = new StackedAreaChart('stacked-area-chart', fgdata);

		// TO-DO (Activity I):  init visualizations
		areachart.initVis();

		timeline = new Timeline('timeline', fgdata)
		timeline.initVis();

	});
}



function brushed() {

	// TO-DO: React to 'brushed' event
	// Get the extent of the current brush
	let selectionRange = d3.brushSelection(d3.select(".brush").node());

	// Convert the extent into the corresponding domain values
	let selectionDomain = selectionRange.map(timeline.x.invert);

	// Update focus chart (detailed information)
	areachart.x.domain(selectionDomain)
	areachart.wrangleData();

}



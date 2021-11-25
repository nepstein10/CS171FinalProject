
// Variables for the visualization instances
let areachart, timeline, shotchart, playerChart;;

let selectedPlayer1, selectedPlayer2;

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

	let yearsLoaded = 0
	let yearlyShotData = {}
	let years = [...Array(23).keys()].map(d=>d+1998)
	const getLastTwo = y => {return (''+y).slice(2)}
	years.forEach(year => {
		d3.csv(`data/ShotsByYear/shots${getLastTwo(year-1)}-${getLastTwo(year)}.csv`).then(yearShotData => {
			yearlyShotData[year] = yearShotData
			yearsLoaded++
			if (yearsLoaded == years.length) {
				shotchart = new ShotChart("shotChart", yearlyShotData)
				shotchart.initVis()
			}
		})
	})

	d3.csv("data/playerData.csv"). then(playerData=>{
		playerChart = new PlayerChart('player-chart', playerData)
		playerChart.initVis()

		selectedPlayer1 = document.getElementById("playerSelector1").value;
		selectedPlayer2 = document.getElementById("playerSelector2").value;
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

function playerChange() {
	selectedPlayer1 = document.getElementById("playerSelector1").value;
	selectedPlayer2 = document.getElementById("playerSelector2").value;
	playerChart.playerSelect()
}



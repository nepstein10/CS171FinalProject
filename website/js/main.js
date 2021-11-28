
// Variables for the visualization instances
let areachart, timeline, shotchart, shotChartControls, playerChart;;

let selectedPlayer1, selectedPlayer2;

let yearlyShotData = {}
let yearsLoaded = 0
let years = [...Array(23).keys()].map(d=>d+1998)

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

	let initialSeason = 2000
	shotchart = new ShotChart("shotChart", yearlyShotData, initialSeason, loadSeasonShots)
	shotchart.initVis()
	loadSeasonShots(initialSeason).then(() => {
		shotchart.wrangleData()
	})

	shotChartControls = new ShotChartControls("shotChartControls", shotchart)
	shotChartControls.initControl()


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

function getLastTwo(y) {return (''+y).slice(2)}

async function loadSeasonShots(year) {
	console.log("Loading data from the " + year + " season")
	await d3.csv(`data/ShotsByYear/shots${getLastTwo(year-1)}-${getLastTwo(year)}.csv`).then(yearShotData => {
		yearlyShotData[year] = processData(yearShotData)
		console.log("done processing now")
	})
}

function processData(data) {
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
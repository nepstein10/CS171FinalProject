
// Variables for the visualization instances
let areachart, shotchart, shotChartControls, playerChart, pieChart;

let selectedPlayer1, selectedPlayer2;

let yearlyShotData = {}
let yearsLoaded = 0
let years = [...Array(23).keys()].map(d=>d+1998)

// Start application by loading the data
loadData();

function loadData() {

	d3.csv("data/percentfg.csv", row => {
		row["0 to 3 ft"] = +row["0 to 3 ft"];
		row["3 to 10 ft"] = +row["3 to 10 ft"];
		row["10 to 16 ft"] = +row["10 to 16 ft"];
		row["16 ft to 3P"] = +row["16 ft to 3P"];
		row["3P"] = +row["3P"];
		return row;
	}). then(fgdata=>{
		areachart = new StackedAreaChart('stacked-area-chart', fgdata);
		areachart.initVis();

		// sum each property across 5 years
		let reducer = function(previousValue, currentValue) {
			return {
				"0 to 3 ft": previousValue["0 to 3 ft"] + currentValue["0 to 3 ft"],
				"3 to 10 ft": previousValue["3 to 10 ft"] + currentValue["3 to 10 ft"],
				"10 to 16 ft": previousValue["10 to 16 ft"] + currentValue["10 to 16 ft"],
				"16 ft to 3P": previousValue["16 ft to 3P"] + currentValue["16 ft to 3P"],
				"3P": previousValue["3P"] + currentValue["3P"]
			};
		};
		let chartNum = 0;
		let titles = ["2000-2004", "2005-2009", "2010-2014", "2015-2019"];
		for (let i = 3; i < 23; i+=5) {
			let reduced = fgdata.slice(i, i+5).reduce(reducer);
			let twoPtSum = 0;
			for (const property in reduced) {
				reduced[property] = reduced[property] / 5;
				if (property != "3P") {
					twoPtSum += reduced[property];
				}
			}
			let data = {"2PT" : twoPtSum, "3PT": reduced["3P"]};
			pieChart = new PieChart('pie-chart-'+chartNum.toString(), data, titles[chartNum]);
			pieChart.initVis();
			chartNum++;
		}

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
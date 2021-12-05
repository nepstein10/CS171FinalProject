
// Variables for the visualization instances


let areachart, shotchart, shotChartControls, playerChart, playerChart2, linechart, barChart;

let selectedPlayer1, selectedPlayer2;

let yearlyShotData = {}
let years = [...Array(23).keys()].map(d=>d+1998)

// Start application by loading the data
loadData();
//sleep(3000)
//getBackgroundData(); //Process some data after rest of page loads

async function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms))}

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
		linechart = new LineChart('line-chart', fgdata)
		linechart.initVis();
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

	d3.csv("data/playerData.csv"). then(playerData=>{
		playerChart2 = new PlayerChart('player-chart-2', playerData)
		playerChart2.initVis()
	});

	d3.csv("data/playerData2.csv"). then(playerData=>{
		barChart = new BarChart('bar-chart', playerData)
		barChart.initVis()
	});

	d3.csv("data/basicdata.csv", row => {
		row["3PA"] = +row["3PA"];
		row["FGA"] = +row["FGA"];
		return row;
	}). then(basicdata=>{
		let titles = ["1980s", "1990s", "2000s", "2010s", "2020s*"];
		let chartNum = 0;
		for (let i = 41; i >= 11; i -= 10) {
			let processed = processBasicData(basicdata, i-9, i+1);
			let pieChart = new PieChart('pie-chart-'+chartNum.toString(), processed, titles[chartNum]);
			chartNum++;
		}
		let processed = processBasicData(basicdata, 0, 2);
		let pieChart = new PieChart('pie-chart-'+chartNum.toString(), processed, titles[chartNum]);
		chartNum++;

	});
}



function brushed() {
	
	let selectionRange = d3.brushSelection(d3.select(".brush").node());

	// Convert the extent into the corresponding domain values
	let selectionDomain = selectionRange.map(linechart.x.invert);

	// Update focus chart (detailed information)
	areachart.x.domain(selectionDomain)
	areachart.wrangleData();

}

function playerChange() {
	selectedPlayer1 = document.getElementById("playerSelector1").value;
	selectedPlayer2 = document.getElementById("playerSelector2").value;
	playerChart.playerSelect()
}

function positionChange() {
	selectedPosition = document.getElementById("positionSelector").value;
	playerChart2.positionSelect()
}

// averages 3PA, 2PA, FGA across 10 seasons
function processBasicData(basicdata, start_index, end_index) {
	console.log(basicdata.slice(start_index, end_index));
	let reduced = basicdata.slice(start_index, end_index).reduce(function(previousValue, currentValue) {
		return {
			"FGA": previousValue["FGA"] + currentValue["FGA"],
			"3PA": previousValue["3PA"] + currentValue["3PA"]
		};
	});
	reduced["2PA"] = reduced["FGA"] - reduced["3PA"];
	Object.keys(reduced).forEach((element, i) => {
		reduced[element] /= 10;
	});
	return reduced;
}

function getLastTwo(y) {return (''+y).slice(2)}

async function loadSeasonShots(year) {
	console.log("Loading data from the " + year + " season")
	await d3.csv(`data/ShotsByYear/shots${getLastTwo(year-1)}-${getLastTwo(year)}.csv`).then(yearShotData => {
		yearlyShotData[year] = processData(yearShotData)
		//console.log("done processing now")
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

	processedData.sort((e1, e2) => {return e1.distance - e2.distance})

	return processedData
}

function getBackgroundData() {
	years.forEach(y => {
		loadSeasonShots(y)
	})
}

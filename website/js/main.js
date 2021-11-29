
// Variables for the visualization instances
let areachart, timeline, playerChart;

let selectedPlayer1, selectedPlayer2;

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

		timeline = new Timeline('timeline', fgdata)
		timeline.initVis();

	});

	d3.csv("data/playerData.csv"). then(playerData=>{
		playerChart = new PlayerChart('player-chart', playerData)
		playerChart.initVis()

		selectedPlayer1 = document.getElementById("playerSelector1").value;
		selectedPlayer2 = document.getElementById("playerSelector2").value;
	});

	d3.csv("data/basicdata.csv", row => {
		row["3PA"] = +row["3PA"];
		row["FGA"] = +row["FGA"];
		return row;
	}). then(basicdata=>{
		let titles = ["1970s", "1980s", "1990s", "2000s", "2010s"];
		let chartNum = 0;
		for (let i = 51; i >= 2; i -= 10) {
			let processed = processBasicData(basicdata, i);
			let pieChart = new PieChart('pie-chart-'+chartNum.toString(), processed, titles[chartNum]);
			chartNum++;
		}
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

// averages 3PA, 2PA, FGA across 10 seasons
function processBasicData(basicdata, i) {
	let reduced = basicdata.slice(i, i+10).reduce(function(previousValue, currentValue) {
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



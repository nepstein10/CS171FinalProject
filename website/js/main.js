
// Variables for the visualization instances
let dseason1 = [], dseason2 = [];
let date=[];
let player=[], team=[], year=[];

let areachart, shotchart, shotChartControls, playerChart, playerChart2, linechart, barChart, barChart2;

let selectedPlayer1, selectedPlayer2;

let yearlyShotData = {}
let years = [...Array(23).keys()].map(d=>d+1998)

// Start application by loading the data
loadData();

loadChartData();

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
	}).then(fgdata => {
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


	d3.csv("data/playerData.csv").then(playerData => {
		playerChart = new PlayerChart('player-chart', playerData)
		playerChart.initVis()
		selectedPlayer1 = document.getElementById("playerSelector1").value;
		selectedPlayer2 = document.getElementById("playerSelector2").value;
	});

	d3.csv("data/playerData.csv").then(playerData => {
		playerChart2 = new PlayerChart('player-chart-2', playerData)
		playerChart2.initVis()
	});

	d3.csv("data/playerData2.csv").then(playerData => {
		barChart = new BarChart('bar-chart', playerData)
		barChart.initVis()
		barChart2 = new BarChart2('bar-chart-2', playerData)
		barChart2.initVis()
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


function loadChartData() {
	// shot distance viz for shotDistance.js
	d3.csv("data/ShotsByYear/shots00-01.csv").then( function (data1) {
		d3.csv("data/ShotsByYear/shots17-18.csv").then ( function (data2) {
			data1.forEach((d,i) => {
				if (
					d["X Location"] != 0 &&
					d["Y Location"] != 0 &&
					d["Shot Made Flag"] == 1 &&
					parseInt(d["Shot Distance"]) <= 45
				) {
					player.push(d["Player Name"]);
					team.push(d["Team Name"]);
					d["year"]= d["Game Date"].substring(0,4);
					year.push(d["year"]);
					if (
						d["Season Type"].localeCompare(
							"Regular Season"
						) == 0
					) {
						d.name = d["Shot Distance"].toString();
						d["X Location"] = d["X Location"] / 12;
						dseason1.push(d);
					} else if (
						d["Season Type"].localeCompare("Playoffs") == 0
					) {
						d.name = d["Shot Distance"].toString();
						d["X Location"] = d["X Location"] / 12;
						dseason2.push(d);
					}
				}
			});
			data2.forEach((d) => {
				if (
					d["X Location"] != 0 &&
					d["Y Location"] != 0 &&
					d["Shot Made Flag"] == 1 &&
					parseInt(d["Shot Distance"]) <= 45
				) {
					player.push(d["Player Name"]);
					team.push(d["Team Name"]);
					d["year"]= d["Game Date"].substring(0,4);
					year.push(d["year"]);
					if (
						d["Season Type"].localeCompare(
							"Regular Season"
						) == 0
					) {
						d.name = d["Shot Distance"].toString();
						d["X Location"] = d["X Location"] / 12;
						dseason1.push(d);
					} else if (
						d["Season Type"].localeCompare("Playoffs") == 0
					) {
						d.name = d["Shot Distance"].toString();
						d["X Location"] = d["X Location"] / 12;
						dseason2.push(d);
					}
				}
			});
			console.log("middle");
			var uniqueTeam = [];
			$.each(team, function(i, el){
				if($.inArray(el, uniqueTeam) === -1) uniqueTeam.push(el);
			});

			var uniquePlayer = [];
			$.each(player, function(i, el){
				if($.inArray(el, uniquePlayer) === -1) uniquePlayer.push(el);
			});

			var uniqueYears = [];
			$.each(year, function(i, el){
				if($.inArray(el, uniqueYears) === -1) uniqueYears.push(el);
			});

			uniquePlayer.sort();

			uniqueTeam.sort();

			addOptions(uniquePlayer,"player");

			addOptions(uniqueTeam,"team");

			addOptions(uniqueYears,"year");

			multiLine(dseason1, "chart1");

			multiLine(dseason2, "chart2");

			let dseason1temp=[], dseason2temp=[];

			let playerstemp=[];

			$("#player").on("change", function () {
				dseason1temp=[]; dseason2temp=[];
				var t = $("#team").val();
				var p = $(this).val();
				var y= $("#year").val();

				dseason1.forEach(d=>{
					if(d["Team Name"].localeCompare(t)==0 || t.localeCompare("all")==0)
					{
						if(d["year"].localeCompare(y)==0 || y.localeCompare("all")==0){
							if(d["Player Name"].localeCompare(p)==0 || p.localeCompare("all")==0){
								dseason1temp.push(d);
							}
						}
					}
				})

				dseason2.forEach(d=>{
					if(d["Team Name"].localeCompare(t)==0 || t.localeCompare("all")==0)
					{
						if(d["year"].localeCompare(y)==0 || y.localeCompare("all")==0){
							if(d["Player Name"].localeCompare(p)==0 || p.localeCompare("all")==0){
								dseason2temp.push(d);
							}
						}
					}
				})

				d3.select("#chart1 svg").remove();
				d3.select("#chart2 svg").remove();
				if(dseason1temp.length>0){
					multiLine(dseason1temp, "chart1");
				}
				if(dseason2temp.length>0){
					multiLine(dseason2temp, "chart2");
				}

			});


			$("#year").on("change", function () {
				dseason1temp=[]; dseason2temp=[];
				var t = $("#team").val();
				var p = $("#player").val();
				var y= $(this).val();

				dseason1.forEach(d=>{
					if(d["Team Name"].localeCompare(t)==0 || t.localeCompare("all")==0)
					{
						if(d["year"].localeCompare(y)==0 || y.localeCompare("all")==0){
							if(d["Player Name"].localeCompare(p)==0 || p.localeCompare("all")==0){
								dseason1temp.push(d);
							}
						}
					}
				})

				dseason2.forEach(d=>{
					if(d["Team Name"].localeCompare(t)==0 || t.localeCompare("all")==0)
					{
						if(d["year"].localeCompare(y)==0 || y.localeCompare("all")==0){
							if(d["Player Name"].localeCompare(p)==0 || p.localeCompare("all")==0){
								dseason2temp.push(d);
							}
						}
					}
				})

				d3.select("#chart1 svg").remove();
				d3.select("#chart2 svg").remove();
				if(dseason1temp.length>0){
					multiLine(dseason1temp, "chart1");
				}
				if(dseason2temp.length>0){
					multiLine(dseason2temp, "chart2");
				}

			});

			$("#seasonselector").on("change", function () {
				var option = $(this).val();
				var opt = document.getElementById("seasonselector").dataset.click;
				if(opt.localeCompare("regular")==0){
					document.getElementById("regularseason").style.display="none";
					document.getElementById("playoffseason").style.display="block";
					document.getElementById("seasonselector").dataset.click="playoff";
					document.getElementById("seasontype").innerHTML ="Select Regular";
				}
				else if(opt.localeCompare("playoff")==0){
					document.getElementById("regularseason").style.display="block";
					document.getElementById("playoffseason").style.display="none";
					document.getElementById("seasonselector").dataset.click="regular";
					document.getElementById("seasontype").innerHTML ="Select Playoff";
				}
			})

			$("#team").on("change", function () {
				playerstemp=[];
				dseason1temp=[]; dseason2temp=[];
				var t = $(this).val();
				var p = $("#player").val();
				var y= $("#year").val();

				dseason1.forEach(d=>{
					if(d["Team Name"].localeCompare(t)==0 || t.localeCompare("all")==0)
					{
						if(d["year"].localeCompare(y)==0 || y.localeCompare("all")==0){
							dseason1temp.push(d);
							playerstemp.push(d["Player Name"]);
						}
					}
				})

				dseason2.forEach(d=>{
					if(d["Team Name"].localeCompare(t)==0 || t.localeCompare("all")==0)
					{
						if(d["year"].localeCompare(y)==0 || y.localeCompare("all")==0){
							dseason2temp.push(d);
							playerstemp.push(d["Player Name"]);
						}
					}
				})


				var uniquePlayertemp = [];
				$.each(playerstemp, function(i, el){
					if($.inArray(el, uniquePlayertemp) === -1) uniquePlayertemp.push(el);
				});

				uniquePlayertemp.sort();

				addOptions(uniquePlayertemp,"player");

				d3.select("#chart1 svg").remove();
				d3.select("#chart2 svg").remove();
				if(dseason1temp.length>0){
					multiLine(dseason1temp, "chart1");
				}
				if(dseason2temp.length>0){
					multiLine(dseason2temp, "chart2");
				}
				// end of shot distance viz
			});
			console.log("end");

		});
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


// Variables for the visualization instances
let areachart, playerChart, pieChart;

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

	d3.csv("data/playerData.csv"). then(playerData=>{
		playerChart = new PlayerChart('player-chart', playerData)
		playerChart.initVis()

		selectedPlayer1 = document.getElementById("playerSelector1").value;
		selectedPlayer2 = document.getElementById("playerSelector2").value;
	});

// shot distance viz for index.js
	d3.csv("data/shots00-01.csv", function (data1) {
		d3.csv("data/shots17-18.csv", function (data2) {
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


		});
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



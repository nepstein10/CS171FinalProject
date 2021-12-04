function addOptions(data, id) {
	$("#"+id).find("option").remove();
	var count = data.length;
	var option = "";
	option +=
				'<option selected value="all">' + "All" + "</option>";
	for (var i = 0; i < count; i++) {
			option +=
				'<option  value="' + data[i] + '">' + data[i] + "</option>";
	}
	
	$("#"+id).append(option);
}

function ExcelDateToJSDate(serial) {
   var utc_days  = Math.floor(serial - 25569);
   var utc_value = utc_days * 86400;                                        
   var date_info = new Date(utc_value * 1000);

   var fractional_day = serial - Math.floor(serial) + 0.0000001;

   var total_seconds = Math.floor(86400 * fractional_day);

   var seconds = total_seconds % 60;

   total_seconds -= seconds;

   var hours = Math.floor(total_seconds / (60 * 60));
   var minutes = Math.floor(total_seconds / 60) % 60;

   return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}


function loadChartData() {
	let dseason1 = [],
		dseason2 = [];

	let date=[];
	let player=[], team=[], year=[];
	d3.csv("data/ShotsByYear/shots00-01.csv", function (data1) {
		d3.csv("data/ShotsByYear/shots17-18.csv", function (data2) {
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

				addOptions(uniquePlayertemp,"player");

				d3.select("#chart1 svg").remove();
				d3.select("#chart2 svg").remove();
				if(dseason1temp.length>0){
					multiLine(dseason1temp, "chart1");
				}
				if(dseason2temp.length>0){
					multiLine(dseason2temp, "chart2");
				}

			});


		});
	});
}

function multiLine(data, id) {

	 var box = document.querySelector('#title');//selecting the div with id #chart1
     var width = box.offsetWidth/4 *3.75;// taking width equal to  #chart1 width

    var height=screen.height/5;
    height=height*2.3;//taking height equal to 3.3/5 of height of screen

	var margin = { top: 10, right: 30, bottom: 30, left: 20 };
		
	width = width - margin.left - margin.right;
	height = height - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3
		.select("#" + id)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr(
			"transform",
			"translate(" + margin.left + "," + margin.top + ")"
		);

	 var sumstat1 = d3
		.nest() // nest function allows to group the calculation per level of a factor
		.key(function (d) {
			return d.name;
		})
		.entries(data);

	var max=0;	

	var strokeWidth={};

	var sumstat=[];

	sumstat1.forEach(d=>{

		if(max<d.values.length){
			max=d.values.length;
		}
		strokeWidth[d.key]=d.values.length;

		sumstat.push({
				key: d.key,
				x1:47-parseInt(d.key),
				y1: 0,
				x2: 47,
				y2: 201,
			});
	})


	var x = d3
		.scaleLinear()
		.domain([
			-3,
			50.25
			]
		)
		.range([0, width]);

	var x1 = d3
		.scaleLinear()
		.domain([
			51,
			-3
			]
		)
		.range([0, width]);
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x1).ticks(3));

	// Add Y axis
	var y = d3
		.scaleLinear()
		.domain([
			0,
			401,
		])
		.range([height, 0]);

	// color palette
	var res = sumstat.map(function (d) {
		return d.key;
	}); // list of group names
	var color = d3
		.scaleOrdinal()
		.domain(res)
		.range([
			"#e41a1c",
			"#377eb8",
			"#4daf4a",
			"#984ea3",
			"#ff7f00",
			"#ffff33",
			"#a65628",
			"#f781bf",
			"#999999",
			"#3957ff", 
			"#d3fe14", 
			"#c9080a", 
			"#fec7f8", 
			"#0b7b3e", 
			"#0bf0e9", 
			"#c203c8", 
			"#fd9b39", 
			"#888593", 
			"#906407", 
			"#98ba7f", 
			"#fe6794", 
			"#10b0ff", 
			"#ac7bff", 
			"#fee7c0", 
			"#964c63", 
			"#1da49c", 
			"#0ad811", 
			"#bbd9fd", 
			"#fe6cfe", 
			"#297192", 
			"#d1a09c", 
			"#78579e", 
			"#81ffad", 
			"#739400", 
			"#ca6949", 
			"#d9bf01", 
			"#646a58", 
			"#d5097e", 
			"#bb73a9", 
			"#ccf6e9", 
			"#9cb4b6", 
			"#b6a7d4", 
			"#9e8c62", 
			"#6e83c8", 
			"#01af64", 
			"#a71afd", 
			"#cfe589", 
			"#d4ccd1", 
			"#fd4109", 
			"#bf8f0e", 
			"#2f786e", 
			"#4ed1a5", 
			"#d8bb7d", 
			"#a54509", 
			"#6a9276", 
			"#a4777a", 
			"#fc12c9", 
			"#606f15", 
			"#3cc4d9", 
			"#f31c4e", 
			"#73616f", 
			"#f097c6", 
			"#fc8772", 
			"#92a6fe", 
			"#875b44", 
			"#699ab3", 
			"#94bc19", 
			"#7d5bf0", 
			"#d24dfe", 
			"#c85b74", 
			"#68ff57", 
			"#b62347", 
			"#994b91", 
			"#646b8c", 
			"#977ab4", 
			"#d694fd", 
			"#c4d5b5", 
			"#fdc4bd", 
			"#1cae05", 
			"#7bd972", 
			"#e9700a", 
			"#d08f5d", 
			"#8bb9e1", 
			"#fde945", 
			"#a29d98", 
			"#1682fb", 
			"#9ad9e0", 
			"#d6cafe", 
			"#8d8328", 
			"#b091a7", 
			"#647579", 
			"#1f8d11", 
			"#e7eafd", 
			"#b9660b", 
			"#a4a644", 
			"#fec24c", 
			"#b1168c", 
			"#188cc1", 
			"#7ab297", 
			"#4468ae", 
			"#c949a6", 
			"#d48295", 
			"#eb6dc2", 
			"#d5b0cb", 
			"#ff9ffb", 
			"#fdb082", 
			"#af4d44", 
			"#a759c4", 
			"#a9e03a", 
			"#0d906b", 
			"#9ee3bd", 
			"#5b8846", 
			"#0d8995", 
			"#f25c58", 
			"#70ae4f", 
			"#847f74", 
			"#9094bb", 
			"#ffe2f1", 
			"#a67149", 
			"#936c8e", 
			"#d04907", 
			"#c3b8a6", 
			"#cef8c4", 
			"#7a9293", 
			"#fda2ab", 
			"#2ef6c5", 
			"#807242", 
			"#cb94cc", 
			"#b6bdd0", 
			"#b5c75d", 
			"#fde189", 
			"#b7ff80", 
			"#fa2d8e", 
			"#839a5f", 
			"#28c2b5", 
			"#e5e9e1", 
			"#bc79d8", 
			"#7ed8fe", "#9f20c3", "#4f7a5b", "#f511fd", "#09c959", "#bcd0ce", "#8685fd", "#98fcff", "#afbff9", "#6d69b4", "#5f99fd", "#aaa87e", "#b59dfb", "#5d809d", "#d9a742", "#ac5c86", "#9468d5", "#a4a2b2", "#b1376e", "#d43f3d", "#05a9d1", "#c38375", "#24b58e", "#6eabaf", "#66bf7f", "#92cbbb", "#ddb1ee", "#1be895", "#c7ecf9", "#a6baa6", "#8045cd", "#5f70f1", "#a9d796", "#ce62cb", "#0e954d", "#a97d2f", "#fcb8d3", "#9bfee3", "#4e8d84", "#fc6d3f", "#7b9fd4", "#8c6165", "#72805e", "#d53762", "#f00a1b", "#de5c97", "#8ea28b", "#fccd95", "#ba9c57", "#b79a82", "#7c5a82", "#7d7ca4", "#958ad6", "#cd8126", "#bdb0b7", "#10e0f8", "#dccc69", "#d6de0f", "#616d3d", "#985a25", "#30c7fd", "#0aeb65", "#e3cdb4", "#bd1bee", "#ad665d", "#d77070", "#8ea5b8", "#5b5ad0", "#76655e", "#598100", "#86757e", "#5ea068", "#a590b8", "#c1a707", "#85c0cd", "#e2cde9", "#dcd79c", "#d8a882", "#b256f9", "#b13323", "#519b3b", "#dd80de", "#f1884b", "#74b2fe", "#a0acd2", "#d199b0", "#f68392", "#8ccaa0", "#64d6cb", "#e0f86a", "#42707a", "#75671b", "#796e87", "#6d8075", "#9b8a8d", "#f04c71", "#61bd29", "#bcc18f", "#fecd0f", "#1e7ac9", "#927261", "#dc27cf", "#979605", "#ec9c88", "#8c48a3", "#676769", "#546e64", "#8f63a2", "#b35b2d", "#7b8ca2", "#b87188", "#4a9bda", "#eb7dab", "#f6a602", "#cab3fe", "#ddb8bb", "#107959", "#885973", "#5e858e", "#b15bad", "#e107a7", "#2f9dad", "#4b9e83", "#b992dc", "#6bb0cb", "#bdb363", "#ccd6e4", "#a3ee94", "#9ef718", "#fbe1d9", "#a428a5", "#93514c", "#487434", "#e8f1b6", "#d00938", "#fb50e1", "#fa85e1", "#7cd40a", "#f1ade1", "#b1485d", "#7f76d6", "#d186b3", "#90c25e", "#b8c813", "#a8c9de", "#7d30fe", "#815f2d", "#737f3b", "#c84486", "#946cfe", "#e55432", "#a88674", "#c17a47", "#b98b91", "#fc4bb3", "#da7f5f", "#df920b", "#b7bbba", "#99e6d9", "#a36170", "#c742d8", "#947f9d", "#a37d93", "#889072", "#9b924c", "#23b4bc", "#e6a25f", "#86df9c", "#a7da6c", "#3fee03", "#eec9d8", "#aafdcb", "#7b9139", "#92979c", "#72788a", "#994cff", "#c85956", "#7baa1a", "#de72fe", "#c7bad8", "#85ebfe", "#6e6089", "#9b4d31", "#297a1d", "#9052c0", "#5c75a5", "#698eba", "#d46222", "#6da095", "#b483bb", "#04d183", "#9bcdfe", "#2ffe8c", "#9d4279", "#c909aa", "#826cae", "#77787c", "#a96fb7", "#858f87", "#fd3b40", "#7fab7b", "#9e9edd", "#bba3be", "#f8b96c", "#7be553", "#c0e1ce", "#516e88", "#be0e5f", "#757c09", "#4b8d5f", "#38b448", "#df8780", "#ebb3a0", "#ced759", "#f0ed7c", "#e0eef1", "#0969d2", "#756446", "#488ea8", "#888450", "#61979c", "#a37ad6", "#b48a54", "#8193e5", "#dd6d89"]);



	var path = d3.path();

	svg.append("image")      // text label for the x axis
		.attr("x", x(47.2) )
		.attr("y",  y(220) )
		.attr('width', 120)
		.attr('height', 144)
		.attr("xlink:href", "img/hoop-side-view.png")
	//  .style("text-anchor", "middle")
	//  .style("font-size","25px");
	//  .text("Hoop");

	//svg.append("text")      // text label for the x axis
	//.attr("x", x(48) )
	//.attr("y",  y(199) )
	//.style("text-anchor", "middle")
	//.style("font-size","25px")
	//.text("Hoop");

	svg.append("text")      // text label for the x axis
        .attr("x", width/2 )
        .attr("y",  height+margin.bottom )
        .style("text-anchor", "middle")
		.style("font-size","15px")
        .text("Court Distance (Ft)");

	svg.selectAll(".line")
		.data(sumstat)
		.enter()
		.append("path")
		.attr("d", function (d, i) {
			var dx = x(d.x2) - x(d.x1),
        	dy = y(d.y2) - y(d.y1),
        	dr = Math.sqrt(dx*dx + dy*dy );
    		return "M" + x(d.x1) + "," + y(d.y1) + "A" + dr + "," + dr +
			" 0 0,1 " + x(d.x2) + "," + y(d.y2);
		})
		.attr("stroke", function (d) {
			return color(d.key);
		})
		.attr("stroke-width", function(d){
			var val=((strokeWidth[d.key]/max)*15);
			return val<0.25?0.25:val;
		})
		.style("opacity", 0)
		.transition()
		.duration(5001)
		.style("opacity", 1)
		.attr("fill", "none");

}

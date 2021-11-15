// need to add comments
//
//
function runAll (graph) {
  d3.select('.svg-container')
    .selectAll('svg')
    .remove()
  
  d3.selectAll('.tooltip')
    .remove()

  d3.selectAll('.info')
    .remove()

  d3.selectAll('select')
    .remove()

  let graphTypes = ['3 Pointers', 'Top Players', 'Other']
  let buttonCheck = d3.select('.button-container')
    .selectAll('button')
    .data(graphTypes)
    .enter()
    .append('button')
    .classed('graph-select', true)
    .text(d => d)
    .on('click', d => runAll(d))

  if (graph === '3 Pointers') {
    d3.json('./data/per36.json', threeGraph)
  }
  else if (graph === 'Top Players') {
    d3.json('./data/Leaders.json', usgGraph)
  }
 
}

runAll();


function threeGraph (error, per36) {
  let paddingLeft = 80;
  let paddingBottom = 80;
  let height = 700;
  let width = 1200;
  let attemptsScale = d3.scaleLinear()
    .domain([0.5, 12])
    .range([paddingLeft, width - paddingLeft])

  let percentScale = d3.scaleLinear()
    .domain([0.15, 0.55])
    .range([height - paddingBottom, paddingBottom])

  let threeArray = per36
  .filter(player => player['3PA'] >= 1 && player.MP >=820)
  .map(player => {
    let index = player.Player.indexOf("\\");
    return {
      name: player.Player.substring(0, index),
      attempts: player['3PA'], 
      percent: player['3P%'],
      position: player.Pos,
      team: player.Tm,
      x: attemptsScale(player['3PA']),
      y: percentScale(player['3P%'])
    }
  })
  let explanation = d3.select('#draft')
    .insert('p', ':first-child')
    .classed('info', true)
    .text('3PA vs 3P%.')

  let threePlot = d3.select('.svg-container')
    .append('svg')
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1200 700")
    .classed("svg-content-responsive", true); 

  let xAxis = d3.axisBottom()
    .scale(attemptsScale)

  let yAxis = d3.axisLeft()
    .scale(percentScale)

  let createXAxis = threePlot.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${height - paddingBottom})`)
    .call(xAxis)

  let xAxisLabel = threePlot.append('text')
    .attr('transform', `translate(${(width-paddingLeft)/2 + paddingLeft}, ${height - paddingBottom/2})`)
    .style('text-anchor', 'middle')
    .text('3PA')
    .classed('tooltip', true)

  let createYAxis = threePlot.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${paddingLeft}, 0)`)
    .call(yAxis)

  let yAxisLabel = threePlot.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0)
    .attr('x', 0 - (height/2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('3P%')
    .classed('tooltip', true)

  let tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .classed('tooltip', true)

  let dataPoints = threePlot.selectAll('circle')
    .data(threeArray)
    .enter()
    .append('circle')
    .attr('cx', d => d.x)
    .attr('cy', 4)
    .attr('r', 4)
    .attr('fill', d => returnColor(d.team))
    .on("mouseover", d => tooltip
      .style("visibility", "visible")
      .append('p')
      .classed("tooltip", true)
      .text(`${d.name}, ${d.attempts} 3PA`)
    )
    .on("mousemove", () => tooltip.style("top", (d3.event.pageY-10)+"px")
      .style("left",(d3.event.pageX+10)+"px"))
    .on("mouseout", () => tooltip.style("visibility", "hidden")
      .selectAll('p')
      .remove()
    )
    .transition()
    .duration(1500)
    .delay(d => d.x*1.5)
    .attr('cy', d => d.y)
    .ease(d3.easeBounceOut)

  threePlot.append("text")
    .attr("x", (width / 2))             
    .attr("y", (paddingBottom))
    .attr("text-anchor", "middle")  
    .style("font-size", "18px");
}

function usgGraph (error, usg) {
  let paddingLeft = 80;
  let paddingBottom = 80;
  let height = 700;
  let width = 1200;
  let usgScale = d3.scaleLinear()
    .domain([20, 44])
    .range([paddingLeft, width - paddingLeft])

  let astScale = d3.scaleLinear()
    .domain([5, 60])
    .range([height - paddingBottom, paddingBottom])

  let TSScale = d3.scaleLinear()
    .domain([0.4, 0.7])
    .range([4, 14])

  let usgArray = usg.map(player => {
    let index = player.Player.indexOf("\\");
    return {
      name: player.Player.substring(0, index),
      usage: player['USG%'],
      ts: player['TS%'],
      position: player.Pos,
      team: player.Tm,
      assist: player['AST%'],
      x: usgScale(player['USG%']),
      y: astScale(player['AST%']),
      r: TSScale([player['TS%']])
    }
  })
  let explanation = d3.select('#draft')
    .insert('p', ':first-child')
    .classed('info', true)
      // https://www.burntorangenation.com/2011/10/19/2464697/advanced-basketball-statistics-understanding-possession-estimation
    .text('Top performers of teams comparing % possessions they finished and % assisting teammates make shots. Variation in circle size for scoring.')
  
  let usgPlot = d3.select('.svg-container')
    .append('svg')
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1200 700")
    .classed("svg-content-responsive", true); 

  let xAxis = d3.axisBottom()
    .scale(usgScale)

  let yAxis = d3.axisLeft()
    .scale(astScale)

  let createXAxis = usgPlot.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${height - paddingBottom})`)
    .call(xAxis)

  let xAxisLabel = usgPlot.append('text')
    .attr('transform', `translate(${(width-paddingLeft)/2 + paddingLeft}, ${height - paddingBottom/2})`)
    .style('text-anchor', 'middle')
    .text('% possessions')
    .classed('tooltip', true)

  let createYAxis = usgPlot.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${paddingLeft}, 0)`)
    .call(yAxis)

  let yAxisLabel = usgPlot.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0)
    .attr('x', 0 - (height/2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('% assisting teammates make shots')
    .classed('tooltip', true)

  let tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .classed('tooltip', true)
    
  let dataPoints = usgPlot.selectAll('circle')
    .data(usgArray)
    .enter()
    .append('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => 0)
    .attr('fill', d => returnColor(d.team))
    .on("mouseover", d => tooltip
      .style("visibility", "visible")
      .append('p')
      .classed("tooltip", true)
      .text(`${d.name}, ${(d.usage)}% p, ${(d.assist)}% a`)
    )
    .on("mousemove", () => tooltip.style("top", (d3.event.pageY-10)+"px")
      .style("left",(d3.event.pageX+10)+"px"))
    .on("mouseout", () => tooltip.style("visibility", "hidden")
      .selectAll('p')
      .remove()
    )
    .transition()
    .ease(d3.easeCubicIn)
    .duration(d => d.r * 300 * d.r/9)
    .attr('r', d => d.r)

  playerPlot.append("text")
    .attr("x", ((width) / 2))             
    .attr("y", (paddingBottom))
    .attr("text-anchor", "middle")  
    .style("font-size", "18px");
}

function Graph () {
// need to redo
  for (let key in team) {
    let item = team[key];
    let data = [];
    let pathDataShots = [];
    let pathDataPercents = [];
    for (let i = 0; i < 5; i++) {
      data.push({
        team: key,
        distKeys: distKeys[i],
        distX: distX[i],
        distWidthScaled: distWidthScaled[i],
        distXScaled: distXScaled[i],
        shots: item[returnShots(i, 'shots')],
        percents: item[returnShots(i, 'percents')],
        percentY: percentScale(0) - percentScale(item[returnShots(i, 'percents')]),
        shotY: percentScale(0) - percentScale(item[returnShots(i, 'shots')])
      })
    }
    returnObj[key] = {
      avgDist: item['Dist.'],
      avgFg: item['FG%'],
      avgX: distScale(item['Dist.']),
      avgY: percentScale(item['FG%']),
      data
    }
  }
  function returnShots (i, type) {
    switch (i) {
      case 0:
        return (type === 'shots') ? '0-3%' : '0-3FG';
      case 1:
        return (type === 'shots') ? '3-10%' : '3-10FG';
      case 2:
        return (type === 'shots') ? '10-16%' : '10-16FG';
      case 3:
        return (type === 'shots') ? '16 <3%' : '16 <3FG';
      case 4:
        return (type === 'shots') ? '3PFG' : '3P';
    }
  }

  let dataPoints = teamPlot.selectAll('rect')
    .data(returnObj['League Average'].data)
    .enter()

  let percents = dataPoints.append('rect')
    .attr('width', d => d.distWidthScaled - 60)
    .attr('height', d => d.percentY)
    .attr('x', d => d.distXScaled)
    .attr('y', d => percentScale(0) - d.percentY)
    .attr('fill', d => returnDualColor(d.team, true))
    .attr('fill-opacity', d => returnOpacity(d.percentY, d.shotY))
    .classed('percents', true)

  let locations = dataPoints.append('rect')
    .attr('width', d => d.distWidthScaled - 60)
    .attr('height', d => d.shotY)
    .attr('x', d => d.distXScaled)
    .attr('y', d => percentScale(0) - d.shotY)
    .attr('fill', d => returnDualColor(d.team, false))
    .attr('fill-opacity', d => returnOpacity(d.shotY, d.percentY))
    .classed('locations', true)

  let avgShot = teamPlot.selectAll('circle')
    .data([returnObj['League Average']])
    .enter()
    .append('circle')
    .attr('cx', d => d.avgX)
    .attr('cy', d => d.avgY)
    .attr('r', 5)
    .attr('fill', d => returnDualColor(d.data[0].team, true))
    .on("mouseover", d => tooltip
      .style("visibility", "visible")
      .append('p')
      .classed("tooltip", true)
      .text(`Average shot distance: ${d.avgDist} ft. Field goal percent: ${d.avgFg}`)
    )
    .on("mousemove", () => tooltip.style("top", (d3.event.pageY-10)+"px")
      .style("left",(d3.event.pageX+10)+"px"))
    .on("mouseout", () => tooltip.style("visibility", "hidden")
      .selectAll('p')
      .remove()
    )
  function returnOpacity (current, other) {
    return (current > other) ? 0.8 : 0.95
  }
  let teamOffenseTitle = teamPlot.selectAll('.team-offense-title')
    .data(returnObj['League Average'].data)
    .enter()
    .append("text")
    .classed('team-offense-title', true)
    .attr("x", ((width) / 2))
    .attr("y", (paddingBottom))
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text(d => `${d.team} Shot Locations`);

  function changeTeam () {
    let team = d3.select('select')
      .property('value')

    let updatePercents = teamPlot.selectAll('.percents')
      .data(returnObj[team].data)
      .transition()
      .ease(d3.easeCubicOut)
      .duration(2500)
      .attr('height', d => d.percentY)
      .attr('y', d => percentScale(0) - d.percentY)
      .attr('fill', d => returnDualColor(d.team, true))
      .attr('fill-opacity', d => returnOpacity(d.percentY, d.shotY))

    let updateLocations = teamPlot.selectAll('.locations')
      .data(returnObj[team].data)
      .transition()
      .ease(d3.easeCubicOut)
      .duration(1500)
      .attr('height', d => d.shotY)
      .attr('y', d => percentScale(0) - d.shotY)
      .attr('fill', d => returnDualColor(d.team, false))
      .attr('fill-opacity', d => returnOpacity(d.shotY, d.percentY))

    let updateAverage = teamPlot.selectAll('circle')
      .data([returnObj[team]])
      .transition()
      .ease(d3.easeCubicOut)
      .duration(1500)
      .attr('cx', d => d.avgX)
      .attr('cy', d => d.avgY)
      .attr('fill', d => returnDualColor(d.data[0].team, true))

    let updateName = teamPlot.selectAll('.team-offense-title')
      .data(returnObj[team].data)
      .text(d => `${d.team} Shot Locations`)
  }

  let optionData = Object.keys(returnObj)
  let options = d3.select('select')
    .selectAll('option')
    .data(optionData)
    .enter()
    .append('option')
    .attr('value', d => d)
    .text(d => d)
    .attr('selected', d => (d === 'League Average') ? 'selected' : null)
}


function returnColor (team) {
  switch (team) {
    case "ATL":
      return '#E13A3E'
    case "BOS":
      return '#008348'
    case "BRK":
      return '#061922'
    case "CHI":
      return '#CE1141'
    case "CHO":
      return '#1D1160'
    case "CLE":
      return '#860038'
    case "DAL":
      return '#007DC5'
    case "DEN":
      return '#4D90CD'
    case "DET":
      return '#ED174C'
    case "GSW":
      return '#FDB927'
    case "HOU":
      return '#CE1141'
    case "IND":
      return '#FFC633'
    case "LAC":
      return '#ED174C'
    case "LAL":
      return '#FDB927'
    case "MEM":
      return '#7399C6'
    case "MIA":
      return '#98002E'
    case "MIL":
      return '#00471B'
    case "MIN":
      return '#005083'
    case "NOP":
      return '#002B5C'
    case "NYK":
      return '#006BB6'
    case "OKC":
      return '#007DC3'
    case "ORL":
      return '#007DC5'
    case "PHI":
      return '#006BB6'
    case "PHO":
      return '#E56020'
    case "POR":
      return '#E03A3E'
    case "SAC":
      return '#724C9F'
    case "SAS":
      return '#BAC3C9'
    case "TOR":
      return '#CE1141'
    case "TOT":
      return '#A1A1A4'
    case "UTA":
      return '#00471B'
    case "WAS":
      return '#002B5C'
  }
}

function returnDualColor (team, primary) {
  switch (team) {
    case "Atlanta Hawks":
      return primary ? '#E13A3E' : '#C4D600';
    case "Boston Celtics":
      return primary ? '#008348' : 'lightgray';
    case "Brooklyn Nets":
      return primary ? '#061922' : 'silver';
    case "Charlotte Hornets":
      return primary ? '#1D1160' : '#008CA8';
    case "Chicago Bulls":
      return primary ? '#CE1141' : '#061922';
    case "Cleveland Cavaliers":
      return primary ? '#860038' : '#FDBB30';
    case "Dallas Mavericks":
      return primary ? '#007DC5' : '#C4CED3';
    case "Denver Nuggets":
      return primary ? '#4D90CD' : '#FDB927';
    case "Detroit Pistons":
      return primary ? '#ED174C' : '#006BB6';
    case "Golden State Warriors":
      return primary ? '#FDB927' : '#006BB6';
    case "Houston Rockets":
      return primary ? '#CE1141' : '#C4CED3';
    case "Indiana Pacers":
      return primary ? '#FFC633' : '#00275D';
    case "Los Angeles Clippers":
      return primary ? '#ED174C' : '#006BB6';
    case "Los Angeles Lakers":
      return primary ? '#FDB927' : '#552582';
    case "Memphis Grizzlies":
      return primary ? '#0F586C' : '#7399C6';
    case "Miami Heat":
      return primary ? '#98002E' : '#061922';
    case "Milwaukee Bucks":
      return primary ? '#00471B' : '#F0EBD2';
    case "Minnesota Timberwolves":
      return primary ? '#005083' : '#00A94F';
    case "New Orleans Pelicans":
      return primary ? '#002B5C' : '#E31837';
    case "New York Knicks":
      return primary ? '#006BB6' : '#F58426';
    case "Oklahoma City Thunder":
      return primary ? '#007DC3' : '#F05133';
    case "Orlando Magic":
      return primary ? '#007DC5' : '#C4CED3';
    case "Philadelphia 76ers":
      return primary ? '#006BB6' : '#ED174C';
    case "Phoenix Suns":
      return primary ? '#E56020' : '#1D1160';
    case "Portland Trail Blazers":
      return primary ? '#E03A3E' : '#BAC3C9';
    case "Sacramento Kings":
      return primary ? '#724C9F' : '#8E9090';
    case "San Antonio Spurs":
      return primary ? '#BAC3C9' : '#061922';
    case "Toronto Raptors":
      return primary ? '#CE1141' : '#061922';
    case "Utah Jazz":
      return primary ? '#002B5C' : '#00471B';
    case "Washington Wizards":
      return primary ? '#002B5C' : '#E31837';
    case "League Average":
      return primary ? '#0046AD' : '#D0103A';
  }
}
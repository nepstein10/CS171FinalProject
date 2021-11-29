class ShotChartControls {
    constructor(parentElement, chartToControl) {
        this.parentElement = parentElement
        this.chart = chartToControl
    }

    initControl() {
        let chart = this.chart
        this.d = d3.select('#'+this.parentElement)
        let buttonControls = [
            {
                label: "Steph Curry",
                players: ["Stephen Curry"],
                teams: [],
                playoffs: "all",
                seasons: [2010, 2020],
                color: "team",
                subset: 1,
            },
            {
                label: "Shaq",
                players: ["Shaquille O'Neal"],
                teams: [],
                playoffs: "all",
                seasons: [1998, 2011],
                color: "team",
                subset: 1,
            },
            {
                label: "Rockets v. Spurs",
                players: [],
                teams: ["Houston Rockets", "San Antonio Spurs"],
                playoffs: "all",
                seasons: [1998, 2020],
                color: "team",
                subset: 1,
            }
        ]

        buttonControls.forEach(c => {
            let newB = this.d.append("button")
                .attr("class", "controlButton")
                .attr("type", "button")
                //.attr("onClick", "this.buttonFunction")
                .html(c.label)
                .on("click", function(e) {
                    //console.log(e, this)
                    //console.log(chart.filters)
                    chart.filters = {
                        players: c.players,
                        teams: c.teams,
                        playoffs: c.playoffs,
                        color: c.color
                    }
                    let season = chart.season
                    if (!(season >= c.seasons[0] && season <= c.seasons[1])) {
                        season = c.seasons[0]
                    }
                    //console.log(chart.filters)
                    chart.slider.value(season)
                    chart.sliderChange(season)
                    // TODO: Message of significance
                })
        })
        console.log("done init")
    }
}
class ShotChartControls {
    constructor(parentElement, chartToControl) {
        this.parentElement = parentElement
        this.chart = chartToControl
    }

    initControl() {
        let controller = this;

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
                message: "Steph Curry is one of the strongest 3-point shooters in the modern NBA," +
                    "routinely attempting shots from well beyond the arc when open. The 7-time all-star " +
                    "is truly a modern NBA player, having taken 49.6% of his career shot attempts from " +
                    "3. With a stellar .432 shooting percentage on those shots, it's no surprise he has " +
                    "led the league in 3-point attempts and 3s made in all 6 of his most recent complete " +
                    "seasons.",
            },
            {
                label: "Shaq",
                players: ["Shaquille O'Neal"],
                teams: [],
                playoffs: "all",
                seasons: [1998, 2011],
                color: "team",
                subset: 1,
                message: "7\'1\" Shaquille \"Shaq\" O'Neal was one of the best players in the NBA for most " +
                    "of his 19-year career, earning 15 all-star selections. He also only ever made 1 3-pointer! " +
                    "Instead, he managed to lead the league in scoring 3 times, and in shooting percentage 10 " +
                    "times, by rarely taking shots from more than a few feet away, and being highly effective in " +
                    "the paint."
            },
            {
                label: "Rockets v. Spurs",
                players: [],
                teams: ["Houston Rockets", "San Antonio Spurs"],
                playoffs: "all",
                seasons: [1998, 2020],
                color: "team",
                subset: 1,
                message: "Over the past decade, the " +
                    `<span style='color:${returnDualColor("Houston Rockets")}'>Rockets</span> ` +
                    "have routinely been at or near the top of " +
                    "the NBA in percentage of field goals attempted from 3-point range, and the " +
                    `<span style='color:${returnDualColor("San Antonio Spurs")}'>Spurs</span> ` +
                    "have been " +
                    "at or near the bottom. In fact, for 2018-2020, the Rockets shot more than half of their shots " +
                    "as 3s, around 150% of the Spurs' pace most seasons. This can be seen particularly in more recent " +
                    "seasons, where the long 2-pointers are predominantly the grey of San Antonio, and the red of " +
                    "Houston is clustered under the basket and behind the arc."
            },
            {
                label: "Ray Allen",
                players: ["Ray Allen"],
                teams: [],
                playoffs: "all",
                seasons: [1998, 2014],
                color: "team",
                subset: 1,
                message: "Ray Allen is the all-time NBA record holder for career 3s. With multiple teams over a nearly " +
                    "two-decade-long career, he consistently drained shots from behind the arc. However, even his pace of 3s " +
                    "was slower than that of most modern 3-point shooters!"
            },
            {
                label: "Kobe Bryant",
                players: ["Kobe Bryant"],
                teams: [],
                playoffs: "all",
                seasons: [1998, 2016],
                color: "team",
                subset: 1,
                message: "Bryant is recognized near-universally as one of the best players of all time. He was not known " +
                    "for his 3-point shooting however, instead opting for being highly effective in the post and mid-range " +
                    "jumpshots that are falling out of favor in the modern game. He was an all-star every year from 2000 " +
                    "until his career ended in 2016."
            },
        ]

        buttonControls.forEach(c => {
            let newB = this.d.append("button")
                .attr("class", "controlButton")
                .attr("type", "button")
                .html(c.label)
                .on("click", function(e) {
                    chart.filters = {
                        players: c.players,
                        teams: c.teams,
                        playoffs: c.playoffs,
                        color: c.color,
                        subset: c.subset,
                    }
                    let season = chart.season
                    if (!(season >= c.seasons[0] && season <= c.seasons[1])) {
                        season = c.seasons[0]
                    }
                    chart.message = c.message
                    if (season !== chart.season) {chart.slider.value(season)}
                    else {
                        chart.loading(true)
                        chart.sliderChange(season)
                    }
                    d3.select("#shotChartTeamSelect")
                        .classed("active-filter", false)
                        .property("value", "selectByTeam")
                    d3.select("#playerSearchBox")
                        .classed("active-filter", false)
                        .property("value", "")
                    d3.selectAll(".controlButton")
                        .classed("active-filter", false)
                    d3.select(this).classed("active-filter", true)
                })
        })

        this.d.append("br")
        this.d.append("span")
            .attr("class", "instructions")
            .html("Explore the data by:")
        this.d.append("br")
        let tlabel = this.d.append("label")
            .attr("for", "shotChartTeamSelect")
            .html("Team: ")
        let teamSelect = this.d.append("select")
            .attr("id", "shotChartTeamSelect")
            .attr("class", "active-filter")
            .style("width", "75%")
            .on("change", function(e) {
                console.log(e)
                controller.selectChange()
            })
        teamSelect.append("option")
            .html("Select by Team")
            .property("value", "selectByTeam")
            .property("hidden", true)
        teamSelect.append("option")
            .html("Subsample of All")
            .property("value", "subsample")
            .property('selected', true)
        Object.entries(teamArrs).forEach(([key, val]) => {
            teamSelect.append("option")
                .html(key)
        })

        let plabel = this.d.append("label")
            .attr("for", "playerSearchBox")
            .html("Player: ")
        let playerSearchBox = this.d.append("input")
            .attr("type", "text")
            .attr("id", "playerSearchBox")
            .attr("name", "playerSearchBox")
            .property("placeholder", "Player Search")
        this.d.append("button")
            .attr("class", "controlButton")
            .attr("type", "button")
            .html("Search")
            .on("click", function(e) {
                controller.searchChange()
            })
    }

    selectChange() {
        let chart = this.chart

        let selectValue = d3.select('#shotChartTeamSelect').property('value')
        if (selectValue === "all" ) {
            chart.filters = {
                players: [],
                teams: [],
                color: "",
                subset: 1,
            }
        } else if (selectValue === "subsample") {
            chart.filters = {
                players: [],
                teams: [],
                color: "",
                subset: 0.1,
            }
        } else {
            chart.filters = {
                players: [],
                teams: teamArrs[selectValue],
                color: "team",
                subset: 1,
            }
        }
        chart.message = "Use the slider to track this team's shots by season!"
        d3.selectAll(".controlButton")
            .classed("active-filter", false)
        d3.select("#playerSearchBox").classed("active-filter", false)
        d3.select("#shotChartTeamSelect").classed("active-filter", true)

        chart.wrangleData()
    }

    searchChange() {
        let chart = this.chart;

        let searchValue = d3.select('#playerSearchBox').property('value')
        chart.filters = {
            players: [searchValue],
            teams: [],
            color: "team",
            subset: 1,
        }
        chart.message = "Use the slider to track this player's shots over their career. " +
            "If no data appears for any seasons, make sure the player appears by this name " +
            "on <a href='https://www.basketball-reference.com/'>Basketball Reference</a>."

        d3.select("#shotChartTeamSelect")
            .classed("active-filter", false)
            .property("value", "selectByTeam")
        d3.selectAll(".controlButton")
            .classed("active-filter", false)
        d3.select("#playerSearchBox").classed("active-filter", true)

        chart.wrangleData()
    }
}
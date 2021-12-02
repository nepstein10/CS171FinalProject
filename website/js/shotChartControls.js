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
                    "of his 19-year career, earning 15 all-star selections. He also only ever made 1 3-pointer " +
                    "(you won't find it here because it was in the 1996 season, before location data was " +
                    "tracked, and you will find only 7 three point attempts.) Instead, he managed to lead the " +
                    "league in scoring 3 times, and in shooting percentage 10 times, by rarely taking shots " +
                    "from more than a few feet away, and being highly effective in the paint. Even before the " +
                    "3-point revolution, he was already avoiding long, low-percentage 2s, and this strategy is " +
                    "part of what made him a Hall-of-Famer."
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
                    "Houston is clustered under the basket and behind the arc. " +
                    "</p><p>" +
                    "Much of this can be attributed to Rockets " +
                    "star James Harden, who let the league in 3-pointers, 3-point attempts, and points-per-game all " +
                    "three of those seasons (Click the James Harden button to explore his shooting tendencies!) " +
                    "The Spurs were in the NBA Finals in both 2013 and 2014, but have since gone 3-5 in playoff " +
                    "series, and missed the postseason in each of the past 2 years. The Rockets are 7-6 in playoff " +
                    "series over that span, getting eliminated by the also-three-heavy Warrios 4 of those seasons."
            }
            // TODO: JAMES HARDEN
            // TODO: RAY ALLEN
            // TODO: LEBRON JAMES?
            // TODO: rest of dropdown players
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
                        .classed("active", false)
                        .property("value", "selectByTeam")
                    d3.select("#playerSearchBox")
                        .classed("active", false)
                        .property("value", "")
                    d3.selectAll(".controlButton")
                        .classed("active", false)
                    d3.select(this).classed("active", true)
                })
        })

        let teamSelect = this.d.append("select")
            .attr("id", "shotChartTeamSelect")
            .attr("class", "active")
            .style("width", "50%")
            .on("change", function(e) {
                console.log(e)
                controller.selectChange()
            })
        teamSelect.append("option")
            .html("Select by Team Here")
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

        let label = this.d.append("label")
            .attr("for", "playerSearchBox")
            .html("Search for a Player: ")
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
            .classed("active", false)
        d3.select("#playerSearchBox").classed("active", false)
        d3.select("#shotChartTeamSelect").classed("active", true)

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
            .classed("active", false)
            .property("value", "selectByTeam")
        d3.selectAll(".controlButton")
            .classed("active", false)
        d3.select("#playerSearchBox").classed("active", true)

        chart.wrangleData()
    }
}
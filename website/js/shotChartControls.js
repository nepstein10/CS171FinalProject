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
                message: "Over the past decade, the Houston Rockets have routinely been at or near the top of " +
                    "the NBA in percentage of field goals attempted from 3-point range, and the Spurs have been " +
                    "at or near the bottom. In fact, for 2018-2020, the Rockets shot more than half of their shots " +
                    "as 3s, around 150% of the Spurs' pace most seasons. Much of this can be attributed to Rockets " +
                    "star James Harden, who let the league in 3-pointers, 3-point attempts, and points-per-game all " +
                    "three of those seasons (Click the James Harden button to explore his shooting tendencies!) " +
                    "The Spurs were in the NBA Finals in both 2013 and 2014, but have since gone 3-5 in playoff " +
                    "series, and missed the postseason in each of the past 2 years. The Rockets are 7-6 in playoff " +
                    "series over that span, getting eliminated by the also-three-heavy Warrios 4 of those seasons."
            }
            // TODO: JAMES HARDEN
            // TODO: RAY ALLEN
            // TODO: LEBRON JAMES?

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
                    chart.message = c.message
                    //console.log(chart.filters)
                    if (season !== chart.season) {chart.slider.value(season)}
                    else {chart.sliderChange(season)}
                })
        })
        console.log("done init")
    }
}
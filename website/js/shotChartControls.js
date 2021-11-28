class ShotChartControls {
    constructor(parentElement, chartToControl) {
        this.parentElement = parentElement
        this.chart = chartToControl
    }

    initControl() {
        this.d = d3.select('#'+this.parentElement)
        let buttonControls = [
            {
                label: "Steph Curry",
                players: ["Stephen Curry"],
                teams: [],
                playoffs: "all",
                color: "",
            },
            {
                label: "Shaq",
                players: ["Shaquille O'Neal"],
                teams: [],
                playoffs: "all",
                color: "",
            },
            {
                label: "Rockets v. Spurs",
                players: [],
                teams: ["Houston Rockets", "San Antonio Spurs"],
                playoffs: "all",
                color: "team",

            }
        ]

        buttonControls.forEach(c => {
            let newB = this.d.append("button")
                .attr("class", "controlButton")
                .attr("type", "button")
                .html(c.label)
                .on("input", function(e) {
                    console.log(e, this)
                })
        })
        console.log("done init")
    }
}
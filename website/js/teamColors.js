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
        default:
            return 'black'
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
        default:
            return 'black'
    }
}
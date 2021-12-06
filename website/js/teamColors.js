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

function returnDualColor (team, primary=true) {
    switch (team) {
        case "Atlanta Hawks":
            return primary ? '#E03A3E' : '#C4D600';
        case "Boston Celtics":
            return primary ? '#007A33' : 'lightgray';
        case "Brooklyn Nets":
            return primary ? '#000000' : '#FFFFFF'
        case "New Jersey Nets":
            return primary ? '#002A60' : 'silver';
        case "Charlotte Hornets":
        case 'Charlotte Bobcats':
            return primary ? '#1D1160' : '#008CA8';
        case "Chicago Bulls":
            return primary ? '#CE1141' : '#061922';
        case "Cleveland Cavaliers":
            return primary ? '#860038' : '#FDBB30';
        case "Dallas Mavericks":
            return primary ? '#00538C' : '#002B5E';
        case "Denver Nuggets":
            return primary ? '#0E2240' : '#FDB927';
        case "Detroit Pistons":
            return primary ? '#C8102E' : '#006BB6';
        case "Golden State Warriors":
            return primary ? '#1D428A' : '#FFC72C';
        case "Houston Rockets":
            return primary ? '#CE1141' : '#C4CED3';
        case "Indiana Pacers":
            return primary ? '#002D62' : '#FDBB30';
        case "Los Angeles Clippers":
        case "LA Clippers":
            return primary ? '#C8102E' : '#006BB6';
        case "Los Angeles Lakers":
            return primary ? '#552583' : '#FDB927';
        case "Memphis Grizzlies":
        case "Vancouver Grizzlies":
            return primary ? '#5D76A9' : '#12173F';
        case "Miami Heat":
            return primary ? '#98002E' : '#061922';
        case "Milwaukee Bucks":
            return primary ? '#00471B' : '#F0EBD2';
        case "Minnesota Timberwolves":
            return primary ? '#0C2340' : '#236192';
        case "New Orleans Pelicans":
        case "New Orleans Hornets":
        case "New Orleans/Oklahoma City Hornets":
            return primary ? '#0C2340' : '#C8102E';
        case "New York Knicks":
            return primary ? '#006BB6' : '#F58426';
        case "Oklahoma City Thunder":
            return primary ? '#007AC1' : '#EF3B24';
        case "Seattle SuperSonics":
            return primary ? '#00653A' : '#FFC200';
        case "Orlando Magic":
            return primary ? '#0077C0' : '#C4CED3';
        case "Philadelphia 76ers":
            return primary ? '#006BB6' : '#ED174C';
        case "Phoenix Suns":
            return primary ? '#1D1160' : '#E56020';
        case "Portland Trail Blazers":
            return primary ? '#E03A3E' : '#000000';
        case "Sacramento Kings":
            return primary ? '#5A2D81' : '#63727A';
        case "San Antonio Spurs":
            return primary ? '#696969' : '#000000';
        case "Toronto Raptors":
            return primary ? '#753BBD' : '#BA0C2F';
        case "Utah Jazz":
            return primary ? '#002B5C' : '#00471B';
        case "Washington Wizards":
        case "Washington Bullets":
            return primary ? '#002B5C' : '#E31837';
        case "League Average":
            return primary ? '#0046AD' : '#D0103A';
        default:
            return 'black'
    }
}

let teamArrs = {
    "Atlanta Hawks": ["Atlanta Hawks"],
    "Boston Celtics": ["Boston Celtics"],
    "Brooklyn/New Jersey Nets": ["New Jersey Nets", "Brooklyn Nets"],
    "Charlotte Hornets/Bobcats": ["Charlotte Hornets", "Charlotte Bobcats"],
    "Chicago Bulls": ["Chicago Bulls"],
    "Cleveland Cavaliers": ["Cleveland Cavaliers"],
    "Dallas Mavericks": ["Dallas Mavericks"],
    "Denver Nuggets": ["Denver Nuggets"],
    "Detroit Pistons": ["Detroit Pistons"],
    "Golden State Warriors": ["Golden State Warriors"],
    "Houston Rockets": ["Houston Rockets"],
    "Indiana Pacers": ["Indiana Pacers"],
    "LA Clippers": ["Los Angeles Clippers", "LA Clippers"],
    "LA Lakers": ["Los Angeles Lakers"],
    "Memphis/Vancouver Grizzlies": ["Vancouver Grizzlies", "Memphis Grizzlies"],
    "Miami Heat": ["Miami Heat"],
    "Milwaukee Bucks": ["Milwaukee Bucks"],
    "Minnesota Timberwolves": ["Minnesota Timberwolves"],
    "New Orleans/OKC Pelicans/Hornets": ["New Orleans/Oklahoma City Hornets", "New Orleans Hornets", "New Orleans Pelicans"],
    "New York Knicks": ["New York Knicks"],
    "OKC/Seattle Thunder/Supersonics": ["Oklahoma City Thunder", "Seattle SuperSonics"],
    "Philadelphia 76ers": ["Philadelphia 76ers"],
    "Phoenix Suns": ["Phoenix Suns"],
    "Portland Trail Blazers": ["Portland Trail Blazers"],
    "Sacramento Kings": ["Sacramento Kings"],
    "San Antonio Spurs": ["San Antonio Spurs"],
    "Toronto Raptors": ["Toronto Raptors"],
    "Utah Jazz": ["Utah Jazz"],
    "Washington Wizards/Bullets": ["Washington Wizards", "Washington Bullets"]
}
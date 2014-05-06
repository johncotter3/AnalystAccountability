var chartData = [];
generateChartData();

function generateChartData() {
/*    var firstDate = new Date(2012, 0, 1);
    firstDate.setDate(firstDate.getDate() - 500);
    firstDate.setHours(0, 0, 0, 0);

    for (var i = 0; i < 500; i++) {
	var newDate = new Date(firstDate);
	newDate.setDate(newDate.getDate() + i);

	var a = Math.round(Math.random() * (40 + i)) + 100 + i;
	var b = Math.round(Math.random() * 100000000);

	chartData.push({
	    date: newDate,
	    value: a,
	    volume: b
	    });
	}
*/
    parseCSV(csv);
}

function parseCSV (data) {
    // CSV settings
    var separator = ",";  // use comma for column separator
    var skip = 1;         // skip first row
    //console.log(data);
    data = data.replace (/\\n/g, "\n");
    //replace UNIX new lines
    data = data.replace (/\r\n/g, "\n");
    //replace MAC new lines
    data = data.replace (/\r/g, "\n");
    //split into rows
    var rows = data.split("\n");
    
    // delete skiped rows
    rows.splice(0,skip);
    
    // parese each row
    for (var i = 0; i < rows.length; i++)
    {
	if(rows[i])
	{
            // split the row into columns
            var tArray = rows[i].split(separator);
            var dItem = new Object();
	    
            // parse date in format YYYY-MM-DD
            var p = tArray[0].split('-');
            if (p.length == 1) {
		dItem.date = new Date(Number(p[0]), 1, 1);
            }
            else {
		dItem.date = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
            }
	    
            for (var j = 1; j < tArray.length; j++) {
		var g = j - 1;
		if (tArray[j] != "" && tArray[j] != undefined) {
		    dItem['col' + j] = AmCharts.toNumber(tArray[j]);
		}
            }
	    
            // we add the data point to the beginning of the array since
            // Yahoo Finance provides reversed data and we need it in
            // consecutive ascending order
            chartData.unshift(dItem);
	}
    }
    //console.debug(chartData);
}

var events = JSON.parse(events);
for (i=0; i<events.length; i++){
    var datestr = events[i].Date;
    var yyyy = datestr.substring(0,4);
    var mm = datestr.substring(5,7);
    var dd = datestr.substring(8,10);
    events[i].date = new Date(parseInt(yyyy),parseInt(mm),parseInt(dd));
    events[i].graph = "g1";
    events[i].type = "sign";
    events[i].datestr = mm+'-'+dd+'-'+yyyy;
    //console.log(events[i].Type);
    switch(events[i].Type){
    case "Downgrades":
	events[i].backgroundColor = "#CDCDCD";
	events[i].text = "D";
	events[i].description = "DOWNGRADE by " + events[i].Firm + " on " + datestr + "\nTarget Price: " + events[i].Price_int;
	break;
    case "Upgrades":
	events[i].backgroundColor = "#85CDE6";
	events[i].text = "U";
	events[i].description = "UPGRADE by " + events[i].Firm + " on " + datestr + "\nTarget Price: " + events[i].Price_int;
	break;
    default:
	events[i].backgroundColor = "#D8BFD8";
	events[i].text = "R";
	events[i].description = "OTHER by " + events[i].Firm + " on " + datestr + "\nTarget Price: " + events[i].Price_int;
    } 
    //console.log(Date.parse(events[i].date));
}    

//console.log(JSON.stringify(events));

var chart = AmCharts.makeChart("AMchartdiv", {
    type: "stock",
    theme: "dark",
    pathToImages: "http://www.amcharts.com/lib/3/images/",
    dataSets: [{
	color: "#ffffff",
	fieldMappings:  [{
                fromField: "col1",
                toField: "open"
            }, {
                fromField: "col4",
                toField: "close"
            }, {
                fromField: "col2",
                toField: "high"
            }, {
                fromField: "col3",
                toField: "low"
            }, {
                fromField: "col5",
                toField: "volume"
            }, {
                fromField: "col6",
                toField: "value"
            }],
  
	dataProvider: chartData,
	categoryField: "date",
	// EVENTS
	stockEvents: events
/*	stockEvents: [{
	    date: new Date(2013, 8, 19),
	    type: "sign",
	    backgroundColor: "#85CDE6",
	    graph: "g1",
	    text: "U",
	    description: "UPGRADE: John Cotter, Stifel, Target: $400"
	}, {
	    date: new Date(2013, 10, 19),
	    type: "sign",
	    backgroundColor: "#85CDE6",
	    backgroundAlpha: 0.5,
	    graph: "g1",
	    text: "U",
	    description: "UPGRADE: John Cotter, Stifel, Target: $450"
	}, {
	    date: new Date(2013, 11, 10),
	    backgroundColor: "#CDCDCD",
	    type: "sign",
	    text: "D",
	    graph: "g1",
	    description: "DOWNGRADE: John Cotter, Stifel, Target: $400"
	}, {
	    date: new Date(2013, 11, 26),
	    backgroundColor: "#D8BFD8",
	    type: "sign",
	    text: "R",
	    graph: "g1",
	    description: "REITERATED: John Cotter, Stifel, Target: $400"
	}, {
	    date: new Date(2013, 0, 3),
	    type: "sign",
	    backgroundColor: "#85CDE6",
	    graph: "g1",
	    text: "U",
	    description: "UPGRADE: John Cotter, Stifel, Target: $400"
	}, {
	    date: new Date(2013, 1, 6),
	    type: "sign",
	    backgroundColor: "#CDCDCD",
	    graph: "g1",
	    text: "D",
	    description: "DOWNGRADE: John Cotter, Stifel, Target: $400"
	}, {
	    date: new Date(2013, 3, 5),
	    type: "sign",
	    backgroundColor: "#CDCDCD",
	    graph: "g1",
	    text: "D",
	    description: "DOWNGRADE: John Cotter, Stifel, Target: $400"
	}, {
	    date: new Date(2013, 3, 5),
	    type: "sign",
	    backgroundColor: "#D8BFD8",
	    graph: "g1",
	    text: "R",
	    description: "REITERATED: John Cotter, Stifel, Target: $400"
	}]*/
    }],

    panels: [{
	title: title,
	percentHeight: 70,

	stockGraphs: [{
	    id: "g1",
	    valueField: "value"
	    }],

	stockLegend: {
	    valueTextRegular: " ",
	    markerType: "none"
	    }
    }],

    chartScrollbarSettings: {
	graph: "g1"
    },

    chartCursorSettings: {
	valueBalloonsEnabled: true,
	graphBulletSize: 1
    },

    periodSelector: {
	periods: [{
	    period: "DD",
	    count: 10,
	    label: "10 days"
	}, {
	    period: "MM",
	    count: 1,
	    label: "1 month"
	}, {
	    period: "YYYY",
	    count: 1,
	    label: "1 year"
	}, {
	    period: "YTD",
	    label: "YTD"
	}, {
	    period: "MAX",
	    label: "MAX"
	}]
    },

    panelsSettings: {
	usePrefixes: true
    }
});

chart.addListener("init", zoomChart());
//zoomChart();

// this method is called when chart is first inited as we listen for "dataUpdated" event
function zoomChart() {
    // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
    //chart.zoomToIndexes(chartData.length - 360, chartData.length - 1);
    //startDate = chart.startDate;
    //endDate = new Date();
    //startDate = new Date();
    //startDate.setDate(endDate.getDate()-2*365)
    //endDate = chart.endDate;
    //console.log(typeof endDate);
    //startDate.setDate(endDate.getDate()-1);
    //console.log(startDate);
    //console.log(endDate);
    //chart.zoomToDates(startDate, endDate);
    console.log(chartData.length);
    chart.zoomToIndexes(10,20);
    //chart.zoomToIndexes(chartData.length-2*365, chartData.length - 1);
}


// this method is called each time the selected period of the chart is changed
/*function handleZoom(event) {
    var startDate = event.startDate;
    //console.log(startDate);
    //startDate = new Date();
    //startDate.setDate(startDate.getDate()-365; 
    var endDate = event.endDate;
    //endDate = new Date();
    document.getElementById("startDate").value = AmCharts.formatDate(startDate, "DD/MM/YYYY");
    document.getElementById("endDate").value = AmCharts.formatDate(endDate, "DD/MM/YYYY");

    // as we also want to change graph type depending on the selected period, we call this method
    changeGraphType(event);
}*/

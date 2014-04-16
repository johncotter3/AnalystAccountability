var chartData = [];
generateChartData();

function generateChartData() {
    var firstDate = new Date(2012, 0, 1);
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
}

var chart = AmCharts.makeChart("AMchartdiv", {
    type: "stock",
    theme: "dark",
    pathToImages: "http://www.amcharts.com/lib/3/images/",
    dataSets: [{
	color: "#ffffff",
	fieldMappings: [{
	    fromField: "value",
	    toField: "value"
	    }, {
		fromField: "volume",
		toField: "volume"
		}],
	dataProvider: chartData,
	categoryField: "date",
	// EVENTS
	stockEvents: [{
	    date: new Date(2010, 8, 19),
	    type: "sign",
	    backgroundColor: "#85CDE6",
	    graph: "g1",
	    text: "U",
	    description: "UPGRADE: John Cotter, Stifel, Target: $400"
	    }, {
		date: new Date(2010, 10, 19),
		type: "sign",
		backgroundColor: "#85CDE6",
		backgroundAlpha: 0.5,
		graph: "g1",
		text: "U",
		description: "UPGRADE: John Cotter, Stifel, Target: $450"
		}, {
		    date: new Date(2010, 11, 10),
		    backgroundColor: "#CDCDCD",
		    type: "sign",
		    text: "D",
		    graph: "g1",
		    description: "DOWNGRADE: John Cotter, Stifel, Target: $400"
		    }, {
			date: new Date(2010, 11, 26),
			backgroundColor: "#D8BFD8",
			type: "sign",
			text: "R",
			graph: "g1",
			description: "REITERATED: John Cotter, Stifel, Target: $400"
			}, {
			    date: new Date(2011, 0, 3),
			    type: "sign",
			    backgroundColor: "#85CDE6",
			    graph: "g1",
			    text: "U",
			    description: "UPGRADE: John Cotter, Stifel, Target: $400"
			    }, {
				date: new Date(2011, 1, 6),
				type: "sign",
				backgroundColor: "#CDCDCD",
				graph: "g1",
				text: "D",
				description: "DOWNGRADE: John Cotter, Stifel, Target: $400"
				}, {
				    date: new Date(2011, 3, 5),
				    type: "sign",
				    backgroundColor: "#CDCDCD",
				    graph: "g1",
				    text: "D",
				    description: "DOWNGRADE: John Cotter, Stifel, Target: $400"
				    }, {
					date: new Date(2011, 3, 5),
					type: "sign",
					backgroundColor: "#D8BFD8",
					graph: "g1",
					text: "R",
					description: "REITERATED: John Cotter, Stifel, Target: $400"
					}]
	}],


    panels: [{
	title: "Value",
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

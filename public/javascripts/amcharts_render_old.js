AmCharts.ready(function () {
            loadChartData('http://ichart.yahoo.com/table.csv?s=GOOG&a=0&b=1&c=2000&d=0&e=31&f=2010&g=w&ignore=.csv');
            createStockChart();
        });

        var chart;
        var chartData = [];
        var newPanel;
        var stockPanel;
  
  function loadChartData (url) {
/*
    if (window.XMLHttpRequest)
    {
      // IE7+, Firefox, Chrome, Opera, Safari
      var request = new XMLHttpRequest();
    }
    else
    {
      // code for IE6, IE5
      var request = new ActiveXObject('Microsoft.XMLHTTP');
    }
    // load
    request.open('GET', url, false);
    request.send();
    parseCSV(request.responseText);
    console.log(request.responseText);    
*/
/*
      var yahooFinance = require('yahoo-finance');
      var csv = 'Date,Open,Hign,Low,Close,Volume,Adj Close\n';
      var hack;
      
      function formatDate(d) {
	  var dd = d.getDate();
          if (dd<10){dd='0'+dd};
          var mm = d.getMonth()+1;
          if (mm<10){mm='0'+mm};
          var yy = d.getFullYear();

          return yy+'-'+mm+'-'+dd;
      };

      yahooFinance.historical({
	  symbol: symbolName,
          from: '2013-01-01',
          to: '2014-01-01'
      }, function(err, quotes, url, symbol){
	  for (var i=0; i<quotes.length; i++){
              d = quotes[i];
              csv = csv + formatDate(d.date)+','+d.open+','+d.high+','+d.low+','+d.close+','+d.volume+','+d.adjClose+'\n';
                    //console.log("csv array: " + csv[i]);
          };
          hack = url;
      });

      // Hack to make it work, shouldn't be used in production
      var uvrun = require("uvrun");
      while (!hack)
	  uvrun.runOnce();
  */

    console.log('Here!! 1.0');  
    // console.log(csv);  
    parseCSV(csv);  
  }
  
  function parseCSV (data) {
    // CSV settings
    var separator = ",";  // use comma for column separator
    var skip = 1;         // skip first row
    console.log(data);
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
    console.debug(chartData);
  }

        function createStockChart() {
            chart = new AmCharts.AmStockChart();
            chart.pathToImages = "http://www.amcharts.com/lib/images/";
	    
	     console.log('Here!! 2.0');


            // DATASET //////////////////////////////////////////
            var dataSet = new AmCharts.DataSet();
            dataSet.fieldMappings = [{
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
            }];
            dataSet.color = "#7f8da9";
            dataSet.dataProvider = chartData;
            dataSet.title = title;
            dataSet.categoryField = "date";

	    var e1 = {
		date: new Date(2013, 8, 19),
		type: "sign",
		backgroundColor: "#85CDE6",
		graph: "g1",
		text: "U",
		description: "UPGRADE: John Cotter, Stifel, Target: $400"
            };
	    var e2 = {
                date: new Date(2013, 10, 19),
                type: "sign",
                backgroundColor: "#85CDE6",
                backgroundAlpha: 0.5,
                graph: "g1",
                text: "U",
                description: "UPGRADE: John Cotter, Stifel, Target: $450"
            };
	    var e3 = {
                date: new Date(2013, 11, 10),
                backgroundColor: "#CDCDCD",
                type: "sign",
                text: "D",
                graph: "g1",
                description: "DOWNGRADE: John Cotter, Stifel, Target: $400"
            };
	    dataSet.stockEvents = [e1, e2, e3];

            chart.dataSets = [dataSet];

            // PANELS ///////////////////////////////////////////                                                  
            stockPanel = new AmCharts.StockPanel();
            stockPanel.title = "Value";
            stockPanel.showCategoryAxis = false;
            stockPanel.percentHeight = 70;

            var valueAxis = new AmCharts.ValueAxis();
            valueAxis.dashLength = 5;
            stockPanel.addValueAxis(valueAxis);

            stockPanel.categoryAxis.dashLength = 5;

            // graph of first stock panel
            var graph = new AmCharts.StockGraph();
            graph.type = "candlestick";
            graph.openField = "open";
            graph.closeField = "close";
            graph.highField = "high";
            graph.lowField = "low";
            graph.valueField = "close";
            graph.lineColor = "#7f8da9";
            graph.fillColors = "#7f8da9";
            graph.negativeLineColor = "#db4c3c";
            graph.negativeFillColors = "#db4c3c";
            graph.fillAlphas = 1;
            graph.useDataSetColors = false
            graph.comparable = true;
            graph.compareField = "value";
            graph.showBalloon = false;
            stockPanel.addStockGraph(graph);

            var stockLegend = new AmCharts.StockLegend();
            stockLegend.valueTextRegular = undefined;
            stockPanel.stockLegend = stockLegend;

            stockPanel2 = new AmCharts.StockPanel();
            stockPanel2.title = "Volume";
            stockPanel2.percentHeight = 30;
            stockPanel2.marginTop = 1;
            stockPanel2.showCategoryAxis = true;

            var valueAxis2 = new AmCharts.ValueAxis();
            valueAxis2.dashLength = 5;
            stockPanel2.addValueAxis(valueAxis2);

            var graph2 = new AmCharts.StockGraph();
            graph2.valueField = "volume";
            graph2.type = "column";
            graph2.showBalloon = false;
            graph2.fillAlphas = 1;
            stockPanel2.addStockGraph(graph2);

            var legend2 = new AmCharts.StockLegend();
            legend2.markerType = "none";
            legend2.markerSize = 0;
            legend2.labelText = "";
            stockPanel2.stockLegend = legend2;

            chart.panels = [stockPanel, stockPanel2];


            // OTHER SETTINGS ////////////////////////////////////
            var sbsettings = new AmCharts.ChartScrollbarSettings();
            sbsettings.graph = graph;
            sbsettings.graphType = "line";
            chart.chartScrollbarSettings = sbsettings;


            // PERIOD SELECTOR ///////////////////////////////////
            var periodSelector = new AmCharts.PeriodSelector();
            periodSelector.position = "bottom";
            periodSelector.periods = [{
                period: "DD",
                count: 10,
                label: "10 days"
            }, {
                period: "MM",
                count: 1,
                label: "1 month"
            }, {
                period: "YYYY",
                selected: true,
                count: 1,
                label: "1 year"
            }, {
                period: "YTD",
                label: "YTD"
            }, {
                period: "MAX",
                label: "MAX"
            }];
            chart.periodSelector = periodSelector;
	     console.log('Here!! 3.0');

            chart.write('AMchartdiv');
        }


/*
        function createStockChart() {
            chart = new AmCharts.AmStockChart();
            chart.pathToImages = "http://www.amcharts.com/lib/images/";

            // DATASET //////////////////////////////////////////
            var dataSet = new AmCharts.DataSet();
            dataSet.fieldMappings = [{
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
            }];
            dataSet.color = "#7f8da9";
            dataSet.dataProvider = chartData;
            dataSet.title = "GOOG";
            dataSet.categoryField = "date";

            chart.dataSets = [dataSet];

            // PANELS ///////////////////////////////////////////                                                  
            stockPanel = new AmCharts.StockPanel();
            stockPanel.title = "Value";
            stockPanel.showCategoryAxis = false;
            stockPanel.percentHeight = 70;

            var valueAxis = new AmCharts.ValueAxis();
            valueAxis.dashLength = 5;
            stockPanel.addValueAxis(valueAxis);

            stockPanel.categoryAxis.dashLength = 5;

            // graph of first stock panel
            var graph = new AmCharts.StockGraph();
            graph.type = "candlestick";
            graph.openField = "open";
            graph.closeField = "close";
            graph.highField = "high";
            graph.lowField = "low";
            graph.valueField = "close";
            graph.lineColor = "#7f8da9";
            graph.fillColors = "#7f8da9";
            graph.negativeLineColor = "#db4c3c";
            graph.negativeFillColors = "#db4c3c";
            graph.fillAlphas = 1;
            graph.useDataSetColors = false
            graph.comparable = true;
            graph.compareField = "value";
            graph.showBalloon = false;
            stockPanel.addStockGraph(graph);

            var stockLegend = new AmCharts.StockLegend();
            stockLegend.valueTextRegular = undefined;
            stockPanel.stockLegend = stockLegend;

            stockPanel2 = new AmCharts.StockPanel();
            stockPanel2.title = "Volume";
            stockPanel2.percentHeight = 30;
            stockPanel2.marginTop = 1;
            stockPanel2.showCategoryAxis = true;

            var valueAxis2 = new AmCharts.ValueAxis();
            valueAxis2.dashLength = 5;
            stockPanel2.addValueAxis(valueAxis2);

            var graph2 = new AmCharts.StockGraph();
            graph2.valueField = "volume";
            graph2.type = "column";
            graph2.showBalloon = false;
            graph2.fillAlphas = 1;
            stockPanel2.addStockGraph(graph2);

            var legend2 = new AmCharts.StockLegend();
            legend2.markerType = "none";
            legend2.markerSize = 0;
            legend2.labelText = "";
            stockPanel2.stockLegend = legend2;

            chart.panels = [stockPanel, stockPanel2];


            // OTHER SETTINGS ////////////////////////////////////
            var sbsettings = new AmCharts.ChartScrollbarSettings();
            sbsettings.graph = graph;
            sbsettings.graphType = "line";
            chart.chartScrollbarSettings = sbsettings;


            // PERIOD SELECTOR ///////////////////////////////////
            var periodSelector = new AmCharts.PeriodSelector();
            periodSelector.position = "bottom";
            periodSelector.periods = [{
                period: "DD",
                count: 10,
                label: "10 days"
            }, {
                period: "MM",
                count: 1,
                label: "1 month"
            }, {
                period: "YYYY",
                selected: true,
                count: 1,
                label: "1 year"
            }, {
                period: "YTD",
                label: "YTD"
            }, {
                period: "MAX",
                label: "MAX"
            }];
            chart.periodSelector = periodSelector;

            chart.write('AMchartdiv');
        }
*/

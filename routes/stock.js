/*
 * GET Stocks Pages.
 */
var mongoose = require('mongoose');

exports.avg = function(Stock, firmSchema) {
    return function(req, res) {
        var o = {};
        o.map = function() {
            var key = this.Symbol
            var value = {
                count: 1,
                qty: this.Percent_Diff
            };
            emit(key, value);
        };
        o.reduce = function(keySKU, countObjVals) {
            reducedVal = { count: 0, qty: 0 };
            for (var idx = 0; idx < countObjVals.length; idx++) {
                reducedVal.count += countObjVals[idx].count;
                reducedVal.qty += countObjVals[idx].qty;
            }
            return reducedVal;
        };
        o.finalize = function (key, reducedVal) {
            reducedVal.avg = reducedVal.qty/reducedVal.count;
            return reducedVal;
        };
        //o.out = {replace: 'map_reduce_TestData'};
        o.out = 'map_reduce_results';
	o.verbose = true;
	Stock.mapReduce(o, function (err, model, stats) {
	    if(err){
                console.log("Error: ", err);
            }else{
                console.log("Success, Took %d ms", stats.processtime);
            }
	    model.find().exec(function(err, docs) {
		if (err) return console.error(err);
		console.log(docs);
		console.log("WHOAAAAAAAAA");
		res.render('stocks', {
                    "forecast" : docs
		});
	    });
        });
    };
};

exports.specific = function(Stock, firmSchema) {
    return function(req, res) {
	var symbolName = req.params.symbolName;
	
	Stock.find({"Symbol": symbolName}, function (err, docs) {
	    if(err){
                console.log("Error: ", err);
            }else{
		console.log("Load specific symbol page by firm for " + symbolName);
                console.log("Success.");
            }
	    
            var yahooFinance = require('yahoo-finance');
            var csv = "";
	    csv = csv + "Date,Open,Hign,Low,Close,Volume,Adj Close\\n";
	    var quotesx;
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
		from: '2009-01-01',
		to: '2014-01-01'
            }, function(err, quotes, url, symbol){
		for (var i=0; i<quotes.length; i++){
		    d = quotes[quotes.length - 1 - i];
		    //console.log(d.date);
		    csv = csv + formatDate(d.date)+","+d.open+","+d.high+","+d.low+","+d.close+","+d.volume+","+d.adjClose+"\\n";
                    //console.log("csv array: " + csv[i]);
		};
		hack = url;
		//quotesx = quotes;
            });

            // Hack to make it work, shouldn't be used in production
	    // Used to get callback function from yahooFinance prior to rendering page
            var uvrun = require("uvrun");
            while (!hack)
		uvrun.runOnce();
 
	    // console.log("crazy: " + quotesx[3].date);
	    res.render('specificStocks', {
		"forecast" : docs,
		csv: csv,
		//quotesx: quotesx,
		title: symbolName
	    });
        });
    };
};


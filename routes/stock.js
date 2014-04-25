
/*
 * GET Firms Pages.
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

	    res.render('specificStocks', {
		"forecast" : docs,
		title: symbolName
	    });
        });
    };
};


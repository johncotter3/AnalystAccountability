
/*
 * GET Analyst Pages.
 */
var mongoose = require('mongoose');

exports.avg = function(Analyst, firmSchema){
    return function(req, res) {
        var o = {};
        o.map = function() {
            var key = this.Analyst
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
        //o.out = { replace: 'map_reduce_TestData'};
	o.out = 'map_reduce_analystAvg';
	o.verbose = true;
        Analyst.mapReduce(o, function (err, results) {
	    if(err){ 
		console.log("Error:", err);
	    }else{
		console.log("success");
	    }
        });

        var analystResults = mongoose.model('analystResults', firmSchema, 'map_reduce_results');
        analystResults.find(function(err, docs) {
            if (err) return console.error(err);
            console.log(docs);
            res.render('analysts', {
                "forecast" : docs
            });
        });
    };
};


/*
 * GET Firms Pages.
 */
var mongoose = require('mongoose');

exports.avg = function(Firm, firmSchema) {
    return function(req, res) {
        var o = {};
        o.map = function() {
            var key = this.Firm
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
        o.out = 'map_reduce_firmsAvg';
	o.verbose = true;
	Firm.mapReduce(o, function (err, results) {
	    if(err){
                console.log("Error:", err);
            }else{
                console.log("success");
            }

        });

        var firmResults = mongoose.model('firmResults', firmSchema, 'map_reduce_firmsAvg');
        firmResults.find(function(err, docs) {
            if (err) return console.error(err);
            console.log(docs);
            res.render('firms', {
                "forecast" : docs
            });
        });
    };
};

exports.specific = function(Firm, firmSchema) {
    return function(req, res) {
	var firmName = req.params.firmName;
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
        o.out = 'map_reduce_firmsSpecific';
	o.verbose = true;
	o.query = {'Firm': firmName}
        Firm.mapReduce(o, function (err, results) {
	    if(err){
                console.log("Error:", err);
            }else{
                console.log("success");
            }

        });

	console.log("Specific Firm Page for " + firmName);

        var firmResults = mongoose.model('firmResults', firmSchema, 'map_reduce_firmsSpecific');
        firmResults.find(function(err, docs) {
            if (err) return console.error(err);
            console.log(docs);
            res.render('specificFirms', {
                "forecast" : docs,
		title: firmName
            });
        });
    };
};



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
        o.out = 'map_reduce_results';
	o.verbose = true;
	Firm.mapReduce(o, function (err, model, stats) {
	    if(err){
                console.log("Error: ", err);
            }else{
                console.log("Success, Took %d ms", stats.processtime);
            }
	    model.find().exec(function(err, docs) {
		if (err) return console.error(err);
		console.log(docs);
		console.log("WHOAAAAAAAAA");
		if(req.session.user!=null){
		    res.render('firms', {
			"forecast" : docs,
			loggedin: 'true'
			//udata: req.session.user
		    });
		} else {
		    res.render('firms', {
			"forecast" : docs
		    });
		}
	    });
        });
    };
};

exports.specific = function(Firm, firmSchema) {
    return function(req, res) {
	if (req.session.user!=null && req.session.user.member == 'premium') {
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
            o.out = 'map_reduce_results';
	    o.verbose = true;
	    o.query = {'Firm': firmName}
            Firm.mapReduce(o, function (err, model, stats) {
		if(err){
                    console.log("Error: ", err);
		}else{
		    console.log("Load specific firm page for " + firmName);
                    console.log("Success, Took %d ms", stats.processtime);
		}
		
		model.find().exec(function(err, docs) {
		    if (err) return console.error(err);
		    console.log(docs);
		    if(req.session.user!=null){
			res.render('specificFirms', {
			    "forecast" : docs,
			    title: firmName,
			    loggedin: 'true'
			    //udata: req.session.user
			});    
		    } else {
			res.render('specificFirms', {
			    "forecast" : docs,
			    title: firmName
			});
		    }
		});
            });
	} else {
	    res.redirect('/premium');
	}
    };
};


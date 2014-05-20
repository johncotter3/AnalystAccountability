
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
	o.out = 'map_reduce_results';
	o.verbose = true;
        Analyst.mapReduce(o, function (err, model, stats) {
	    if(err){
                console.log("Error: ", err);
            }else{
                console.log("Success, Took %d ms", stats.processtime);
            }
            model.find().exec(function(err, docs) {
                if (err) return console.error(err);
                console.log(docs);
                if(req.session.user!=null){
		    res.render('analysts', {
			"forecast" : docs,
			loggedin: 'true',
			udata: req.session.user
                    });
		} else {
		    res.render('analysts', {
                        "forecast" : docs,
                    });
		}
            });
        });
    };
};


exports.specific = function(Analyst, firmSchema){
    return function(req, res) {
        if (req.session.user!=null && req.session.user.member == 'premium') {
            var analystName = req.params.analystName;
	    console.log(analystName);
	    Analyst.find({"Analyst": analystName}, function (err, docs) {
		if(err){
                    console.log("Error: ", err);
		}else{
                    console.log("Success.");
		}
		if(req.session.user!=null){
		    res.render('specificAnalysts', {
			"forecast" : docs,
			title: analystName,
			loggedin: 'true'
		    });
		} else {
		    res.render('specificAnalysts', {
                        "forecast" : docs,
                        title: analystName
                    });
		}
            });
	} else {
            res.redirect('/premium');
	}
    };
};

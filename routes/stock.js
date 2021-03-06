/*
 * GET Stocks Pages.
 */
var mongoose = require('mongoose');

exports.avg = function(Stock, firmSchema) {
    return function(req, res) {
        StockAvg = mongoose.model('StockAvg', firmSchema, 'map_reduce_stocks');
	StockAvg.find().exec(function(err, docs) {
	    if (err) return console.error(err);
	    //console.log(docs);
	    console.log("WHOAAAAAAAAA");
	    if(req.session.user!=null){
		res.render('stocks', {
		    "forecast" : docs,
		    loggedin: 'true',
		    uname: req.session.user.name
		});
	    } else {
		res.render('stocks', {
		    "forecast" : docs
		});
	    }
	});
    };
};

exports.specific = function(Stock, firmSchema) {
    return function(req, res) {
	if (req.session.user!=null && req.session.user.member == 'premium') {
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
		    to: null
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
		if(req.session.user!=null){
		    res.render('specificStocks', {
			"forecast" : docs,
			csv: csv,
			//quotesx: quotesx,
			title: symbolName,
			loggedin: 'true',
			uname: req.session.user.name
		    });
		} else {
		    res.render('specificStocks', {
			"forecast" : docs,
			csv: csv,
			title: symbolName
		    });
		}
            });
	} else {
	    res.redirect('/premium');
	}
    };
};


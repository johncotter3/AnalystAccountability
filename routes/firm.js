
/*
 * GET Firms Pages.
 */
var mongoose = require('mongoose');

exports.avg = function(Firm, firmSchema) {
    return function(req, res) {
        FirmAvg = mongoose.model('FirmAvg', firmSchema, 'map_reduce_firms');
        FirmAvg.find().exec(function(err, docs) {
            if (err) return console.error(err);
            console.log("WHOAAAAAAAAA");
            if(req.session.user!=null){
                res.render('firms', {
                    "forecast" : docs,
                    loggedin: 'true',
                    uname: req.session.user.name
                });
            } else {
                res.render('firms', {
                    "forecast" : docs
                });
            }
        });
    };
};

exports.specific = function(Firm, firmSchema) {
    return function(req, res) {
	if (req.session.user!=null && req.session.user.member == 'premium') {
            var firmName = req.params.firmName;
            console.log("Load specific firm page for " + firmName);
            Firm.find({"Firm": firmName}, function(err, docs) {
		if (err) return console.error(err);
		console.log(docs);
		if(req.session.user!=null){
		    res.render('specificFirms', {
			"forecast" : docs,
			title: firmName,
			loggedin: 'true',
			uname: req.session.user.name
		    });    
		} else {
		    res.render('specificFirms', {
			"forecast" : docs,
			title: firmName
		    });
		}
	    });
        } else {
	    res.redirect('/premium');
	}
    };
};


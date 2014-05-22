
/*
 * GET Search Pages.
 */
var mongoose = require('mongoose');

exports.query = function(Stock, firmSchema) {
    return function(req, res) {
	var query = req.query.q;
	console.log("WHOAAAAAAAAA");
	if(req.session.user!=null){
	   res.render('searches', {
	       query: query,
	       loggedin: 'true'
	   });
	} else {
	   res.render('searches', {
	       query: query
	   }); 
	}
    };	
};


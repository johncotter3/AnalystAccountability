
/*
 * GET premium page to convince people it is awesome.
 */

exports.view = function() {
    return function(req, res) {
	res.render('premium');
    };	
};


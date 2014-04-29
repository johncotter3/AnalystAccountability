
/*
 * GET home page.
 */
var mongoose = require('mongoose');

exports.index = function(postSchema) {
    return function(req, res){
	//res.render('index', { title: 'Analyst Accountability' });

	var postResults = mongoose.model('postResults', postSchema, 'postData');
	var q = postResults.find().sort('Date').limit(3);
	q.sort('-Date').exec(function(err, docs) {
	    if (err) return console.error(err);
	    // TODO: Handle error when no results are returned
	    console.log(docs);
	    for (var i=0; i< docs.length; i++){
		docs[i].Post = docs[i].Post.substring(0,499);
	    }
	    res.render('index', {
		"docs" : docs
	    });
	});
    };
};

exports.dne = function(){
    return function(req, res){
	res.render('dne');
    };
};


/*
 * GET home page.
 */
var mongoose = require('mongoose');

exports.index = function(req, res){
  res.render('index', { title: 'Analyst Accountability' });
};


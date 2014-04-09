var express = require('express');
var fs = require('fs');
var routes = require('./routes');
var analyst = require('./routes/analyst');
var firm = require('./routes/firm');
var post = require('./routes/post');
var http = require('http');
var path = require('path');
var favicons = require('static-favicon');
var bodyParser = require('body-parser');
var router = require('app-router');
var connect = require('connect');
var serveStatic = require('serve-static');
var mongo = require('mongodb');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://ip-172-31-40-77/AnalystData');
var config = {       
    "USER"    : "",                  
    "PASS"    : "",       
    "HOST"    : "ec2-54-213-144-38.us-west-2.compute.amazonaws.com",         
    "PORT"    : "27017",        
    "DATABASE" : "AnalystData"     
};
var dbPath  = "mongodb://"+
    config.USER + ":"+     
    config.PASS + "@"+     
    config.HOST + ":"+    
    config.PORT + "/"+     
    config.DATABASE;
//mongoose.connect(dbPath);
mongoose.connect('mongodb://johncotter:johncotter@ds049337.mongolab.com:49337/analystaccountability')

var db = mongoose.connection; 
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("yay!");
    
});

var firmSchema = new mongoose.Schema({
    Firm: String
    , _id: String
    , Analyst: String
    , Date: Date
    , Symbol: String
    , Percent_Diff: Number
    , value: {
	count: Number,
        qty: Number,
        avg: Number
    }
});
var Firm = mongoose.model('Firm', firmSchema, 'AnalystData');
var Analyst = mongoose.model('Analyst', firmSchema, 'AnalystData');
var postSchema = new mongoose.Schema({
    _id : String
    , Date : Date
    , Post : String
    , PostTitle : String
    , PostImage : String
});
var Post = mongoose.model('Post', postSchema, 'PostData');

var app = express();
// Logging middleware
app.use(function(request, response, next) {
  console.log("In comes a " + request.method + " to " + request.url);
  next();
});

app.set("views", __dirname + "/views");
app.set('view engine', 'jade');
app.use(favicons());
app.use(bodyParser());
app.use(require('method-override')());
app.use(serveStatic(path.join(__dirname, 'public')));

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});


app.get('/', routes.index(postSchema));
app.get('/firms', firm.avg(Firm, firmSchema));
app.get('/firms/:firmName', firm.specific(Firm, firmSchema));
//app.get('/analysts', analyst.avg(Analyst, firmSchema));
app.get('/analysts', routes.dne());
app.get('/stocks', routes.dne());
app.get('/posts/:postID', post.view(Post, postSchema));

http.createServer(app)

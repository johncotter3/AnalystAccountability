var express = require('express');
var fs = require('fs');
var routes = require('./routes');
var analyst = require('./routes/analyst');
var firm = require('./routes/firm');
var post = require('./routes/post');
var stock = require('./routes/stock');
var search = require('./routes/search');
var contact = require('./routes/contact');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var connect = require('connect');
var csrf = require('csrf');
var serveStatic = require('serve-static');
var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
var email = new sendgrid.Email();
var Validator = require('validator').Validator;
var mongo = require('mongodb');
var mongoose = require('mongoose');

// MongoDB connection Stuff
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
    , Company: String
    , Rating: String
    , Price_int: Number
    , Actual: Number
    , Percent_Diff: Number
    , value: {
	count: Number,
        qty: Number,
        avg: Number
    }
});
var Firm = mongoose.model('Firm', firmSchema, 'AnalystData');
var Analyst = mongoose.model('Analyst', firmSchema, 'AnalystData');
var Stock = mongoose.model('Stock', firmSchema, 'AnalystData');
var postSchema = new mongoose.Schema({
    _id : String
    , Date : Date
    , Post : String
    , PostTitle : String
    , PostImage : String
});
var Post = mongoose.model('Post', postSchema, 'PostData');

function csrf(req, res, next) {
  res.locals.token = req.session._csrf;
  next();
}

// App configuration
var app = express();
app.use(function(request, response, next) {
  console.log("In comes a " + request.method + " to " + request.url);
  next();
});
app.set("views", __dirname + "/views");
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(cookieParser());
app.use(session({secret: 'Secret goes here'}));
//app.use(csrf());
app.use(bodyParser());
app.locals.errors = {};
app.locals.message = {};
app.use(require('method-override')());
app.use(serveStatic(path.join(__dirname, 'public')));
var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});

// App Routes
app.get('/', routes.index(postSchema));
app.get('/firms', firm.avg(Firm, firmSchema));
app.get('/firms/:firmName', firm.specific(Firm, firmSchema));
app.get('/analysts', analyst.avg(Analyst, firmSchema));
app.get('/analysts/:analystName', analyst.specific(Firm, firmSchema));
//app.get('/analysts', routes.dne());
app.get('/stocks', stock.avg(Stock, firmSchema));
app.get('/stocks/:symbolName', stock.specific(Stock, firmSchema));
app.get('/posts/:postID', post.view(Post, postSchema));
app.get('/search', search.query());
app.get('/contact', contact.formGet());
app.post('/contact', contact.formPost()); 

// Create Web App
http.createServer(app)

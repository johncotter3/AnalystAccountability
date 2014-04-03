var express = require('express');
var fs = require('fs');
var routes = require('./routes');
var analyst = require('./routes/analyst')
  , firm = require('./routes/firm');
var http = require('http');
var path = require('path');
var favicons = require('static-favicon');
var bodyParser = require('body-parser');
//var methodOverride = require('get-methodoverride');
var router = require('app-router');
var connect = require('connect');
var serveStatic = require('serve-static');
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://ip-172-31-40-77/AnalystData');
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
var Firm = mongoose.model('Firm', firmSchema, 'TestData');
var Analyst = mongoose.model('Analyst', firmSchema, 'TestData');


var app = express();
// Logging middleware
app.use(function(request, response, next) {
  console.log("In comes a " + request.method + " to " + request.url);
  next();
});

app.set("views", __dirname + "/views");
app.set('view engine', 'jade');
app.use(favicons());
//app.use(express.logger('dev'));
app.use(bodyParser());
//app.use(methodOverride());
app.use(require('method-override')());
//app.use(router(app));
app.use(serveStatic(path.join(__dirname, 'public')));

//var port = process.env.PORT || 8080;
//app.listen(port, function() {
//  console.log("Listening on " + port);
//});


app.get('/', routes.index);
app.get('/firms', firm.avg(Firm, firmSchema));
app.get('/firms/:firmName', firm.specific(Firm, firmSchema));
app.get('/analysts', analyst.avg(Analyst, firmSchema));

http.createServer(app).listen(8080);

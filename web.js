var express = require('express');
var fs = require('fs');
var routes = require('./routes');
var analyst = require('./routes/analyst')
  , firm = require('./routes/firm');
var http = require('http');
var path = require('path');
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/AnalystData');
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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});


app.get('/', routes.index);
app.get('/firms', firm.avg(Firm, firmSchema));
app.get('/firms/:firmName', firm.specific(Firm, firmSchema));
app.get('/analysts', analyst.avg(Analyst, firmSchema));

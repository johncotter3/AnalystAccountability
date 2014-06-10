var express = require('express');
var fs = require('fs');
var routes = require('./routes');
var analyst = require('./routes/analyst');
var firm = require('./routes/firm');
var post = require('./routes/post');
var stock = require('./routes/stock');
var search = require('./routes/search');
var contact = require('./routes/contact');
var premium = require('./routes/premium');
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
var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');

// MongoDB connection Stuff
mongoose.connect(process.env.MONGOLAB_CONNECT_URL)
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
app.get('/premium', premium.view());
app.get('/contact', contact.formGet());
app.post('/contact', contact.formPost()); 
// ****** Login Routes ******
// main login page
app.get('/login', function(req, res){
    // check if the user's credentials are saved in a cookie //
    if (req.cookies.user == undefined || req.cookies.pass == undefined){
        res.render('node-login/login', { title: 'Hello - Please Login To Your Account', udata: '' });
    } else{
        // attempt automatic login //
        AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
            if (o != null){
                req.session.user = o;
                res.redirect('/home');
            } else{
                res.render('node-login/login', { title: 'Hello - Please Login To Your Account' });
            }
        });
    }
});
app.post('/login', function(req, res){
    AM.manualLogin(req.param('user'), req.param('pass'), function(e, o){
        if (!o){
            res.send(e, 400);
        }       else{
            req.session.user = o;
            if (req.param('remember-me') == 'true'){
                res.cookie('user', o.user, { maxAge: 900000 });
                res.cookie('pass', o.pass, { maxAge: 900000 });
            }
            res.send(o, 200);
        }
    });
});
// logged-in user homepage //
app.get('/home', function(req, res) {
    if (req.session.user != null){
	res.render('node-login/home', {
            title : 'Control Panel',
            countries : CT,
            loggedin : 'true',
	    udata : req.session.user,
	    uname: req.session.user.name
        });
    } else{
	res.redirect('/');
    }	
});
app.post('/home', function(req, res){
    if (req.param('user') != undefined) {
	console.log("Make it Here??? 6.0");
        AM.updateAccount({
            user            : req.param('user'),
            name            : req.param('name'),
            email           : req.param('email'),
            country         : req.param('country'),
            pass            : req.param('pass')
        }, function(e, o){
            if (e){
                res.send('error-updating-account', 400);
            }       else{
                req.session.user = o;
                // update the user's login cookies if they exists //
                if (req.cookies.user != undefined && req.cookies.pass != undefined){
                    res.cookie('user', o.user, { maxAge: 900000 });
                    res.cookie('pass', o.pass, { maxAge: 900000 });
                }
                res.send('ok', 200);
            }
        });
    } else if (req.param('logout') == 'true'){
        console.log("Make it Here??? 2.0");
	res.clearCookie('user',{path: '/' });
	//res.cookie('user', '', {expires: new Date(1), path: '/' });
	//delete req.session.user;
	console.log(req.session.user);
	console.log("Make it Here??? 3.0");
        res.clearCookie('pass',{path: '/' });
	//res.cookie('pass', '', {expires: new Date(1), path: '/' });
	//delete req.session.pass;
	console.log(req.session.pass);
	console.log("Make it Here??? 4.0");
        req.session.destroy(function(e){ res.send('ok', 200); });
	console.log("Make it Here??? 5.0");
    }
});
// creating new accounts //
app.get('/signup', function(req, res) {
    res.render('node-login/signup', {  title: 'Signup', countries : CT });
});
app.post('/signup', function(req, res){
    AM.addNewAccount({
        name    : req.param('name'),
        email   : req.param('email'),
        user    : req.param('user'),
        pass    : req.param('pass'),
        country : req.param('country'),
	member  : 'basic',
	subscription: 'none'
    }, function(e){
        if (e){
	    console.log(e);
            res.send(e, 400);
        }       else{
            res.send('ok', 200);
        }
    });
});
// password reset //
app.post('/lost-password', function(req, res){
    // look up the user's account via their email //
    AM.getAccountByEmail(req.param('email'), function(o){
        if (o){
            res.send('ok', 200);
            EM.dispatchResetPasswordLink(o, function(e, m){
                // this callback takes a moment to return //
                // should add an ajax loader to give user feedback //
                if (!e) {
                    //      res.send('ok', 200);
                }       else{
                    res.send('email-server-error', 400);
                    for (k in e) console.log('error : ', k, e[k]);
                }
            });
        }       else{
            res.send('email-not-found', 400);
        }
    });
});
app.get('/reset-password', function(req, res) {
    var email = req.query["e"];
    var passH = req.query["p"];
    AM.validateResetLink(email, passH, function(e){
        if (e != 'ok'){
            res.redirect('/');
        } else{
            // save the user's email in a session instead of sending to the client //
            req.session.reset = { email:email, passHash:passH };
            res.render('node-login/reset', { title : 'Reset Password' });
        }
    })
});
app.post('/reset-password', function(req, res) {
    var nPass = req.param('pass');
    // retrieve the user's email from the session to lookup their account and reset password //
    var email = req.session.reset.email;
    // destory the session immediately after retrieving the stored email //
    req.session.destroy();
    AM.updatePassword(email, nPass, function(e, o){
        if (o){
            res.send('ok', 200);
        }       else{
            res.send('unable to update password', 400);
        }
    })
});
// view & delete accounts //
app.get('/print', function(req, res) {
    AM.getAllRecords( function(e, accounts){
        res.render('print', { title : 'Account List', accts : accounts });
    })
});
app.post('/delete', function(req, res){
    AM.deleteAccount(req.body.id, function(e, obj){
        if (!e){
            res.clearCookie('user');
            res.clearCookie('pass');
            req.session.destroy(function(e){ res.send('ok', 200); });
        }       else{
            res.send('record not found', 400);
        }
    });
});
/*app.get('/reset', function(req, res) {
  AM.delAllRecords(function(){
  res.redirect('/print');
  });
  });
app.get('*', function(req, res) { 
    if(req.session.user!=null){
	res.render('node-login/404', { title: 'Page Not Found', loggedin : 'true'}); 
    } else {
	res.render('node-login/404', { title: 'Page Not Found'});
    }
});*/


// Create Web App
http.createServer(app)

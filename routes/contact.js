/*
 * GET Contact Form Page
*/

var v = require('validator');
var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

function validate(message) {
  
  errors = [];
  /*
  v.error = function(msg) {
    errors.push(msg);
  };

  v.check(message.name, 'Please enter your name').len(1, 100);
  v.check(message.email, 'Please enter a valid email address').isEmail();
  v.check(message.subject, 'Please enter a valid subject').len(1,150);
  v.check(message.message, 'Please enter a valid message').len(1, 1000);
*/
    if(v.isLength(message.name,1,100) == false){
	errors.push('Please enter your name');
    }
    if(v.isEmail(message.email) == false){
	errors.push('Please enter a valid email address');
    }
    if(v.isLength(message.subject,1,250) == false){
        errors.push('Please enter a valid subject');
    }
    if(v.isLength(message.message,1,1000) == false){
        errors.push('Please enter a valid message. Either you didn\'t write a message or your message was the size of a novel. Please use less than 1000 characters.');
    }
    
    // These are homebrewed validators based on bad messages
    if(message.name == '2rand[0,1,1]'){
        errors.push('NO BOTS PLEASE!');
    }


    return errors;
}

function sendEmail(message, fn) {
    // Is this function needed?
    var ret;
    var email = new sendgrid.Email();
    email.addTo(process.env.SENDGRID_TO);
    email.setFrom(process.env.SENDGRID_TO);
    email.setSubject('Analyst Accountability Contact Form: '+message.subject);
    email.setHtml(['<h4>FROM: </h4>',
		   '<p>'+message.name+'</p>',
		   '<h4>EMAIL: </h4>',
		   '<p>'+message.email+'</p>',
		   '<h4>SUBJECT: </h4>',
		   '<p>'+message.subject+'</p>',
		   '<h4>MESSAGE: </h4>',
		   '<p>'+message.message+'</p>'
		  ].join("\r\n"));

    sendgrid.send(email, function(err, json){
	if (err){ return console.error(err);}
	console.log('JSON Response: '+json.message);
	ret = json.message;
	return json.message;
    });
    /*console.log('here? 1.0');
{
    to: process.env.EMAIL_RECIPIENT
  , from: message.email
  , subject: message.subject
  , text: 'FROM: '+message.name+'\nMESSAGE: '+message.message
  }, fn);
    //console.log(ret);
    return ret;*/
}

exports.formGet = function() {
    return function(req, res) {
	if(req.session.user!=null){
	    res.render('contact',{
		loggedin: 'true'
	    });
	} else {
	    res.render('contact');
	}
    }
};

exports.formPost = function() {
    return function(req, res) {
	var message = req.body.message
	, errors = validate(message)
	, locals = {}
	;
	console.log('Message: '+message);
	function render() {
	    if(req.session.user!=null){
		var jadeVars = {};
		var locals2 = {loggedin: 'true'};
		for (var attrname in locals) { jadeVars[attrname] = locals[attrname]; }
		for (var attrname in locals2) { jadeVars[attrname] = locals2[attrname]; }
		console.log(jadeVars);
		res.render('contact',jadeVars);
	    } else {
		res.render('contact',locals);
	    }
	}
	
	if (errors.length === 0) {
	    /*sendEmail(message, function(success) {
		if (success != 'success') {
		    locals.error = 'Error sending message';
		    locals.message = message;
		} else {
		    locals.notice = 'Your message has been sent.';
		    console.log('here? 2.0');
		}
		render();
	    });*/
	    var email = new sendgrid.Email();
	    email.addTo(process.env.SENDGRID_TO);
	    email.setFrom(process.env.SENDGRID_TO);
	    email.setSubject('Analyst Accountability Contact Form: '+message.subject);
	    email.setHtml(['<h4>FROM: </h4>',
			   '<p>'+message.name+'</p>',
			   '<h4>EMAIL: </h4>',
			   '<p>'+message.email+'</p>',
			   '<h4>SUBJECT: </h4>',
			   '<p>'+message.subject+'</p>',
			   '<h4>MESSAGE: </h4>',
			   '<p>'+message.message+'</p>'
			  ].join("\r\n"));
	    
	    sendgrid.send(email, function(err, json){
		if (err){ return console.error(err);}
		console.log('JSON Response: '+json.message);
		ret = json.message;
		if (err){
		    locals.error = 'Error sending message';
		    locals.message = message;
		} else {
		    locals.notice = 'Your message has been sent.';
		    render();
		}
		//return json.message;
	    });

	} else {
	    locals.error = 'Your message has errors:';
	    locals.errors = errors;
	    locals.message = message;
	    render();
	}
    }
};

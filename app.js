var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');

var app = express();

/*var logger = function(req,res,next){
	console.log("logging..");
	next(); 
}

app.use(logger);*/


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname,'public')));

app.use(function(req,res,next){
	res.locals.errors = null;
	next();
});

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


var users = [
	{
		id: 1,
		first_name: 'prateek',
		last_name: 'gupta',
		email: 'prateekgupa@gmail.com'
	},
	{
		id: 2,
		first_name: 'nidish',
		last_name: 'ram',
		email: 'nidishram@gmail.com'
	}

]


app.get('/',function(req,res){
	res.render('index',{
		title: 'Customers',
		users: users
	}); 

});

app.post('/users/add',function(req,res){

	req.checkBody('first_name','First Name is required').notEmpty();
	req.checkBody('last_name','Last name is required').notEmpty();
	req.checkBody('email','Email is required').notEmpty();
	var errors = req.validationErrors();

	if(errors)
	{
		res.render('index',{
			title: 'Customers',
			users: users,
			errors: errors
		}); 
	}
	else
	{
	var newUser = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email
	}

	console.log('Success');
	}

	
});

app.listen(3000,function(){
	console.log('server started on port 3000');
})

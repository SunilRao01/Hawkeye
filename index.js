var express = require('express');
var app = express();

app.disable('x-powered-by');


// Set default page
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');



// MORE IMPORTS HERE




// Set 'port' variable to 3000
app.set('port', process.env.PORT || 3000);
// Listen to port number 'port'
app.listen(app.get('port'), function()
{
	console.log('Express has started press Ctrl-C to terminate');
});

// Reference to the public directory
app.use(express.static(__dirname + '/public'));

// Serve home page at start (path for first param is nto case sensitive)
app.get('/', function(req, res)
{
	res.render('home');
});

// Serve error page(s)
app.use(function(err, req, res, next)
{
	console.log('Error: ' + err.message);
});
app.use(function(req, res)
{
	res.type('text/html');
	res.status(404);
	res.render('404');
});
app.use(function(err, req, res, next)
{
	console.log(err.stack);
	res.type('text/html');
	res.status(500);
	res.render('404');
});

// Serve calendar page
app.get('/calendar', function(req, res)
{
	res.render('calendar');
});
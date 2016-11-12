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

// Reference to the public directory
app.use(express.static(__dirname + '/public'));

// Serve requests with hard text (path for first param is nto case sensitive)
app.get('/', function(req, res)
{
	res.render('home');
});

// Listen to port number 'port'
app.listen(app.get('port'), function()
{
	console.log('Express has started press Ctrl-C to terminate');
});
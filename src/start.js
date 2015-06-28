var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var calculator = require('./calculator');

app.engine('handlebars',
	exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
	var theData = JSON.stringify(calculator.evaluate("calculate","", ""));
	res.render('display', { data : theData });
});

app.get('/underscore-calculator', function(req, res) {
	var theData = JSON.stringify(calculator.evaluate("calculate", "", ""));
	res.render('display', { data : theData });
});

app.get('/underscore-calculator/:func/:op', function(req, res) {
	var theData = JSON.stringify(calculator.evaluate(req.params.func, req.params.op,req.query.input));
	res.render('display', { data : theData });
});

app.use(express.static('public'));

var port = Number(process.env.PORT || 8080);
app.listen(port);

console.log('starting server...');

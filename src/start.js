var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var calculator = require('./calculator');

app.engine('handlebars',
	exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
	var theData = JSON.stringify(calculator.evaluate("", ""));
	res.render('display', { data : theData });
});

app.get('/underscore-calculator', function(req, res) {
	var theData = JSON.stringify(calculator.evaluate("", ""));
	res.render('display', { data : theData });
});

app.get('/underscore-calculator/calculate/:op', function(req, res) {
	var theRegisters = calculator.evaluate(req.params.op,req.query.input);
	var theData = JSON.stringify(theRegisters);
	res.render('display', { data : theData });
});

app.get('/underscore-calculator/recall/:name', function(req, res) {
	var theRegisters = calculator.recall(req.params.name);
	var theData = JSON.stringify(theRegisters);
	res.render('display', { data : theData });
});

app.get('/underscore-calculator/store/:name', function(req, res) {
	var theRegisters = calculator.store(req.params.name);
	var theData = JSON.stringify(theRegisters);
	res.render('display', { data : theData });
});

app.get('/underscore-calculator/record/:name', function(req, res) {
	var theRegisters = calculator.record(req.params.name);
	var theData = JSON.stringify(theRegisters);
	res.render('display', { data : theData });
});

app.get('/underscore-calculator/play/:name', function(req, res) {
	var theRegisters = calculator.play(req.params.name);
	var theData = JSON.stringify(theRegisters);
	res.render('display', { data : theData });
});

app.use(express.static('public'));

var port = Number(process.env.PORT || 8080);
app.listen(port);

console.log('starting server...');

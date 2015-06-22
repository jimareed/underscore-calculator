var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var _ = require("underscore");

app.engine('handlebars',
	exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var ds = [];
var registers = [];

function loadRegisters() {
	for (var i = 0; i < 4; i += 1) {
		if (typeof ds[i][0] == "object") {
			for (var key in ds[i]) break;
			if (key != null) {
				registers[i] = ds[i][key];
			}
		} else {
			registers[i] = [ds[i][0]];
		}
	}

	registers[4] = [1,1,1,1];
	registers[5] = [1,1,1,1];

	for (var i = 0; i < 4; i += 1) {
		registers[5][i] = ds[i].length;
	}

}

ds[0] = [];
ds[1] = [];
ds[2] = [];
ds[3] = [];

loadRegisters();

app.get('/', function(req, res) {
	var theData = JSON.stringify(registers);
	res.render('display', { data : theData });
});

app.get('/display', function(req, res) {
	var theData = JSON.stringify(registers);
	res.render('display', { data : theData });
});

app.get('/calculate/:op', function(req, res) {

	if (req.query.input == "") {
		if (req.params.op == "enter") {
			ds[3] = ds[2];
			ds[2] = ds[1];
			ds[1] = ds[0];
		}
	} else {
		ds[3] = ds[2];
		ds[2] = ds[1];
		ds[1] = ds[0];

		var input = req.query.input;
		if (req.query.input.indexOf("[") == -1) {
			ds[0] = [ req.query.input ];
		} else {
			ds[0] = JSON.parse(req.query.input);
		}
	}

	if (req.params.op == "uniq") {
		ds[0] = _.uniq(ds[0]);
	}

	if (req.params.op == "size") {
		var size =  _.size(ds[0]);

		ds[0] = [ size ];
	}

	if (req.params.op == "clear") {
		ds[0] = ds[1];
		ds[1] = ds[2];
		ds[2] = ds[3];
		ds[3] = [];
	}

	if (req.params.op == "r-down") {
		var temp = ds[0];
		ds[0] = ds[1];
		ds[1] = ds[2];
		ds[2] = ds[3];
		ds[3] = temp;
	}

	if (req.params.op == "x-y") {
		var temp = ds[1];
		ds[1] = ds[0];
		ds[0] = temp;
	}

	loadRegisters();
	var theData = JSON.stringify(registers);
	res.render('display', { data : theData });
});

app.use(express.static('public'));

var port = Number(process.env.PORT || 8080);
app.listen(port);

console.log('starting server...');

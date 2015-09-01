var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var calculator = require('./calculator');
var busboy = require('connect-busboy'); //middleware for form/file upload

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

app.get('/underscore-calculator/upload-file', function(req, res) {
	res.render('upload-file');
});

app.get('/underscore-calculator/:func/:op', function(req, res) {
	var theData = JSON.stringify(calculator.evaluate(req.params.func, req.params.op,req.query.input));
	res.render('display', { data : theData });
});

app.use(express.static('public'));

//
// file upload route
//
app.use(busboy());
app.route('/underscore-calculator/upload')
    .post(function (req, res, next) {

        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);
        });
    });

//
// listener
//
var port = Number(process.env.PORT || 8080);
app.listen(port);

console.log('starting server...');

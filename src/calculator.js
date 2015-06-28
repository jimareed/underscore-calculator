var _ = require("underscore");
var store = require('./store');

var ds = [];
var registers = [];
var response = [];
var recording = { "on":false, "steps":[]};

ds[0] = [];
ds[1] = [];
ds[2] = [];
ds[3] = [];

var calculator = {  "row":1 , 
                    "column":1 ,
                    "columnCount":1, 
                    "requestInProgress":false ,
                    "view":"", 
                    "getResponseCount":0,
                    "registers":registers,
                    "recording":recording,
                    "storeDatasets":[] };

function getKey(col) {
  var i = 1;
  for (var key in ds[0][0]) {
    if (i == col) {
      return key;
    }
    i += 1;
  }

  return "";  
}

function resetXRegister() {
  calculator.row = 1;
  calculator.column = 1;
  calculator.columnCount = 1;

  if (typeof ds[0][0] == "object") {
    calculator.columnCount = 0;
    for (var key in ds[0][0]) {
      calculator.columnCount += 1;
    }
  }
}

function recordSteps(step,operation,value) {

  if (step == "record") {
    calculator.recording.on = !calculator.recording.on;

    if (calculator.recording.on) {
      calculator.recording.steps = [];
    }
  }

  if (step == "play") {
    return;
  }

  if (step == "recall" && operation != "default") {
    return;
  }

  if (step == "getresponse") {
    return;
  }

  if (calculator.recording.on && step != "record") {
    calculator.recording.steps[calculator.recording.steps.length] = { "step":step,"operation":operation,"value":value};
  }
}

function playRecording(name) {
  for (var i = 0; i < calculator.recording.steps.length; i+=1) {
    evaluateFunc(calculator.recording.steps[i].step, calculator.recording.steps[i].operation, calculator.recording.steps[i].value);
  }
}

function calculateOperation(operation,value) {

    if (typeof value == 'undefined') {
      value = "";
    }

    if (value == "") {
      if (operation == "enter") {
        ds[3] = ds[2];
        ds[2] = ds[1];
        ds[1] = ds[0];
      }
    } else {
      ds[3] = ds[2];
      ds[2] = ds[1];
      ds[1] = ds[0];

      if (value.indexOf("[") == -1) {
        ds[0] = [ value ];
      } else {
        ds[0] = JSON.parse(value);
      }
      resetXRegister();
    }

    if (operation == "uniq") {
      ds[0] = _.uniq(ds[0]);
      resetXRegister();
    }

    if (operation == "add") {
      if (ds[0].length == 1 && ds[1].length == 1 && Number(ds[0][0]) != 'NaN' && Number(ds[1][0]) != 'NaN') {
        ds[0][0]= [Number(ds[1][0]) + Number(ds[0][0])];
      } else {
        ds[0]= ds[1] + ds[0];
      }
      ds[1] = ds[2];
      ds[2] = ds[3];
      ds[3] = [];      
      resetXRegister();
    }

    if (operation == "subtract") {
      if (ds[0].length == 1 && ds[1].length == 1 && Number(ds[0][0]) != 'NaN' && Number(ds[1][0]) != 'NaN') {
        ds[0][0]= [Number(ds[1][0]) - Number(ds[0][0])];
      } else {
        ds[0]= ds[1] - ds[0];
      }
      ds[1] = ds[2];
      ds[2] = ds[3];
      ds[3] = [];      
      resetXRegister();
    }

    if (operation == "multipy") {
      if (ds[0].length == 1 && ds[1].length == 1 && Number(ds[0][0]) != 'NaN' && Number(ds[1][0]) != 'NaN') {
        ds[0][0]= [Number(ds[1][0]) * Number(ds[0][0])];
      } else {
        ds[0]= ds[1] * ds[0];
      }
      ds[1] = ds[2];
      ds[2] = ds[3];
      ds[3] = [];      
      resetXRegister();
    }

    if (operation == "divide") {
      if (ds[0].length == 1 && ds[1].length == 1 && Number(ds[0][0]) != 'NaN' && Number(ds[1][0]) != 'NaN') {
        ds[0][0]= [Number(ds[1][0]) / Number(ds[0][0])];
      } else {
        ds[0]= ds[1] / ds[0];
      }
      ds[1] = ds[2];
      ds[2] = ds[3];
      ds[3] = [];      
      resetXRegister();
    }

    if (operation == "pluck") {
      if (typeof ds[0][0] == "object") {
        ds[0] = _.pluck(ds[0], getKey(calculator.column));
        resetXRegister();
      }
    }

    if (operation == "filter") {
      if (typeof ds[0][0] == "object") {
        var key = getKey(calculator.column);
        var keyValue = ds[0][calculator.row-1][key];
        var where = {};
        where[key] = keyValue;
        ds[0] = _.where(ds[0], where);
        resetXRegister();
      }
    }

    if (operation == "sort") {
      if (typeof ds[0][0] == "object") {
        ds[0] = _.sortBy(ds[0], getKey(calculator.column));
      } else {
        ds[0] = _.sortBy(ds[0]);
      }
      resetXRegister();
    }

    if (operation == "union") {
      ds[0] = _.union(ds[0],ds[1]);
      ds[1] = ds[2]
      ds[2] = ds[3];
      ds[3] = [];
      resetXRegister();
    }

    if (operation == "intersection") {
      ds[0] = _.intersection(ds[0],ds[1]);
      ds[1] = ds[2]
      ds[2] = ds[3];
      ds[3] = [];
      resetXRegister();
    }

    if (operation == "difference") {
      ds[0] = _.difference(ds[0],ds[1]);
      ds[1] = ds[2]
      ds[2] = ds[3];
      ds[3] = [];
      resetXRegister();
    }

    if (operation == "min") {
      ds[0] = [_.min(ds[0])];
      resetXRegister();
    }

    if (operation == "max") {
      ds[0] = [_.max(ds[0])];
      resetXRegister();
    }

    if (operation == "first") {
      ds[0] = [_.first(ds[0])];
      resetXRegister();
    }

    if (operation == "last") {
      ds[0] = [_.last(ds[0])];
      resetXRegister();
    }

    if (operation == "initial") {
      ds[0] = _.initial(ds[0]);
      resetXRegister();
    }

    if (operation == "rest") {
      ds[0] = _.rest(ds[0]);
      resetXRegister();
    }

    if (operation == "get-rec") {
      ds[3] = ds[2];
      ds[2] = ds[1];
      ds[1] = ds[0];
      ds[0] = calculator.recording.steps;
      resetXRegister();
    }

    if (operation == "set-rec") {
      var badFormat = false;

      if (typeof ds[0][0] != "object") {
        badFormat = true;
      }

      var i = 0;
      for (var key in ds[0][0]) {
        if (i == 0 && key != "step") {
          badFormat = true;
        } 
        if (i == 1 && key != "operation") {
          badFormat = true;
        } 
        if (i == 2 && key != "value") {
          badFormat = true;
        } 
        i += 1;
      }

      if (!badFormat) {
        calculator.recording.steps = ds[0];
      }
    }


    if (operation == "size") {
      var size =  _.size(ds[0]);

      ds[0] = [ size ];
      resetXRegister();
    }

    if (operation == "clear") {
      ds[0] = ds[1];
      ds[1] = ds[2];
      ds[2] = ds[3];
      ds[3] = [];
      resetXRegister();
    }

    if (operation == "r-down") {
      var temp = ds[0];
      ds[0] = ds[1];
      ds[1] = ds[2];
      ds[2] = ds[3];
      ds[3] = temp;
      resetXRegister();
    }

    if (operation == "down") {
      if (calculator.row < ds[0].length) {
        calculator.row += 1;
      }
    }

    if (operation == "up") {
      if (calculator.row > 1) {
        calculator.row -= 1;
      }
    }

    if (operation == "right") {
      if (calculator.column < calculator.columnCount) {
        calculator.column += 1;
      }
    }

    if (operation == "left") {
      if (calculator.column > 1) {
        calculator.column -= 1;
      }
    }

    if (operation == "x-y") {
      var temp = ds[1];
      ds[1] = ds[0];
      ds[0] = temp;
      resetXRegister();
    }

    if (operation == 'noop') {

    }

    for (var i = 0; i < 4; i += 1) {
      var row = 0;
      var col = 0;

      if (i == 0) {
        row = calculator.row-1;
        col = calculator.column-1;
      }

      if (typeof ds[i][row] == "object") {
        var j = 0;
        for (var key in ds[i][row]) {
          if (j == col) {
            break;
          }
          j += 1;
        } 
        if (key != null) {
          registers[i] = ds[i][row][key];
        }
      } else {
        registers[i] = ds[i][row];
      }
    }

    calculator.requestInProgress = false;
    calculator.registers = registers;
    calculator.view = 'default';

    return calculator;
  }

function evaluateFunc(func, name, value) {

  if (func == 'calculate') {
      calculateOperation(name,value);
  }

  if (func == 'play') {
    if (!calculator.recording.on) {
      playRecording(name);
    }

    calculateOperation("","");
  }

  if (func == 'record') {
    calculateOperation("","");
  }

  if (func == 'store') {
    store.store(name,ds[0]);
    calculateOperation("","");
  }

  if (func == 'recall') {
    var input = JSON.stringify(store.recall(name, function(err,res) {
      if (err) {
        response = "recall error";
      } else {
        response = JSON.stringify(res);
      }
      calculator.requestInProgress = false;
    }));

    if (name == 'default') {
      return calculateOperation("enter",input);
    } 

    calculator.view = 'default';
    calculator.requestInProgress = true;
    calculator.getResponseCount = 0;

  }

  if (func == 'showview') {

    if (name == 'selectdataset') {
/*
      var input = JSON.stringify(store.list(function(err,res) {
        if (err) {
          calculator.storeDatasets = "select dataset error";
        } else {
          calculator.storeDatasets = JSON.stringify(res);
        }
        calculator.requestInProgress = false;
      }));

      calculator.requestInProgress = true;
      calculator.view = 'selectdataset';
      calculator.getResponseCount = 0;
      */

      calculateOperation("noop", "");
      calculator.view = 'selectdataset';      


    } else {
      calculator.view = 'default';      
      calculateOperation("noop", "");
    }
  }

  if (func == 'getresponse') {
    if (calculator.requestInProgress) {
      calculator.getResponseCount += 1;
    } else {
      if (calculator.view == 'selectdataset') {
        calculateOperation("noop", "");
      } else {
        calculateOperation("enter", response);
      }
    }
  }

  return calculator;

}

module.exports = {

  evaluate: function(func, name, value) {

    recordSteps(func, name, value);

    return evaluateFunc(func, name, value);
  }

};

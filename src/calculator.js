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
                    "getResponseCount":0,
                    "registers":registers,
                    "recording":recording };

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

  if (calculator.recording.on && step != "record") {
    calculator.recording.steps[calculator.recording.steps.length] = { "step":step,"operation":operation,"value":value};
  }
}

function playRecording(name) {
  for (var i = 0; i < calculator.recording.steps.length; i+=1) {
    console.log("playback:" + calculator.recording.steps[i].step + "," + calculator.recording.steps[i].operation + "," + calculator.recording.steps[i].value);
  }
}

function evaluateOperation(operation,value) {

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

    return calculator;
  }

module.exports = {

  getresponse: function(name) {
    if (calculator.requestInProgress) {
      calculator.getResponseCount += 1;
    } else {
      evaluateOperation("enter", response);
    }

    return calculator;
  },

  recall: function(name) {

    recordSteps("recall", name, "");
    
    var input = JSON.stringify(store.recall(name, function(err,res) {
      if (err) {
        response = "recall error";
      } else {
        response = JSON.stringify(res);
      }
      calculator.requestInProgress = false;
    }));

    if (name == 'default') {
      return evaluateOperation("enter",input);
    } 

    calculator.requestInProgress = true;
    calculator.getResponseCount = 0;

    return calculator;
  },

  store: function(name) {

    recordSteps("store", name, "");

    store.store(name,ds[0]);

    return evaluateOperation("","");
  },

  record: function(name) {
    recordSteps("record", name, "");

    return evaluateOperation("","");
  },

  play: function(name) {
    if (!calculator.recording.on) {
      playRecording(name);
    }

    return evaluateOperation("","");
  },

  evaluate: function(operation,value) {
    recordSteps("evaluate", operation, value);

    return evaluateOperation(operation,value);
  }

};

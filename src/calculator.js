var _ = require("underscore");
var store = require('./store');

var ds = [];
var registers = [];
var response = [];

ds[0] = [];
ds[1] = [];
ds[2] = [];
ds[3] = [];

var calculator = {  "row":1 , 
                    "column":1 ,
                    "columnCount":1, 
                    "requestInProgress":false , 
                    "getResponseCount":0,
                    "registers":registers };

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
      if (typeof ds[i][0] == "object") {
        for (var key in ds[i]) break;
        if (key != null) {
          registers[i] = ds[i][key];
        }
      } else {
        registers[i] = [ds[i][0]];
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
    store.store(name,ds[0]);

    return evaluateOperation("","");
  },

  record: function(name) {
    console.log("record " + name);

    return evaluateOperation("","");
  },

  play: function(name) {
    console.log("play " + name);

    return evaluateOperation("","");
  },

  evaluate: function(operation,value) {

    return evaluateOperation(operation,value);
  }

};

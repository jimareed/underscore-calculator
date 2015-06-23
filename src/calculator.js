var _ = require("underscore");
var store = require('./store');

var ds = [];
var registers = [];

ds[0] = [];
ds[1] = [];
ds[2] = [];
ds[3] = [];

var response = [{ country:"China-t" , population:1343 } ,
              { country:"India" , population:1205 } ,
              { country:"United States" , population:314 } ,
              { country:"Brazil" , population:194 }];


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
    }

    if (operation == "uniq") {
      ds[0] = _.uniq(ds[0]);
    }

    if (operation == "size") {
      var size =  _.size(ds[0]);

      ds[0] = [ size ];
    }

    if (operation == "clear") {
      ds[0] = ds[1];
      ds[1] = ds[2];
      ds[2] = ds[3];
      ds[3] = [];
    }

    if (operation == "r-down") {
      var temp = ds[0];
      ds[0] = ds[1];
      ds[1] = ds[2];
      ds[2] = ds[3];
      ds[3] = temp;
    }

    if (operation == "x-y") {
      var temp = ds[1];
      ds[1] = ds[0];
      ds[0] = temp;
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

    var calculator = { "row":1 , "column":1 , "registers":registers };

    return calculator;
  }

module.exports = {

  recall: function(name) {
    var input = JSON.stringify(store.recall(name));

    return evaluateOperation("enter",input);
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

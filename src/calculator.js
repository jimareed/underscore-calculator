var _ = require("underscore");

var ds = [];
var registers = [];

ds[0] = [];
ds[1] = [];
ds[2] = [];
ds[3] = [];

module.exports = {
  evaluate: function(operation,value) {

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

    registers[4] = [1,1,1,1];
    registers[5] = [1,1,1,1];

    for (var i = 0; i < 4; i += 1) {
      registers[5][i] = ds[i].length;
    }

    return registers;
  }

};

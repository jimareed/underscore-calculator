var request = require('supertest')('http://jimareed.com');

var data = [];

var defaultData = [{ country:"China-t" , population:1343 } ,
              { country:"India" , population:1205 } ,
              { country:"United States" , population:314 } ,
              { country:"Brazil" , population:194 }];

module.exports = {

  recall: function(name,callback) {
    console.log("recall " + name);

    if (name == 'default') {
       return data;
    } else {
      var result = request
                      .get('/simple-csv-store/data/' + name)
                      .end(function(err, res) {
                        if (err) {
                          callback(true, []);
                        } else {
                          callback(false, res.body);
                        }
                      });
    }

    return defaultData;
  },

  list: function(callback) {
    console.log("list ");

    var result = request
                    .get('/simple-csv-store/list')
                    .end(function(err, res) {
                      if (err) {
                        callback(true, []);
                      } else {
                        callback(false, res.body);
                      }
                    });

    return result;
  },

  store: function(name, value) {
    console.log("store " + name);

    if (name = 'default') {
      data = value;
    }
  }

};

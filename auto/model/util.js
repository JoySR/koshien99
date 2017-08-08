var fs = require('fs');

function Util() {
}

module.exports = Util;

Util.prototype.saveToFile = function(file, data) {
  console.log("writing to " + file);
  fs.writeFile(file, JSON.stringify(data), 'utf8', function(err) {
    if (err) {
      console.log(err); //TODO
    } else {
      console.log("writing to" + file + " done");
    }
  });
};

Util.prototype.readFromFile = function(file, callback) {
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
      console.log(err); //TODO
    } else {
      callback(JSON.parse(data));
    }
  });
};
var express = require('express');
var router = express.Router();
var Util = require('../model/util');
var Asahi = require('../model/asahi');

/* GET home page. */
router.get('/', function(req, res, next) {
  var util = new Util();
  util.readFromFile("./data/games.txt", function(data) {
    // TODO: 98 选手权 都设置成变量
    res.render('index', data);
    //res.send(data);
  });
});

router.get('/game', function(req, res, next) {
  var gameId = req.query.gameId;
  // var asahi = new Asahi();
  // asahi.getSingleGame(gameId, function(data){
  //   res.send(data);
  // });
  var util = new Util();
  util.readFromFile("./data/game/" + gameId + ".txt", function(data) {
    res.send(data);
  });
});

router.get('/date', function(req, res, next) {
  res.send({ date: req.query.dateId });
});

router.get('/school', function(req, res, next) {
  res.send({ school: req.query.schoolId });
});

module.exports = router;
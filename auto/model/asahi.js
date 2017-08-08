var superagent = require('superagent');
var cheerio = require('cheerio');
var Util = require('./util');

function Asahi() {
}

module.exports = Asahi;

Asahi.prototype.getSingleGame = function(gameId, callback) {
  superagent.get('http://www.asahi.com/koshien/text_sokuhou/' + gameId + '.html').end(function(err, sres) {
    if (err) {
      return; //TODO
    }
    organizeSingleGameData(sres.text, callback);
  })
};

Asahi.prototype.getOverview = function(callback) {
  superagent.get('http://www.asahi.com/koshien/schedule/')
    .end(function (err, sres) {
      if (err) {
        return next(err); //TODO
      }
      organizeOverviewData(sres.text, callback);
    });
};

function getThisYear() {
  var date = new Date();
  return date.getFullYear();
}

function convertToDoubleNumberFormedString(number) {
  if (parseInt(number) < 10) {
    number = "0" + number;
  }
  return number;
}

function getDateRelated(data) {
  //data: 8/7（日）-第1日- , 8/21（日）-第14日-

  var month = convertToDoubleNumberFormedString(data.split("/")[0]);
  var day =  convertToDoubleNumberFormedString(data.split("/")[1].split("（")[0]);
  var weekday = data.split("（")[1].split("）")[0];
  var nthDay = data.split("（")[1].split("）")[1].split("-")[1];

  return {
    month: month,
    day: day,
    weekday: weekday,
    nthDay: nthDay
  }
}

function getGameId (date, index) {
  var month = date.month;
  var day = date.day;
  return getThisYear() + month + day + "6" + index;
};

function organizeOverviewData(data, callback) {
  var $ = cheerio.load(data);

  var dateInfoArray = [];
  var timeArray = [];
  var roundArray = [];

  var $tr = $(".main-sec table tbody tr");

  $tr.each(function() {
    debugger;
    // 日期,曜日,大赛第几日
    var dateInfo = $(this).find("th").text();

    if(dateInfo) {
      dateInfoArray.push(getDateRelated(dateInfo));
    }

    // 时间
    var $time = $(this).find("td.time");
    $time.each(function() {
      timeArray.push($(this).text());
    });

    // 回合
    var $stage = $(this).find(".stage").text();
    if($stage.indexOf("[") !== -1) {
      roundArray.push($stage.slice($stage.indexOf("[") + 1, $stage.indexOf("]")));
    }
  });

  // 去掉開会式和閉会式
  timeArray = timeArray.slice(1, timeArray.length-1);

  var timeSortedArray = [];

  for (var i = 0; i < timeArray.length; i++) {
    if(parseInt(timeArray[i]) > parseInt(timeArray[i + 1])) {
      timeSortedArray.push(timeArray.splice(0, i + 1));
      i = 0;
    }
  }

  // 半决赛
  timeSortedArray.push(timeArray.splice(0, 2));
  // 决赛
  timeSortedArray.push(timeArray);

  var gameArray = [];
  $(".team-block").each(function () {
    var firstRaw = $(this).find(".team1");
    var thirdRaw = $(this).find(".team2");

    var firstNamePre = firstRaw.text();
    var thirdNamePre = thirdRaw.text();

    if (firstNamePre.indexOf("）") !== -1) {
      var firstName = firstNamePre.split("（")[0];
      var firstPrefecture = firstNamePre.split("（")[1].split("）")[0];
    }

    if (thirdNamePre.indexOf("）") !== -1) {
      var thirdName = thirdNamePre.split("（")[0];
      var thirdPrefecture = thirdNamePre.split("（")[1].split("）")[0];
    }

    var firstURL = firstRaw.find("a").attr("href");
    var thirdURL = thirdRaw.find("a").attr("href");

    if (firstURL) {
      var firstId = firstURL.substring(0,firstURL.length - 1).split("/").pop();
    }
    if (thirdURL) {
      var thirdId = thirdURL.substring(0, thirdURL.length - 1).split("/").pop();
    }

    var firstScore = $(this).find(".score").text().split(" - ")[0];
    var thirdScore = $(this).find(".score").text().split(" - ")[1];

    if (firstScore === '―') {
      firstScore = undefined;
    }

    gameArray.push({
      first: {
        id: firstId,
        name: firstName,
        prefecture: firstPrefecture,
        url: firstURL
      },
      third: {
        id: thirdId,
        name: thirdName,
        prefecture: thirdPrefecture,
        url: thirdURL
      },
      firstScore: firstScore,
      thirdScore: thirdScore
    });
  });

  gameArray.shift(); //抛去開会式
  gameArray.pop(); //抛去閉会式

  var overviewArray = [];

  // 单独保存 gameId 到文件,以便遍历获取比赛详情。
  var gameIdArray = [];

  for (var x = 0; x < dateInfoArray.length; x++) {
    var month = dateInfoArray[x].month;
    var day = dateInfoArray[x].day;
    var weekday = dateInfoArray[x].weekday;
    var nthDay = dateInfoArray[x].nthDay;

    var games = [];

    for (var y = 0; y < timeSortedArray[x].length; y++) {
      var gameId = getGameId({month: month, day: day}, y + 1);

      gameIdArray.push(gameId);

      var newsURL = "http://www.asahi.com/koshien/text_sokuhou/" + gameId + ".html";
      var videoURL = "http://www.asahi.com/koshien/digest/" + getThisYear() + month + day + "_" + (y + 1) + "d.html";
      games.push({
        gameId: gameId,
        time: timeSortedArray[x][y],
        round: roundArray.shift(),
        game: gameArray.shift(),
        news: newsURL,
        video: videoURL
      });
    }

    overviewArray.push({
      date: getThisYear() + month + day,
      weekday: weekday,
      nthDay: nthDay,
      games: games
    });
  }

  //处理因为延后一天开赛造成的数据改动

  dateInfoArray.shift();

  overviewArray.shift();
  var tArr = overviewArray[0].games;

  tArr[3].gameId = tArr[2].gameId;
  tArr[3].news = tArr[2].news;
  tArr[3].video = tArr[2].video;

  tArr[2].gameId = tArr[1].gameId;
  tArr[2].news = tArr[1].news;
  tArr[2].video = tArr[1].video;

  tArr[1].gameId = tArr[0].gameId;
  tArr[1].news = tArr[0].news;
  tArr[1].video = tArr[0].video;

  tArr.shift();

  //处理因为延后一天开赛造成的数据改动 - 结束

  var util = new Util();
  util.saveToFile("./data/gameId.txt", {gameId: gameIdArray});

  callback({
    overview: overviewArray,
    dateArray: dateInfoArray
  });
}

function getFirstThird(data) {
  var firstRaw = data.split(" - ")[0];
  var thirdRaw = data.split(" - ")[1];
  var firstStartIndex = firstRaw.indexOf("】");
  var firstEndIndex = firstRaw.indexOf("(");
  var first = firstRaw.substring(firstStartIndex + 1, firstEndIndex);
  var thirdEndIndex = thirdRaw.indexOf("(");
  var third = thirdRaw.substring(0, thirdEndIndex);
  return {first: first, third: third};
}

function organizeSingleGameData(data, callback) {
  var $ = cheerio.load(data);
  var firstThirdRawData = $("h1").text();
  var first =  getFirstThird(firstThirdRawData).first;
  var third =  getFirstThird(firstThirdRawData).third;

  var homeRow = $(".cmn-scoreboard tbody tr").eq(1);
  var visitRow = $(".cmn-scoreboard tbody tr").eq(2);

  var homeName = homeRow.find("th").text();
  var visitName = visitRow.find("th").text();

  var firstIsHome = false;
  if (first === homeName) {
    firstIsHome = true;
  }

  var homeScore = homeRow.find("td").last().text();
  var visitScore = visitRow.find("td").last().text();

  var inningLength = homeRow.find("td").length - 1;

  var homeScoreList = homeRow.find("td").text().substring(0, inningLength).split("");
  var visitScoreList = visitRow.find("td").text().substring(0, inningLength).split("");

  callback ({
    first: first,
    third: third,
    firstIsHome: firstIsHome,
    home: {
      name: homeName,
      score: homeScore,
      scoreList: homeScoreList
    },
    visit: {
      name: visitName,
      score: visitScore,
      scoreList: visitScoreList
    }
  });
}

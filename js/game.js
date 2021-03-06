/**
 * Created by sun on 16/3/16.
 * TODO:是否必要用try,catch,return false等
 * TODO: 比较singleCard中的双方比分,赢得比赛的队伍改变背景色或文字颜色
 */

//预定义日期数组,如果因天气等原因而延期,可在此处修改调整后的日期
var dateArr = [
	"2017年08月08日",
	"2017年08月09日",
	"2017年08月10日",
	"2017年08月11日",
	"2017年08月12日",
	"2017年08月13日",
	"2017年08月14日",
	"2017年08月15日",
	"2017年08月16日",
	"2017年08月17日",
	"2017年08月18日",
	"2017年08月19日",
	"2017年08月20日",
	"2017年08月21日",
	"2017年08月22日",
	"2017年08月23日"
];

var startDate = [2017, 7, 8];

var restDay = dateArr[13];
var cancelDay = [dateArr[7]];

/* 获取数据 */

var $schools;
var $schedule;

$.getJSON("./data/game.json", function(data) {
	$schedule = data["schedule"];
	$schools = data["schools"];
	onloadShow();
});

/* 简单函数 */

function getPrefecture(name) {
  var school = $schools.filter(function(school) {
    return school.name === name;
  });
  if (school[0]) {
  	return school[0].prefecture;
  } else {
    return '';
  }
}

function getScoreList(scoreArr) {
	var str = "";
	for (var $i = 0; $i < scoreArr.length; $i++) {
		str += "<td>"+scoreArr[$i]+"</td>";
	}
	var result;
	result = '<td class="name"></td>'
		+ str
		+ '<td class="final"></td>';
	return result;
}

function getDateToday() {
	var $now = new Date();
	var $year = $now.getFullYear();
	var $month = $now.getMonth() + 1;
	if ($month < 10) { $month = "0" + $month; }
	var $date = $now.getDate();
	if ($date < 10) { $date = "0" + $date; }
	return $year + "年" + $month + "月" + $date + "日";
}

function isBeforeStartDate(startDate) {
  var now = new Date();
  var start = new Date(startDate[0], startDate[1], startDate[2]);
  return now < start;
}

function getTimeNow() {
	var $now = new Date();
	var $hour = $now.getUTCHours();
	//获取北京时间
	var $gameHour = $hour + 9;
	if ($gameHour < 10) { $gameHour = "0" + $gameHour; }
	var $minute = $now.getMinutes();
	if ($minute < 10) { $minute = "0" + $minute; }
	return $gameHour + ":" + $minute;
}

function getGameId(id) {
	return id.substr(1, id.length-1);
}

function closeCard() {
	$("#card-bg").addClass("hide");
}

function getGameInfoOrDate(id, type) {
	var i = id.split("-")[0] - 1;
	var j = id.split("-")[1] - 1;
	if (type === "info") {
		return $schedule[i]["games"][j];
	} else if (type === "date") {
		return $schedule[i]["date"];
	}
}

function emptyList() {
	$("#game-list").empty();
}

//检查当前时间,跳转到当前正在(或即将)进行的比赛并高亮当前的比赛时间
//TODO: 优化
function highlightCurrentGame(){
	//休养日无高亮
	if (getDateToday() === restDay || isBeforeStartDate(startDate)) return;

	var $timeNow = getTimeNow();
	var $time = $(".info .time");
	var $videoURL = $(".after-game .video");

	//决赛日
	if ($time.length === 1 && ($videoURL.eq(0).attr("href") === "")) {
		highlight(0)
	}
	//半决赛日
	if ($time.length === 2) {
		if ($timeNow < $time.eq(1).text()){
			highlight(0);
		} else if ($timeNow < "17:00" && ($videoURL.eq(1).attr("href") === "")) {
			highlight(1);
		}
	}
	//一天4场
	if ($time.length === 4) {
		if ($timeNow < $time.eq(1).text()){
			highlight(0);
		} else if ($timeNow < $time.eq(2).text()) {
			highlight(1);
		} else if ($timeNow < $time.eq(3).text()) {
			highlight(2);
		} else if ($timeNow < "20:00" && ($videoURL.eq(3).attr("href") === "")) {
			highlight(3);
		}
	}
	//其他日期
	if ($timeNow < $time.eq(1).text()){
		highlight(0);
	} else if ($timeNow < $time.eq(2).text()) {
		highlight(1);
	} else if ($timeNow < "19:00" && ($videoURL.eq(2).attr("href") === "")) {
		highlight(2);
	}
}

function highlight(index) {
	var id = getGameId($(".single-game").eq(index).attr("id"));
	jumpToDetail(id);
	$(".info .time").eq(index).css("color", "#fd6a06");
}

function highlightDate(index) {
	var $theDay;
	//空出休养日
	if (index < 12) {
		$theDay = $("#time-table .date").eq(index).parent();
	} else {
		$theDay = $("#time-table .date").eq(index+1).parent();
	}
	$theDay.siblings().removeClass("today");
	$theDay.addClass("today");
}

/* 大型函数?= = */

function showTodaysGame(data) {
	var $date = data["date"];
	var $gameList = $("#game-list");

	var singleGame = $('' +
		'<div class="single-game">' +
		'<div class="school-school">' +
		'<div class="info clearfix">' +
		'<div class="round-wrap">' +
		'<i class="fa fa-bullhorn"></i>' +
		'<span class="round"></span>' +
		'</div>' +
		'<div class="time-wrap">' +
		'<i class="fa fa-clock-o"></i>' +
		'<span class="time"></span>' +
		'</div>' +
		'</div>' +
		'<p class="first">' +
		'<span class="prefecture"></span>' +
		'<span class="name"></span>' +
		'<span class="final-score"></span>' +
		'</p>' +
		'<span class="vs">-</span>' +
		'<p class="third">' +
		'<span class="final-score"></span>' +
		'<span class="name"></span>' +
		'<span class="prefecture"></span>' +
		'</p>' +
		'</div>' +
		'<table class="scoreboard hide">' +
		'<tr class="home">' +
		'</tr>' +
		'<tr class="visit">' +
		'</tr>' +
		'</table>' +
		'<div class="after-game hide">' +
		'<a class="news"><i class="fa fa-link"></i>速報</a>' +
		'<a class="video"><i class="fa fa-video-camera"></i>ビデオ</a>' +
		'</div>' +
		'<div class="show-more">詳細<span class="triangle-to-bottom"></span></div>' +
		'</div><!-- .single-game -->');

	function appendSingleGame(n) {
		emptyList();
		for (var i = 0; i < n; i++) {
			singleGame.clone().appendTo($gameList);
		}
	}

	if($date === dateArr[0] || $date === dateArr[4] || $date === dateArr[9]) {
		appendSingleGame(3);
	} else if ($date === dateArr[14]) {
		appendSingleGame(2);
	} else if ($date === dateArr[15]) {
		appendSingleGame(1);
	} else {
		appendSingleGame(4);
	}

	var $games = data["games"];

	//获取当天的每场比赛数据
	for (var $index = 0; $index < $games.length; $index++) {
		var $elem = $games[$index];

		var $gameId = $elem["id"];
		var $gameRound = $elem["round"];
		var $gameTime = $elem["time"];
		var $first = $elem["first"]; //一垒侧
		var $firstPrefecture = getPrefecture($elem["first"]);
		var $third = $elem["third"]; //三垒侧
		var $thirdPrefecture = getPrefecture($elem["third"]);
		var $score = $elem["score"]; //最终比分: X-X
		var $finalScore = $score.split("-");
		var $fScore = $elem["fScore"]; //数组.一垒侧学校每局分数
		var $tScore = $elem["tScore"]; //数组.三垒侧学校每局分数
		var $gameNews = $elem["news"];
		var $gameVideo = $elem["video"];

		var $fScoreList = $(getScoreList($fScore)); //将每局分数封装进HTML
		var $tScoreList = $(getScoreList($tScore));

		//定位DOM元素
		var $singleGame = $(".single-game");

		var $round = $(".info .round");
		var $time = $(".info .time");

		var $fName = $(".first .name");
		var $fPrefecture = $(".first .prefecture");
		var $fFinalScore = $(".first .final-score");
		var $tPrefecture = $(".third .prefecture");
		var $tName = $(".third .name");
		var $tFinalScore = $(".third .final-score");
		//var $scoreboard = $(".scoreboard");

		//赛前决定两队先攻后攻,先攻为home,后攻为visitor
		var $scoreHome = $(".scoreboard .home");
		var $scoreVisit = $(".scoreboard .visit");

		var $video = $(".after-game .video");
		var $news = $(".after-game .news");

		var $showMore = $(".show-more");

		//填入数据
		$round.eq($index).text($gameRound);
		$time.eq($index).text($gameTime);
		$singleGame.eq($index).attr("id", ("g" + $gameId));

		if ($first === "") { //未安排比赛时
			$(".vs").eq($index).text("対戦カード未定");
			$showMore.eq($index).addClass("hide");
		} else {
			$fName.eq($index).text($first);
			$fPrefecture.eq($index).text("("+$firstPrefecture+")");
			$fFinalScore.eq($index).text($finalScore[0]);
			$tName.eq($index).text($third);
			if ($third !== "") {
				$tPrefecture.eq($index).text("(" + $thirdPrefecture + ")");
				$tFinalScore.eq($index).text($finalScore[1]);
			}

			$video.eq($index).attr("href", $gameVideo);
			$news.eq($index).attr("href", $gameNews);

			if ($gameVideo === "") {
				$video.eq($index).addClass("disabled");
			}
			if ($gameNews === "") {
				$news.eq($index).addClass("disabled");
			}

			$scoreHome.eq($index).empty();
			$scoreVisit.eq($index).empty();

			var $isHome = $elem["firstIsHome"];

			//判断一垒侧是否先攻,先攻者在记分板上侧
			if ($isHome) {
				$scoreHome.eq($index).append($fScoreList);
				$scoreVisit.eq($index).append($tScoreList);

				$(".scoreboard .home .name").eq($index).text($first);
				$(".scoreboard .visit .name").eq($index).text($third);

				$(".scoreboard .home .final").eq($index).text($finalScore[0]);
				$(".scoreboard .visit .final").eq($index).text($finalScore[1]);
			} else {
				$scoreHome.eq($index).append($tScoreList);
				$scoreVisit.eq($index).append($fScoreList);

				$(".scoreboard .home .name").eq($index).text($third);
				$(".scoreboard .visit .name").eq($index).text($first);

				$(".scoreboard .home .final").eq($index).text($finalScore[1]);
				$(".scoreboard .visit .final").eq($index).text($finalScore[0]);
			}
		}
	}

	$showMore.on("click", function() {
		$(this).prev().toggleClass("hide");
		$(this).prev().prev().toggleClass("hide");
		$(this).find("span").toggleClass("triangle-to-top");
		$(this).find("span").toggleClass("triangle-to-bottom");
	});
}

function onloadShow() {
	var $today = getDateToday();
  console.log($today, 'today');
	emptyList();
	if ($today < dateArr[0]) { //大会开赛前
		$("#message").append('<h3 style="color: orange; margin: 20px auto;">大会前（今日は' + getDateToday() + '），抽選会は8月4日に行います。</h3><h3 style="margin: 20px auto;">第一日の試合</h3>');
		showTodaysGame($schedule[0]);
	} else if ($today === dateArr[13]) { //休养日
    console.log('===');
    $('#message').empty().append('<h3 style="color: orange; margin: 20px auto;">今日は休養日</h3><h3 style="margin: 20px auto;">明日の試合</h3>');
		showTodaysGame($schedule[12]);
	} else if ($today > dateArr[15]) { //大会结束后
		//TODO: 冠军介绍
		showTodaysGame($schedule[14]);
	}

	//大会进行时
	for (var $i = 0; $i < $schedule.length; $i++) {
		if ($today === $schedule[$i]["date"]) {
			highlightDate($i);
			showTodaysGame($schedule[$i]);
		}
	}

	highlightCurrentGame();
	checkWidth();
}

function showSingleCard(school) {
	//定位DOM元素
	var $schoolName = $("#school-name");
	var $schoolPrefecture = $("#school-prefecture");
	var $schoolCount = $("#school-count");

	var $cardContent = $("#card-content");
	$cardContent.empty();

	for (var $i = 0; $i < $schools.length; $i++) {
		if ($schools[$i]["name"] === school) {
			var $s = $schools[$i];
			//var $sArea = $s["area"];
			var $sCount = $s["count"];
			var $sPrefecture = $s["prefecture"];
			//var $sId = $s["id"];
			//var $sResult = $s["result"];

			//填充基础数据
			$schoolName.text(school);
			$schoolPrefecture.text("(" + $sPrefecture + ")");
			$schoolCount.text($sCount);

			var $sGames = $s["games"]; //数组

			for (var $j = 0; $j < $sGames.length; $j++) {
				var $sGameId = $sGames[$j];
				var $gameInfo = getGameInfoOrDate($sGameId, "info");

				var $sRound = $gameInfo["round"];
				var $sFirst = $gameInfo["first"];
				var $sThird = $gameInfo["third"];
				var $sScore = $gameInfo["score"];
				var $sRawDate = getGameInfoOrDate($sGameId, "date");
				var $sDate = "(" + $sRawDate[5] + $sRawDate[6] + "/" + $sRawDate[8] + $sRawDate[9] + ")";

				var cardGame = $('<tr>' +
					'<td>' +
					'<span class="round">' + $sRound + '</span>' +
					'<span class="date">' + $sDate + '</span></td>' +
					'<td>' +
					'<span class="first-name">' + $sFirst + '</span></td>' +
					'<td class="score">' +
					'<span class="first-score">' + $sScore.split("-")[0] + '</span>' +
					'<span class="vs">-</span>' +
					'<span class="third-score">' + ($sScore.split("-")[1] || "") + '</span>' +
					'</td>' +
					'<td>' +
					'<span class="third-name">' + $sThird + '</span>' +
					'</td>' +
					'<td class="result">' +
					'<a class="detail" id="' + ("s" + $sGameId) + '"><i class="triangle-to-right"></i>詳細</a>' +
					'</td>' +
					'</tr>');

				$cardContent.append(cardGame);
			}
		}
	}

	$(".detail").on("click", function() {
		var id = getGameId($(this).attr("id"));
		jumpToDetail(id);
	});
}

function jumpToDetail(id) {
	//通过id可以判断出是哪一天哪一场比赛,就不需要for循环遍历查找对应的日期了.
	var theDate = id.split("-")[0];
	var theSequence = id.split("-")[1];
	var gId = "#g" + id;
	$("#card-bg").addClass("hide");
	showTodaysGame($schedule[theDate-1]);

	//高亮当天日期
	highlightDate(theDate - 1);

	//来自<关于锚点跳转及jQuery下相关操作与插件>
	//-60: 让出header占据的60px,使目标内容可以完整显示而不是被header盖住
	$("html,body").animate({scrollTop: ($(gId).offset().top-60)}, 200);
	if($(".vs").eq(theSequence-1).text() === "対戦カード未定") {
		$(".after-game").addClass("hide");
	} else {
		$(gId).find(".scoreboard").removeClass("hide");
		$(gId).find(".after-game").removeClass("hide");
		$(gId).find(".show-more span").removeClass("triangle-to-bottom").addClass("triangle-to-top");
	}
}

/* 监听事件 */

$("#time-table").on("click", "li", function() {
	$("#message").text("");
	var $this = $(this);

	$this.siblings().removeClass("today");
	$this.addClass("today");

	if ($this.index() < 7) {
    showTodaysGame($schedule[$this.index()]);
	} else if ($this.index() === 7) {
    $("#message").append('<h3 style="color: orange; margin: 20px auto;">天気のため、今日は試合がありません。</h3><h3 style="margin: 20px auto;">明日の試合</h3>');
    showTodaysGame($schedule[7]);
	} else if ($this.index() > 7 && $this.index() < 13) {
    showTodaysGame($schedule[$this.index() - 1]);
	} else if ($this.index() > 13) {
    showTodaysGame($schedule[$this.index() - 2]);
	} else {
    $("#message").append('<h3 style="color: orange; margin: 20px auto;">今日は休養日</h3><h3 style="margin: 20px auto;">明日の試合</h3>');
    showTodaysGame($schedule[12]);
	}

	var $todaysDate = new Date();
	var $thisDate = $todaysDate.getDate();
	if ($thisDate == $(".today .date").text()) {
		highlightCurrentGame();
	}
});

$("#game-list").on("click", ".name", function(){
	$("#card-bg").removeClass("hide");
	showSingleCard($(this).text());
});

$("#close").on("click", closeCard);
$(".card-cover").on("click", closeCard);

$(".date-column").on("click", "li", function() {
	var id = getGameId($(this).attr("id"));
	jumpToDetail(id);
});

$(".school-column").on("click", "li", function() {
	var $name = $(this).find(".name");
	var school = $name.text();
	showSingleCard(school);
	$("#card-bg").removeClass("hide");
});

$(".toggle-nav").on("click", function() {
	$(this).prev().toggleClass("hide");
});


function checkWidth() {
	if ($(window).width() <= 640) {
		$(".toggle-nav").removeClass("hide");
		$(".nav").addClass("hide");
	} else {
		$(".nav").removeClass("hide");
		$(".toggle-nav").addClass("hide");
	}
}
$(window).resize(checkWidth);

// onloadShow();

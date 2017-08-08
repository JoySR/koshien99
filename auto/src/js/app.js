$(".show-more").on("click", function() {
  var $info = $(this).prev();
  var $scoreboard = $info.prev();

  $info.toggleClass("hide");
  $(this).find("span").toggleClass("triangle-to-top");
  $(this).find("span").toggleClass("triangle-to-bottom");

  var $game = $(this).parent();
  if ($game.find(".third .final-score").text() === "") {
    $("<p style='margin: 20px 0;'>尚无比赛详情</p>").insertBefore($info);
  } else {
    if ($scoreboard.hasClass("hide")) {
      if (!$scoreboard.hasClass("fetched")) {
        var gameId = $game.attr("id");

        $.ajax({
          url: '/game',
          data: {
            gameId: gameId
          },
          success: function(res) {
            showSingleGame($game, res);
            $scoreboard.addClass("fetched").removeClass("hide");
          }
        });
      } else {
        $scoreboard.removeClass("hide");
      }

    } else {
      $scoreboard.addClass("hide");
    }
  }
});

function showSingleGame($game, data) {
  var home = $game.find("tr.home");
  var visit = $game.find("tr.visit");

  home.append('<td class="name">' + data.home.name + '</td>');
  visit.append('<td class="name">' + data.visit.name + '</td>');

  var homeScoreList = data.home.scoreList;
  var visitScoreList = data.visit.scoreList;

  while (homeScoreList.length){
    home.append('<td>' + homeScoreList.shift() + '</td>');
    visit.append('<td>' + visitScoreList.shift() + '</td>');
  }

  home.append('<td class="final">' + data.home.score + '</td>');
  visit.append('<td class="final">' + data.visit.score + '</td>');
}

$("#time-table").on("click", "li", function() {
  var $this = $(this);

  $this.siblings().removeClass("today");
  $this.addClass("today");

  $("#restDayMessage").remove();

  if($this.index() > 12) {
    showTodaysGame($this.index()-1);
  } else if($this.index() < 12) {
    showTodaysGame($this.index());
  } else {
    $("#game-list").prepend('<div id="restDayMessage"><h3 style="color: orange; margin: 20px auto;">今日は休養日</h3><h3 style="margin: 20px auto;">明日の試合</h3></div>');
    showTodaysGame(12);
  }
});

var $dateArray = $(".singleDate");
$dateArray.each(function() {
  $(this).hide();
});

function showTodaysGame(index) {
  $dateArray.eq(index).siblings().hide();
  $dateArray.eq(index).show();
}

var dateToday = new Date();
var date = dateToday.getDate();
if (date < 10) { date = '0' + date;}

var dateList = $("#time-table li");

dateList.each(function(index) {
  if ($(this).find('.date').text() === date) {
    showTodaysGame(index);
    $(this).addClass('today');
  }
});

// console.log($("#time-table li .date").text(), 'date');

// // TODO: now only shows the final day.
// $("#time-table li").last().addClass("today");
// $dateArray.last().show();

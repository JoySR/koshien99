var title = new Vue({
  el: '#site-title',
  data: {
    title: '第99回全国高等学校野球選手権大会'
  }
});

var timeTable = new Vue({
  el: '#time-table',
  data: {
    isRestDay: function(day) {
      if (day.rest) {
        return 'rest';
      } else {
        return '';
      }
    },
    days: [
      {
        date: '07',
        weekday: '日'
      },
      {
        date: '08',
        weekday: '月'
      },
      {
        date: '09',
        weekday: '火'
      },
      {
        date: '10',
        weekday: '水'
      },
      {
        date: '11',
        weekday: '木'
      },
      {
        date: '12',
        weekday: '金'
      },
      {
        date: '13',
        weekday: '土'
      },
      {
        date: '14',
        weekday: '日'
      },
      {
        date: '15',
        weekday: '月'
      },
      {
        date: '16',
        weekday: '火'
      },
      {
        date: '17',
        weekday: '水'
      },
      {
        date: '18',
        weekday: '木'
      },
      {
        date: '19',
        weekday: '金',
        rest: true
      },
      {
        date: '20',
        weekday: '土'
      },
      {
        date: '21',
        weekday: '日'
      }
    ]
  }
});

var reference = new Vue({
  el: '#reference',
  data: {
    links: [
      {
        content: 'NHK Online',
        url: 'http://www.nhk.or.jp/koushien',
        img: 'img/nhk_logo.png'
      },
      {
        content: 'MBS',
        url: 'http://mainichi.jp/koshien/',
        img: 'img/mbs_logo_s.png'
      },
      {
        content: '朝日新聞',
        url: 'http://www.asahi.com/koshien',
        img: 'img/asahi_logo.png'
      }
    ]
  }
});

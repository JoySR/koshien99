var timeTable = new Vue({
  // TODO: 给定第一天和当天的星期，用程序计算出整个日程表及休息日
  el: '#time-table',
  data: {
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
  },
  methods: {
    switchDate: function() {}
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

var title = new Vue({
  el: '#site-title',
  data: {
    title: '第99回全国高等学校野球選手権大会'
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

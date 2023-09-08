const axios = require('axios')
const cheerio = require('cheerio')

const arr = axios
  .get('https://www.aladin.co.kr/home/welcome.aspx')
  .then((response) => {
    const $ = cheerio.load(response.data)
    const arr = []
    const imgbox = []
    $('div.r_text div.tit').each(function () {
      arr.push($(this).text())
    })
    $(
      'div.welcome_section3 div.swiper div.swiper-wrapper div a div.cover img'
    ).each(function (i, e) {
      const imgurl = $(e).attr('src')
      if (imgurl) {
        imgbox.push(imgurl)
      }
    })
    arr.slice(0, 10).forEach((v, i) => {
      // slice를 이용해서 10개까지 보여준다.
      console.log(`책 이름: ${v}`)
      console.log(imgbox[i])
    })
    return imgbox
  })
  .catch((error) => {
    console.error('Error fetching the webpage:', error)
  })
  console.log(arr)
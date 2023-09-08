require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const request = require('request')
const axios = require('axios')
const cheerio = require('cheerio')
const path = require('path')
const app = express()
const client_id = process.env.nid
const client_secret = process.env.npw
const _path = path.join(__dirname, './dist')

app.use(logger('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static(_path))

// 파파고 번역기
app.get('/ppg/', (req, res) => {
  const txt = req.query.input
  const source = req.query.source
  const target = req.query.target

  const api_url = 'https://openapi.naver.com/v1/papago/n2mt'
  const options = {
    url: api_url,
    form: { source, target, text: txt },
    headers: {
      'X-Naver-Client-Id': client_id,
      'X-Naver-Client-Secret': client_secret
    }
  }

  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const result = JSON.parse(body)
      const translatedText = result.message.result.translatedText

      res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
      res.end(translatedText)
    } else {
      res.status(response.statusCode).end()
      console.log('error = ' + response.statusCode)
    }
  })
})

// 멜론챠트
const melon_url = 'https://www.melon.com/chart/index.htm'
const songlist = []
let year, hour
axios.get(melon_url).then((res) => {
  const $ = cheerio.load(res.data)
  year = $('.year').text()
  hour = $('.hour').text()

  $('.ellipsis.rank01').each(function () {
    const artist = $(this)
      .parent()
      .find('.ellipsis.rank02')
      .find('a')
      .first()
      .text()
      .trim()
    const title = $(this).find('a').text().trim()
    songlist.push({ title, artist })
  })
})

app.get('/mml/:slt', (req, res) => {
  const slt = req.params.slt * 1
  let list = ``
  list += `<tr style="border: 1px solid black;"><th colspan="3" style="border: 1px solid black;">기준일: ${year} / 기준시: ${hour}</th></tr>`
  list += `<tr style="border: 1px solid black;"><td style="border: 1px solid black;">순위</td><td style="border: 1px solid black;">제목</td><td style="border: 1px solid black;">아티스트</td></tr>`
  songlist.slice(0, slt).forEach((song, index) => {
    list += `<tr style="border: 1px solid black;"><td style="border: 1px solid black;">${
      index + 1
    }위</td><td style="border: 1px solid black;">${
      song.title
    }</td><td style="border: 1px solid black;">${song.artist}</td></tr>`
  })
  res.end(list)
})

app.listen(3000, () => {
  console.log('3000서버에서 서버 동작중')
})

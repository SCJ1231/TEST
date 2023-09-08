require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const _path = path.join(__dirname, "/dist");
const client_id = process.env.nid;
const client_secret = process.env.npw;
const axios = require("axios");
const cheerio = require("cheerio");

app.use("/", express.static(_path));
const request = require("request");
let key = process.env.pkey;

const url =
  "http://apis.data.go.kr/6260000/AirQualityInfoService/getAirQualityInfoClassifiedByStation?serviceKey=" +
  key +
  "&pageNo=1&numOfRows=30&resultType=json";
app.get("/Home", function (req, res) {
  request(url, (e, response, body) => {
    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
    const rst = JSON.parse(body);
    const _ = rst.getAirQualityInfoClassifiedByStation.body.items.item[3];
    res.send(
      `<script>alert("${_.site}의\n일산화탄소:${_.co}\n오존:${_.o3}\n초미세먼지:${_.pm25}\n미세먼지:${_.pm10}")</script>`
    );
  });
});

const query = "삶은 고난의 연속이다.";
app.get("/Trans", function (req, res) {
  const api_url = "https://openapi.naver.com/v1/papago/n2mt";
  const options = {
    url: api_url,
    form: { source: "ko", target: "en", text: query },
    headers: {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    },
  };
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
      //   res.end(body)
      const result = JSON.parse(body);
      res.send(result.message.result.translatedText);
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  });
});

const menu_url =
  "https://www.pusan.ac.kr/kor/CMS/MenuMgr/menuListOnBuilding.do?mCode=MN202";

app.get("/Menu", (req, res) => {
  axios.get(menu_url).then((res) => {
    let menu = [],
      day = [],
      date = [];
    let $ = cheerio.load(res.data);
    $(".menu-tit01~p").each(function (_) {
      menu.push($(this).text());
    });
    $(".day").each(function (_) {
      day.push($(this).text());
    });
    $(".date").each(function (_) {
      date.push($(this).text());
    });
    for (i in menu) {
      res.send(date[i] + "(" + day[i] + ")" + "\n" + menu[i]);
    }
  });
});

app.listen(3000, () => {
  console.log("서버시작.");
});

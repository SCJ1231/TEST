const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TELBOT_TOKEN

const bot = new TelegramBot(token, { polling: true })

bot.onText(/^사진/, (msg, match) => {
  const chatId = msg.chat.id
  const resp =
    'https://social-phinf.pstatic.net/20210307_237/16150733102294sSWV_JPEG/B110E207-BB0F-4A24-A9AC-0A80C86BB3B3.jpeg'
  bot.sendPhoto(chatId, resp)
})

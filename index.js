const TelegramApi = require("node-telegram-bot-api")
const { gameOptions, againOptions } = require("./options")

const token = '1676549406:AAEQvzPTNL5JCqlalG-O2tt2gPXRPnXUvkU'
const sticker = 'https://tlgrm.ru/_/stickers/2b7/ff8/2b7ff812-f294-4447-9145-95fd518167ca/1.webp'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Загадываю цифру от 0 до 9`)
  const randomNumber = Math.floor(Math.random() * 10)
  console.log("randomNumber", randomNumber)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, "Отгадывай", gameOptions)
}

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить инфу" },
    { command: "/game", description: "Игра" },
  ])

  bot.on('message', async (msg) => {
    const user = `${msg.from.first_name} ${msg.from.last_name}`
    const text = msg.text
    const chatId = msg.chat.id

    // Здесь мы просто перебираем список команд и делаем соответствующий аутпут
    if (text === '/start') { // Когда впервые открыл бота
      return await bot.sendMessage(chatId, `Добро пожаловать`)
    }
    if (text === '/info') {
      await bot.sendSticker(chatId, sticker)
      return await bot.sendMessage(chatId, `Тебя зовут: ${user}`)
    }
    if (text === '/game') {
      return await startGame(chatId)
    }

    // console.log("message: ", msg)
    return bot.sendMessage(chatId, 'Такой команды нет')
  })

  bot.on('callback_query', async (msg) => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if (data === '/again') {
      return await startGame(chatId)
    }

    if (Number(data) === chats[chatId]) {
      return await bot.sendMessage(chatId, `Ты угадал цифру ${chats[chatId]}`, againOptions)
    } else {
      return await bot.sendMessage(chatId, `${chats[chatId]} - неправильный ответ`, againOptions)
    }
  })
}

start()
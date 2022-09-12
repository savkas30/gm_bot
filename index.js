import TelegramApi from "node-telegram-bot-api";
import fetch from "node-fetch";
const  token = '5406290583:AAG72loLINN7q9K5DWwf56JMnFiO3_8iPUw';
const bot = new TelegramApi(token, {polling:true});


const isValidTime = () => {
    const Time = new Date();
    return (Time.getHours() === 7 && Time.getMinutes() === 30);
}
const getGM = (chatId) => {
    bot.sendMessage(chatId, "gm 🤍\n");
    getCompliment(chatId);
    getAdvice(chatId);
}
const getCompliment = (chatId) => {
    fetch('https://complimentr.com/api')
        .then(res => res.json())
        .then(json => {
            bot.sendMessage(chatId,  `${json.compliment} 💌`)
        });
}
const getAdvice = (chatId) => {
    fetch('https://api.adviceslip.com/advice')
        .then(res => res.json())
        .then(json => {
            bot.sendMessage(chatId,  `${json.slip.advice.toLowerCase()} 🎟`)
        });
}
const getStart = (chatId) => {
    bot.sendMessage(chatId, 'i`ll write u soon 📝', {
        reply_markup: {
            keyboard: [
                [
                    {text: 'Advice 🎟', callback_data: 'advice'},
                    {text: 'Compliment 💌', callback_data: 'compliment'}
                ]
            ],
            resize_keyboard : true
        }
    });

    setInterval(() => {
        if (isValidTime()) getGM(chatId)
    },1000 * 60);
}

bot.on('message' , msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    switch (text) {
        case '/start':
            getStart(chatId);
            break;
        case 'Compliment 💌':
            getCompliment(chatId);
            break;
        case 'Advice 🎟':
            getAdvice(chatId);
            break;
    }
    if (msg.from.id !== 423773370) bot.sendMessage(423773370, `[${msg.from.username}] ${msg.text}`);
    bot.deleteMessage(chatId, msg.message_id);
})

bot.on('callback_query', msg => {
    console.log(msg);
})


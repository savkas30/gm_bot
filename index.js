import TelegramApi from "node-telegram-bot-api";
import fetch from "node-fetch";
const  token = '5406290583:AAG72loLINN7q9K5DWwf56JMnFiO3_8iPUw';
const bot = new TelegramApi(token, {polling:true});


const isValidTime = () => {
    const Time = new Date();
    return (Time.getHours() === 7 && Time.getMinutes() === 0);
}
const getGM = async (chatId) => {
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
            bot.sendMessage(chatId,  `${json.slip.advice.toLowerCase().slice(0,-1)} 🎟`)
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
const getAnswer = () => {
    const x = Math.floor(Math.random() * 2);
    return x === 0 ?  'no 🙅‍️' :  'yes 🧑‍💻'
}

bot.on('message' , msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    switch (text) {
        case '/start':
            getStart(chatId);
            if (msg.from.id !== 423773370) bot.sendMessage(423773370, `--------------\n[${msg.from.username}] ${msg.text}`);
            break;
        case 'Compliment 💌':
            getCompliment(chatId);
            if (msg.from.id !== 423773370) bot.sendMessage(423773370, `--------------\n[${msg.from.username}] ${msg.text}`);
            bot.deleteMessage(chatId,msg.message_id)
            break;
        case 'Advice 🎟':
            getAdvice(chatId);
            if (msg.from.id !== 423773370) bot.sendMessage(423773370, `--------------\n[${msg.from.username}] ${msg.text}`);
            bot.deleteMessage(chatId,msg.message_id)
            break;
        default:
            if (text.slice(-1) === '?') {
                const answer = getAnswer();
                if (msg.from.id !== 423773370) bot.sendMessage(423773370, `--------------\n[${msg.from.username}] ${msg.text}\n[bot] ${answer}`);
                bot.sendMessage(chatId, answer);
            } else {
                if (msg.from.id !== 423773370) bot.sendMessage(423773370, `--------------\n[${msg.from.username}] ${msg.text}\n`)
                bot.deleteMessage(chatId, msg.message_id);
            }
    }
})



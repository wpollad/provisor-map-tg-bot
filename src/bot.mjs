import TeleBot from "telebot";
<<<<<<< HEAD

const bot = new TeleBot("TELEGRAM_BOT_TOKEN");

// On commands
bot.on(["/start", "/back"], (msg) => {
    let replyMarkup = bot.keyboard(
        [
            ["/buttons", "/inlineKeyboard"],
            ["/start", "/hide"],
        ],
        { resize: true },
    );

    return bot.sendMessage(msg.from.id, "Keyboard example.", { replyMarkup });
});

// Buttons
bot.on("/buttons", (msg) => {
    let replyMarkup = bot.keyboard(
        [
            [
                bot.button("contact", "Your contact"),
                bot.button("location", "Your location"),
            ],
            ["/back", "/hide"],
        ],
        { resize: true },
    );

    return bot.sendMessage(msg.from.id, "Button example.", { replyMarkup });
});

// Hide keyboard
bot.on("/hide", (msg) => {
    return bot.sendMessage(
        msg.from.id,
        "Hide keyboard example. Type /back to show.",
        { replyMarkup: "hide" },
    );
});

// On location on contact message
bot.on(["location", "contact"], (msg, self) => {
    return bot.sendMessage(msg.from.id, `Thank you for ${self.type}.`);
});

// Inline buttons
bot.on("/inlineKeyboard", (msg) => {
    let replyMarkup = bot.inlineKeyboard([
        [
            bot.inlineButton("callback", { callback: "this_is_data" }),
            bot.inlineButton("inline", { inline: "some query" }),
        ],
        [bot.inlineButton("url", { url: "https://telegram.org" })],
    ]);

    return bot.sendMessage(msg.from.id, "Inline keyboard example.", {
        replyMarkup,
    });
});

// Inline button callback
bot.on("callbackQuery", (msg) => {
    // User message alert
    return bot.answerCallbackQuery(
        msg.id,
        `Inline button callback: ${msg.data}`,
        true,
    );
});

// Inline query
bot.on("inlineQuery", (msg) => {
    const query = msg.query;
    const answers = bot.answerList(msg.id);

    answers.addArticle({
        id: "query",
        title: "Inline Query",
        description: `Your query: ${query}`,
        message_text: "Click!",
    });

    return bot.answerQuery(answers);
});

bot.start();

export default bot;
=======
import * as tf from "@tensorflow/tfjs-node"; // Используйте tfjs-node для сервера

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

const wordIndex = {
    coa: 1,
    sms: 2,
    sum: 3,
    fom: 4,
    gom: 5,
    jua: 6,
    mut: 7,
    frg: 8,
    pmc: 9,
    drc: 10,
    che: 11,
    lbf: 12,
    grj: 13,
    bsh: 14,
    ena: 15,
    hby: 16,
    gob: 17,
    wht: 18,
    rye: 19,
    msg: 20,
    goe: 21,
};

const uniqueLabels = [
    51, 38, 31, 23, 41, 52, 28, 100, 24, 35, 37, 97, 32, 83, 66, 48, 25, 7, 59,
    62, 55, 21, 60, 89, 20, 74, 33, 17, 76, 45,
];

let model = null;

// Функция для преобразования текста в последовательность
const textToSequence = (text) => {
    return text.split(" ").map((word) => wordIndex[word] || 0);
};

// Загрузка модели
const loadModel = async () => {
    try {
        model = await tf.loadLayersModel(
            "https://provisor-map-back.vercel.app/model.json",
        );
        console.log("Model loaded successfully");
    } catch (error) {
        console.error("Error loading the model:", error);
    }
};

// Вызов функции для загрузки модели при запуске бота
loadModel();

// Обработка текстовых сообщений
bot.on("text", async (msg) => {
    const userMessage = msg.text;

    // Проверяем, была ли загружена модель
    if (model) {
        const sequence = textToSequence(userMessage);
        const paddedSequence = Array.from({ length: 3 }).map(
            (_, i) => sequence[i] || 0,
        );

        const inputTensor = tf.tensor2d([paddedSequence], [1, 3]);
        const prediction = model.predict(inputTensor);
        const labelIndex = prediction.argMax(-1).dataSync()[0];
        const predictedValue = uniqueLabels[labelIndex];

        // Отправляем предсказанное значение пользователю
        bot.sendMessage(
            msg.from.id,
            `Предсказанное значение: ${predictedValue}`,
        );
    } else {
        bot.sendMessage(
            msg.from.id,
            "Модель еще не загружена. Пожалуйста, подождите.",
        );
    }
});

// Запуск бота
bot.start();
>>>>>>> c64bedf (feat: ai)

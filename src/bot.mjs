import TeleBot from "telebot";

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

// Функция для преобразования текста в нужный формат
function parseMessage(text) {
  const lines = text.split("\n");
  const items = [];

  for (let line of lines) {
    if (line.includes("/gw_")) {
      const parts = line.split(" ");
      for (let part of parts) {
        if (part.startsWith("/gw_")) {
          const item = part.substring(4);
          const [code, count] = item.split("_");
          items.push(`${code} ${count}`);
        }
      }
    }
  }

  if (items.length === 0) return null; // Если ничего не найдено, вернуть null

  const groups = [];
  for (let i = 0; i < items.length; i += 9) {
    groups.push(items.slice(i, i + 9));
  }

  return groups
    .map((group) => `/g_withdraw ${group.join(" ")}`)
    .map((cmd) => `\`${cmd}\``)
    .join("\n");
}

// Универсальная обработка входящих сообщений
bot.on("*", (msg) => {
  try {
    let text = msg.text || (msg.reply_to_message && msg.reply_to_message.text);

    if (!text) {
      return bot.sendMessage(
        msg.from.id,
        "Сообщение не содержит текста для обработки.",
      );
    }

    const parsedResult = parseMessage(text);
    if (parsedResult) {
      return bot.sendMessage(msg.from.id, parsedResult, {
        parseMode: "Markdown",
      });
    } else {
      const messageTime = new Date(msg.date * 1000).toLocaleString();
      return bot.sendMessage(msg.from.id, `🕒 Время сообщения: ${messageTime}`);
    }
  } catch (error) {
    console.error("Ошибка при обработке сообщения:", error);
    return bot.sendMessage(
      msg.from.id,
      "Произошла ошибка при обработке сообщения.",
    );
  }
});

// // Обработчик для получения текстовых сообщений
// bot.on("text", (msg) => {
//   const userMessage = msg.text;
//   return bot.sendMessage(msg.from.id, userMessage);
// });
//
// bot.on("text", (msg) => {
//     const url = `https://cataas.com/cat?random=${Math.random()}`;
//     return msg.reply.photo(url);
// });

// Обработчик для получения JSON-файлов
// bot.on("document", async (msg) => {
//     const fileId = msg.document.file_id;
//     const fileName = msg.document.file_name;

//     // Проверяем, что файл имеет JSON-формат
//     if (path.extname(fileName) !== ".json") {
//         return bot.sendMessage(msg.from.id, "Пожалуйста, отправьте JSON-файл.");
//     }

//     try {
//         // Получаем URL для скачивания файла
//         const fileInfo = await bot.getFile(fileId);
//         const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${fileInfo.file_path}`;

//         // Скачиваем файл
//         const response = await axios.get(fileUrl, { responseType: "stream" });
//         const filePath = path.resolve("./", fileName);
//         const writer = fs.createWriteStream(filePath);

//         response.data.pipe(writer);

//         writer.on("finish", async () => {
//             // Чтение и извлечение ключей JSON-файла
//             const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
//             const keys = Object.keys(data);

//             // const messages = data.messages;
//             // const messages = JSON.parse(data).messages;

//             // const cwM = messages.filter(
//             //     (message) =>
//             //         message.from_id === "user265204902" &&
//             //         Array.isArray(message.text) &&
//             //         message.text.some(
//             //             (item) =>
//             //                 typeof item === "object" &&
//             //                 item.text &&
//             //                 item.text.includes("/cook_recipe"),
//             //         ),
//             // );

//             // Создаем сообщение со списком ключей${JSON.stringify(data)}`;
//             const responseMessage = `Ключи в JSON: ${keys.join(", ")}`;
//             // const responseMessage = `Ключи в JSON: ${messages.length}`;
//             // const responseMessage = `Результат: ${cwM}`;

//             // Отправляем список ключей пользователю
//             await bot.sendMessage(msg.from.id, responseMessage);

//             // Удаление временного файла
//             fs.unlinkSync(filePath);
//         });

//         writer.on("error", (err) => {
//             bot.sendMessage(msg.from.id, "Ошибка при обработке файла.");
//             console.error("Ошибка записи файла:", err);
//         });
//     } catch (error) {
//         bot.sendMessage(msg.from.id, "Не удалось обработать файл.");
//         console.error("Ошибка:", error);
//     }
// });

export default bot;

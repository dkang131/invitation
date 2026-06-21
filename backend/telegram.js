const axios = require("axios");

async function sendTelegramMessage(message) {
  const token = process.env.BOT_TOKEN;
  const chatId = process.env.CHAT_ID;

  await axios.post(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      chat_id: chatId,
      text: message,
    }
  );
}

module.exports = {
  sendTelegramMessage,
};
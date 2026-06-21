require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const log = (level, message, data = null) => {
  const timestamp = new Date().toISOString();

  console.log(
    `[${timestamp}] [${level}] ${message}`
  );

  if (data) {
    console.log(data);
  }
};

const app = express();


app.use(cors());
app.use(express.json());

app.post("/api/respond", async (req, res) => {
  try {
    log(
      "INFO",
      "Received date invitation response"
    );
    const data = req.body;

    log("DEBUG", "Request payload", data);

    let message =
      "💌 New Date Invitation Response\n\n";

    if (data.selectedDates?.length) {
      log(
        "INFO",
        `Processing ${data.selectedDates.length} selected proposal(s)`
      );
      message += "✅ Selected dates:\n";

      data.selectedDates.forEach((d) => {
        message += `• ${d.title}\n`;
        message += `  ${d.date} ${d.time}\n`;
      });

      message += "\n";
    }

    if (data.customAvailability?.length) {
      log(
        "INFO",
        `Processing ${data.customAvailability.length} custom date(s)`
      );

      message += "📅 Custom availability:\n";

      data.customAvailability.forEach((d) => {
        const formattedDate = new Date(
          d.date
        ).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });

        message += `• ${formattedDate}\n`;
        message += `  ⏰ ${d.startTime} - ${d.endTime}\n\n`;
      });

      message += "\n";
    }

    if (data.note) {
      log(
        "INFO",
        `Note received (${data.note.length} chars)`
      );
      message += `📝 Note:\n${data.note}`;
    }

    log(
      "INFO",
      "Sending message to Telegram"
    );

    const telegramResponse = await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.CHAT_ID,
        text: message,
      }
    );
    log(
      "INFO",
      "Telegram message sent successfully"
    );

    log(
      "DEBUG",
      "Telegram response",
      telegramResponse.data
    );

    res.json({
      success: true,
    });
    log(
      "INFO",
      "Response returned to frontend"
    );
  } catch (err) {
    log(
      "ERROR",
      "Failed processing invitation response"
    );
    console.error(err);

    res.status(500).json({
      success: false,
    });
  }
});

app.listen(9191, () => {
  log(
    "INFO",
    "Date Invitation API started on port 9191"
  );
  log(
    "INFO",
    `Telegram Chat ID configured: ${
      process.env.CHAT_ID ? "YES" : "NO"
    }`
  );
});
const express = require("express");

const { sendTelegramMessage } = require("../telegram");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      selectedDates,
      customAvailability,
      note,
    } = req.body;

    let message = "💌 New Date Response\n\n";

    if (selectedDates.length > 0) {
      message += "Accepted Proposals:\n";

      selectedDates.forEach((item) => {
        message += `• ${item.date} ${item.time}\n`;
      });
    }

    if (customAvailability.length > 0) {
      message += "\nSuggested Availability:\n";

      customAvailability.forEach((item) => {
        message += `• ${item.date}\n`;
      });
    }

    message += `\nMessage:\n${note}`;

    await sendTelegramMessage(message);

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
});

module.exports = router;
const axios = require("axios");

const sendWebhook = async (action, data) => {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await axios.post(webhookUrl, {
      action,
      timestamp: new Date(),
      project: data,
    });
    console.log(`n8n Webhook sent: ${action}`);
  } catch (error) {
    console.error("Error sending n8n Webhook:", error.message);
  }
};

module.exports = sendWebhook;

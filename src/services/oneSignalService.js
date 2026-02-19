const axios = require('axios');

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;

const sendNotification = async (playerIds, message, data = {}) => {
  try {
    const response = await axios.post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: ONESIGNAL_APP_ID,
        include_player_ids: Array.isArray(playerIds) ? playerIds : [playerIds],
        contents: { en: message },
        data: data,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${ONESIGNAL_API_KEY}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const sendLikeNotification = async (recipientPlayerId, senderName) => {
  return sendNotification(
    recipientPlayerId,
    `${senderName} liked your profile!`,
    { type: 'like', senderName }
  );
};

const sendMessageNotification = async (recipientPlayerId, senderName, messageText) => {
  return sendNotification(
    recipientPlayerId,
    `${senderName}: ${messageText}`,
    { type: 'message', senderName }
  );
};

const sendMatchNotification = async (recipientPlayerId, matchName) => {
  return sendNotification(
    recipientPlayerId,
    `It's a match! You and ${matchName} liked each other!`,
    { type: 'match', matchName }
  );
};

module.exports = {
  sendNotification,
  sendLikeNotification,
  sendMessageNotification,
  sendMatchNotification,
};

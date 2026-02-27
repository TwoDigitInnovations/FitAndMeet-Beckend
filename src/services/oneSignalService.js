const axios = require('axios');

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;

const translations = {
  like: {
    en: (name) => `${name} liked your profile!`,
    fr: (name) => `${name} aime votre profil !`
  },
  message: {
    en: (name, text) => `${name}: ${text}`,
    fr: (name, text) => `${name}: ${text}`
  },
  messagePhoto: {
    en: () => '📷 Photo',
    fr: () => '📷 Photo'
  },
  match: {
    en: (name) => `It's a match! You and ${name} liked each other!`,
    fr: (name) => `C'est un match ! Vous et ${name} vous aimez !`
  }
};

const sendNotification = async (playerIds, message, data = {}, imageUrl = null) => {
  try {
    const notificationPayload = {
      app_id: ONESIGNAL_APP_ID,
      include_player_ids: Array.isArray(playerIds) ? playerIds : [playerIds],
      contents: { en: message },
      data: data,
    };

    if (imageUrl) {
      notificationPayload.big_picture = imageUrl;
      notificationPayload.ios_attachments = { id: imageUrl };
      notificationPayload.large_icon = imageUrl;
    }

    const response = await axios.post(
      'https://onesignal.com/api/v1/notifications',
      notificationPayload,
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

const sendLikeNotification = async (recipientPlayerId, senderName, recipientLanguage = 'en') => {
  const message = translations.like[recipientLanguage](senderName);
  return sendNotification(
    recipientPlayerId,
    message,
    { type: 'like', senderName }
  );
};

const sendMessageNotification = async (recipientPlayerId, senderName, messageText, conversationId, senderId, senderImage = null, messageImage = null, recipientLanguage = 'en') => {
  const displayText = messageImage ? translations.messagePhoto[recipientLanguage]() : messageText;
  const message = translations.message[recipientLanguage](senderName, displayText);
  const imageToShow = messageImage || senderImage;
  
  return sendNotification(
    recipientPlayerId,
    message,
    { 
      type: 'message', 
      senderName,
      conversationId,
      senderId,
      senderImage
    },
    imageToShow
  );
};

const sendMatchNotification = async (recipientPlayerId, matchName, recipientLanguage = 'en') => {
  const message = translations.match[recipientLanguage](matchName);
  return sendNotification(
    recipientPlayerId,
    message,
    { type: 'match', matchName }
  );
};

module.exports = {
  sendNotification,
  sendLikeNotification,
  sendMessageNotification,
  sendMatchNotification,
};

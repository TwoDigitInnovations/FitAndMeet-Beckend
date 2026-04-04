const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Test endpoint to send a message via socket
router.post('/send-test-message', async (req, res) => {
  try {
    const { conversationId, senderId, recipientId, content } = req.body;

    console.log('🧪 TEST: Sending test message:', {
      conversationId,
      senderId,
      recipientId,
      content
    });

    // Create a test message
    const testMessage = new Message({
      conversation: conversationId,
      sender: senderId,
      recipient: recipientId,
      content: content || 'Test message from backend',
      type: 'text',
      isDelivered: true,
      deliveredAt: new Date()
    });

    await testMessage.save();

    // Populate sender info
    await testMessage.populate('sender', 'firstName photos');

    // Emit via socket
    if (global.io) {
      console.log('🧪 TEST: Emitting to room conversation_' + conversationId);
      global.io.to(`conversation_${conversationId}`).emit('new-message', testMessage);
      console.log('🧪 TEST: Message emitted successfully');
      
      // Also log room info
      const room = global.io.sockets.adapter.rooms.get(`conversation_${conversationId}`);
      console.log('🧪 TEST: Room has', room ? room.size : 0, 'connected sockets');
    } else {
      console.log('🧪 TEST: No global.io found');
    }

    res.json({
      success: true,
      message: 'Test message sent',
      data: testMessage
    });
  } catch (error) {
    console.error('🧪 TEST ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get conversation details for testing
router.get('/conversation-info/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const Conversation = require('../models/Conversation');
    
    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'firstName email');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Check socket rooms
    const roomInfo = {
      conversationId,
      participants: conversation.participants,
      socketRoomName: `conversation_${conversationId}`,
      connectedSockets: global.io ? 
        Array.from(global.io.sockets.adapter.rooms.get(`conversation_${conversationId}`) || []) : 
        []
    };

    res.json({
      success: true,
      data: roomInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

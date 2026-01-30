const MessageService = require('../services/message-service');
const messageService = new MessageService();

const createMessage = async (req, res) => {
    try {
        const data = req.body;
        const message = await messageService.createMessage(data);
        res.status(201).json({
            data: message,
            success: true,
            message: 'Message created successfully',
            err: {}
        });
    } catch (error) {
        console.log('Error in createMessage:', error);
        res.status(500).json({
            data: {},
            success: false,
            message: 'Internal server error',
            err: error
        });
    }
}

const getMessagesByConversationId = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const messages = await messageService.getMessagesByConversationId(conversationId);
        return res.status(200).json({
            data: messages,
            success: true,
            message: 'Messages fetched successfully',
            err: {}
        });
    } catch (error) {
        console.log('Error in getMessagesByConversationId:', error);
        res.status(500).json({
            data: {},
            success: false,
            message: 'Internal server error',
            err: error
        });
    }
}

module.exports = {
    createMessage,
    getMessagesByConversationId,
}
// controllers/conversation-controller.js
const ConversationService = require('../services/conversation-service');
const MessageService = require('../services/message-service');

const conversationService = new ConversationService();
const messageService = new MessageService();

const createConversation = async (req, res) => {
    try {
        const conversationData = {
            userId: req.user.id,
            title: req.body.title || 'New Chat',
        };
        const conversation = await conversationService.create(conversationData);
        return res.status(201).json({
            data: conversation,
            success: true,
            message: 'Conversation created successfully',
            err: {}
        });
    } catch (error) {
        console.error('Error in createConversation controller:', error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to create conversation',
            err: error.message
        });
    }   
};

const getConversation = async (req, res) => {
    try {
        const conversationId = req.params.id;
        const data = await conversationService.getConversationWithMessages(conversationId);
        return res.status(200).json({
            data,
            success: true,
            message: 'Conversation fetched successfully',
            err: {}
        });
    } catch (error) {
        console.error('Error in getConversation controller:', error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to fetch conversation',
            err: error.message
        });
    }
};

const getUserConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await conversationService.getByUserId(userId);
        return res.status(200).json({
            data: conversations,
            success: true,
            message: 'Conversations fetched successfully',
            err: {}
        });
    } catch (error) {
        console.error('Error in getUserConversations controller:', error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to fetch conversations',
            err: error.message
        });
    }
};

const deleteConversation = async (req, res) => {
    try {
        const conversationId = req.params.id;
        await conversationService.deleteWithMessages(conversationId);
        return res.status(200).json({
            data: {},
            success: true,
            message: 'Conversation deleted successfully',
            err: {}
        });
    } catch (error) {
        console.error('Error in deleteConversation controller:', error);
        return res.status(500).json({
            data: {},   
            success: false,
            message: 'Failed to delete conversation',
            err: error.message
        });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { conversationId, content } = req.body;
        const userId = req.user.id; // Get from authenticated user
        
        // Create user message
        const userMessage = await messageService.create({
            conversationId,
            sender: 'User',
            content
        });

        // Generate bot response from your API
        const botResponseData = await messageService.generateBotResponse(content, userId);
        
        const botMessage = await messageService.create({
            conversationId,
            sender: 'Bot',
            content: botResponseData.content,
            structured: botResponseData.structured,
            type: botResponseData.type
        });
        console.log('Bot response generated:', botResponseData);
        // Update conversation timestamp
        await conversationService.update(conversationId, { updatedAt: new Date() });

        return res.status(201).json({
            data: {
                userMessage,
                botMessage
            },
            success: true,
            message: 'Messages sent successfully',
            err: {}
        });
    } catch (error) {
        console.error('Error in sendMessage controller:', error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Failed to send message',
            err: error.message
        });
    }
};

module.exports = {
    createConversation,
    getConversation,
    getUserConversations,
    deleteConversation,
    sendMessage
};
// services/message-service.js
const CrudService = require('./crud-service');
const MessageRepository = require('../repositories/message-repo');
const axios = require('axios');

class MessageService extends CrudService {
    constructor() {
        const messageRepository = new MessageRepository();
        super(messageRepository);
        this.messageRepository = messageRepository;
        this.BOT_API_URL = process.env.BOT_API_URL || 'https://project-jan-3.onrender.com/query';
    }

    async getMessagesByConversationId(conversationId) {
        try {
            const messages = await this.messageRepository.getByConversationId(conversationId);
            return messages;
        } catch (error) {
            console.log("Error in MessageService: getMessagesByConversationId()", error);
            throw error;
        }
    }

    async deleteByConversationId(conversationId) {
        try {
            const result = await this.messageRepository.deleteByConversationId(conversationId);
            return result;
        } catch (error) {
            console.log("Error in MessageService: deleteByConversationId()", error);
            throw error;
        }
    }

    async generateBotResponse(userMessage, userId = 'default_user') {
        try {
            // Call your bot API
            const response = await axios.post(this.BOT_API_URL, {
                query: userMessage,
                user_id: userId
            }, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 seconds timeout
            });

            if (response.data && response.data.answer) {
                return {
                    content: response.data.answer,
                    type: response.data.type,
                    structured: this.parseStructuredData(response.data)
                };
            }

            // Fallback response
            return {
                content: 'I apologize, but I encountered an issue processing your request. Please try again.',
                type: 'error',
                structured: null
            };

        } catch (error) {
            console.error("Error calling bot API:", error.message);
            
            // Fallback response on error
            return {
                content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
                type: 'error',
                structured: null
            };
        }
    }

    // Parse bot response into structured format for frontend
    parseStructuredData(botResponse) {
        const structured = {
            type: botResponse.type,
            userProfile: botResponse.user_profile,
            targetScope: botResponse.target_scope,
            transaction: botResponse.transaction,
            alert: botResponse.alert
        };

        // Remove null/undefined fields
        Object.keys(structured).forEach(key => {
            if (structured[key] === null || structured[key] === undefined) {
                delete structured[key];
            }
        });

        return Object.keys(structured).length > 0 ? JSON.stringify(structured) : null;
    }
}

module.exports = MessageService;
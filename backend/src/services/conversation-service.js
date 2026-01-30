// services/conversation-service.js
const CrudService = require('./crud-service');
const ConversationRepository = require('../repositories/conversation-repo');
const MessageService = require('./message-service');

class ConversationService extends CrudService {
    constructor() {
        const conversationRepository = new ConversationRepository();
        super(conversationRepository);
        this.conversationRepository = conversationRepository;
        this.messageService = new MessageService();
    }

    async getByUserId(userId) {
        try {
            const conversations = await this.conversationRepository.getByUserId(userId);
            return conversations;
        } catch (error) {
            console.log("Error in ConversationService: getByUserId()", error);
            throw error;
        }
    }

    async getConversationWithMessages(conversationId) {
        try {
            const conversation = await this.repo.get({ _id: conversationId });
            if (!conversation) {
                throw new Error('Conversation not found');
            }
            
            const messages = await this.messageService.getMessagesByConversationId(conversationId);
            
            return {
                conversation,
                messages
            };
        } catch (error) {
            console.log("Error in ConversationService: getConversationWithMessages()", error);
            throw error;
        }
    }

    async deleteWithMessages(conversationId) {
        try {
            // Delete all messages first
            await this.messageService.deleteByConversationId(conversationId);
            // Then delete conversation
            const result = await this.repo.destroy(conversationId);
            return result;
        } catch (error) {
            console.log("Error in ConversationService: deleteWithMessages()", error);
            throw error;
        }
    }
}

module.exports = ConversationService;
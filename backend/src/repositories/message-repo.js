// repositories/message-repo.js
const CrudRepository = require('./crud-repo');
const Message = require('../models/message');

class MessageRepository extends CrudRepository {
    constructor() {
        super(Message);
    }

    async getByConversationId(conversationId) {
        try {
            const messages = await this.model
                .find({ conversationId })
                .sort({ createdAt: 1 });
            return messages;
        } catch (error) {
            console.log("Error in MessageRepository: getByConversationId()", error);
            throw error;
        }
    }

    async deleteByConversationId(conversationId) {
        try {
            const result = await this.model.deleteMany({ conversationId });
            return result;
        } catch (error) {
            console.log("Error in MessageRepository: deleteByConversationId()", error);
            throw error;
        }
    }
}

module.exports = MessageRepository;
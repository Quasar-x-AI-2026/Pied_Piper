// repositories/conversation-repo.js
const CrudRepository = require('./crud-repo');
const Conversation = require('../models/conversation');

class ConversationRepository extends CrudRepository {
    constructor() {
        super(Conversation);
    }

    async getByUserId(userId) {
        try {
            const conversations = await this.model
                .find({ userId })
                .sort({ updatedAt: -1 });
            return conversations;
        } catch (error) {
            console.log("Error in ConversationRepository: getByUserId()", error);
            throw error;
        }
    }
}

module.exports = ConversationRepository;
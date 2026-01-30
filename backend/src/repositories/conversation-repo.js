const CrudRepository = require('./crud-repo');
const Conversation = require('../models/conversation');

class ConversationRepository extends CrudRepository {
    constructor() {
        super(Conversation);
    }
}

module.exports = ConversationRepository;
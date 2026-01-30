// models/message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    sender: {   
        type: String,   
        enum: ['User', 'Bot'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: false,
        // greeting, scheme_query, transaction, scam_detection, etc.
    },
    structured: {
        type: String, // JSON string for structured data
        required: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
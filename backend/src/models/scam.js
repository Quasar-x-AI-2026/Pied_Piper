const mongoose = require('mongoose');

const scamSchema = new mongoose.Schema({
    scamType: {
        type: String,
        required: true,
        enum: ['Phishing', 'Investment Fraud', 'Lottery Scam', 'Romance Scam', 'Tech Support Scam', 'Charity Fraud', 'Identity Theft', 'KYC update scam', 'Other'],
    },
    message: {
        type: String,
        required: true,
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    riskLevel: {
        type: String,
        required: true,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    recommendation: {
        type: String,
        required: false,
    },
    dateReported: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model('Scam', scamSchema);
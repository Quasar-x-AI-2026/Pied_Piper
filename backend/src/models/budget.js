const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    totalIncome: {
        type: Number,
        required: true,
    },
    expenses: {
        rent: {
            type: Number,
            default: 0
        },
        emi: {
            type: Number,
            default: 0
        },
        utilities: {
            type: Number,
            default: 0
        },
        groceries: {
            type: Number,
            default: 0
        },
        other: {
            type: Number,
            default: 0
        }
    },
    savingGoals: {
        percentage: {
            type: Number,
        },
        monthly: {
            type: Number,
        },
        emergencyFund: {
            type: Number,
        }
    },
    recommendations: [{
        catogory: {
            type: String,
        },
        message: {
            type: String,
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }],

}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
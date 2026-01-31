const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema({
    amount: { type: Number, required: true },
    category: { type: String, default: 'other' }, // Matches your TransactionForm defaults
    notes: { type: String, default: null },      // Changed 'description' to 'notes' to match your frontend
    type: { type: String, enum: ['expense', 'income'], default: 'expense' },
    date: { type: Date, default: Date.now }
}, { _id: true }); // Keep _id for individual transaction deletion

const BudgetSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true 
    },
    transactions: [TransactionSchema],
}, { 
    timestamps: true // This automatically handles createdAt and updatedAt
});

// Remove the manual pre-save hook entirely to stop the "next is not a function" error
module.exports = mongoose.model('Budget', BudgetSchema);
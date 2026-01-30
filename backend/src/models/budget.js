const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema({
    amount: { type: Number, required: true },
    category: { type: String, default: null },
    description: { type: String, default: null },
    type: { type: String, default: 'expense' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

const BudgetSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    transactions: { type: [TransactionSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

BudgetSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Budget', BudgetSchema);
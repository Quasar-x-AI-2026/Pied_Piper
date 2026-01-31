const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expenses: [
    {
      amount: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        required: true,
        enum: [
          'food',
          'transport',
          'utilities',
          'entertainment',
          'healthcare',
          'education',
          'other',
        ],
      },
      description: {
        type: String,
      },
    },
  ],
  date: {
    type: String, // ✅ FIX
    required: true,
  },
}, { timestamps: true });

// Prevent duplicate day entries
expenseSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Expense', expenseSchema);

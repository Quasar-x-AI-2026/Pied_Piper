const CrudService = require('./crud-service');
const ExpenseRepository = require('../repositories/expense-repo');
const Budget = require('../models/budget');
const axios = require('axios');

class ExpenseService extends CrudService {
  constructor() {
    super(new ExpenseRepository());
  }

  async createExpenseAi(data) {
    try {
      const aiResponse = await axios.post(
        'https://project-jan-3.onrender.com/query',
        {
          query: data.message,
          user_id: data.userId,
        }
      );

      const detail = aiResponse.data.transaction;

      if (!detail || !detail.amount || !detail.date) {
        throw new Error('Invalid AI transaction data');
      }

      // ✅ Normalize date (YYYY-MM-DD)
      const date = new Date(detail.date).toISOString().split('T')[0];

      // =========================
      // 1️⃣ HANDLE EXPENSE COLLECTION
      // =========================
      let expenseDoc = await this.repo.findOne({
        userId: data.userId,
        date,
      });

      if (expenseDoc) {
        expenseDoc.expenses.push({
          amount: detail.amount,
          category: detail.category || 'other',
          description: detail.description,
        });

        await this.repo.update(expenseDoc.id, expenseDoc);
      } else {
        await this.repo.create({
          userId: data.userId,
          date,
          expenses: [
            {
              amount: detail.amount,
              category: detail.category || 'other',
              description: detail.description,
            },
          ],
        });
      }

      // =========================
      // 2️⃣ HANDLE BUDGET TRANSACTIONS
      // =========================
      const transaction = {
        amount: detail.amount,
        category: detail.category || 'other',
        description: detail.description,
        type: 'expense',
        date: new Date(detail.date),
      };

      await Budget.findOneAndUpdate(
        { userId: data.userId },
        {
          $push: { transactions: transaction },
          $set: { updatedAt: new Date() },
        },
        { upsert: true, new: true }
      );

      return {
        success: true,
        date,
        amount: detail.amount,
        category: detail.category || 'other',
      };
    } catch (error) {
      console.error('Error in createExpenseAi:', error);
      throw new Error(error.message);
    }
  }

  async getExpenseByDate(userId, date) {
    return await this.repo.findOne({ userId, date });
  }
}

module.exports = ExpenseService;

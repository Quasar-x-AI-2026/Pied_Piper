const CrudService = require('./crud-service');
const ExpenseRepository = require('../repositories/expense-repo');
const axios = require('axios');

class ExpenseService extends CrudService {
    constructor() {
        const expenseRepository = new ExpenseRepository();
        super(expenseRepository);
    }
    async createExpense(data) {
        try {
            const query = `i spent ${data.amount} on ${data.category} at ${data.date}`;
            await axios.post('https://project-jan-3.onrender.com/query', {
                    "query": query,
                    "user_id": data.userId
            });
            const expense = await this.repository.create(data);
            return expense;
        } catch (error) {
            
        }
    }
    async createExpenseAi(data) {
  try {
    const aiResponse = await axios.post(
      'https://project-jan-3.onrender.com/query',
      {
        query: data.message,
        user_id: data.userId
      }
    );

    const detail = aiResponse.data.transaction;
    const date = detail.date;

    let expenseDoc = await this.getExpenseByDate(data.userId, date);

    if (expenseDoc) {
      expenseDoc.expense.push({
        amount: detail.amount,
        description: detail.description,
        category: detail.category
      });

      await this.repository.update(expenseDoc.id, expenseDoc);
    } else {
      expenseDoc = await this.repository.create({
        userId: data.userId,
        date,
        expense: [{
          amount: detail.amount,
          description: detail.description,
          category: detail.category
        }]
      });
    }

    return {
      success: true,
      amount: detail.amount,
      category: detail.category,
      date
    };

  } catch (error) {
    throw new Error(error.message);
  }
}


    async getExpenseByDate(userId, date) {
        try {
            const expenses = await this.repository.findOne({
                userId: userId,
                date: date
            });
            return expenses;
        } catch {
            throw new Error('Error fetching expenses by date');
        }
    }
}

module.exports = ExpenseService;
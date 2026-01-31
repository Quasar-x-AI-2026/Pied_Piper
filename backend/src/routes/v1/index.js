// routes/v1/index.js
const authMiddleware = require('../../middlewares/auth-middleware');
const UserController = require('../../controllers/user-controller');
const SchemeController = require('../../controllers/scheme-controller');
const ConversationController = require('../../controllers/conversation-controller');    
const BudgetController = require('../../controllers/budget-controller');
const ExpenseController = require('../../controllers/expense-controller');
const MessageController = require('../../controllers/message-controller');  

const express = require('express');
const ExpenseRepository = require('../../repositories/expense-repo');
const router = express.Router();
const { getSchemes } = require('../../controllers/scheme-controller');

router.get('/schemes', getSchemes)
// signup and signin routes
router.post('/signup', UserController.createUser);
router.post('/signin', UserController.signInUser);
router.get('/profile', authMiddleware, UserController.getUserProfile);
router.put('/profile', authMiddleware, UserController.updateUserProfile);

// scheme routes
router.get('/schemes', SchemeController.getSchemes);
// router.get('/schemes/:id', SchemeController.getSchemeById);

// conversation routes
router.post('/conversations', authMiddleware, ConversationController.createConversation);
router.get('/conversations', authMiddleware, ConversationController.getUserConversations);
router.get('/conversations/:id', authMiddleware, ConversationController.getConversation);
router.delete('/conversations/:id', authMiddleware, ConversationController.deleteConversation);

// message routes
router.post('/messages', authMiddleware, MessageController.createMessage);
router.get('/messages/:conversationId', authMiddleware, MessageController.getMessagesByConversationId);

// budget routes

router.get('/budget', authMiddleware, BudgetController.getBudget);
router.post('/budget', authMiddleware, BudgetController.createOrUpdateBudget);

// expense routes
// router.get('/expenses', authMiddleware, BudgetController.getExpenses);
// router.post('/expenses', authMiddleware, BudgetController.addExpense);
// router.delete('/expenses/:id', authMiddleware, BudgetController.deleteExpense);

router.post('/airesponse', authMiddleware, ExpenseController.createExpenseAi); ;

module.exports = router;
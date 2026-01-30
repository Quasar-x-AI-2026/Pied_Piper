// routes/v1/index.js
const authMiddleware = require('../../middlewares/auth-middleware');
const UserController = require('../../controllers/user-controller');
const SchemeController = require('../../controllers/scheme-controller');
const ConversationController = require('../../controllers/conversation-controller');    
const BudgetController = require('../../controllers/budget-controller');

const express = require('express');
const router = express.Router();

// signup and signin routes
router.post('/signup', UserController.createUser);
router.post('/signin', UserController.signInUser);
router.get('/profile', authMiddleware, UserController.getUserProfile);
router.put('/profile', authMiddleware, UserController.updateUserProfile);

// scheme routes
router.get('/schemes', SchemeController.getSchemes);
router.get('/schemes/:id', SchemeController.getSchemeById);

// conversation routes
router.post('/conversations', authMiddleware, ConversationController.createConversation);
router.get('/conversations', authMiddleware, ConversationController.getUserConversations);
router.get('/conversations/:id', authMiddleware, ConversationController.getConversation);
router.delete('/conversations/:id', authMiddleware, ConversationController.deleteConversation);

// message routes
router.post('/messages', authMiddleware, ConversationController.sendMessage);

// budget routes

router.get('/budget', authMiddleware, BudgetController.getBudget);
router.post('/budget', authMiddleware, BudgetController.createOrUpdateBudget);

module.exports = router;
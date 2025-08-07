const express = require('express');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

// Get all analytics data
router.get('/', analyticsController.getAnalytics);

// Get daily active users
router.get('/daily-active-users', analyticsController.getDailyActiveUsers);

// Health check endpoint
router.get('/health', analyticsController.getHealthCheck);

module.exports = router;

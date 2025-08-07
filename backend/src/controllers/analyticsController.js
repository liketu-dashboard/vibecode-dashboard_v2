const analyticsService = require('../services/hivesqlService');

class AnalyticsController {
  async getAnalytics(req, res) {
    try {
      const { period = '90D' } = req.query;
      
      // Validate period parameter
      const validPeriods = ['7D', '30D', '90D', 'All'];
      if (!validPeriods.includes(period)) {
        return res.status(400).json({ 
          error: 'Invalid period parameter. Must be one of: 7D, 30D, 90D, All' 
        });
      }

      const analytics = await analyticsService.getAllAnalytics(period);
      
      res.json({
        success: true,
        data: analytics,
        timestamp: new Date().toISOString(),
        period
      });
    } catch (error) {
      console.error('Analytics controller error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch analytics data',
        message: error.message 
      });
    }
  }

  async getDailyActiveUsers(req, res) {
    try {
      const { days = 90 } = req.query;
      const data = await analyticsService.getDailyActiveUsers(parseInt(days));
      
      res.json({
        success: true,
        data: data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Daily active users error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch daily active users',
        message: error.message 
      });
    }
  }

  async getHealthCheck(req, res) {
    try {
      // Simple query to test HiveSQL connection
      await analyticsService.getTotalPosts();
      
      res.json({
        status: 'healthy',
        hivesql: 'connected',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        hivesql: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = new AnalyticsController();

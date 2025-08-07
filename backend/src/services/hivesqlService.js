// Fixed backend/src/services/hivesqlService.js
const hivesql = require('../config/database');

class AnalyticsService {
  async getDailyActiveUsers(days = 90) {
    const query = `
      SELECT 
        CAST(created AS DATE) as date,
        COUNT(DISTINCT author) as active_users
      FROM Comments 
      WHERE CONTAINS(json_metadata, 'app:liketu')
        AND created >= DATEADD(day, -${days}, GETDATE())
      GROUP BY CAST(created AS DATE)
      ORDER BY date DESC
    `;
    
    const result = await hivesql.executeQuery(query);
    return result.data || [];
  }

  async getTotalPosts() {
    const query = `
      SELECT COUNT(*) as total_posts
      FROM Comments 
      WHERE CONTAINS(json_metadata, 'app:liketu')
        AND depth = 0
    `;
    
    const result = await hivesql.executeQuery(query);
    return result.data[0]?.total_posts || 0;
  }

  async getTotalComments() {
    const query = `
      SELECT COUNT(*) as total_comments
      FROM Comments 
      WHERE CONTAINS(json_metadata, 'app:liketu')
        AND depth > 0
    `;
    
    const result = await hivesql.executeQuery(query);
    return result.data[0]?.total_comments || 0;
  }

  async getDailyPosts(days = 90) {
    const query = `
      SELECT 
        CAST(created AS DATE) as date,
        COUNT(*) as posts_count
      FROM Comments 
      WHERE CONTAINS(json_metadata, 'app:liketu')
        AND created >= DATEADD(day, -${days}, GETDATE())
        AND depth = 0
      GROUP BY CAST(created AS DATE)
      ORDER BY date DESC
    `;
    
    const result = await hivesql.executeQuery(query);
    return result.data || [];
  }

  async getDailyComments(days = 90) {
    const query = `
      SELECT 
        CAST(created AS DATE) as date,
        COUNT(*) as comments_count
      FROM Comments 
      WHERE CONTAINS(json_metadata, 'app:liketu')
        AND depth > 0
        AND created >= DATEADD(day, -${days}, GETDATE())
      GROUP BY CAST(created AS DATE)
      ORDER BY date DESC
    `;
    
    const result = await hivesql.executeQuery(query);
    return result.data || [];
  }

  async getTotalRewards() {
    const query = `
      SELECT 
        SUM(
          CAST(REPLACE(total_payout_value, ' HBD', '') AS DECIMAL(10,3)) + 
          CAST(REPLACE(curator_payout_value, ' HBD', '') AS DECIMAL(10,3))
        ) as total_rewards
      FROM Comments 
      WHERE CONTAINS(json_metadata, 'app:liketu')
        AND depth = 0
    `;
    
    const result = await hivesql.executeQuery(query);
    return parseFloat(result.data[0]?.total_rewards || 0);
  }

  async getDailyRewards(days = 90) {
    const query = `
      SELECT 
        CAST(created AS DATE) as date,
        SUM(
          CAST(REPLACE(total_payout_value, ' HBD', '') AS DECIMAL(10,3)) + 
          CAST(REPLACE(curator_payout_value, ' HBD', '') AS DECIMAL(10,3))
        ) as daily_rewards
      FROM Comments 
      WHERE CONTAINS(json_metadata, 'app:liketu')
        AND created >= DATEADD(day, -${days}, GETDATE())
        AND depth = 0
      GROUP BY CAST(created AS DATE)
      ORDER BY date DESC
    `;
    
    const result = await hivesql.executeQuery(query);
    return result.data || [];
  }

  // Simple test query to check connection
  async testConnection() {
    const query = `SELECT TOP 1 author, created FROM Comments WHERE depth = 0`;
    
    try {
      const result = await hivesql.executeQuery(query);
      return result.data && result.data.length > 0;
    } catch (error) {
      console.error('Connection test failed:', error.message);
      throw error;
    }
  }

  async getAllAnalytics(period = '90D') {
    const days = this.getDaysFromPeriod(period);
    
    try {
      const [
        dailyUsers,
        totalPosts,
        totalComments,
        dailyPosts,
        dailyCommentsData,
        totalRewards,
        dailyRewardsData
      ] = await Promise.all([
        this.getDailyActiveUsers(days),
        this.getTotalPosts(),
        this.getTotalComments(),
        this.getDailyPosts(days),
        this.getDailyComments(days),
        this.getTotalRewards(),
        this.getDailyRewards(days)
      ]);

      return {
        dailyActiveUsers: dailyUsers[0]?.active_users || 0,
        previousDayUsers: dailyUsers[1]?.active_users || 0,
        totalPosts,
        totalComments,
        totalRewards,
        charts: {
          dailyActiveUsers: this.formatChartData(dailyUsers, 'active_users'),
          postsCreated: this.formatChartData(dailyPosts, 'posts_count'),
          dailyComments: this.formatChartData(dailyCommentsData, 'comments_count'),
          dailyRewards: this.formatChartData(dailyRewardsData, 'daily_rewards')
        }
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  formatChartData(data, valueKey) {
    return data.reverse().map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      value: parseFloat(item[valueKey]) || 0
    }));
  }

  getDaysFromPeriod(period) {
    switch (period) {
      case '7D': return 7;
      case '30D': return 30;
      case '90D': return 90;
      case 'All': return 365;
      default: return 90;
    }
  }
}

module.exports = new AnalyticsService();
// Updated backend/src/services/hivesqlService.js

const hivesql = require('../config/database');

class AnalyticsService {
  // New method for last 24 hours active users
  async getDailyActiveUsersLast24h() {
    const query = `
      SELECT 
        COUNT(DISTINCT author) as active_users_24h
      FROM Comments 
      WHERE CONTAINS(json_metadata, 'app:liketu')
        AND created >= DATEADD(hour, -24, GETDATE())
    `;
    
    const result = await hivesql.executeQuery(query);
    return result.data[0]?.active_users_24h || 0;
  }

  // New method for previous 24 hours (for percentage comparison)
  async getDailyActiveUsersPrevious24h() {
    const query = `
      SELECT 
        COUNT(DISTINCT author) as active_users_prev_24h
      FROM Comments 
      WHERE CONTAINS(json_metadata, 'app:liketu')
        AND created >= DATEADD(hour, -48, GETDATE())
        AND created < DATEADD(hour, -24, GETDATE())
    `;
    
    const result = await hivesql.executeQuery(query);
    return result.data[0]?.active_users_prev_24h || 0;
  }

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

  async getTotalPosts(days = null) {
    let query;
    if (days === null) {
      // All time (for "All" period)
      query = `
        SELECT COUNT(*) as total_posts
        FROM Comments 
        WHERE CONTAINS(json_metadata, 'app:liketu')
          AND depth = 0
      `;
    } else {
      // Filtered by time period
      query = `
        SELECT COUNT(*) as total_posts
        FROM Comments 
        WHERE CONTAINS(json_metadata, 'app:liketu')
          AND depth = 0
          AND created >= DATEADD(day, -${days}, GETDATE())
      `;
    }
    
    const result = await hivesql.executeQuery(query);
    return result.data[0]?.total_posts || 0;
  }

  async getTotalComments(days = null) {
    let query;
    if (days === null) {
      // All time (for "All" period)
      query = `
        SELECT COUNT(*) as total_comments
        FROM Comments 
        WHERE CONTAINS(json_metadata, 'app:liketu')
          AND depth > 0
      `;
    } else {
      // Filtered by time period
      query = `
        SELECT COUNT(*) as total_comments
        FROM Comments 
        WHERE CONTAINS(json_metadata, 'app:liketu')
          AND depth > 0
          AND created >= DATEADD(day, -${days}, GETDATE())
      `;
    }
    
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

  async getTotalRewards(days = null) {
    let query;
    if (days === null) {
      // All time (for "All" period)
      query = `
        SELECT 
          SUM(
            CAST(REPLACE(total_payout_value, ' HBD', '') AS DECIMAL(10,3)) + 
            CAST(REPLACE(curator_payout_value, ' HBD', '') AS DECIMAL(10,3))
          ) as total_rewards
        FROM Comments 
        WHERE CONTAINS(json_metadata, 'app:liketu')
          AND depth = 0
      `;
    } else {
      // Filtered by time period
      query = `
        SELECT 
          SUM(
            CAST(REPLACE(total_payout_value, ' HBD', '') AS DECIMAL(10,3)) + 
            CAST(REPLACE(curator_payout_value, ' HBD', '') AS DECIMAL(10,3))
          ) as total_rewards
        FROM Comments 
        WHERE CONTAINS(json_metadata, 'app:liketu')
          AND depth = 0
          AND created >= DATEADD(day, -${days}, GETDATE())
      `;
    }
    
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
    const isAllTime = period === 'All';
    
    try {
      const [
        dailyUsers,
        totalPosts,
        totalComments,
        dailyPosts,
        dailyCommentsData,
        totalRewards,
        dailyRewardsData,
        activeUsers24h,
        activeUsersPrev24h
      ] = await Promise.all([
        this.getDailyActiveUsers(days),
        this.getTotalPosts(isAllTime ? null : days),
        this.getTotalComments(isAllTime ? null : days),
        this.getDailyPosts(days),
        this.getDailyComments(days),
        this.getTotalRewards(isAllTime ? null : days),
        this.getDailyRewards(days),
        this.getDailyActiveUsersLast24h(),
        this.getDailyActiveUsersPrevious24h()
      ]);

      return {
        dailyActiveUsers24h: activeUsers24h,
        previousDayUsers24h: activeUsersPrev24h,
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
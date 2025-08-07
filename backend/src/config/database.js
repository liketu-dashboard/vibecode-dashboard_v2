const sql = require('mssql');

class HiveSQLConnection {
  constructor() {
    this.config = {
      user: process.env.HIVESQL_USERNAME,
      password: process.env.HIVESQL_PASSWORD,
      server: process.env.HIVESQL_SERVER,
      database: process.env.HIVESQL_DATABASE,
      options: {
        encrypt: true, // Use this if you're on Windows Azure
        trustServerCertificate: true, // Use this if you're on localhost
        connectTimeout: 30000,
        requestTimeout: 30000,
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      }
    };
    this.pool = null;
  }

  async connect() {
    try {
      if (!this.pool) {
        this.pool = await sql.connect(this.config);
        console.log('✅ Connected to HiveSQL database');
      }
      return this.pool;
    } catch (error) {
      console.error('❌ HiveSQL connection failed:', error.message);
      throw new Error(`Failed to connect to HiveSQL: ${error.message}`);
    }
  }

  async executeQuery(query) {
    try {
      const pool = await this.connect();
      const request = pool.request();
      
      // Set query timeout
      request.timeout = 30000;
      
      console.log('🔍 Executing query:', query.substring(0, 100) + '...');
      
      const result = await request.query(query);
      
      console.log(`✅ Query executed successfully, returned ${result.recordset.length} rows`);
      
      return {
        data: result.recordset,
        rowsAffected: result.rowsAffected
      };
    } catch (error) {
      console.error('❌ Query execution failed:', error.message);
      throw new Error(`Query execution failed: ${error.message}`);
    }
  }

  async testConnection() {
    try {
      const result = await this.executeQuery('SELECT 1 as test');
      return result.data.length > 0;
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
  }

  async close() {
    try {
      if (this.pool) {
        await this.pool.close();
        this.pool = null;
        console.log('🔌 HiveSQL connection closed');
      }
    } catch (error) {
      console.error('❌ Error closing connection:', error.message);
    }
  }
}

module.exports = new HiveSQLConnection();

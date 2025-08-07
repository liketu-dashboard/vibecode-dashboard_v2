# Liketu Analytics Dashboard

A full-stack analytics dashboard for Liketu social platform on the Hive blockchain. Built with React frontend and Node.js backend using HiveSQL for real-time blockchain data.

## Features

- 📊 Real-time analytics from Hive blockchain
- 👥 Daily active users tracking  
- 📝 Posts and comments metrics
- 💰 Rewards tracking in HBD
- 📈 Interactive charts and visualizations
- 🔄 Multiple time period views (7D, 30D, 90D, All)
- 🚀 Production-ready with Docker support
- ☁️ Deploy on Render, Heroku, or any cloud platform

## Prerequisites

- Node.js 16+ 
- HiveSQL account with SQL Server access
- Git

## HiveSQL Setup

1. Sign up at [HiveSQL.io](https://hivesql.io)
2. Get your connection credentials:
   - Username
   - Password  
   - Server address
   - Database name

## Local Development

### 1. Clone and Setup
```bash
git clone <repository-url>
cd liketu-analytics
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Edit `backend/.env` with your HiveSQL credentials:
```env
HIVESQL_USERNAME=your_username
HIVESQL_PASSWORD=your_password
HIVESQL_SERVER=your_server_address
HIVESQL_DATABASE=your_database_name
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

### 4. Using Docker (Recommended for Production)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

Access the dashboard at: http://localhost:3000

## Deploy on Render

### Backend Deployment
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables:
   ```
   HIVESQL_USERNAME=your_username
   HIVESQL_PASSWORD=your_password
   HIVESQL_SERVER=your_server
   HIVESQL_DATABASE=your_database
   NODE_ENV=production
   PORT=5000
   ```

### Frontend Deployment
1. Create new Static Site on Render
2. Connect your GitHub repository
3. Set build command: `cd frontend && npm install && npm run build`
4. Set publish directory: `frontend/build`
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

## Environment Variables

### Backend (.env)
```env
HIVESQL_USERNAME=your_username
HIVESQL_PASSWORD=your_password  
HIVESQL_SERVER=your_server_address
HIVESQL_DATABASE=your_database_name
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Liketu Analytics
```

## API Endpoints

### Analytics
- `GET /api/analytics?period=90D` - Get all analytics data
- `GET /api/analytics/daily-active-users?days=90` - Get daily active users
- `GET /api/analytics/health` - Health check endpoint

### Available Periods
- `7D` - Last 7 days
- `30D` - Last 30 days  
- `90D` - Last 90 days
- `All` - Last 365 days

## Database Schema

The application queries the HiveSQL `Comments` table with these fields:
- `depth` - 0 for posts, >0 for comments
- `json_metadata` - Contains app information
- `author` - Content creator
- `created` - Timestamp
- `total_payout_value` - Author rewards
- `curator_payout_value` - Curator rewards

## Production Deployment

### Render (Recommended)
- ✅ Easy setup with GitHub integration
- ✅ Automatic deployments
- ✅ Free tier available
- ✅ Built-in SSL certificates

### Other Platforms
- Heroku
- Vercel (frontend)
- Railway
- DigitalOcean App Platform

### Environment Variables for Production
```env
# Backend
NODE_ENV=production
HIVESQL_USERNAME=your_production_username
HIVESQL_PASSWORD=your_production_password
HIVESQL_SERVER=your_production_server
HIVESQL_DATABASE=your_production_database
ALLOWED_ORIGINS=https://yourdomain.com

# Frontend  
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## Troubleshooting

### Common Issues

**SQL Connection Error**
- Verify credentials in `.env` file
- Check HiveSQL server status
- Ensure firewall allows SQL connections

**CORS Errors**
- Update `ALLOWED_ORIGINS` in backend `.env`
- Check frontend `REACT_APP_API_URL` setting

**Charts Not Loading**
- Check browser console for JavaScript errors
- Verify API endpoints are returning data
- Test backend health endpoint: `/api/analytics/health`

### Local Development
```bash
# Backend logs
cd backend && npm run dev

# Frontend logs  
cd frontend && npm start

# Docker logs
docker-compose logs -f
```

### Production Debugging
- Check Render deployment logs
- Verify environment variables are set
- Test API endpoints directly

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create GitHub issue
- Check troubleshooting section
- Review HiveSQL documentation: https://hivesql.io/docs

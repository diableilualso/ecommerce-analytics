# Ecommerce Analytics Dashboard

A real-time analytics dashboard for ecommerce businesses, built with Supabase and modern web technologies.

## 🚀 Quick Start

### 1. Supabase Setup
1. Go to [Supabase](https://supabase.com) and create a new project
2. Name it `ecommerce-analytics`
3. Copy your:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **Anon Public Key** (from Settings > API)

### 2. Database Setup
1. In Supabase Dashboard, go to **SQL Editor**
2. Copy and paste the entire content of `backend/schema.sql`
3. Run the SQL to create tables, indexes, and sample data

### 3. Frontend Setup
1. Open `frontend/app.js`
2. Update the Supabase configuration:
   ```javascript
   const SUPABASE_URL = 'https://your-project-url.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-public-key';
   ```
3. Open `frontend/index.html` in your browser

### 4. Backend Setup (Optional)
```bash
cd backend
npm install
npm start
```

## 📁 Project Structure

```
ecommerce-analytics/
├── frontend/
│   ├── index.html      # Main dashboard
│   ├── style.css       # Styling
│   └── app.js          # Frontend logic with Supabase
├── backend/
│   ├── server.js       # Express API server
│   ├── package.json    # Node.js dependencies
│   └── schema.sql      # Database schema
└── docs/
    └── README.md       # This file
```

## 🛠️ Features

### ✅ Completed
- User registration system
- Ecommerce data tracking (Shopify, WooCommerce, Amazon)
- Real-time dashboard with responsive design
- Supabase integration with RLS security
- Sample data generation
- RESTful API backend

### 🔄 In Progress
- Advanced analytics charts
- User authentication
- Data export functionality
- Email notifications

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### User Data Table
```sql
CREATE TABLE user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  platform VARCHAR(50),
  metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 API Endpoints

### Frontend (Direct Supabase)
- `POST /users` - Register new user
- `POST /user_data` - Add user metrics
- `GET /users` - List all users

### Backend API (Express)
- `GET /api/health` - Health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/user-data` - Get user metrics
- `POST /api/user-data` - Add user metrics
- `GET /api/analytics/summary` - Analytics summary

## 🚀 Deployment Options

### Option 1: Static Hosting (Frontend Only)
1. Update Supabase credentials in `app.js`
2. Deploy to Netlify/Vercel/GitHub Pages

### Option 2: Full Stack (Frontend + Backend)
1. Deploy backend to Railway/Render
2. Set environment variables:
   ```
   SUPABASE_URL=your-project-url
   SUPABASE_ANON_KEY=your-anon-key
   PORT=3000
   ```
3. Deploy frontend separately or serve from backend

### Option 3: Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Analytics Metrics

The system tracks:
- **Revenue**: Total sales revenue
- **Orders**: Number of orders
- **Visitors**: Website/shop visitors
- **Conversion Rate**: Orders ÷ Visitors
- **Average Order Value**: Revenue ÷ Orders

## 🔒 Security

- Row Level Security (RLS) enabled
- Public read/insert access (configurable)
- UUID primary keys
- Timestamp tracking
- Input validation

## 🧪 Testing

1. Open the dashboard
2. Register a test user
3. Add sample metrics
4. Verify data appears in Supabase dashboard

## 📝 License

MIT License - see LICENSE file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions:
1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the schema.sql for database setup
3. Test with the sample data first

---

**Built with ❤️ by Jingtian** | Last Updated: March 2025
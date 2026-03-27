require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-public-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'ecommerce-analytics-api',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register new user
app.post('/api/users', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        const { data, error } = await supabase
            .from('users')
            .insert([{ email }])
            .select();
            
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user data
app.get('/api/user-data', async (req, res) => {
    try {
        const { userId, platform } = req.query;
        let query = supabase.from('user_data').select(`
            *,
            users(email)
        `);
        
        if (userId) query = query.eq('user_id', userId);
        if (platform) query = query.eq('platform', platform);
        
        const { data, error } = await query.order('created_at', { ascending: false });
            
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add user data
app.post('/api/user-data', async (req, res) => {
    try {
        const { user_id, platform, metrics } = req.body;
        
        if (!user_id || !platform || !metrics) {
            return res.status(400).json({ 
                error: 'user_id, platform, and metrics are required' 
            });
        }
        
        const { data, error } = await supabase
            .from('user_data')
            .insert([{ user_id, platform, metrics }])
            .select();
            
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Analytics summary
app.get('/api/analytics/summary', async (req, res) => {
    try {
        // Get total users
        const { count: userCount, error: userError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });
            
        if (userError) throw userError;
        
        // Get total data entries
        const { count: dataCount, error: dataError } = await supabase
            .from('user_data')
            .select('*', { count: 'exact', head: true });
            
        if (dataError) throw dataError;
        
        // Get platform distribution
        const { data: platformData, error: platformError } = await supabase
            .from('user_data')
            .select('platform');
            
        if (platformError) throw platformError;
        
        const platformDistribution = platformData.reduce((acc, item) => {
            acc[item.platform] = (acc[item.platform] || 0) + 1;
            return acc;
        }, {});
        
        res.json({
            total_users: userCount || 0,
            total_data_entries: dataCount || 0,
            platform_distribution: platformDistribution,
            last_updated: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '../frontend' });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Ecommerce Analytics API running on port ${port}`);
    console.log(`📊 Health check: http://localhost:${port}/api/health`);
    console.log(`🌐 Frontend: http://localhost:${port}/`);
    
    if (supabaseUrl.includes('your-project-url')) {
        console.log('\n⚠️  WARNING: Supabase credentials not configured!');
        console.log('Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables');
        console.log('Or update the values in server.js');
    }
});
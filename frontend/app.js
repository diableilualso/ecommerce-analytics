// Supabase configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-public-key';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const registerForm = document.getElementById('registerForm');
const dataForm = document.getElementById('dataForm');
const usersList = document.getElementById('usersList');

// Register user
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const messageEl = document.getElementById('registerMessage');
    
    try {
        const { data, error } = await supabase
            .from('users')
            .insert([{ email }])
            .select();
            
        if (error) throw error;
        
        messageEl.textContent = 'User registered successfully!';
        messageEl.className = 'success';
        registerForm.reset();
        loadUsers();
    } catch (error) {
        messageEl.textContent = `Error: ${error.message}`;
        messageEl.className = 'error';
    }
});

// Add user data
dataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('userEmail').value;
    const platform = document.getElementById('platform').value;
    const metricsText = document.getElementById('metrics').value;
    const messageEl = document.getElementById('dataMessage');
    
    try {
        // First get user ID by email
        const { data: users, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();
            
        if (userError) throw new Error('User not found. Please register first.');
        
        // Parse metrics JSON
        let metrics;
        try {
            metrics = JSON.parse(metricsText);
        } catch {
            throw new Error('Invalid JSON format for metrics');
        }
        
        // Insert user data
        const { data, error } = await supabase
            .from('user_data')
            .insert([{
                user_id: users.id,
                platform,
                metrics
            }])
            .select();
            
        if (error) throw error;
        
        messageEl.textContent = 'User data added successfully!';
        messageEl.className = 'success';
        dataForm.reset();
    } catch (error) {
        messageEl.textContent = `Error: ${error.message}`;
        messageEl.className = 'error';
    }
});

// Load and display users
async function loadUsers() {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
            
        if (error) throw error;
        
        usersList.innerHTML = '';
        
        if (users.length === 0) {
            usersList.innerHTML = '<p>No users found. Register a user to get started!</p>';
            return;
        }
        
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-item';
            
            const date = new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            userDiv.innerHTML = `
                <div class="user-email">${user.email}</div>
                <div class="user-date">Registered: ${date}</div>
            `;
            
            usersList.appendChild(userDiv);
        });
    } catch (error) {
        console.error('Error loading users:', error);
        usersList.innerHTML = '<p class="error">Error loading users</p>';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    
    // Add example metrics to textarea
    document.getElementById('metrics').value = JSON.stringify({
        revenue: 1000,
        orders: 50,
        visitors: 5000,
        conversion_rate: 0.01,
        average_order_value: 20
    }, null, 2);
});

// Demo mode - show instructions if Supabase is not configured
if (SUPABASE_URL.includes('your-project-url')) {
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.querySelector('.container');
        const demoAlert = document.createElement('div');
        demoAlert.className = 'card';
        demoAlert.style.background = '#fff3cd';
        demoAlert.style.border = '1px solid #ffeaa7';
        demoAlert.innerHTML = `
            <h2>🚀 Setup Instructions</h2>
            <p>To use this dashboard:</p>
            <ol>
                <li>Create a Supabase project at <a href="https://supabase.com" target="_blank">supabase.com</a></li>
                <li>Run the SQL from <code>backend/schema.sql</code> in the SQL Editor</li>
                <li>Update <code>app.js</code> with your Supabase URL and anon key</li>
                <li>Open <code>frontend/index.html</code> in your browser</li>
            </ol>
            <p><strong>Demo Mode Active</strong> - Forms will not submit until configured</p>
        `;
        container.insertBefore(demoAlert, container.firstChild);
    });
}
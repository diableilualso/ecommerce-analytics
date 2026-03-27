// Supabase Connection Test Script
// Run with: node test-supabase.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://15340370275.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

console.log('🔍 Testing Supabase Connection...');
console.log(`📍 URL: ${supabaseUrl}`);
console.log(`🔑 Key: ${supabaseKey.substring(0, 20)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Query the users table
    console.log('\n📊 Test 1: Querying users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (usersError) {
      console.log(`❌ Users table error: ${usersError.message}`);
      console.log(`   Code: ${usersError.code}`);
    } else {
      console.log(`✅ Users table accessible! Found ${users?.length || 0} users`);
    }

    // Test 2: Check if tables exist by querying with .select on different tables
    console.log('\n📊 Test 2: Checking available tables...');
    const tables = ['users', 'ecommerce_data', 'analysis_results', 'reports', 'templates'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('id').limit(1);
        if (error) {
          console.log(`   ${table}: ❌ ${error.message}`);
        } else {
          console.log(`   ${table}: ✅ exists`);
        }
      } catch (e) {
        console.log(`   ${table}: ❌ ${e.message}`);
      }
    }

    // Test 3: Try to get service role key status
    console.log('\n🔐 Test 3: Connection details:');
    console.log(`   Project URL: ${supabaseUrl}`);
    console.log(`   Key prefix: ${supabaseKey.substring(0, 10)}...`);
    console.log(`   Key format appears: ${supabaseKey.startsWith('eyJ') ? '✅ Valid JWT' : '⚠️  May not be standard JWT'}`);

    console.log('\n✨ Connection test complete!');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error(`Error: ${error.message}`);
    if (error.message.includes('JWT')) {
      console.log('\n💡 The key format looks incorrect.');
      console.log('   Expected: A JWT starting with "eyJ..."');
      console.log('   Got: Key starting with "' + supabaseKey.substring(0, 15) + '"');
    }
  }
}

testConnection();

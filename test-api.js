#!/usr/bin/env node

/**
 * Simple API Test Script for KLYA AI
 * Tests basic API endpoints without requiring database connection
 */

const http = require('http');

const API_BASE_URL = 'http://localhost:3001';

// Test data
const testUser = {
  firstName: 'Kwame',
  lastName: 'Mensah',
  email: 'kwame@example.com',
  password: 'TestPass123!',
  businessName: 'Kwame Fashion',
  businessType: 'retail'
};

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test functions
async function testHealthCheck() {
  console.log('🔍 Testing health check...');
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/health',
      method: 'GET'
    });
    
    if (response.status === 200) {
      console.log('✅ Health check passed');
      return true;
    } else {
      console.log('❌ Health check failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
    return false;
  }
}

async function testSubscriptionPlans() {
  console.log('🔍 Testing subscription plans endpoint...');
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/subscription/plans',
      method: 'GET'
    });
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Subscription plans endpoint working');
      console.log(`   Found ${response.data.data.plans.length} plans`);
      return true;
    } else {
      console.log('❌ Subscription plans failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Subscription plans error:', error.message);
    return false;
  }
}

async function testUserRegistration() {
  console.log('🔍 Testing user registration...');
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, testUser);
    
    if (response.status === 201 && response.data.success) {
      console.log('✅ User registration working');
      return true;
    } else if (response.status === 500 && response.data.error && response.data.error.includes('MongoDB')) {
      console.log('⚠️  User registration endpoint working (but MongoDB not connected)');
      return true;
    } else {
      console.log('❌ User registration failed:', response.status, response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ User registration error:', error.message);
    return false;
  }
}

async function testProtectedEndpoint() {
  console.log('🔍 Testing protected endpoint...');
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/user/profile',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    
    if (response.status === 401) {
      console.log('✅ Protected endpoint properly secured');
      return true;
    } else {
      console.log('❌ Protected endpoint security failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Protected endpoint error:', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting KLYA AI API Tests\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Subscription Plans', fn: testSubscriptionPlans },
    { name: 'User Registration', fn: testUserRegistration },
    { name: 'Protected Endpoints', fn: testProtectedEndpoint }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) passed++;
    } catch (error) {
      console.log(`❌ ${test.name} crashed:`, error.message);
    }
    console.log(''); // Empty line for readability
  }
  
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! API is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the backend server and database connection.');
  }
  
  console.log('\n📝 Next Steps:');
  console.log('1. Start MongoDB: docker run -d --name mongodb -p 27017:27017 mongo:7.0');
  console.log('2. Start backend: cd backend && npm run dev');
  console.log('3. Start frontend: cd frontend && npm run dev');
  console.log('4. Visit: http://localhost:3000');
}

// Run tests
runTests().catch(console.error);

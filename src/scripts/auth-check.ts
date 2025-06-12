#!/usr/bin/env node

import { fetch } from '@whatwg-node/fetch';

interface AuthCheckResult {
  success: boolean;
  message: string;
  projectName: string;
  pageCount?: number;
}

async function checkAuth(): Promise<void> {
  const projectName = process.env.COSENSE_PROJECT_NAME;
  const apiDomain = process.env.API_DOMAIN || 'scrapbox.io';
  
  if (!projectName) {
    console.error('Error: COSENSE_PROJECT_NAME environment variable is not set');
    process.exit(1);
  }

  const url = `https://${apiDomain}/api/pages/${projectName}?limit=1`;
  
  console.log(`Checking authentication for project: ${projectName}`);
  console.log(`API URL: ${url}`);

  try {
    // First attempt without authentication
    const headers: Record<string, string> = {};
    
    // If COSENSE_SID exists, use it
    if (process.env.COSENSE_SID) {
      headers['Cookie'] = `connect.sid=${process.env.COSENSE_SID}`;
      console.log('Using existing COSENSE_SID for authentication');
    }

    const response = await fetch(url, { headers });

    if (response.ok) {
      const data = await response.json() as { count?: number };
      console.log('\n✅ Authentication successful!');
      console.log(`Project "${projectName}" is accessible`);
      console.log(`Found ${data.count || 0} pages`);
      
      if (process.env.COSENSE_SID) {
        console.log('Authentication token (COSENSE_SID) is valid');
      } else {
        console.log('Project is public - no authentication needed');
      }
      
      process.exit(0);
    } else if (response.status === 401) {
      console.log('\n⚠️  Authentication required (401 Unauthorized)');
      
      if (!process.env.COSENSE_SID) {
        console.log('\nAttempting to retrieve authentication information...');
        console.log('\nThis project requires authentication.');
        console.log('Please follow these steps to get your session ID:');
        console.log(`\n1. Open your browser and go to: https://${apiDomain}/${projectName}`);
        console.log('2. Log in to your account if not already logged in');
        console.log('3. Open Developer Tools (F12)');
        console.log(`4. Go to Application/Storage > Cookies > https://${apiDomain}`);
        console.log('5. Find the "connect.sid" cookie and copy its value');
        console.log('6. Add to your .env file: COSENSE_SID=your-cookie-value');
        console.log('7. Run this command again');
      } else {
        console.log('\nYour authentication token (COSENSE_SID) may be expired or invalid.');
        console.log('Current SID: ' + process.env.COSENSE_SID.substring(0, 10) + '...');
        console.log('\nPlease get a fresh token by following these steps:');
        console.log(`1. Open your browser and go to: https://${apiDomain}/${projectName}`);
        console.log('2. Make sure you are logged in');
        console.log('3. Open Developer Tools > Application > Cookies');
        console.log('4. Copy the new "connect.sid" value');
        console.log('5. Update your .env file with the new value');
      }
      
      process.exit(1);
    } else if (response.status === 404 || response.status === 403) {
      console.log('\n❌ Authentication failed!');
      console.log(`Status: ${response.status}`);
      
      if (response.status === 404) {
        console.log('\nProject not found. Please check:');
        console.log('- Project name is correct: ' + projectName);
        console.log('- You have access to this project');
      } else {
        console.log('\nAccess forbidden. You may not have permission to access this project.');
      }
      
      process.exit(1);
    } else {
      console.error(`\n❌ Unexpected error: ${response.status} ${response.statusText}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Network error:', (error as Error).message);
    console.error('Please check your internet connection and try again');
    process.exit(1);
  }
}

// Run the check
checkAuth();
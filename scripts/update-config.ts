#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

interface MCPConfig {
  mcpServers?: {
    [key: string]: {
      command: string;
      args: string[];
      env?: Record<string, string>;
    };
  };
}

function getConfigPath(): string {
  const platform = process.platform;
  if (platform === 'darwin') {
    return join(homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  } else if (platform === 'win32') {
    return join(process.env.APPDATA || '', 'Claude', 'claude_desktop_config.json');
  }
  throw new Error('Unsupported platform');
}

function updateSID(newSID: string): void {
  const configPath = getConfigPath();
  
  try {
    // Read existing config
    const configContent = readFileSync(configPath, 'utf-8');
    const config: MCPConfig = JSON.parse(configContent);
    
    // Find scrapbox-cosense-mcp server
    const serverConfig = config.mcpServers?.['scrapbox-cosense-mcp'];
    
    if (!serverConfig) {
      console.error('❌ scrapbox-cosense-mcp not found in claude_desktop_config.json');
      console.log('\nPlease add the server configuration first.');
      process.exit(1);
    }
    
    // Update SID
    if (!serverConfig.env) {
      serverConfig.env = {};
    }
    
    const oldSID = serverConfig.env.COSENSE_SID;
    serverConfig.env.COSENSE_SID = newSID;
    
    // Write back
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    console.log('✅ Successfully updated COSENSE_SID');
    if (oldSID) {
      console.log(`Old SID: ${oldSID.substring(0, 10)}...`);
    }
    console.log(`New SID: ${newSID.substring(0, 10)}...`);
    console.log('\n⚠️  Please restart Claude Desktop for changes to take effect');
    
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      console.error('❌ claude_desktop_config.json not found');
      console.log(`Expected location: ${configPath}`);
    } else {
      console.error('❌ Error updating config:', (error as Error).message);
    }
    process.exit(1);
  }
}

// Command line interface
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: npm run update:sid <new-sid-value>');
  console.log('\nExample:');
  console.log('  npm run update:sid s%3A1234567890abcdef');
  console.log('\nTo get your SID:');
  console.log('  1. Open Scrapbox in browser');
  console.log('  2. Open DevTools > Application > Cookies');
  console.log('  3. Copy the "connect.sid" value');
  process.exit(0);
}

const newSID = args[0];
updateSID(newSID);
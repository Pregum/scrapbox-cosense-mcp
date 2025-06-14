import { ShowSidHelpRequest, ShowSidHelpResponse } from '../../types/handlers.js';

export async function handleShowSidHelp(
  args: ShowSidHelpRequest,
  projectName: string,
  apiDomain: string = 'scrapbox.io'
): Promise<ShowSidHelpResponse> {
  const { browser = 'chrome' } = args;

  const projectUrl = `https://${apiDomain}/${projectName}`;

  const instructions = {
    chrome: [
      `1. Open Chrome and navigate to: ${projectUrl}`,
      '2. Log in to your Scrapbox account if not already logged in',
      '3. Open Developer Tools:',
      '   - Windows/Linux: Press F12 or Ctrl+Shift+I',
      '   - Mac: Press Cmd+Option+I',
      '4. Go to the "Application" tab (or "Storage" tab in some versions)',
      '5. In the left sidebar, expand "Cookies" > `https://' + apiDomain + '`',
      '6. Find the cookie named "connect.sid"',
      '7. Click on it and copy the entire "Value" field',
      '8. The value should look like: s%3Axxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ],
    firefox: [
      `1. Open Firefox and navigate to: ${projectUrl}`,
      '2. Log in to your Scrapbox account if not already logged in',
      '3. Open Developer Tools:',
      '   - Windows/Linux: Press F12 or Ctrl+Shift+I',
      '   - Mac: Press Cmd+Option+I',
      '4. Go to the "Storage" tab',
      '5. In the left sidebar, expand "Cookies" > `https://' + apiDomain + '`',
      '6. Find the cookie named "connect.sid"',
      '7. Click on it and copy the "Value" field from the right panel',
      '8. The value should look like: s%3Axxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ],
    safari: [
      `1. Open Safari and navigate to: ${projectUrl}`,
      '2. Log in to your Scrapbox account if not already logged in',
      '3. Enable Developer Menu (if not already enabled):',
      '   - Go to Safari > Preferences > Advanced',
      '   - Check "Show Develop menu in menu bar"',
      '4. Open Web Inspector:',
      '   - Press Cmd+Option+I or use Develop > Show Web Inspector',
      '5. Go to the "Storage" tab',
      '6. In the left sidebar, click on "Cookies"',
      '7. Find the cookie named "connect.sid" for ' + apiDomain,
      '8. Double-click the "Value" field and copy it',
      '9. The value should look like: s%3Axxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ],
    edge: [
      `1. Open Edge and navigate to: ${projectUrl}`,
      '2. Log in to your Scrapbox account if not already logged in',
      '3. Open Developer Tools:',
      '   - Windows/Linux: Press F12 or Ctrl+Shift+I',
      '   - Mac: Press Cmd+Option+I',
      '4. Go to the "Application" tab',
      '5. In the left sidebar, expand "Storage" > "Cookies" > `https://' + apiDomain + '`',
      '6. Find the cookie named "connect.sid"',
      '7. Click on it and copy the entire "Value" field',
      '8. The value should look like: s%3Axxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ],
  };

  const quickMethod = [
    '\n=== Note ===',
    'The connect.sid cookie is HttpOnly and cannot be accessed via JavaScript.',
    'You must use the Developer Tools method described above to view and copy the cookie value.',
    '',
    'The cookie value should look like:',
    's%3A07ThcoUacwzZ0HoabS5L-aoo325zt9gU.6%2FHbP9x7C9%2BLjr6tVtlX1Vs0flSTK0Alb%2BdTOaE0Rz0',
    '',
    'Make sure to copy the ENTIRE value including the "s%3A" prefix.',
  ];

  const browserInstructions = instructions[browser.toLowerCase() as keyof typeof instructions] || instructions.chrome;

  return {
    browser: browser,
    projectUrl: projectUrl,
    instructions: [...browserInstructions, ...quickMethod].join('\n'),
    quickCommand: 'N/A - HttpOnly cookie cannot be accessed via JavaScript',
  };
}
import { UpdateSidRequest, UpdateSidResponse } from '../../types/handlers.js';

export async function handleUpdateSid(
  args: UpdateSidRequest,
  currentSid?: string
): Promise<UpdateSidResponse> {
  const { sid } = args;

  if (!sid || sid.trim() === '') {
    throw new Error('Session ID cannot be empty');
  }

  // Validate SID format (basic check)
  if (!sid.includes('%')) {
    console.warn('Warning: Session ID might be incorrectly formatted. It should be URL-encoded (e.g., s%3A...)');
  }

  // Store the old SID for comparison
  const oldSid = currentSid || process.env.COSENSE_SID;

  // Update the environment variable for current session
  process.env.COSENSE_SID = sid;

  // Log the change
  console.log(`Session ID updated successfully`);
  if (oldSid) {
    console.log(`Old SID: ${oldSid.substring(0, 10)}...`);
  }
  console.log(`New SID: ${sid.substring(0, 10)}...`);

  return {
    success: true,
    message: 'Session ID updated successfully for current session',
    oldSid: oldSid ? `${oldSid.substring(0, 10)}...` : undefined,
    newSid: `${sid.substring(0, 10)}...`,
    note: 'This update is temporary and only affects the current MCP session. To make it permanent, update your Claude Desktop configuration or .env file.',
  };
}
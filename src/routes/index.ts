import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { handleListPages } from './handlers/list-pages.js';
import { handleGetPage } from './handlers/get-page.js';
import { handleSearchPages } from './handlers/search-pages.js';
import { handleCreatePage } from './handlers/create-page.js';
import { handleUpdateSid } from './handlers/update-sid.js';
import { handleShowSidHelp } from './handlers/show-sid-help.js';

export function setupRoutes(
  server: Server,
  config: {
    projectName: string;
    cosenseSid?: string;
  }
) {
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { projectName, cosenseSid } = config;

    switch (request.params.name) {
      case "list_pages":
        return handleListPages(
          projectName,
          cosenseSid,
          request.params.arguments || {}
        );

      case "get_page":
        return handleGetPage(
          projectName,
          cosenseSid,
          {
            pageTitle: String(request.params.arguments?.pageTitle)
          }
        );

      case "search_pages":
        return handleSearchPages(
          projectName,
          cosenseSid,
          {
            query: String(request.params.arguments?.query)
          }
        );

      case "create_page":
        return handleCreatePage(
          projectName,
          cosenseSid,
          {
            title: String(request.params.arguments?.title),
            body: request.params.arguments?.body as string | undefined
          }
        );

      case "update_sid":
        const result = await handleUpdateSid(
          {
            sid: String(request.params.arguments?.sid)
          },
          cosenseSid
        );
        
        // Update the config with new SID for subsequent requests
        config.cosenseSid = request.params.arguments?.sid as string;
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result, null, 2)
          }]
        };

      case "show_sid_help":
        const helpResult = await handleShowSidHelp(
          {
            browser: request.params.arguments?.browser as string | undefined
          },
          projectName,
          process.env.API_DOMAIN || 'scrapbox.io'
        );
        
        return {
          content: [{
            type: "text",
            text: helpResult.instructions
          }]
        };

      default:
        return {
          content: [{
            type: "text",
            text: [
              'Error details:',
              'Message: Unknown tool requested',
              `Tool: ${request.params.name}`,
              `Timestamp: ${new Date().toISOString()}`
            ].join('\n')
          }],
          isError: true
        };
    }
  });
}

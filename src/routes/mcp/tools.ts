import { FastifyInstance } from 'fastify'
import { ListToolsRequest, ListToolsResult, JSONRPC_VERSION } from '../../modelcontextprotocol/schema'

interface ToolsRPC {
    jsonrpc: '2.0'
    id: string | number
    method: 'tools/list'
    params: ListToolsRequest['params']
}
  
export default async function registerToolsRoute(fastify: FastifyInstance) {
  fastify.post('/mcp/tools/list', async (request, reply) => {
    console.debug('Received request at /mcp/tools/list', { body: request.body });

    const body = request.body as ToolsRPC;

    if (body?.method !== 'tools/list') {
      console.warn('Invalid ToolsRequest', { method: body?.method });
      return reply.status(400).send({ error: 'Invalid ToolsRequest' });
    }

    console.debug('Valid ToolsRequest received', { method: body.method });

    const result: ListToolsResult = {
      tools: [{
        name: 'getWeather',
        description: 'Fetch weather data for a given city',
        inputSchema: {
          type: 'object',
          properties: { city: { type: 'string' } },
          required: ['city']
        }
      }]
    };

    console.debug('Constructed ListToolsResult', { result });

    return reply.send({ jsonrpc: JSONRPC_VERSION, id: body.id ?? 'tools-1', result });
  });
}

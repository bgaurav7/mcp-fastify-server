import { FastifyInstance } from 'fastify'
import { ListPromptsRequest, ListPromptsResult, JSONRPC_VERSION } from '../../modelcontextprotocol/schema'

interface PromptsRPC {
    jsonrpc: '2.0'
    id: string | number
    method: 'prompts/list'
    params: ListPromptsRequest['params']
}

export default async function registerPromptsRoute(fastify: FastifyInstance) {
  fastify.post('/mcp/prompts/list', async (request, reply) => {
    console.debug('Received request at /mcp/prompts/list', { body: request.body });

    const body = request.body as PromptsRPC;

    if (body?.method !== 'prompts/list') {
      console.warn('Invalid PromptsRequest', { method: body?.method });
      return reply.status(400).send({ error: 'Invalid PromptsRequest' });
    }

    console.debug('Valid PromptsRequest received', { method: body.method });

    const result: ListPromptsResult = {
      prompts: [{
        name: 'welcome',
        description: 'Welcome message prompt',
        arguments: [{ name: 'userName', required: true }]
      }]
    };

    console.debug('Constructed ListPromptsResult', { result });

    return reply.send({ jsonrpc: JSONRPC_VERSION, id: body.id ?? 'prompts-1', result });
  });
}

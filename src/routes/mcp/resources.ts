import { FastifyInstance } from 'fastify'
import { ListResourcesRequest, ListResourcesResult, JSONRPC_VERSION } from '../../modelcontextprotocol/schema'

interface ResourcesRPC {
    jsonrpc: '2.0'
    id: string | number
    method: 'resources/list'
    params: ListResourcesRequest['params']
}
  
export default async function registerResourcesRoute(fastify: FastifyInstance) {
  fastify.post('/mcp/resources/list', async (request, reply) => {
    console.debug('Received request at /mcp/resources/list', { body: request.body });

    const body = request.body as ResourcesRPC;

    if (body?.method !== 'resources/list') {
      console.warn('Invalid ResourcesRequest', { method: body?.method });
      return reply.status(400).send({ error: 'Invalid ResourcesRequest' });
    }

    console.debug('Valid ResourcesRequest received', { method: body.method });

    const result: ListResourcesResult = {
      resources: [{
        uri: 'file://documents/example.md',
        name: 'Example Doc',
        description: 'A sample resource',
        mimeType: 'text/markdown'
      }]
    };

    console.debug('Constructed ListResourcesResult', { result });

    return reply.send({ jsonrpc: JSONRPC_VERSION, id: body.id ?? 'resources-1', result });
  });
}

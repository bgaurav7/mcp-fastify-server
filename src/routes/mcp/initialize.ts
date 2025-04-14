import { FastifyInstance } from 'fastify'
import { InitializeRequest, InitializeResult, JSONRPC_VERSION } from '../../modelcontextprotocol/schema'

interface InitializeRPC {
    jsonrpc: '2.0'
    id: string | number
    method: 'initialize'
    params: InitializeRequest['params']
}

export default async function registerInitializeRoute(fastify: FastifyInstance) {
  fastify.post('/mcp/initialize', async (request, reply) => {
    console.debug('Received request at /mcp/initialize', { body: request.body });

    const body = request.body as InitializeRPC;

    if (body?.method !== 'initialize' || !body?.params?.protocolVersion) {
      console.warn('Invalid InitializeRequest', { method: body?.method, protocolVersion: body?.params?.protocolVersion });
      return reply.status(400).send({ error: 'Invalid InitializeRequest' });
    }

    console.debug('Valid InitializeRequest received', { protocolVersion: body.params.protocolVersion });

    const result: InitializeResult = {
      protocolVersion: body.params.protocolVersion,
      capabilities: {
        experimental: { echo: { enabled: true } },
        prompts: { listChanged: true },
        tools: { listChanged: true },
      },
      serverInfo: { name: 'MCP Fastify Server', version: '1.0.0' }
    };

    console.debug('Constructed InitializeResult', { result });

    return reply.send({ jsonrpc: JSONRPC_VERSION, id: body.id ?? 'init-1', result });
  });
}
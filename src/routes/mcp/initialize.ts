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
    const body = request.body as InitializeRPC

    if (body?.method !== 'initialize' || !body?.params?.protocolVersion) {
      return reply.status(400).send({ error: 'Invalid InitializeRequest' })
    }

    const result: InitializeResult = {
      protocolVersion: body.params.protocolVersion,
      capabilities: {
        experimental: { echo: { enabled: true } },
        prompts: { listChanged: true },
        tools: { listChanged: true },
      },
      serverInfo: { name: 'MCP Fastify Server', version: '1.0.0' }
    }

    return reply.send({ jsonrpc: JSONRPC_VERSION, id: body.id ?? 'init-1', result })
  })
}

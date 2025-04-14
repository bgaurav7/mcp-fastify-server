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
    const body = request.body as PromptsRPC

    const result: ListPromptsResult = {
      prompts: [{
        name: 'welcome',
        description: 'Welcome message prompt',
        arguments: [{ name: 'userName', required: true }]
      }]
    }

    return reply.send({ jsonrpc: JSONRPC_VERSION, id: body.id ?? 'prompts-1', result })
  })
}

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
    const body = request.body as ToolsRPC

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
    }

    return reply.send({ jsonrpc: JSONRPC_VERSION, id: body.id ?? 'tools-1', result })
  })
}

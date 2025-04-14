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
    const body = request.body as ResourcesRPC

    const result: ListResourcesResult = {
      resources: [{
        uri: 'file://documents/example.md',
        name: 'Example Doc',
        description: 'A sample resource',
        mimeType: 'text/markdown'
      }]
    }

    return reply.send({ jsonrpc: JSONRPC_VERSION, id: body.id ?? 'resources-1', result })
  })
}

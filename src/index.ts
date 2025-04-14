import Fastify from 'fastify'
import { mcpRoutes } from './routes/index'

const app = Fastify({ logger: true })
app.register(mcpRoutes)

app.listen({ port: 3000 }, err => {
  if (err) throw err
  console.log('🚀 MCP server running on http://localhost:3000')
})
// src/routes/mcp.ts
import { FastifyInstance } from 'fastify'
import registerInitializeRoute from './mcp/initialize'
import registerResourcesRoute from './mcp/resources'
import registerToolsRoute from './mcp/tools'
import registerPromptsRoute from './mcp/prompts'
import registerWeatherToolRoute from './mcp/weatherTool'

export async function mcpRoutes(fastify: FastifyInstance) {
  await registerInitializeRoute(fastify)
  await registerResourcesRoute(fastify)
  await registerToolsRoute(fastify)
  await registerPromptsRoute(fastify)
  await registerWeatherToolRoute(fastify)
}
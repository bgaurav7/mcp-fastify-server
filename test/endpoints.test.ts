import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import Fastify from 'fastify'
import registerInitializeRoute from '../src/routes/mcp/initialize'
import registerPromptsRoute from '../src/routes/mcp/prompts'
import registerResourcesRoute from '../src/routes/mcp/resources'
import registerToolsRoute from '../src/routes/mcp/tools'

describe('MCP Endpoints', () => {
  const server = Fastify()
  
  beforeAll(async () => {
    await registerInitializeRoute(server)
    await registerPromptsRoute(server)
    await registerResourcesRoute(server)
    await registerToolsRoute(server)
  })

  afterAll(async () => {
    await server.close()
  })

  describe('Initialize Endpoint', () => {
    it('should handle valid initialization request', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/mcp/initialize',
        payload: {
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: { protocolVersion: '0.1.0' }
        }
      })
      
      expect(response.statusCode).toBe(200)
      const json = JSON.parse(response.body)
      expect(json.result.protocolVersion).toBe('0.1.0')
      expect(json.result.capabilities).toBeDefined()
    })

    it('should return 400 for invalid protocol version', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/mcp/initialize',
        payload: {
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {}
        }
      })
      expect(response.statusCode).toBe(400)
    })
  })

  describe('Prompts Endpoint', () => {
    it('should handle valid prompts list request', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/mcp/prompts/list',
        payload: {
          jsonrpc: '2.0',
          id: 1,
          method: 'prompts/list',
          params: {}
        }
      })
      
      expect(response.statusCode).toBe(200)
      const json = JSON.parse(response.body)
      expect(Array.isArray(json.result.prompts)).toBe(true)
    })
  })

  describe('Resources Endpoint', () => {
    it('should handle valid resources list request', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/mcp/resources/list',
        payload: {
          jsonrpc: '2.0',
          id: 1,
          method: 'resources/list',
          params: {}
        }
      })
      
      expect(response.statusCode).toBe(200)
      const json = JSON.parse(response.body)
      expect(Array.isArray(json.result.resources)).toBe(true)
    })
  })

  describe('Tools Endpoint', () => {
    it('should handle valid tools list request', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/mcp/tools/list',
        payload: {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list',
          params: {}
        }
      })
      
      expect(response.statusCode).toBe(200)
      const json = JSON.parse(response.body)
      expect(Array.isArray(json.result.tools)).toBe(true)
    })

    it('should return 400 for invalid method', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/mcp/tools/list',
        payload: {
          jsonrpc: '2.0',
          id: 1,
          method: 'invalid/method',
          params: {}
        }
      })
      expect(response.statusCode).toBe(400)
    })
  })
})
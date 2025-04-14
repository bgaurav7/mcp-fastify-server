import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import Fastify from 'fastify'
import { mcpRoutes } from '../src/routes/index'

let server: Awaited<ReturnType<typeof Fastify>>

beforeAll(async () => {
  server = Fastify()
  await server.register(mcpRoutes)
  await server.ready()
  console.log(server.printRoutes())
})

afterAll(async () => {
  await server.close()
})

describe('Weather Tool API - Error Scenarios', () => {
    it('should return 400 for invalid method', async () => {
      const response = await server.inject({
          method: 'POST',
          url: '/mcp/tools/call',
          payload: {
              jsonrpc: '2.0',
              id: 1,
              method: 'invalid/method',
              params: {
                  name: 'getWeather',
                  arguments: {
                      city: 'London'
                  }
              }
          }
      })

      expect(response.statusCode).toBe(400)
      const json = JSON.parse(response.body)
      expect(json.error).toBe('Invalid method or tool')
    })

    it('should return 400 for invalid tool name', async () => {
      const response = await server.inject({
          method: 'POST',
          url: '/mcp/tools/call',
          payload: {
              jsonrpc: '2.0',
              id: 1,
              method: 'tools/call',
              params: {
                  name: 'invalidTool',
                  arguments: {
                      city: 'London'
                  }
              }
          }
      })

      expect(response.statusCode).toBe(400)
      const json = JSON.parse(response.body)
      expect(json.error).toBe('Invalid method or tool')
    })

    it('should return 500 if API key is missing', async () => {
      delete process.env.OPENWEATHER_API_KEY

      const response = await server.inject({
          method: 'POST',
          url: '/mcp/tools/call',
          payload: {
              jsonrpc: '2.0',
              id: 1,
              method: 'tools/call',
              params: {
                  name: 'getWeather',
                  arguments: {
                      city: 'London'
                  }
              }
          }
      })

      expect(response.statusCode).toBe(500)
      const json = JSON.parse(response.body)
      expect(json.error).toBe('API key missing')
    })

    it('should return 500 if weather API request fails', async () => {
      process.env.OPENWEATHER_API_KEY = 'invalid_api_key'

      const response = await server.inject({
          method: 'POST',
          url: '/mcp/tools/call',
          payload: {
              jsonrpc: '2.0',
              id: 1,
              method: 'tools/call',
              params: {
                  name: 'getWeather',
                  arguments: {
                      city: 'InvalidCity'
                  }
              }
          }
      })

      expect(response.statusCode).toBe(500)
      const json = JSON.parse(response.body)
      expect(json.error).toBe('Failed to fetch weather')
    })
})

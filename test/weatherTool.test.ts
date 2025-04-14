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

describe('Weather Tool API', () => {
  it('should return weather info for a city', async () => {
    process.env.OPENWEATHER_API_KEY = 'your_test_api_key_here' // Replace this with a real key

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

    expect(response.statusCode).toBe(200)
    const json = JSON.parse(response.body)
    expect(json.result.content[0].text).toMatch(/temperature in London/i)
  })
})

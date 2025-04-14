import { FastifyInstance } from 'fastify'
import axios from 'axios'
import { CallToolRequest, CallToolResult, JSONRPC_VERSION } from '../../modelcontextprotocol/schema'

interface CallToolRPC {
    jsonrpc: '2.0'
    id: string | number
    method: 'tools/call'
    params: CallToolRequest['params']
}

export default async function registerWeatherToolRoute(fastify: FastifyInstance) {
  fastify.post('/mcp/tools/call', async (request, reply) => {
    const body = request.body as CallToolRPC

    if (body.method !== 'tools/call' || body.params.name !== 'getWeather') {
      return reply.status(400).send({ error: 'Invalid method or tool' })
    }

    const city = body.params.arguments?.city as string
    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) return reply.status(500).send({ error: 'API key missing' })

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
      const res = await axios.get(url)

      const result: CallToolResult = {
        content: [{
          type: 'text',
          text: `The current temperature in ${city} is ${res.data.main.temp}°C with ${res.data.weather[0].description}.`
        }]
      }

      return reply.send({ jsonrpc: JSONRPC_VERSION, id: body.id ?? 'weather-1', result })
    } catch (err) {
      return reply.status(500).send({ error: 'Failed to fetch weather' })
    }
  })
}

import { FastifyInstance } from 'fastify'
import axios from 'axios'
import { CallToolRequest, CallToolResult, JSONRPC_VERSION } from '../../modelcontextprotocol/schema'
import * as dotenv from 'dotenv';
dotenv.config();

interface CallToolRPC {
    jsonrpc: '2.0'
    id: string | number
    method: 'tools/call'
    params: CallToolRequest['params']
}

export default async function registerWeatherToolRoute(fastify: FastifyInstance) {
  fastify.post('/mcp/tools/call', async (request, reply) => {
    console.debug('Received request at /mcp/tools/call', { body: request.body });

    const body = request.body as CallToolRPC;

    if (body.method !== 'tools/call' || body.params.name !== 'getWeather') {
        console.warn('Invalid method or tool', { method: body.method, toolName: body.params.name });
        return reply.status(400).send({ error: 'Invalid method or tool' });
    }

    const city = body.params.arguments?.city as string;
    console.debug('Extracted city from request', { city });

    const apiKey = process.env.OPENWEATHER_API_KEY;
    console.log("OPENWEATHER_API_KEY=", apiKey); // Should print the API key
    if (!apiKey) {
        console.error('API key is missing in environment variables');
        return reply.status(500).send({ error: 'API key missing' });
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
        console.debug('Constructed OpenWeather API URL', { url });

        const res = await axios.get(url);
        console.debug('Received response from OpenWeather API', { data: res.data });

        const result: CallToolResult = {
            content: [{
                type: 'text',
                text: `The current temperature in ${city} is ${res.data.main.temp}°C with ${res.data.weather[0].description}.`
            }]
        };

        console.debug('Constructed result object', { result });
        return reply.send({ jsonrpc: JSONRPC_VERSION, id: body.id ?? 'weather-1', result });
    } catch (err) {
        console.error('Error occurred while fetching weather data', { error: err });
        return reply.status(500).send({ error: 'Failed to fetch weather' });
    }
  })
}

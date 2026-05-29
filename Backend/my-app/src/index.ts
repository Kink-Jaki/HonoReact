import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/api/*', cors({
  origin: 'http://localhost:5173'
}))

app.get('/', (c) => {
  return c.json({ message: 'Hello dari Hono!' })
})

export default app
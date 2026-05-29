import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import Database from 'bun-sqlite'

const app = new Hono()
const db = new Database('app.db')

// middleware cors
app.use('/api/*', cors({
  origin: 'http://localhost:5173'
}))

// buat table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL
  )
`)

// get all
app.get('/api/users', (c) => {
  const users = db.prepare('SELECT * FROM users').all()
  return c.json(users)
})

// get one
app.get('/api/users/:id', (c) => {
  const id = Number(c.req.param('id'))
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  if (!user) return c.json({ message: 'not found' }, 404)
  return c.json(user)
})

// create
app.post('/api/users', async (c) => {
  const { name, email } = await c.req.json()
  const result = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').run(name, email)
  return c.json({ id: result.lastInsertRowid, name, email }, 201)
})

// update
app.patch('/api/users/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const { name, email } = await c.req.json()
  db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').run(name, email, id)
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  return c.json(user)
})

// delete
app.delete('/api/users/:id', (c) => {
  const id = Number(c.req.param('id'))
  db.prepare('DELETE FROM users WHERE id = ?').run(id)
  return c.json({ message: 'deleted' })
})

serve({ fetch: app.fetch, port: 3000 })
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { verify, sign } from 'hono/jwt' // Impor verify, bukan jwt
import { Database } from 'bun:sqlite'

const app = new Hono()
const db = new Database('app.db')

const JWT_SECRET = 'sangat-rahasia-sekali-123'

app.use('/api/*', cors({ origin: '*' }))
// ==========================================
// MIDDLEWARE JWT KUSTOM (Anti-Error TypeScript)
// ==========================================
app.use('/api/users/*', async (c, next) => {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: 'Unauthorized: Token tidak ditemukan' }, 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    // Fungsi verify bawaan hono menerima string biasa, jadi aman dari SignatureKey error
    const payload = await verify(token, JWT_SECRET, 'HS256')
    c.set('jwtPayload', payload) // Simpan data user ke context jika butuh
    await next()
  } catch (error) {
    return c.json({ message: 'Unauthorized: Token tidak valid atau expired' }, 401)
  }
})

// Buat table jika belum ada
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`)

// ==========================================
// ENDPOINT PUBLIC
// ==========================================

app.post('/api/register', async (c) => {
  try {
    const { name, email, password } = await c.req.json()
    const result = db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?) RETURNING id').get([name, email, password]) as { id: number }
    return c.json({ id: result.id, name, email }, 201)
  } catch (error) {
    return c.json({ message: 'Email sudah terdaftar atau data tidak valid' }, 400)
  }
})

app.post('/api/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    const user = db.query('SELECT * FROM users WHERE email = ? AND password = ?').get([email, password]) as any

    if (!user) return c.json({ message: 'Email atau password salah' }, 401)

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2)
    }

    // Jika sign(...) di bawah ini merah, tambahkan 'as any' pada JWT_SECRET
    const token = await sign(payload, JWT_SECRET)

    return c.json({
      message: 'Login berhasil',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error) {
    return c.json({ message: 'Request tidak valid' }, 400)
  }
})

// ==========================================
// ENDPOINT PROTECTED
// ==========================================

app.get('/api/users', (c) => {
  const users = db.query('SELECT id, name, email FROM users').all()
  return c.json(users)
})

app.get('/api/users/:id', (c) => {
  const id = Number(c.req.param('id'))
  const user = db.query('SELECT id, name, email FROM users WHERE id = ?').get([id])
  if (!user) return c.json({ message: 'not found' }, 404)
  return c.json(user)
})

app.put('/api/users/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const { name, email } = await c.req.json()
  
  const userExists = db.query('SELECT id FROM users WHERE id = ?').get([id])
  if (!userExists) return c.json({ message: 'User not found' }, 404)

  db.query('UPDATE users SET name = ?, email = ? WHERE id = ?').get([name, email, id])
  const updatedUser = db.query('SELECT id, name, email FROM users WHERE id = ?').get([id])
  return c.json(updatedUser)
})

app.delete('/api/users/:id', (c) => {
  const id = Number(c.req.param('id'))
  const userExists = db.query('SELECT id FROM users WHERE id = ?').get([id])
  if (!userExists) return c.json({ message: 'User not found' }, 404)

  db.query('DELETE FROM users WHERE id = ?').get([id])
  return c.json({ message: 'deleted' })
})

export default {
  port: 3000,
  host: '0.0.0.0',
  fetch: app.fetch
}
import { Hono } from 'hono'
import { jwt, sign, verify } from 'hono/jwt'
import { z } from 'zod'
import { Database } from 'bun:sqlite'
import { cors } from 'hono/cors'

const app = new Hono()
const db  = new Database('db.sqlite')

const JWT_SECRET = 'rahasia_super_aman'

// ── Middleware CORS ─────────────────────────────
app.use('/api/*', cors({
  origin: 'http://localhost:5173'
}))


// ── Buat tabel ─────────────────────────────────
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT    NOT NULL,
    email    TEXT    NOT NULL UNIQUE,
    password TEXT    NOT NULL
  )
`)

// ── Schema Zod ─────────────────────────────────
const RegisterSchema = z.object({
  name:     z.string().min(2, 'Nama minimal 2 karakter'),
  email:    z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

const LoginSchema = z.object({
  email:    z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
})

const UserSchema = z.object({
  name:  z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
})

// ── REGISTER ───────────────────────────────────
app.post('/register', async (c) => {
  const body   = await c.req.json()
  const result = RegisterSchema.safeParse(body)
  if (!result.success) {
    return c.json({ error: result.error.flatten().fieldErrors }, 400)
  }

  const { name, email, password } = result.data
  const hashed = await Bun.password.hash(password)

  try {
    const user = db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?) RETURNING id, name, email'
    ).get(name, email, hashed)
    return c.json({ message: 'Registrasi berhasil', data: user }, 201)
  } catch {
    return c.json({ error: 'Email sudah digunakan' }, 409)
  }
})

// ── LOGIN ──────────────────────────────────────
app.post('/login', async (c) => {
  const body   = await c.req.json()
  const result = LoginSchema.safeParse(body)
  if (!result.success) {
    return c.json({ error: result.error.flatten().fieldErrors }, 400)
  }

  const { email, password } = result.data
  const user = db.query('SELECT * FROM users WHERE email = ?').get(email) as any

  if (!user) return c.json({ error: 'Email atau password salah' }, 401)

  const valid = await Bun.password.verify(password, user.password)
  if (!valid)  return c.json({ error: 'Email atau password salah' }, 401)

  const token = await sign({ id: user.id, email: user.email }, JWT_SECRET, 'HS256')
  return c.json({ message: 'Login berhasil', token })
})

// ── Middleware JWT — proteksi semua route /users ─
app.use('/users/*', jwt({ secret: JWT_SECRET, alg: 'HS256' }))
app.use('/users',   jwt({ secret: JWT_SECRET, alg: 'HS256' }))

// ── GET semua user ─────────────────────────────
app.get('/users', (c) => {
  const users = db.query('SELECT id, name, email FROM users').all()
  return c.json(users)
})

// ── GET satu user by ID ────────────────────────
app.get('/users/:id', (c) => {
  const id   = Number(c.req.param('id'))
  const user = db.query('SELECT id, name, email FROM users WHERE id = ?').get(id)
  if (!user) return c.json({ error: 'User tidak ditemukan' }, 404)
  return c.json(user)
})

// ── POST buat user baru ────────────────────────
app.post('/users', async (c) => {
  const body   = await c.req.json()
  const result = UserSchema.safeParse(body)
  if (!result.success) {
    return c.json({ error: result.error.flatten().fieldErrors }, 400)
  }

  const { name, email } = result.data

  try {
    const user = db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?) RETURNING id, name, email'
    ).get(name, email, '')
    return c.json(user, 201)
  } catch {
    return c.json({ error: 'Email sudah digunakan' }, 409)
  }
})

// ── PUT update seluruh data ────────────────────
app.put('/users/:id', async (c) => {
  const id     = Number(c.req.param('id'))
  const body   = await c.req.json()
  const result = UserSchema.safeParse(body)
  if (!result.success) {
    return c.json({ error: result.error.flatten().fieldErrors }, 400)
  }

  const { name, email } = result.data

  try {
    const user = db.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ? RETURNING id, name, email'
    ).get(name, email, id)
    if (!user) return c.json({ error: 'User tidak ditemukan' }, 404)
    return c.json(user)
  } catch {
    return c.json({ error: 'Email sudah digunakan' }, 409)
  }
})

// ── DELETE hapus user ──────────────────────────
app.delete('/users/:id', (c) => {
  const id   = Number(c.req.param('id'))
  const user = db.query('DELETE FROM users WHERE id = ? RETURNING id, name, email').get(id)
  if (!user) return c.json({ error: 'User tidak ditemukan' }, 404)
  return c.json({ message: 'Berhasil dihapus', data: user })
})

app.notFound((c) => c.json({ error: 'Route tidak ditemukan' }, 404))

export default { port: 3000, fetch: app.fetch }
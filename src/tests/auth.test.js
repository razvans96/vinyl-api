const request = require('supertest');
const app = require('../../app');
const User = require('../models/User');
const db = require('../config/database');

require('dotenv').config({ path: '../../.env.test' });

describe('Registro y login de usuarios', () => {
  beforeEach(async () => {
    // Antes de cada prueba, borramos todos los usuarios de la base de datos
    await User.deleteMany();
  });

  afterAll(async () => {
    await db.closeDB();
  });

  describe('POST /register', () => {
    it('debería registrar un nuevo usuario', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({ username: 'testuser', password: 'testpassword' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('username');
    });

    it('debería retornar un error si se intenta registrar un usuario con un nombre de usuario ya existente', async () => {
      // Primero, registramos un usuario con un nombre de usuario
      await request(app)
        .post('/api/register')
        .send({ username: 'testuser', password: 'testpassword' });

      // Luego, intentamos registrar otro usuario con el mismo nombre de usuario
      const response = await request(app)
        .post('/api/register')
        .send({ username: 'testuser', password: 'anotherpassword' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'El nombre de usuario ya está registrado');
    });
  });

  describe('POST /login', () => {
    it('debería permitir el inicio de sesión de un usuario registrado con credenciales válidas', async () => {
      // Primero, registramos un usuario con un nombre de usuario y contraseña
      await request(app)
        .post('/api/register')
        .send({ username: 'testuser', password: 'testpassword' });

      // Luego, intentamos iniciar sesión con las mismas credenciales
      const response = await request(app)
        .post('/api/login')
        .send({ username: 'testuser', password: 'testpassword' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('username');
    });

    it('debería retornar un error si se intenta iniciar sesión con credenciales inválidas', async () => {
        // Intentamos iniciar sesión con credenciales incorrectas
        const response = await request(app)
          .post('/api/login')
          .send({ username: 'testuser', password: 'incorrectpassword' });
    
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    });
  });
});
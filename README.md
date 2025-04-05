# Backend Authentication Project

## Descripción
Sistema de autenticación usando JWT con Express y MongoDB

## Instalación
```bash
npm install
```

## Variables de Entorno
Crear archivo `.env` con:
- MONGODB_URI=mongodb://localhost:27017/userdb
- JWT_SECRET=tu_secret_key
- PORT=8080

## Uso
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Rutas
- POST /api/sessions/register
- POST /api/sessions/login
- GET /api/sessions/current
- POST /api/sessions/logout

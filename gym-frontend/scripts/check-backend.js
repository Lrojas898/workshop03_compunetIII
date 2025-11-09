#!/usr/bin/env node

/**
 * BACKEND CONNECTION CHECKER
 *
 * Verifica que el backend esté disponible antes de iniciar el servidor de Next.js
 */

const http = require('http');

// Leer la URL del backend desde .env.local o usar el default
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Parsear la URL
const url = new URL(BACKEND_URL);
const options = {
  hostname: url.hostname,
  port: url.port,
  path: '/auth', // Endpoint que sabemos que existe
  method: 'GET',
  timeout: 5000
};

console.log('\n🔍 Verificando conexión al backend...');
console.log(`📡 Backend URL: ${BACKEND_URL}`);

const req = http.request(options, (res) => {
  if (res.statusCode === 200 || res.statusCode === 401 || res.statusCode === 403) {
    // 200, 401 o 403 significa que el backend está respondiendo
    console.log('✅ Backend conectado correctamente');
    console.log(`   Status: ${res.statusCode}`);
    console.log('🚀 Iniciando Next.js...\n');
    process.exit(0);
  } else {
    console.error(`⚠️  Backend respondió con status: ${res.statusCode}`);
    console.log('🚀 Iniciando Next.js de todas formas...\n');
    process.exit(0);
  }
});

req.on('error', (error) => {
  console.error('❌ Error al conectar con el backend');
  console.error(`   URL: ${BACKEND_URL}`);
  console.error(`   Error: ${error.message}`);
  console.log('\n⚠️  ADVERTENCIA: No se pudo conectar al backend');
  console.log('   Asegúrate de que el backend esté corriendo en el puerto correcto');
  console.log('   Puedes continuar, pero las peticiones API fallarán\n');

  // Preguntar si desea continuar
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('¿Deseas continuar de todas formas? (s/n): ', (answer) => {
    readline.close();
    if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'y') {
      console.log('🚀 Iniciando Next.js...\n');
      process.exit(0);
    } else {
      console.log('❌ Abortado por el usuario\n');
      process.exit(1);
    }
  });
});

req.on('timeout', () => {
  req.destroy();
  console.error('❌ Timeout al conectar con el backend');
  console.error(`   URL: ${BACKEND_URL}`);
  console.log('\n⚠️  ADVERTENCIA: El backend no respondió a tiempo');
  console.log('   Asegúrate de que el backend esté corriendo\n');
  console.log('🚀 Iniciando Next.js de todas formas...\n');
  process.exit(0);
});

req.end();

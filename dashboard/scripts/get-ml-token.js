/**
 * Script para obtener un Access Token de MercadoLibre
 * 
 * Uso:
 *   node scripts/get-ml-token.js YOUR_CLIENT_ID YOUR_CLIENT_SECRET
 * 
 * O configura las variables de entorno:
 *   MERCADOLIBRE_CLIENT_ID=tu_id
 *   MERCADOLIBRE_CLIENT_SECRET=tu_secret
 *   node scripts/get-ml-token.js
 */

const clientId = process.argv[2] || process.env.MERCADOLIBRE_CLIENT_ID;
const clientSecret = process.argv[3] || process.env.MERCADOLIBRE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('❌ Error: Se requieren Client ID y Client Secret');
  console.log('\nUso:');
  console.log('  node scripts/get-ml-token.js YOUR_CLIENT_ID YOUR_CLIENT_SECRET');
  console.log('\nO configura las variables de entorno:');
  console.log('  MERCADOLIBRE_CLIENT_ID=tu_id');
  console.log('  MERCADOLIBRE_CLIENT_SECRET=tu_secret');
  console.log('  node scripts/get-ml-token.js');
  process.exit(1);
}

async function getAccessToken() {
  try {
    console.log('🔄 Obteniendo Access Token de MercadoLibre...\n');

    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error ${response.status}: ${error}`);
    }

    const data = await response.json();

    console.log('✅ Token obtenido exitosamente!\n');
    console.log('📋 Agrega esto a tu archivo .env.local:\n');
    console.log(`MERCADOLIBRE_ACCESS_TOKEN=${data.access_token}\n`);
    console.log('⚠️  Nota: Este token expira en', data.expires_in, 'segundos');
    console.log('    (aproximadamente', Math.round(data.expires_in / 3600), 'horas)\n');

    return data.access_token;
  } catch (error) {
    console.error('❌ Error al obtener token:', error.message);
    process.exit(1);
  }
}

getAccessToken();


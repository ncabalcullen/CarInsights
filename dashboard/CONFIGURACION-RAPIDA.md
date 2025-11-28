# ⚡ Configuración Rápida - API MercadoLibre

## 🎯 Resumen en 3 Pasos

### 1️⃣ Crear Aplicación (2 min)
```
1. Ve a: https://developers.mercadolibre.com.ar/
2. Click "Crear nueva aplicación"
3. Completa:
   - Nombre: AutoInsights
   - Redirect URI: 
     - **Recomendado**: `https://tu-app.netlify.app/callback` (después de deployar en Netlify)
     - **Local**: `http://localhost:3000/callback` (puede ser rechazado por MercadoLibre)
   
   💡 **Tip**: Si localhost no funciona, deploya en Netlify primero (ver DEPLOY-NETLIFY.md)
4. Copia App ID y Secret Key
```

### 2️⃣ Configurar Credenciales (1 min)
```bash
# En la carpeta dashboard/
touch .env.local

# Edita .env.local y agrega:
MERCADOLIBRE_CLIENT_ID=tu_app_id
MERCADOLIBRE_CLIENT_SECRET=tu_secret_key
```

### 3️⃣ Obtener Token (1 min)
```bash
# Desde dashboard/
node scripts/get-ml-token.js TU_APP_ID TU_SECRET_KEY

# Copia el token que muestra
# Agrégalo a .env.local:
MERCADOLIBRE_ACCESS_TOKEN=el_token_obtenido
```

### 4️⃣ Reiniciar
```bash
# Detén el servidor (Ctrl+C)
npm run dev
```

## ✅ Listo!

Ahora el dashboard usará datos reales de MercadoLibre.

---

## 📖 Guía Completa

Para más detalles, ver: **PASO-A-PASO-API-ML.md**

---

## 🆘 Problemas Comunes

**Error 403**: Verifica que las credenciales estén correctas en `.env.local`

**Token expirado**: Ejecuta nuevamente `get-ml-token.js`

**No carga datos**: Reinicia el servidor después de agregar credenciales


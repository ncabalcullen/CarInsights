# 🚀 Guía Completa: Cómo obtener API de MercadoLibre

## ⚡ Respuesta Rápida

**¿Necesitas credenciales?** 
- ❌ **NO** para búsquedas públicas (lo que hace este proyecto)
- ✅ **SÍ** solo si quieres más de 10,000 consultas/día o funcionalidades avanzadas

**El proyecto ya funciona sin credenciales** usando la API pública. Pero si quieres obtenerlas, aquí está el proceso:

---

## 📋 Paso a Paso: Obtener Credenciales

### Paso 1: Crear cuenta en MercadoLibre

1. Ve a [MercadoLibre Argentina](https://www.mercadolibre.com.ar/)
2. Crea una cuenta o inicia sesión

### Paso 2: Acceder al DevCenter

1. Ve a [DevCenter de MercadoLibre](https://developers.mercadolibre.com.ar/)
2. Inicia sesión con tu cuenta de MercadoLibre
3. Si es tu primera vez, acepta los términos y condiciones

### Paso 3: Crear una nueva aplicación

1. En el DevCenter, haz clic en **"Crear nueva aplicación"** o **"My Applications"**
2. Completa el formulario:

   ```
   Nombre de la aplicación: AutoInsights Dashboard
   Descripción: Dashboard de análisis de mercado de vehículos
   Redirect URI: http://localhost:3000/callback
   Tipo: Web Application
   ```
   
   **Nota sobre Redirect URI**: 
   - MercadoLibre requiere una URL válida con formato completo
   - Usa: `http://localhost:3000/callback` o `http://localhost:3000/oauth/callback`
   - Si ninguna funciona, puedes usar: `https://localhost:3000/callback`

3. Haz clic en **"Crear"**

### Paso 4: Obtener tus credenciales

Después de crear la aplicación, verás:

- **App ID (Client ID)**: Un número largo (ej: `1234567890123456`)
- **Secret Key (Client Secret)**: Una cadena de caracteres (ej: `abc123def456...`)

⚠️ **Importante**: Guarda estas credenciales de forma segura. No las compartas públicamente.

---

## 🔧 Configurar en el Proyecto

### Opción A: Con credenciales (recomendado para producción)

1. Crea un archivo `.env.local` en la raíz del proyecto `dashboard/`:

```bash
cd dashboard
touch .env.local
```

2. Agrega tus credenciales:

```env
MERCADOLIBRE_CLIENT_ID=tu_client_id_aqui
MERCADOLIBRE_CLIENT_SECRET=tu_client_secret_aqui
```

3. (Opcional) Obtén un Access Token:

```bash
node scripts/get-ml-token.js TU_CLIENT_ID TU_CLIENT_SECRET
```

Esto te dará un token que puedes agregar a `.env.local`:

```env
MERCADOLIBRE_ACCESS_TOKEN=tu_token_aqui
```

### Opción B: Sin credenciales (funciona igual)

**No necesitas hacer nada**. El proyecto funciona sin credenciales usando la API pública.

---

## 🧪 Probar la Configuración

1. Inicia el servidor:
```bash
npm run dev
```

2. Visita `http://localhost:3000`

3. Los datos deberían cargarse automáticamente desde MercadoLibre

---

## 📊 Límites de la API

### Sin credenciales (API Pública):
- ✅ Búsquedas de productos
- ✅ Información de items
- ✅ Categorías
- ⚠️ Límite: ~10,000 consultas/día por IP
- ❌ No acceso a datos de usuarios
- ❌ No publicar anuncios

### Con credenciales:
- ✅ Todo lo anterior
- ✅ Más consultas por día
- ✅ Acceso a datos de usuarios
- ✅ Publicar/modificar anuncios
- ✅ Estadísticas avanzadas

---

## 🔐 Seguridad

1. **NUNCA** subas `.env.local` a Git (ya está en `.gitignore`)
2. **NUNCA** compartas tus credenciales públicamente
3. Si expusiste credenciales, revócalas en el DevCenter y crea nuevas

---

## 🆘 Solución de Problemas

### Error: "Invalid credentials"
- Verifica que copiaste correctamente Client ID y Secret
- Asegúrate de que no hay espacios extra

### Error: "Rate limit exceeded"
- Has superado el límite de consultas
- Espera un tiempo o usa credenciales para más consultas

### No se cargan datos
- Verifica tu conexión a internet
- Revisa la consola del navegador para errores
- El proyecto tiene fallback a datos locales si la API falla

---

## 📚 Recursos Adicionales

- [Documentación oficial de la API](https://developers.mercadolibre.com.ar/es_ar/api-docs-es)
- [DevCenter](https://developers.mercadolibre.com.ar/)
- [Explorador de API](https://api.mercadolibre.com/)
- [Guía de autenticación](https://developers.mercadolibre.com.ar/es_ar/obtencion-del-access-token)

---

## ✅ Resumen

1. **Para desarrollo/testing**: No necesitas credenciales, funciona sin ellas
2. **Para producción con muchas consultas**: Crea una app en DevCenter y configura las credenciales
3. **El proyecto ya está listo**: Funciona con o sin credenciales

¿Dudas? Revisa la documentación oficial o el archivo `README-API.md` para más detalles.


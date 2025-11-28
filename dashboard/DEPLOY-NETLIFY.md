# 🚀 Deploy en Netlify - Solución para Redirect URI

## 🎯 Por qué Netlify

MercadoLibre puede rechazar `localhost` como Redirect URI. Netlify proporciona:
- ✅ URL HTTPS válida y pública
- ✅ Aceptada por MercadoLibre sin problemas
- ✅ Deploy gratuito y fácil
- ✅ URL permanente para tu aplicación

---

## 📋 Paso 1: Preparar el Proyecto

### 1.1 Verificar que el proyecto compile

```bash
cd dashboard
npm run build
```

Si hay errores, corrígelos antes de continuar.

### 1.2 Crear archivo de configuración de Netlify

Crea un archivo `netlify.toml` en la raíz del proyecto `dashboard/`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🌐 Paso 2: Crear Cuenta en Netlify

1. Ve a: **https://www.netlify.com/**
2. Click en **"Sign up"** o **"Log in"**
3. Puedes usar:
   - GitHub (recomendado - más fácil)
   - Email
   - Google

⏱️ **Tiempo**: 2 minutos

---

## 📤 Paso 3: Deploy en Netlify

### Opción A: Desde GitHub (Recomendado)

1. **Sube tu código a GitHub:**
   ```bash
   # Si no tienes repo de Git
   git init
   git add .
   git commit -m "Initial commit"
   
   # Crea un repo en GitHub y luego:
   git remote add origin https://github.com/tu-usuario/tu-repo.git
   git push -u origin main
   ```

2. **En Netlify:**
   - Click en **"Add new site"** → **"Import an existing project"**
   - Selecciona **"GitHub"**
   - Autoriza Netlify
   - Selecciona tu repositorio
   - Configura:
     - **Base directory**: `dashboard`
     - **Build command**: `npm run build`
     - **Publish directory**: `.next`
   - Click en **"Deploy site"**

### Opción B: Deploy Manual (Drag & Drop)

1. **Build del proyecto:**
   ```bash
   cd dashboard
   npm run build
   ```

2. **En Netlify:**
   - Click en **"Add new site"** → **"Deploy manually"**
   - Arrastra la carpeta `.next` (dentro de `dashboard/`)
   - Espera a que termine el deploy

⏱️ **Tiempo**: 5-10 minutos

---

## 🔗 Paso 4: Obtener tu URL de Netlify

Después del deploy, Netlify te dará una URL como:
```
https://tu-app-123456.netlify.app
```

**Guarda esta URL** - la necesitarás para configurar MercadoLibre.

---

## 🔧 Paso 5: Configurar Redirect URI en MercadoLibre

1. Ve a: **https://developers.mercadolibre.com.ar/**
2. Entra a tu aplicación (o créala si no la tienes)
3. En **"Redirect URI"**, agrega:
   ```
   https://tu-app-123456.netlify.app/callback
   ```
   O si prefieres:
   ```
   https://tu-app-123456.netlify.app/oauth/callback
   ```

4. **Guarda los cambios**

⏱️ **Tiempo**: 1 minuto

---

## 🔑 Paso 6: Configurar Variables de Entorno en Netlify

1. En Netlify, ve a tu sitio
2. Click en **"Site settings"** → **"Environment variables"**
3. Agrega estas variables:

   ```
   MERCADOLIBRE_CLIENT_ID = tu_client_id
   MERCADOLIBRE_CLIENT_SECRET = tu_client_secret
   MERCADOLIBRE_ACCESS_TOKEN = tu_access_token
   ```

4. **IMPORTANTE**: Después de agregar variables, haz un **"Trigger deploy"** para que se apliquen

⏱️ **Tiempo**: 2 minutos

---

## 🎫 Paso 7: Obtener Access Token

El Access Token se obtiene igual que antes, pero ahora puedes usar la URL de Netlify:

```bash
# Desde tu máquina local
node scripts/get-ml-token.js TU_CLIENT_ID TU_CLIENT_SECRET
```

O si prefieres, puedes obtenerlo directamente desde la API usando tu Redirect URI de Netlify.

---

## ✅ Paso 8: Verificar que Funciona

1. Visita tu URL de Netlify: `https://tu-app-123456.netlify.app`
2. El dashboard debería cargar
3. Revisa los logs de Netlify (en "Functions" o "Deploy logs")
4. Si ves datos cargándose sin errores 403 → **¡Funciona!**

---

## 🔄 Actualizar Redirect URI en MercadoLibre

Si cambias el nombre de tu sitio en Netlify o usas un dominio personalizado:

1. Ve a tu aplicación en MercadoLibre DevCenter
2. Actualiza el Redirect URI con la nueva URL
3. Guarda los cambios

---

## 🌍 Dominio Personalizado (Opcional)

Si quieres usar tu propio dominio:

1. En Netlify: **Site settings** → **Domain management**
2. Click en **"Add custom domain"**
3. Sigue las instrucciones para configurar DNS
4. Actualiza el Redirect URI en MercadoLibre con tu dominio

---

## 📝 Configuración Recomendada

### Redirect URI en MercadoLibre:
```
https://tu-app.netlify.app/callback
```

### Variables de Entorno en Netlify:
```
MERCADOLIBRE_CLIENT_ID
MERCADOLIBRE_CLIENT_SECRET  
MERCADOLIBRE_ACCESS_TOKEN
```

### netlify.toml (opcional, para configuración avanzada):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🆘 Solución de Problemas

### Error: "Build failed"
- **Causa**: Errores en el código o dependencias faltantes
- **Solución**: 
  1. Prueba `npm run build` localmente
  2. Corrige los errores
  3. Vuelve a hacer deploy

### Error: "Environment variables not found"
- **Causa**: Variables no configuradas o deploy sin recargar
- **Solución**: 
  1. Verifica que las variables estén en Netlify
  2. Haz un "Trigger deploy" después de agregar variables

### Error: "Redirect URI mismatch"
- **Causa**: URL en MercadoLibre no coincide con la de Netlify
- **Solución**: 
  1. Verifica la URL exacta en Netlify
  2. Actualiza el Redirect URI en MercadoLibre
  3. Asegúrate de incluir `/callback` al final

---

## ✅ Ventajas de Netlify

- ✅ URL HTTPS válida (requerida por MercadoLibre)
- ✅ Deploy automático desde GitHub
- ✅ Variables de entorno seguras
- ✅ SSL gratuito
- ✅ CDN global
- ✅ Deploy previews para testing

---

## 🎉 ¡Listo!

Ahora tienes:
- ✅ Aplicación desplegada en Netlify
- ✅ URL válida para Redirect URI
- ✅ API de MercadoLibre funcionando
- ✅ Dashboard accesible desde cualquier lugar

---

**Tiempo total**: 15-20 minutos
**Costo**: Gratis (plan básico de Netlify)


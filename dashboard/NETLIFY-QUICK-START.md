# ⚡ Deploy Rápido en Netlify (5 minutos)

## 🎯 Solución al Problema de Redirect URI

MercadoLibre rechaza `localhost`. Netlify te da una URL HTTPS válida que funciona perfectamente.

---

## 🚀 Pasos Rápidos

### 1. Crear cuenta en Netlify (1 min)
- Ve a: https://www.netlify.com/
- Sign up con GitHub (más fácil) o email

### 2. Subir código a GitHub (2 min)
```bash
cd dashboard
git init
git add .
git commit -m "Initial commit"

# Crea repo en GitHub, luego:
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

### 3. Deploy en Netlify (2 min)
1. En Netlify: **"Add new site"** → **"Import from Git"**
2. Selecciona **GitHub** y autoriza
3. Selecciona tu repositorio
4. Configura:
   - **Base directory**: `dashboard`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Click **"Deploy site"**

### 4. Obtener tu URL
Netlify te dará: `https://tu-app-123456.netlify.app`

### 5. Configurar MercadoLibre
1. Ve a: https://developers.mercadolibre.com.ar/
2. En tu aplicación, usa como Redirect URI:
   ```
   https://tu-app-123456.netlify.app/callback
   ```

### 6. Variables de Entorno
En Netlify: **Site settings** → **Environment variables**
- `MERCADOLIBRE_CLIENT_ID`
- `MERCADOLIBRE_CLIENT_SECRET`
- `MERCADOLIBRE_ACCESS_TOKEN`

Luego: **"Trigger deploy"** para aplicar cambios

---

## ✅ Listo!

Tu app estará en: `https://tu-app-123456.netlify.app`

Y MercadoLibre aceptará el Redirect URI sin problemas.

---

📖 **Guía completa**: Ver `DEPLOY-NETLIFY.md`


# 🚀 Guía Paso a Paso: Configurar API de MercadoLibre

## 📋 Requisitos Previos

- ✅ Cuenta de MercadoLibre (puedes crearla en https://www.mercadolibre.com.ar/)
- ✅ Navegador web
- ✅ Editor de texto (para editar `.env.local`)

---

## 📝 Paso 1: Crear Cuenta en MercadoLibre (si no tienes)

1. Ve a: **https://www.mercadolibre.com.ar/**
2. Click en **"Crear cuenta"** o **"Ingresar"**
3. Completa el formulario de registro
4. Verifica tu email si es necesario

⏱️ **Tiempo**: 2-3 minutos

---

## 🔧 Paso 2: Acceder al DevCenter

1. Ve a: **https://developers.mercadolibre.com.ar/**
2. Click en **"Ingresar"** (arriba a la derecha)
3. Inicia sesión con tu cuenta de MercadoLibre
4. Si es tu primera vez, acepta los términos y condiciones

⏱️ **Tiempo**: 1 minuto

---

## 🆕 Paso 3: Crear Nueva Aplicación

1. En el DevCenter, busca el botón **"Crear nueva aplicación"** o **"My Applications"**
2. Click en **"Crear nueva aplicación"**
3. Completa el formulario:

   **Datos a completar:**
   - **Nombre de la aplicación**: `AutoInsights Dashboard`
   - **Descripción**: `Dashboard de análisis de mercado de vehículos`
   - **Redirect URI**: 
     - **Opción 1 (Recomendada - Netlify)**: Si vas a deployar en Netlify, usa:
       ```
       https://tu-app.netlify.app/callback
       ```
       (Reemplaza `tu-app` con el nombre que te dé Netlify)
       - 📖 Ver guía completa: `DEPLOY-NETLIFY.md`
     
     - **Opción 2 (Local)**: Si quieres probar localmente primero:
       ```
       http://localhost:3000/callback
       ```
       ⚠️ **Nota**: MercadoLibre puede rechazar `localhost`. Si te da error, usa la Opción 1 (Netlify).
     
     - **Alternativas locales** (si la anterior no funciona):
       - `http://localhost:3000/oauth/callback`
       - `https://localhost:3000/callback`
   - **Tipo de aplicación**: Selecciona **"Web Application"** o **"Aplicación Web"**

4. Click en **"Crear"** o **"Guardar"**

⏱️ **Tiempo**: 2 minutos

---

## 🔑 Paso 4: Obtener Credenciales

Después de crear la aplicación, verás una pantalla con tus credenciales:

**⚠️ IMPORTANTE: Guarda estas credenciales de forma segura**

1. **App ID (Client ID)**: Un número largo (ej: `1234567890123456`)
   - Copia este valor
   
2. **Secret Key (Client Secret)**: Una cadena de caracteres (ej: `abc123def456...`)
   - Copia este valor también

**💡 Tip**: Puedes copiarlos a un archivo temporal o guardarlos en un gestor de contraseñas

⏱️ **Tiempo**: 1 minuto

---

## 📁 Paso 5: Crear Archivo de Configuración

1. Abre tu terminal
2. Navega a la carpeta del proyecto:
   ```bash
   cd dashboard
   ```

3. Crea el archivo `.env.local`:
   ```bash
   touch .env.local
   ```

   O si estás en Windows:
   ```cmd
   type nul > .env.local
   ```

⏱️ **Tiempo**: 30 segundos

---

## ✏️ Paso 6: Agregar Credenciales al Archivo

1. Abre el archivo `.env.local` con tu editor de texto favorito
2. Agrega tus credenciales (reemplaza con los valores reales):

   ```env
   MERCADOLIBRE_CLIENT_ID=1234567890123456
   MERCADOLIBRE_CLIENT_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
   ```

   **Ejemplo real:**
   ```env
   MERCADOLIBRE_CLIENT_ID=7891234567890123
   MERCADOLIBRE_CLIENT_SECRET=APP_USR_1234567890abcdefghijklmnopqrstuvwxyz
   ```

3. Guarda el archivo

⏱️ **Tiempo**: 1 minuto

---

## 🎫 Paso 7: Obtener Access Token

El Access Token es necesario para autenticar las solicitudes. Hay dos formas:

### Opción A: Usando el Script (Recomendado)

1. En la terminal, desde la carpeta `dashboard`, ejecuta:
   ```bash
   node scripts/get-ml-token.js TU_CLIENT_ID TU_CLIENT_SECRET
   ```

   **Ejemplo:**
   ```bash
   node scripts/get-ml-token.js 7891234567890123 APP_USR_1234567890abcdefghijklmnopqrstuvwxyz
   ```

2. El script te mostrará un token. Copia ese token.

3. Agrega el token a `.env.local`:
   ```env
   MERCADOLIBRE_CLIENT_ID=7891234567890123
   MERCADOLIBRE_CLIENT_SECRET=APP_USR_1234567890abcdefghijklmnopqrstuvwxyz
   MERCADOLIBRE_ACCESS_TOKEN=el_token_que_obtuviste_aqui
   ```

### Opción B: Manualmente con cURL

1. Abre tu terminal
2. Ejecuta (reemplaza con tus credenciales):
   ```bash
   curl -X POST \
     https://api.mercadolibre.com/oauth/token \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -d 'grant_type=client_credentials&client_id=TU_CLIENT_ID&client_secret=TU_CLIENT_SECRET'
   ```

3. Busca el campo `"access_token"` en la respuesta
4. Copia el valor del token
5. Agrega a `.env.local` como en la Opción A

⏱️ **Tiempo**: 2-3 minutos

---

## ✅ Paso 8: Verificar Configuración

Tu archivo `.env.local` debería verse así:

```env
MERCADOLIBRE_CLIENT_ID=tu_client_id_aqui
MERCADOLIBRE_CLIENT_SECRET=tu_client_secret_aqui
MERCADOLIBRE_ACCESS_TOKEN=tu_access_token_aqui
```

**Verifica que:**
- ✅ No haya espacios extra
- ✅ No haya comillas alrededor de los valores
- ✅ Cada variable esté en una línea separada
- ✅ No haya líneas vacías al inicio

⏱️ **Tiempo**: 1 minuto

---

## 🔄 Paso 9: Reiniciar el Servidor

1. Si el servidor está corriendo, detenlo (presiona `Ctrl+C` en la terminal)
2. Reinicia el servidor:
   ```bash
   npm run dev
   ```

3. Espera a que inicie (verás "Ready" en la consola)

⏱️ **Tiempo**: 30 segundos

---

## 🧪 Paso 10: Probar la Configuración

1. Abre tu navegador en: **http://localhost:3000**
2. El dashboard debería cargar datos
3. Revisa la consola del servidor:
   - ✅ Si ves datos cargándose sin errores 403 → **¡Funciona!**
   - ❌ Si ves error 403 → Revisa los pasos anteriores

4. En el dashboard:
   - ✅ No deberías ver el mensaje "Using local data"
   - ✅ Deberías ver datos reales de MercadoLibre

⏱️ **Tiempo**: 1 minuto

---

## 🎉 ¡Listo!

Si todo funcionó correctamente:
- ✅ Tienes acceso a datos reales de MercadoLibre
- ✅ No más errores 403
- ✅ Hasta 10,000 consultas por día
- ✅ Dashboard funcionando con datos en tiempo real

---

## 🆘 Solución de Problemas

### Error: "Invalid credentials"
- **Causa**: Client ID o Secret incorrectos
- **Solución**: Verifica que copiaste correctamente desde el DevCenter

### Error: "Token expired"
- **Causa**: El Access Token expiró (normalmente después de 6 horas)
- **Solución**: Ejecuta nuevamente el script `get-ml-token.js` para obtener un nuevo token

### Error: "403 Forbidden" después de configurar
- **Causa**: Token inválido o credenciales incorrectas
- **Solución**: 
  1. Verifica que `.env.local` esté en la carpeta `dashboard/`
  2. Reinicia el servidor
  3. Obtén un nuevo token

### No se carga `.env.local`
- **Causa**: Archivo en ubicación incorrecta o formato incorrecto
- **Solución**: 
  1. Asegúrate de que el archivo esté en `dashboard/.env.local`
  2. Verifica que no tenga extensión `.txt`
  3. Reinicia el servidor

---

## 📚 Recursos Adicionales

- **DevCenter**: https://developers.mercadolibre.com.ar/
- **Documentación API**: https://developers.mercadolibre.com.ar/es_ar/api-docs-es
- **Soporte**: https://developers.mercadolibre.com.ar/support

---

## ⏱️ Tiempo Total Estimado

**Primera vez**: 10-15 minutos
**Si ya tienes cuenta**: 5-8 minutos

---

## ✅ Checklist Final

Antes de considerar que está configurado:

- [ ] Cuenta de MercadoLibre creada
- [ ] Aplicación creada en DevCenter
- [ ] Client ID copiado
- [ ] Client Secret copiado
- [ ] Archivo `.env.local` creado
- [ ] Credenciales agregadas a `.env.local`
- [ ] Access Token obtenido
- [ ] Token agregado a `.env.local`
- [ ] Servidor reiniciado
- [ ] Dashboard cargando datos reales

---

**¿Necesitas ayuda?** Revisa la sección de Solución de Problemas o consulta la documentación oficial de MercadoLibre.


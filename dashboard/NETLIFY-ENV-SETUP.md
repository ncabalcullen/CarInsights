# 🚀 Configuración de Variables de Entorno en Netlify

Si tu dashboard muestra 0 resultados en producción, es muy probable que falten las variables de entorno en Netlify.

Sigue estos pasos para configurarlas:

## 1. Accede a tu Panel de Netlify

1. Ve a [app.netlify.com](https://app.netlify.com)
2. Selecciona tu sitio (`cobalt-mare` o el nombre que tenga)
3. Ve a **Site configuration** (Configuración del sitio) en el menú lateral o superior
4. Busca la sección **Environment variables** (Variables de entorno)

## 2. Agrega las Variables de MercadoLibre

Necesitas agregar las mismas variables que tienes en tu archivo `.env.local` (si las tienes). Si no, debes crearlas.

Haz clic en **Add a variable** y agrega las siguientes:

### Opción A: Configuración Completa (Recomendada)
Para obtener datos en tiempo real de la API de MercadoLibre:

| Key (Clave) | Value (Valor) | Descripción |
|-------------|---------------|-------------|
| `MERCADOLIBRE_CLIENT_ID` | `123456...` | Tu App ID de MercadoLibre |
| `MERCADOLIBRE_CLIENT_SECRET` | `abc123...` | Tu Secret Key de MercadoLibre |
| `MERCADOLIBRE_ACCESS_TOKEN` | `APP_USR...` | **Opcional**. Si dejas esto vacío, el sistema generará uno automáticamente usando tu ID y Secret. |

> **Nota**: El sistema ahora incluye generación automática de tokens. Solo necesitas configurar `CLIENT_ID` y `CLIENT_SECRET` y el dashboard se encargará de obtener y renovar el token automáticamente cada vez que sea necesario. ¡Ya no necesitas actualizarlo manualmente!

### Opción B: Configuración de Fallback (Datos Locales)
Si solo quieres que se muestren los datos de demostración (sin conectar a la API real) o como respaldo si la API falla:

| Key (Clave) | Value (Valor) | Descripción |
|-------------|---------------|-------------|
| `NEXT_PUBLIC_BASE_URL` | `https://tu-sitio.netlify.app` | La URL de tu sitio en Netlify |

> **Importante**: Hemos actualizado el código para detectar automáticamente la URL, pero definir esta variable asegura que el sistema sepa dónde buscar el archivo `vehicles.json` si la detección automática falla.

## 3. Redesplegar el Sitio

Una vez agregadas las variables:

1. Ve a la pestaña **Deploys**
2. Haz clic en **Trigger deploy** > **Deploy site**
3. Espera a que termine el despliegue

## 4. Verificar

Recarga tu sitio. Deberías ver los datos cargados correctamente.

---

## ¿Cómo obtener las credenciales de MercadoLibre?

Revisa el archivo `PASO-A-PASO-API-ML.md` en este repositorio para ver cómo crear tu aplicación en MercadoLibre y obtener las credenciales.

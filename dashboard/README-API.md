# Guía para obtener credenciales de la API de MercadoLibre

## ¿Necesitas credenciales?

**Buena noticia**: Para búsquedas públicas de productos (como vehículos), **NO necesitas credenciales**. La API pública funciona sin autenticación.

Sin embargo, si quieres:
- Hacer más de 10,000 consultas por día
- Acceder a datos de usuarios
- Publicar o modificar anuncios
- Obtener estadísticas avanzadas

Entonces **SÍ necesitas credenciales**.

## Proceso para obtener credenciales (opcional)

### Paso 1: Crear cuenta en MercadoLibre
1. Ve a [MercadoLibre Argentina](https://www.mercadolibre.com.ar/)
2. Crea una cuenta si no tienes una

### Paso 2: Crear aplicación en DevCenter
1. Accede al [DevCenter de MercadoLibre](https://developers.mercadolibre.com.ar/)
2. Inicia sesión con tu cuenta
3. Haz clic en **"Crear nueva aplicación"**
4. Completa el formulario:
   - **Nombre de la aplicación**: Ej: "AutoInsights Dashboard"
   - **Descripción**: Ej: "Dashboard de análisis de mercado de vehículos"
   - **Redirect URI**: `http://localhost:3000/callback` (para desarrollo)
     - ⚠️ **IMPORTANTE**: MercadoLibre requiere una URL válida con ruta completa
     - Alternativas válidas: `http://localhost:3000/oauth/callback` o `https://localhost:3000/callback`
   - **Tipo de aplicación**: Selecciona según tus necesidades
5. Al finalizar, obtendrás:
   - **Client ID** (App ID)
   - **Client Secret** (Secret Key)

### Paso 3: Obtener Access Token (si es necesario)

Para la mayoría de búsquedas públicas, **NO necesitas token**. Pero si lo necesitas:

#### Opción A: Token de prueba (para desarrollo)
```bash
# Reemplaza YOUR_CLIENT_ID con tu Client ID
curl -X POST \
  https://api.mercadolibre.com/oauth/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET'
```

#### Opción B: Token de usuario (para producción)
Requiere flujo OAuth completo. Consulta la [documentación oficial](https://developers.mercadolibre.com.ar/es_ar/obtencion-del-access-token).

## Configurar credenciales en el proyecto

### Opción 1: Variables de entorno (recomendado)

1. Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Opcional: Credenciales de MercadoLibre
MERCADOLIBRE_CLIENT_ID=tu_client_id_aqui
MERCADOLIBRE_CLIENT_SECRET=tu_client_secret_aqui
MERCADOLIBRE_ACCESS_TOKEN=tu_access_token_aqui

# Si no proporcionas estas variables, la API funcionará sin autenticación
```

2. El código ya está preparado para usar estas variables si están disponibles.

### Opción 2: Sin credenciales (funciona igual)

Si no configuras nada, la API funcionará usando endpoints públicos sin autenticación.

## Límites de la API

### Sin credenciales (público):
- ✅ Búsquedas de productos
- ✅ Información de items públicos
- ✅ Categorías y sitios
- ⚠️ Límite: ~10,000 consultas/día por IP

### Con credenciales:
- ✅ Todo lo anterior
- ✅ Más consultas por día
- ✅ Acceso a datos de usuarios
- ✅ Publicar/modificar anuncios
- ✅ Estadísticas avanzadas

## Prueba tu configuración

1. Inicia el servidor: `npm run dev`
2. Visita: `http://localhost:3000`
3. Los datos deberían cargarse automáticamente desde MercadoLibre

## Recursos útiles

- [Documentación oficial de la API](https://developers.mercadolibre.com.ar/es_ar/api-docs-es)
- [DevCenter](https://developers.mercadolibre.com.ar/)
- [Explorador de API](https://api.mercadolibre.com/)

## Nota importante

**No necesitas credenciales para que el proyecto funcione**. La implementación actual usa endpoints públicos que funcionan sin autenticación. Las credenciales son opcionales y solo necesarias si quieres funcionalidades avanzadas o más consultas.


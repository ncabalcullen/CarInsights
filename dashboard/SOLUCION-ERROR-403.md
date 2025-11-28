# 🔧 Solución al Error 403 de MercadoLibre API

## ❌ Problema

Estás viendo errores `403 Forbidden` al intentar consultar la API de MercadoLibre:

```
Error: MercadoLibre API error: 403
```

## 🔍 Causas del Error 403

El error 403 puede ocurrir por varias razones:

1. **Rate Limiting**: Demasiadas solicitudes desde la misma IP
2. **Falta de User-Agent**: Algunas APIs bloquean solicitudes sin User-Agent válido
3. **Bloqueo de IP**: Tu IP puede estar temporalmente bloqueada
4. **Falta de autenticación**: Aunque no siempre es necesario, algunas consultas requieren credenciales

## ✅ Soluciones Implementadas

### 1. Headers Mejorados

Se agregaron headers apropiados para evitar bloqueos:

```typescript
headers: {
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0...', // User-Agent válido
  'Accept-Language': 'es-AR,es;q=0.9',
}
```

### 2. Fallback Automático a Datos Locales

Cuando la API devuelve 403 o 429, el sistema automáticamente:
- Detecta el error
- Carga datos locales desde `/public/data/vehicles.json`
- Muestra un indicador visual de que se están usando datos locales

### 3. Manejo de Errores Específicos

- **403 Forbidden**: Usa datos locales automáticamente
- **429 Too Many Requests**: Usa datos locales automáticamente
- **Otros errores**: Intenta cargar datos locales como fallback

### 4. Botón para Forzar Datos Locales

Se agregó un botón "Local" en el Dashboard que permite:
- Forzar el uso de datos locales sin intentar la API
- Útil cuando sabes que la API está bloqueada

## 🚀 Cómo Usar

### Opción 1: Usar Datos Locales (Recomendado si 403 persiste)

1. Haz clic en el botón **"Local"** en el Dashboard
2. Los datos se cargarán desde el archivo local
3. Verás un indicador amarillo: "⚠️ Using local data"

### Opción 2: Obtener Credenciales de API

Si quieres usar la API real sin errores 403:

1. Sigue la guía en `GUIA-API-MERCADOLIBRE.md`
2. Crea una aplicación en DevCenter
3. Obtén Client ID y Secret
4. Configura en `.env.local`:
   ```env
   MERCADOLIBRE_CLIENT_ID=tu_client_id
   MERCADOLIBRE_CLIENT_SECRET=tu_client_secret
   ```
5. Obtén un Access Token:
   ```bash
   node scripts/get-ml-token.js TU_CLIENT_ID TU_CLIENT_SECRET
   ```
6. Agrega el token a `.env.local`:
   ```env
   MERCADOLIBRE_ACCESS_TOKEN=tu_token
   ```

### Opción 3: Esperar y Reintentar

Si el error es por rate limiting:
- Espera unos minutos (5-15 minutos)
- Intenta nuevamente
- El sistema intentará automáticamente usar la API

## 📊 Indicadores Visuales

- **Sin indicador**: Datos cargados desde la API de MercadoLibre ✅
- **⚠️ Using local data**: Se están usando datos locales (API falló o fue bloqueada)
- **Botón "Local"**: Permite forzar el uso de datos locales

## 🔄 Flujo de Fallback

```
1. Intenta cargar desde API de MercadoLibre
   ↓
2. Si 403/429 → Carga datos locales automáticamente
   ↓
3. Si error general → Intenta cargar datos locales
   ↓
4. Si todo falla → Muestra error
```

## 🛠️ Solución Temporal Rápida

Si necesitas que funcione **ahora mismo**:

1. El sistema ya está usando datos locales automáticamente
2. Haz clic en el botón **"Local"** para asegurarte
3. El Dashboard funcionará con datos de ejemplo

## 📝 Notas Importantes

- **Los datos locales son de ejemplo**: No son datos reales en tiempo real
- **Para datos reales**: Necesitas resolver el problema del 403 con credenciales
- **El fallback es automático**: No necesitas hacer nada, el sistema se adapta
- **Los datos locales están actualizados**: El archivo `vehicles.json` tiene datos de ejemplo válidos

## 🆘 Si el Problema Persiste

1. **Verifica tu conexión a internet**
2. **Espera 15-30 minutos** (puede ser rate limiting temporal)
3. **Usa el botón "Local"** para trabajar con datos de ejemplo
4. **Obtén credenciales de API** siguiendo `GUIA-API-MERCADOLIBRE.md`

## ✅ Estado Actual

El código ahora:
- ✅ Maneja errores 403 automáticamente
- ✅ Usa datos locales como fallback
- ✅ Muestra indicadores visuales
- ✅ Permite forzar uso de datos locales
- ✅ Funciona incluso si la API está bloqueada

**El Dashboard funciona correctamente con datos locales mientras resuelves el problema del 403.**


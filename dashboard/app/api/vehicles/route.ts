import { NextResponse } from 'next/server';

interface MercadoLibreItem {
  id: string;
  title: string;
  price: number;
  currency_id: string;
  permalink: string;
  thumbnail: string;
  condition: string;
  attributes: Array<{
    id: string;
    name: string;
    value_name: string | number | null;
  }>;
}

interface MercadoLibreResponse {
  results: MercadoLibreItem[];
  paging: {
    total: number;
    offset: number;
    limit: number;
  };
}

// Función para transformar datos de MercadoLibre al formato esperado
function transformMercadoLibreData(items: MercadoLibreItem[]) {
  return items.map((item) => {
    const attributesMap: Record<string, any> = {};
    
    item.attributes.forEach((attr) => {
      if (attr.value_name !== null && attr.value_name !== undefined && attr.value_name !== '') {
        attributesMap[attr.id] = attr.value_name;
        attributesMap[attr.name] = attr.value_name; // También indexar por nombre
      }
    });

    // Función helper para buscar atributos por múltiples posibles claves
    const findAttribute = (possibleKeys: string[], fallback?: string | null) => {
      for (const key of possibleKeys) {
        const value = attributesMap[key] || attributesMap[key.toUpperCase()] || attributesMap[key.toLowerCase()];
        if (value && value !== 'null' && value !== '') {
          return value;
        }
      }
      return fallback || null;
    };

    // Extraer información común de vehículos - buscar por múltiples posibles IDs y nombres
    // MercadoLibre usa diferentes IDs según la categoría, así que buscamos por múltiples variantes
    
    // Lista extensa de marcas comunes en Argentina
    const commonBrands = [
      'Ford', 'Chevrolet', 'Volkswagen', 'Fiat', 'Renault', 'Peugeot', 'Toyota', 'Honda', 
      'Nissan', 'BMW', 'Mercedes', 'Mercedes-Benz', 'Audi', 'Hyundai', 'Kia', 'Mazda', 
      'Suzuki', 'Jeep', 'Dodge', 'Ram', 'Citroën', 'Citroen', 'Opel', 'Seat', 'Skoda',
      'Volvo', 'Land Rover', 'Range Rover', 'Jaguar', 'Porsche', 'Mini', 'Smart',
      'Alfa Romeo', 'Ferrari', 'Lamborghini', 'Maserati', 'Bentley', 'Rolls-Royce',
      'Mitsubishi', 'Subaru', 'Isuzu', 'Great Wall', 'Chery', 'Geely', 'BYD', 'JAC',
      'BAIC', 'DFSK', 'Dongfeng', 'Foton', 'Haval', 'Lifan', 'MG', 'Zotye',
      'SsangYong', 'Tata', 'Mahindra', 'UAZ', 'Lada', 'Dacia', 'Lancia',
      'Abarth', 'Alpine', 'Aston Martin', 'Bentley', 'Bugatti', 'Cadillac', 'Chrysler',
      'DS', 'Genesis', 'Infiniti', 'Lexus', 'Lincoln', 'McLaren', 'Tesla'
    ];
    
    // Buscar marca en atributos primero
    let brand = findAttribute([
      'BRAND', 'Marca', 'VEHICLE_BRAND', 'VEHÍCULO_MARCA',
      'BRAND_ID', 'MARCA_ID', 'vehicle_brand', 'marca', 'MARCA',
      // IDs específicos de MercadoLibre para vehículos
      'BRAND', 'VEHICLE_BRAND', 'VEHICLE_BRAND_ID'
    ]);
    
    // Si no se encontró en atributos, buscar en el título
    if (!brand || brand === 'null' || brand === '') {
      const titleMatch = item.title.match(new RegExp(`\\b(${commonBrands.join('|')})\\b`, 'i'));
      if (titleMatch) {
        brand = titleMatch[0];
      }
    }
    
    // Normalizar marca (capitalizar primera letra)
    if (brand && brand !== 'null' && brand !== '') {
      brand = String(brand).charAt(0).toUpperCase() + String(brand).slice(1).toLowerCase();
      // Casos especiales
      if (brand.toLowerCase() === 'mercedes') brand = 'Mercedes-Benz';
      if (brand.toLowerCase() === 'citroen') brand = 'Citroën';
    } else {
      brand = 'Unknown';
    }
    
    const model = findAttribute([
      'MODEL', 'Modelo', 'VEHICLE_MODEL', 'VEHÍCULO_MODELO',
      'MODEL_ID', 'MODELO_ID', 'vehicle_model', 'modelo'
    ]) || 'Unknown';
    
    const year = findAttribute([
      'YEAR', 'Año', 'Model year', 'VEHICLE_YEAR', 'VEHÍCULO_AÑO',
      'YEAR_ID', 'AÑO_ID', 'vehicle_year', 'año', 'AÑO'
    ]) || 
    (item.title.match(/\b(19|20)\d{2}\b/)?.[0]) ||
    null;
    
    const kilometersStr = findAttribute([
      'KILOMETERS', 'Kilómetros', 'Kilometers', 'VEHICLE_KILOMETERS',
      'KILOMETERS_ID', 'KILÓMETROS_ID', 'vehicle_kilometers', 'kilómetros', 'kilometers'
    ]);
    const kilometers = kilometersStr 
      ? parseInt(String(kilometersStr).replace(/[^\d]/g, '')) || 0
      : (item.title.match(/(\d{1,3}(?:\.\d{3})*)\s*k?m/i)?.[1]?.replace(/\./g, '') || 
         item.title.match(/(\d+)\s*k?m/i)?.[1]) 
        ? parseInt(item.title.match(/(\d+)\s*k?m/i)?.[1] || '0') 
        : 0;
    
    const fuelType = findAttribute([
      'FUEL_TYPE', 'Tipo de combustible', 'VEHICLE_FUEL_TYPE',
      'FUEL_TYPE_ID', 'TIPO_COMBUSTIBLE_ID', 'vehicle_fuel_type', 'tipo de combustible'
    ]) || 'Unknown';
    
    const transmission = findAttribute([
      'TRANSMISSION', 'Transmisión', 'VEHICLE_TRANSMISSION',
      'TRANSMISSION_ID', 'TRANSMISIÓN_ID', 'vehicle_transmission', 'transmisión'
    ]) || 'Unknown';

    return {
      id: item.id,
      title: item.title,
      price: item.price,
      currency_id: item.currency_id,
      permalink: item.permalink,
      thumbnail: item.thumbnail,
      condition: item.condition,
      attributes: {
        brand: String(brand),
        model: String(model),
        year: year ? parseInt(String(year)) : null,
        kilometers: kilometers ? parseInt(String(kilometers)) : 0,
        fuelType: String(fuelType),
        transmission: String(transmission),
      },
    };
  });
}

// Función para cargar datos locales como fallback
async function loadLocalData() {
  try {
    // En Next.js, los archivos públicos se sirven desde /public
    // Intentar cargar desde la URL pública
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/data/vehicles.json`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    // Fallback: intentar leer desde el filesystem (solo funciona en servidor)
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'public', 'data', 'vehicles.json');
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents);
    } catch (fsError) {
      console.error('Error reading from filesystem:', fsError);
      return [];
    }
  } catch (error) {
    console.error('Error loading local data:', error);
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'vehiculos';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category') || 'MLA1744'; // Categoría de vehículos en Argentina
    const useLocal = searchParams.get('useLocal') === 'true';

    // Si se solicita explícitamente datos locales, usarlos
    if (useLocal) {
      const localData = await loadLocalData();
      return NextResponse.json({
        data: localData.slice(offset, offset + limit),
        paging: {
          total: localData.length,
          offset,
          limit,
        },
        source: 'local',
      });
    }

    // Verificar si hay credenciales configuradas
    const hasCredentials = !!process.env.MERCADOLIBRE_ACCESS_TOKEN || 
                          (!!process.env.MERCADOLIBRE_CLIENT_ID && !!process.env.MERCADOLIBRE_CLIENT_SECRET);
    
    if (!hasCredentials) {
      // Sin credenciales, es muy probable que reciba 403
      // Usar datos locales directamente y mostrar mensaje claro
      console.warn('No API credentials configured. Using local data. See GUIA-API-MERCADOLIBRE.md for setup instructions.');
      const localData = await loadLocalData();
      return NextResponse.json({
        data: localData.slice(offset, offset + limit),
        paging: {
          total: localData.length,
          offset,
          limit,
        },
        source: 'local',
        warning: 'API credentials not configured. Using local data. Configure credentials in .env.local to get real-time data from MercadoLibre.',
        info: 'To get real-time data, create an app at https://developers.mercadolibre.com.ar/ and add credentials to .env.local',
      });
    }

    // MercadoLibre permite máximo 50 items por request, pero podemos hacer múltiples requests
    const maxPerRequest = 50;
    const totalRequests = Math.ceil(limit / maxPerRequest);
    const allResults: MercadoLibreItem[] = [];

    // Hacer múltiples requests si necesitamos más de 50 items
    for (let i = 0; i < totalRequests && allResults.length < limit; i++) {
      const currentOffset = offset + (i * maxPerRequest);
      const currentLimit = Math.min(maxPerRequest, limit - allResults.length);
      
      // Intentar diferentes formatos de URL
      const mlApiUrl = `https://api.mercadolibre.com/sites/MLA/search?category=${category}&q=${encodeURIComponent(query)}&limit=${currentLimit}&offset=${currentOffset}`;

      // Headers mínimos - MercadoLibre puede bloquear User-Agent de navegador
      // Usar headers simples que no parezcan un bot
      const headers: HeadersInit = {
        'Accept': 'application/json',
      };

      // Si hay un access token configurado, usarlo (opcional)
      const accessToken = process.env.MERCADOLIBRE_ACCESS_TOKEN;
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      try {
        const response = await fetch(mlApiUrl, { 
          headers,
          // Agregar timeout
          signal: AbortSignal.timeout(10000), // 10 segundos
        });

        // Manejar errores específicos
        if (response.status === 403) {
          // El 403 puede ser por rate limiting o bloqueo de IP
          // Intentar esperar un poco y reintentar, o usar datos locales
          if (i === 0) {
            console.warn('MercadoLibre API returned 403 (Forbidden). This may be temporary. Trying with delay...');
            
            // Esperar 1 segundo y reintentar una vez
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            try {
              const retryResponse = await fetch(mlApiUrl, {
                headers,
                signal: AbortSignal.timeout(10000),
              });
              
              if (retryResponse.ok) {
                const retryData: MercadoLibreResponse = await retryResponse.json();
                allResults.push(...retryData.results);
                continue; // Continuar con el siguiente request
              }
            } catch (retryError) {
              console.warn('Retry also failed:', retryError);
            }
            
            // Si todo falla después del retry, intentar usar datos locales
            // pero solo si realmente no hay otra opción
            console.warn('API unavailable. You may need to configure credentials. Using local data as fallback.');
            const localData = await loadLocalData();
            if (localData.length > 0) {
              return NextResponse.json({
                data: localData.slice(offset, offset + limit),
                paging: {
                  total: localData.length,
                  offset,
                  limit,
                },
                source: 'local',
                warning: 'API returned 403. Using local data. Configure API credentials to get real-time data.',
              });
            }
          }
          break; // Si falla en requests subsecuentes, usar lo que tenemos
        }

        if (response.status === 429) {
          // Si es el primer request y falla, usar datos locales
          if (i === 0) {
            console.warn('MercadoLibre API returned 429 (Too Many Requests). Rate limit exceeded. Falling back to local data.');
            const localData = await loadLocalData();
            return NextResponse.json({
              data: localData.slice(offset, offset + limit),
              paging: {
                total: localData.length,
                offset,
                limit,
              },
              source: 'local',
              warning: 'Rate limit exceeded, using local data as fallback',
            });
          }
          break; // Si falla en requests subsecuentes, usar lo que tenemos
        }

        if (!response.ok) {
          if (i === 0) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(`MercadoLibre API error: ${response.status} - ${errorText}`);
          }
          break; // Si falla en requests subsecuentes, usar lo que tenemos
        }

        const data: MercadoLibreResponse = await response.json();
        allResults.push(...data.results);

        // Si no hay más resultados, salir del loop
        if (data.results.length < currentLimit) {
          break;
        }

        // Pequeño delay entre requests para evitar rate limiting
        if (i < totalRequests - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (fetchError) {
        // Si es el primer request y falla, lanzar el error
        if (i === 0) {
          throw fetchError;
        }
        // Si falla en requests subsecuentes, usar lo que tenemos
        break;
      }
    }

    const transformedData = transformMercadoLibreData(allResults.slice(0, limit));

    return NextResponse.json({
      data: transformedData,
      paging: {
        total: allResults.length,
        offset,
        limit: transformedData.length,
      },
      source: 'api',
    });
  } catch (error) {
    console.error('Error fetching from MercadoLibre:', error);
    
    // Intentar cargar datos locales como fallback
    try {
      const localData = await loadLocalData();
      if (localData.length > 0) {
        const { searchParams } = new URL(request.url);
        const offset = parseInt(searchParams.get('offset') || '0');
        const limit = parseInt(searchParams.get('limit') || '50');
        
        return NextResponse.json({
          data: localData.slice(offset, offset + limit),
          paging: {
            total: localData.length,
            offset,
            limit,
          },
          source: 'local',
          error: error instanceof Error ? error.message : 'Unknown error',
          warning: 'API request failed, using local data as fallback',
        });
      }
    } catch (localError) {
      console.error('Error loading local data:', localError);
    }
    
    // Si todo falla, devolver error
    return NextResponse.json(
      {
        data: [],
        paging: { total: 0, offset: 0, limit: 0 },
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'error',
      },
      { status: 500 }
    );
  }
}


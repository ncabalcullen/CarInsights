const fs = require('fs');
const path = require('path');

// Configuration
const SITE_ID = 'MLA'; // Argentina
const CATEGORY_ID = 'MLA1744'; // Autos (This is a guess, we will fetch it dynamically or use search)
const OUTPUT_FILE = path.join(__dirname, '../public/data/vehicles.json');
const LIMIT = 50;
const MAX_ITEMS = 200; // Limit for prototype to avoid rate limits

// Top brands to search for to get a good mix
const BRANDS = ['Toyota', 'Volkswagen', 'Ford', 'Chevrolet', 'Peugeot'];

async function fetchWithDelay(url, options = {}) {
  // Add a small delay to be nice to the API
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Fetching: ${url}`);
  const response = await fetch(url, {
    ...options,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
      ...options.headers
    }
  });
  
  if (!response.ok) {
    if (response.status === 403) {
      console.error('Error: 403 Forbidden. You might be rate limited or IP blocked.');
      console.error('Try running this script locally or using a VPN.');
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function ingest() {
  let allVehicles = [];

  try {
    console.log('Starting ingestion...');

    for (const brand of BRANDS) {
      console.log(`Searching for ${brand}...`);
      // Search for vehicles of this brand
      // We filter by category MLA1744 (Autos) implicitly by adding "Autos" to query or using category filter if known
      // Using simple search query for now
      const searchUrl = `https://api.mercadolibre.com/sites/${SITE_ID}/search?q=${encodeURIComponent(brand + ' autos')}&limit=${LIMIT}`;
      
      const data = await fetchWithDelay(searchUrl);
      
      if (data.results) {
        const items = data.results.map(item => {
          // Extract attributes
          const getAttr = (id) => item.attributes.find(a => a.id === id)?.value_name;
          
          const km = getAttr('KILOMETERS');
          const year = getAttr('VEHICLE_YEAR');
          const brandAttr = getAttr('BRAND');
          const modelAttr = getAttr('MODEL');

          // Parse numbers
          const kmValue = km ? parseInt(km.replace(/\D/g, ''), 10) : null;
          const yearValue = year ? parseInt(year, 10) : null;

          return {
            id: item.id,
            title: item.title,
            price: item.price,
            currency_id: item.currency_id,
            permalink: item.permalink,
            thumbnail: item.thumbnail,
            condition: item.condition,
            attributes: {
              brand: brandAttr || brand,
              model: modelAttr || 'Unknown',
              year: yearValue,
              kilometers: kmValue,
            }
          };
        });

        allVehicles = [...allVehicles, ...items];
        console.log(`Fetched ${items.length} items for ${brand}`);
      }
    }

    // Deduplicate by ID
    const uniqueVehicles = Array.from(new Map(allVehicles.map(item => [item.id, item])).values());

    console.log(`Total unique vehicles fetched: ${uniqueVehicles.length}`);

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uniqueVehicles, null, 2));
    console.log(`Data saved to ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('Ingestion failed:', error);
    process.exit(1);
  }
}

ingest();

const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../public/data/vehicles.json');
const COUNT = 300;

const BRANDS = ['Toyota', 'Volkswagen', 'Ford', 'Chevrolet', 'Peugeot', 'Renault', 'Fiat'];
const MODELS = {
    'Toyota': ['Corolla', 'Hilux', 'Etios', 'Yaris'],
    'Volkswagen': ['Gol', 'Amarok', 'Vento', 'Polo'],
    'Ford': ['Ranger', 'Focus', 'Fiesta', 'Ecosport'],
    'Chevrolet': ['Cruze', 'Onix', 'S10', 'Tracker'],
    'Peugeot': ['208', '308', '2008', 'Partner'],
    'Renault': ['Sandero', 'Clio', 'Kangoo', 'Duster'],
    'Fiat': ['Cronos', 'Toro', 'Argo', 'Mobi']
};

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMockData() {
    const vehicles = [];

    for (let i = 0; i < COUNT; i++) {
        const brand = BRANDS[randomInt(0, BRANDS.length - 1)];
        const models = MODELS[brand];
        const model = models[randomInt(0, models.length - 1)];
        const year = randomInt(2010, 2024);

        // Logic for price/km correlation
        // Newer cars have less KM and higher price
        // KM = (2025 - year) * 15000 +/- random
        const age = 2025 - year;
        const baseKm = age * 12000;
        const km = Math.max(0, baseKm + randomInt(-5000, 20000));

        // Price based on year and model "tier" (random factor)
        const basePrice = 10000000; // 10M ARS base
        const yearFactor = (year - 2010) * 1000000;
        const kmFactor = km * -50; // -50 ARS per km
        const randomFactor = randomInt(-1000000, 1000000);

        let price = basePrice + yearFactor + kmFactor + randomFactor;
        price = Math.max(2000000, price); // Min price 2M

        vehicles.push({
            id: `MOCK-${i}`,
            title: `${brand} ${model} ${year} ${km}km`,
            price: price,
            currency_id: 'ARS',
            permalink: '#',
            thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_608145-MLA46617056234_072021-O.webp', // Generic placeholder
            condition: 'used',
            attributes: {
                brand: brand,
                model: model,
                year: year,
                kilometers: km
            }
        });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(vehicles, null, 2));
    console.log(`Generated ${COUNT} mock vehicles in ${OUTPUT_FILE}`);
}

generateMockData();

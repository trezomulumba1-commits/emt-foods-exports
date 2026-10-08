import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'KP-01',
    name: 'Dried Kapenta',
    description: 'Premium sourced, sun-dried Kapenta (freshwater sardine-like fish) harvested from Lake Tanganyika and Lake Kariba. High protein content, carefully cleaned and sun-dried on elevated racks under strict phytosanitary guidelines.',
    category: 'Dried Fish & Seafood',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9QEK1bcHZYhfvYHK7v9TlgNWusfUvJM-rZC_8QKsM9_BrHtBSym4EGMiTnH-i7XiumdAR-Sowa8TjmlMkIDC3npq7q8H1a4XThgszIaXJc_1US3YK1WcR5ATNJP1P_rgNmE4ANxnsPQOrVaA7KYnJ27oeOrlAaQgf2gMJw1rXOGkTBB-PCTtsLN7rMC8v5AWjV8weM16ZmILAivcJva9Imula16d6wOmnW7v0pcGqK8LlVGAxBBmnpRGx93MyzSJKaKsCyzi7M0M',
    price: 4.50, // USD per kg
    qualityGrade: 'Premium A',
    moisturePercent: 8.5,
    batchNumber: 'KP-2026-B12',
    warehouse: 'Lusaka',
    inspectionNotes: 'Meets EU importing standards. Total volatile basic nitrogen below limit. Excellent dry factor.',
    harvestDate: '2026-05-14',
    supplier: 'Lake Tanganyika Artisanal Fishery'
  },
  {
    id: '2',
    sku: 'DB-02',
    name: 'Dried Bream',
    description: 'Large, sustainably farmed freshwater Bream fish from local Kafue and Kariba aquaculture pens. Gutted, scaled, split-opened, salted mildly, and dried to golden perfection. High omega-3 and pure taste.',
    category: 'Dried Fish & Seafood',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB43awMIiJTMSK_waO5Vhob1tRoJgBYgD_F39IFKHVqAjnM_1ILtPr6gkFzOfzsXx4D6KrCsOaBD_w1eKOuDhAm8k3hugLWW6t58V_uvYfzvLDfnnTO3jJFs8YC3qBqtQa58eftDf2jusXrYFJxLD28d3Rn0SVYo_mbDRDzGTPnK6u-lf9qgnPs2cGmrp6F5qMkUotn2hDGPrNM8dNRvEHBhzPYOq5U9TsBDnXyr4dyoRZpqoXjcDt8MuNb4Y5zj1jtkg0Jgpo28Nk',
    price: 6.80, // USD per kg
    qualityGrade: 'Premium A',
    moisturePercent: 11.2,
    batchNumber: 'BR-2026-B05',
    warehouse: 'Ndola',
    inspectionNotes: 'No signs of lipid oxidation. Moisture levels perfectly within export tolerances.',
    harvestDate: '2026-05-22',
    supplier: 'Kafue Blue Aqua Farms'
  },
  {
    id: '3',
    sku: 'PO-03',
    name: 'Palm Oil',
    description: '100% natural, unrefined high-carotene palm oil sourced from certified local micro-millers in Luapula Province. Excellent flavor profile, brilliant natural orange-red color, and zero artificial additives.',
    category: 'Vegetable Oils',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV3obVhKvDxCupH8fMDw9xjjEkl0EH9p-ba0m8Wqn9O7TieqhKB0LE_n9vOeHY-L5Fm6qGTVb-eq5HpBq3iNLuaN2YGqZvdgNMzdsz_CDJ1F2IBHfo8CiiRQcXe6X9-qnh7_eKaLYJ1LDuJkalP7Rsv6BTusocjKbLRz2aUpnnkl6Pvn0dJT9_Yb3YhnM7SeeXCLzAtKq602UTlOFRoan0TWMRhc7JRrDF2oLwSVSSUHxOtCwwCyqE1PmeWvsB3-Nq6TfReBxXsg8',
    price: 3.20, // USD per liter
    qualityGrade: 'Premium A',
    moisturePercent: 0.15,
    batchNumber: 'PO-2026-L90',
    warehouse: 'Kitwe',
    inspectionNotes: 'Acid value 2.4%, peroxide value under 5 meq/kg. Premium export quality.',
    harvestDate: '2026-06-02',
    supplier: 'Luapula Palms Cooperative'
  },
  {
    id: '4',
    sku: 'SS-04',
    name: 'Sesame Seeds',
    description: 'Premium organic white sesame seeds grown in the fertile soils of Southern and Eastern Provinces of Zambia. Triple-cleaned, color-sorted, and 99.9% pure. Rich in healthy fats and nutty flavor.',
    category: 'Grains & Seeds',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCndcJWcKpc0Eig73hyoJqxl5SwariWVll-5K4-5wpkDucu0VkTJIIsIXzpQSgMndppQMeQc5H9HXFAQFryxZPU3g64yJYZasic6m3U6poGRp44VDLSdU4tQfBfkGEhyde-pi-JaseF3frJxnfGmjzrSmxftrIGmqboSiDujKQRkY9YQPLRVrjGNV7JjwYvdADaX754gTEbqBIrQduF-mD7NUXyWSpDb2pw-FfarwAsf7sSDyerWkaHW0Z3v0bbkGCyOxOIlyKx-w8',
    price: 1.95, // USD per kg
    qualityGrade: 'Premium A',
    moisturePercent: 4.8,
    batchNumber: 'SS-2026-S11',
    warehouse: 'Livingstone',
    inspectionNotes: 'Free fatty acid ratio under 1.5%. Microbiological inspection fully passed.',
    harvestDate: '2026-04-30',
    supplier: 'Choma Agricultural Union'
  },
  {
    id: '5',
    sku: 'CF-05',
    name: 'Cotton Fabrics',
    description: 'High-grade 100% African-sourced cotton fabric, printed with beautiful traditional and contemporary Zambian chitenge designs. Richly saturated colors, durable weave, and colorfast finish.',
    category: 'Textiles & Apparel',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvyaO7aNfMXgQByqwprC6Sa12cvP7TaiYag2MJhhLDH8nT-jCnIhEZHj2qGLRTChLIBoG9LfMRAPm2r5wiIZcRw55SjPQx00fqqo2F8rg5QSwPPdeLTATp2pPCHxLW_56aaDOkcqLCljSoXpev2ABCFfa_sncK9UFlsmOAQYh72tRScPy8w50CZdNeP-CQs1-NYQx8zqh91iOmUWyr39Qcb2x6DskfXIAHb_1DdV6s8cmAFlL3uawBJ-BGy26QMdlLdbOdabTK8fU',
    price: 8.50, // USD per meter
    qualityGrade: 'Premium A',
    batchNumber: 'TX-2026-M43',
    warehouse: 'Lusaka',
    inspectionNotes: 'No dye bleeding. Warp and weft density verified. Soft hand-feel.',
    harvestDate: '2026-05-10',
    supplier: 'Mulungushi Textile Group'
  },
  {
    id: '6',
    sku: 'JZ-06',
    name: 'Copper Queens Replica Jersey',
    description: 'Official replica jersey of the Zambian Women National Football Team. Breathable moisture-wicking fabric, vibrant green and orange colors, embroidered crest.',
    category: 'Jerseys & Apparel',
    image: 'https://example.com/jersey.jpg',
    price: 25.00,
    qualityGrade: 'Premium A',
    batchNumber: 'JZ-2026-A01',
    warehouse: 'Lusaka',
    inspectionNotes: 'Fabric integrity verified. Stitching reinforced.',
    harvestDate: '2026-06-15',
    supplier: 'Zambia Sportswear Ltd'
  }
];

export const SAMPLE_CATEGORIES = [
  'All Categories',
  'Dried Fish & Seafood',
  'Vegetable Oils',
  'Grains & Seeds',
  'Textiles & Apparel',
  'Jerseys & Apparel',
  'Other Custom Goods'
];

export const ZAMBIAN_WAREHOUSES = [
  { id: 'LUS', name: 'Lusaka Main Depot', city: 'Lusaka', capacity: '15,000 Tons', manager: 'Bwalya Phiri' },
  { id: 'KIT', name: 'Kitwe Central Warehouse', city: 'Kitwe', capacity: '8,000 Tons', manager: 'Mwelwa Mulenga' },
  { id: 'NDO', name: 'Ndola Export Depot', city: 'Ndola', capacity: '12,000 Tons', manager: 'Grace Chilufya' },
  { id: 'LIV', name: 'Livingstone Hub', city: 'Livingstone', capacity: '5,000 Tons', manager: 'Sitali Mubita' }
];

export const DESTINATIONS = [
  { code: 'LHR', name: 'London Gateway (LHR), United Kingdom', region: 'Europe', baseRate: 1.4 },
  { code: 'RTM', name: 'Port of Rotterdam, Netherlands', region: 'Europe', baseRate: 1.15 },
  { code: 'DXB', name: 'Dubai Jebel Ali (DXB), UAE', region: 'Middle East', baseRate: 0.95 },
  { code: 'HAM', name: 'Hamburg Port, Germany', region: 'Europe', baseRate: 1.2 },
  { code: 'SGP', name: 'Singapore Changi (SIN), Singapore', region: 'Asia', baseRate: 1.5 },
  { code: 'JFK', name: 'New York (JFK), United States', region: 'North America', baseRate: 1.75 },
  { code: 'ZRA', name: 'Johannesburg (ZRA), South Africa', region: 'Africa', baseRate: 0.5 },
  { code: 'ZMW', name: 'Lusaka (ZRA) zambia', region: 'Africa', baseRate: 0.5 }
];

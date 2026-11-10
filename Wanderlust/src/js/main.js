(function () {
'use strict';


const config = Object.freeze({
  ticketmasterApiKey: ''
});

//  api-service 
const CACHE_TTL = 30 * 60 * 1000;

const COUNTRY_META_FALLBACK = {
  EG: { callingCode: '+20', drivingSide: 'Right', weekStart: 'Saturday', continent: 'Africa', subregion: 'Northern Africa', utcOffset: 'UTC+02:00', timezone: 'Africa/Cairo', languages: ['Arabic'], currencies: { EGP: { name: 'Egyptian Pound', symbol: '£' } }, borders: ['LBY', 'SDN', 'ISR', 'PSE'], population: 109262178, area: 1002450, capital: ['Cairo'], coordinates: { latitude: 30.0444, longitude: 31.2357 } },
  FR: { callingCode: '+33', drivingSide: 'Right', weekStart: 'Monday', continent: 'Europe', subregion: 'Western Europe', utcOffset: 'UTC+01:00', timezone: 'Europe/Paris', languages: ['French'], currencies: { EUR: { name: 'Euro', symbol: '€' } }, borders: ['AND', 'BEL', 'DEU', 'ITA', 'LUX', 'MCO', 'ESP', 'CHE'], population: 67391582, area: 551695, capital: ['Paris'], coordinates: { latitude: 48.8566, longitude: 2.3522 } },
  US: { callingCode: '+1', drivingSide: 'Right', weekStart: 'Sunday', continent: 'North America', subregion: 'Northern America', utcOffset: 'UTC-05:00', timezone: 'America/New_York', languages: ['English'], currencies: { USD: { name: 'United States Dollar', symbol: '$' } }, borders: ['CAN', 'MEX'], population: 331449281, area: 9372610, capital: ['Washington, D.C.'], coordinates: { latitude: 40.7128, longitude: -74.006 } },
  GB: { callingCode: '+44', drivingSide: 'Left', weekStart: 'Monday', continent: 'Europe', subregion: 'Northern Europe', utcOffset: 'UTC+00:00', timezone: 'Europe/London', languages: ['English'], currencies: { GBP: { name: 'British Pound', symbol: '£' } }, borders: ['IRL'], population: 67215293, area: 242900, capital: ['London'], coordinates: { latitude: 51.5074, longitude: -0.1278 } },
  DE: { callingCode: '+49', drivingSide: 'Right', weekStart: 'Monday', continent: 'Europe', subregion: 'Western Europe', utcOffset: 'UTC+01:00', timezone: 'Europe/Berlin', languages: ['German'], currencies: { EUR: { name: 'Euro', symbol: '€' } }, borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE'], population: 83240525, area: 357114, capital: ['Berlin'], coordinates: { latitude: 52.52, longitude: 13.405 } },
  IT: { callingCode: '+39', drivingSide: 'Right', weekStart: 'Monday', continent: 'Europe', subregion: 'Southern Europe', utcOffset: 'UTC+01:00', timezone: 'Europe/Rome', languages: ['Italian'], currencies: { EUR: { name: 'Euro', symbol: '€' } }, borders: ['AUT', 'FRA', 'SMR', 'SVN', 'CHE', 'VAT'], population: 59554023, area: 301336, capital: ['Rome'], coordinates: { latitude: 41.9028, longitude: 12.4964 } },
  ES: { callingCode: '+34', drivingSide: 'Right', weekStart: 'Monday', continent: 'Europe', subregion: 'Southern Europe', utcOffset: 'UTC+01:00', timezone: 'Europe/Madrid', languages: ['Spanish'], currencies: { EUR: { name: 'Euro', symbol: '€' } }, borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'], population: 47351567, area: 505992, capital: ['Madrid'], coordinates: { latitude: 40.4168, longitude: -3.7038 } },
  AE: { callingCode: '+971', drivingSide: 'Right', weekStart: 'Monday', continent: 'Asia', subregion: 'Western Asia', utcOffset: 'UTC+04:00', timezone: 'Asia/Dubai', languages: ['Arabic'], currencies: { AED: { name: 'UAE Dirham', symbol: 'د.إ' } }, borders: ['OMN', 'SAU'], population: 9890400, area: 83600, capital: ['Abu Dhabi'], coordinates: { latitude: 25.2048, longitude: 55.2708 } },
  SA: { callingCode: '+966', drivingSide: 'Right', weekStart: 'Sunday', continent: 'Asia', subregion: 'Western Asia', utcOffset: 'UTC+03:00', timezone: 'Asia/Riyadh', languages: ['Arabic'], currencies: { SAR: { name: 'Saudi Riyal', symbol: 'ر.س' } }, borders: ['IRQ', 'JOR', 'KWT', 'OMN', 'QAT', 'ARE', 'YEM'], population: 34813867, area: 2149690, capital: ['Riyadh'], coordinates: { latitude: 24.7136, longitude: 46.6753 } },
  JP: { callingCode: '+81', drivingSide: 'Left', weekStart: 'Sunday', continent: 'Asia', subregion: 'Eastern Asia', utcOffset: 'UTC+09:00', timezone: 'Asia/Tokyo', languages: ['Japanese'], currencies: { JPY: { name: 'Japanese Yen', symbol: '¥' } }, borders: [], population: 125836021, area: 377930, capital: ['Tokyo'], coordinates: { latitude: 35.6762, longitude: 139.6503 } },
  CA: { callingCode: '+1', drivingSide: 'Right', weekStart: 'Sunday', continent: 'North America', subregion: 'Northern America', utcOffset: 'UTC-05:00', timezone: 'America/Toronto', languages: ['English', 'French'], currencies: { CAD: { name: 'Canadian Dollar', symbol: '$' } }, borders: ['USA'], population: 38005238, area: 9984670, capital: ['Ottawa'], coordinates: { latitude: 43.6532, longitude: -79.3832 } },
  IN: { callingCode: '+91', drivingSide: 'Left', weekStart: 'Sunday', continent: 'Asia', subregion: 'Southern Asia', utcOffset: 'UTC+05:30', timezone: 'Asia/Kolkata', languages: ['Hindi', 'English'], currencies: { INR: { name: 'Indian Rupee', symbol: '₹' } }, borders: ['BGD', 'BTN', 'MMR', 'CHN', 'NPL', 'PAK'], population: 1380004385, area: 3287590, capital: ['New Delhi'], coordinates: { latitude: 28.6139, longitude: 77.209 } },
  BR: { callingCode: '+55', drivingSide: 'Right', weekStart: 'Sunday', continent: 'South America', subregion: 'South America', utcOffset: 'UTC-03:00', timezone: 'America/Sao_Paulo', languages: ['Portuguese'], currencies: { BRL: { name: 'Brazilian Real', symbol: 'R$' } }, borders: ['ARG', 'BOL', 'COL', 'GUF', 'GUY', 'PRY', 'PER', 'SUR', 'URY', 'VEN'], population: 212559409, area: 8515767, capital: ['Brasília'], coordinates: { latitude: -23.5505, longitude: -46.6333 } },
  AU: { callingCode: '+61', drivingSide: 'Left', weekStart: 'Monday', continent: 'Oceania', subregion: 'Australia and New Zealand', utcOffset: 'UTC+10:00', timezone: 'Australia/Sydney', languages: ['English'], currencies: { AUD: { name: 'Australian Dollar', symbol: '$' } }, borders: [], population: 25687041, area: 7692024, capital: ['Canberra'], coordinates: { latitude: -33.8688, longitude: 151.2093 } },
  TR: { callingCode: '+90', drivingSide: 'Right', weekStart: 'Monday', continent: 'Asia', subregion: 'Western Asia', utcOffset: 'UTC+03:00', timezone: 'Europe/Istanbul', languages: ['Turkish'], currencies: { TRY: { name: 'Turkish Lira', symbol: '₺' } }, borders: ['ARM', 'AZE', 'BGR', 'GEO', 'GRC', 'IRN', 'IRQ', 'SYR'], population: 84339067, area: 783562, capital: ['Ankara'], coordinates: { latitude: 41.0082, longitude: 28.9784 } },
  MA: { callingCode: '+212', drivingSide: 'Right', weekStart: 'Monday', continent: 'Africa', subregion: 'Northern Africa', utcOffset: 'UTC+01:00', timezone: 'Africa/Casablanca', languages: ['Arabic', 'Berber'], currencies: { MAD: { name: 'Moroccan Dirham', symbol: 'د.م.' } }, borders: ['DZA', 'ESH', 'ESP'], population: 36910558, area: 446550, capital: ['Rabat'], coordinates: { latitude: 33.5731, longitude: -7.5898 } }
};

const PRESET_CITY_COORDS = {
  EG: [
    { name: 'Cairo', lat: 30.0444, lon: 31.2357, timezone: 'Africa/Cairo' },
    { name: 'Alexandria', lat: 31.2001, lon: 29.9187, timezone: 'Africa/Cairo' },
    { name: 'Giza', lat: 30.0131, lon: 31.2089, timezone: 'Africa/Cairo' },
    { name: 'Luxor', lat: 25.6872, lon: 32.6396, timezone: 'Africa/Cairo' },
    { name: 'Aswan', lat: 24.0889, lon: 32.8998, timezone: 'Africa/Cairo' },
    { name: 'Hurghada', lat: 27.2579, lon: 33.8116, timezone: 'Africa/Cairo' },
    { name: 'Sharm El Sheikh', lat: 27.9158, lon: 34.3300, timezone: 'Africa/Cairo' }
  ],
  US: [
    { name: 'New York', lat: 40.7128, lon: -74.006, timezone: 'America/New_York' },
    { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, timezone: 'America/Los_Angeles' },
    { name: 'Chicago', lat: 41.8781, lon: -87.6298, timezone: 'America/Chicago' },
    { name: 'Miami', lat: 25.7617, lon: -80.1918, timezone: 'America/New_York' },
    { name: 'San Francisco', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles' }
  ],
  GB: [
    { name: 'London', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
    { name: 'Edinburgh', lat: 55.9533, lon: -3.1883, timezone: 'Europe/London' },
    { name: 'Manchester', lat: 53.4808, lon: -2.2426, timezone: 'Europe/London' }
  ],
  FR: [
    { name: 'Paris', lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' },
    { name: 'Nice', lat: 43.7102, lon: 7.262, timezone: 'Europe/Paris' },
    { name: 'Lyon', lat: 45.764, lon: 4.8357, timezone: 'Europe/Paris' }
  ],
  DE: [
    { name: 'Berlin', lat: 52.52, lon: 13.405, timezone: 'Europe/Berlin' },
    { name: 'Munich', lat: 48.1351, lon: 11.582, timezone: 'Europe/Berlin' },
    { name: 'Frankfurt', lat: 50.1109, lon: 8.6821, timezone: 'Europe/Berlin' }
  ],
  IT: [
    { name: 'Rome', lat: 41.9028, lon: 12.4964, timezone: 'Europe/Rome' },
    { name: 'Florence', lat: 43.7696, lon: 11.2558, timezone: 'Europe/Rome' },
    { name: 'Venice', lat: 45.4408, lon: 12.3155, timezone: 'Europe/Rome' },
    { name: 'Milan', lat: 45.4642, lon: 9.19, timezone: 'Europe/Rome' }
  ],
  ES: [
    { name: 'Madrid', lat: 40.4168, lon: -3.7038, timezone: 'Europe/Madrid' },
    { name: 'Barcelona', lat: 41.3851, lon: 2.1734, timezone: 'Europe/Madrid' },
    { name: 'Seville', lat: 37.3891, lon: -5.9845, timezone: 'Europe/Madrid' }
  ],
  AE: [
    { name: 'Dubai', lat: 25.2048, lon: 55.2708, timezone: 'Asia/Dubai' },
    { name: 'Abu Dhabi', lat: 24.4539, lon: 54.3773, timezone: 'Asia/Dubai' }
  ],
  SA: [
    { name: 'Riyadh', lat: 24.7136, lon: 46.6753, timezone: 'Asia/Riyadh' },
    { name: 'Jeddah', lat: 21.4858, lon: 39.1925, timezone: 'Asia/Riyadh' },
    { name: 'Mecca', lat: 21.3891, lon: 39.8579, timezone: 'Asia/Riyadh' }
  ],
  JP: [
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
    { name: 'Kyoto', lat: 35.0116, lon: 135.7681, timezone: 'Asia/Tokyo' },
    { name: 'Osaka', lat: 34.6937, lon: 135.5023, timezone: 'Asia/Tokyo' }
  ],
  CA: [
    { name: 'Toronto', lat: 43.6532, lon: -79.3832, timezone: 'America/Toronto' },
    { name: 'Vancouver', lat: 49.2827, lon: -123.1207, timezone: 'America/Vancouver' },
    { name: 'Montreal', lat: 45.5017, lon: -73.5673, timezone: 'America/Toronto' }
  ],
  IN: [
    { name: 'New Delhi', lat: 28.6139, lon: 77.209, timezone: 'Asia/Kolkata' },
    { name: 'Mumbai', lat: 19.076, lon: 72.8777, timezone: 'Asia/Kolkata' }
  ],
  BR: [
    { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, timezone: 'America/Sao_Paulo' },
    { name: 'São Paulo', lat: -23.5505, lon: -46.6333, timezone: 'America/Sao_Paulo' }
  ],
  AU: [
    { name: 'Sydney', lat: -33.8688, lon: 151.2093, timezone: 'Australia/Sydney' },
    { name: 'Melbourne', lat: -37.8136, lon: 144.9631, timezone: 'Australia/Melbourne' }
  ],
  TR: [
    { name: 'Istanbul', lat: 41.0082, lon: 28.9784, timezone: 'Europe/Istanbul' },
    { name: 'Ankara', lat: 39.9334, lon: 32.8597, timezone: 'Europe/Istanbul' }
  ],
  MA: [
    { name: 'Casablanca', lat: 33.5731, lon: -7.5898, timezone: 'Africa/Casablanca' },
    { name: 'Marrakech', lat: 31.6295, lon: -7.9811, timezone: 'Africa/Casablanca' },
    { name: 'Rabat', lat: 34.0209, lon: -6.8416, timezone: 'Africa/Casablanca' }
  ],
  MX: [
    { name: 'Mexico City', lat: 19.4326, lon: -99.1332, timezone: 'America/Mexico_City' },
    { name: 'Cancún', lat: 21.1619, lon: -86.8515, timezone: 'America/Cancun' }
  ],
  CN: [
    { name: 'Beijing', lat: 39.9042, lon: 116.4074, timezone: 'Asia/Shanghai' },
    { name: 'Shanghai', lat: 31.2304, lon: 121.4737, timezone: 'Asia/Shanghai' }
  ],
  NL: [
    { name: 'Amsterdam', lat: 52.3676, lon: 4.9041, timezone: 'Europe/Amsterdam' },
    { name: 'Rotterdam', lat: 51.9244, lon: 4.4777, timezone: 'Europe/Amsterdam' }
  ],
  GR: [
    { name: 'Athens', lat: 37.9838, lon: 23.7275, timezone: 'Europe/Athens' },
    { name: 'Santorini', lat: 36.3932, lon: 25.4615, timezone: 'Europe/Athens' }
  ],
  PT: [
    { name: 'Lisbon', lat: 38.7223, lon: -9.1393, timezone: 'Europe/Lisbon' },
    { name: 'Porto', lat: 41.1579, lon: -8.6291, timezone: 'Europe/Lisbon' }
  ],
  SE: [
    { name: 'Stockholm', lat: 59.3293, lon: 18.0686, timezone: 'Europe/Stockholm' },
    { name: 'Gothenburg', lat: 57.7089, lon: 11.9746, timezone: 'Europe/Stockholm' }
  ],
  NO: [
    { name: 'Oslo', lat: 59.9139, lon: 10.7522, timezone: 'Europe/Oslo' },
    { name: 'Bergen', lat: 60.3913, lon: 5.3221, timezone: 'Europe/Oslo' }
  ],
  DK: [
    { name: 'Copenhagen', lat: 55.6761, lon: 12.5683, timezone: 'Europe/Copenhagen' }
  ],
  FI: [
    { name: 'Helsinki', lat: 60.1699, lon: 24.9384, timezone: 'Europe/Helsinki' }
  ],
  AT: [
    { name: 'Vienna', lat: 48.2082, lon: 16.3738, timezone: 'Europe/Vienna' },
    { name: 'Salzburg', lat: 47.8095, lon: 13.0550, timezone: 'Europe/Vienna' }
  ],
  CH: [
    { name: 'Zurich', lat: 47.3769, lon: 8.5417, timezone: 'Europe/Zurich' },
    { name: 'Geneva', lat: 46.2044, lon: 6.1432, timezone: 'Europe/Zurich' },
    { name: 'Bern', lat: 46.9480, lon: 7.4474, timezone: 'Europe/Zurich' }
  ],
  BE: [
    { name: 'Brussels', lat: 50.8503, lon: 4.3517, timezone: 'Europe/Brussels' },
    { name: 'Antwerp', lat: 51.2194, lon: 4.4025, timezone: 'Europe/Brussels' }
  ],
  PL: [
    { name: 'Warsaw', lat: 52.2297, lon: 21.0122, timezone: 'Europe/Warsaw' },
    { name: 'Krakow', lat: 50.0647, lon: 19.9450, timezone: 'Europe/Warsaw' }
  ],
  CZ: [
    { name: 'Prague', lat: 50.0755, lon: 14.4378, timezone: 'Europe/Prague' }
  ],
  HU: [
    { name: 'Budapest', lat: 47.4979, lon: 19.0402, timezone: 'Europe/Budapest' }
  ],
  IE: [
    { name: 'Dublin', lat: 53.3498, lon: -6.2603, timezone: 'Europe/Dublin' }
  ],
  AR: [
    { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816, timezone: 'America/Argentina/Buenos_Aires' }
  ],
  ZA: [
    { name: 'Cape Town', lat: -33.9249, lon: 18.4241, timezone: 'Africa/Johannesburg' },
    { name: 'Johannesburg', lat: -26.2041, lon: 28.0473, timezone: 'Africa/Johannesburg' }
  ],
  KR: [
    { name: 'Seoul', lat: 37.5665, lon: 126.9780, timezone: 'Asia/Seoul' }
  ],
  SG: [
    { name: 'Singapore', lat: 1.3521, lon: 103.8198, timezone: 'Asia/Singapore' }
  ],
  NZ: [
    { name: 'Auckland', lat: -36.8485, lon: 174.7633, timezone: 'Pacific/Auckland' },
    { name: 'Wellington', lat: -41.2866, lon: 174.7756, timezone: 'Pacific/Auckland' }
  ],
  RU: [
    { name: 'Moscow', lat: 55.7558, lon: 37.6173, timezone: 'Europe/Moscow' },
    { name: 'Saint Petersburg', lat: 59.9343, lon: 30.3351, timezone: 'Europe/Moscow' }
  ]
};


const COUNTRY_CAPITALS_COORDS = {
  AD: ['Andorra la Vella', 42.5063, 1.5218], AL: ['Tirana', 41.3275, 19.8187], AM: ['Yerevan', 40.1792, 44.4991],
  AR: ['Buenos Aires', -34.6037, -58.3816], AT: ['Vienna', 48.2082, 16.3738], AU: ['Sydney', -33.8688, 151.2093],
  AX: ['Mariehamn', 60.0970, 19.9348], BA: ['Sarajevo', 43.8563, 18.4131], BB: ['Bridgetown', 13.1132, -59.5988],
  BE: ['Brussels', 50.8503, 4.3517], BG: ['Sofia', 42.6977, 23.3219], BJ: ['Porto-Novo', 6.4969, 2.6289],
  BO: ['La Paz', -16.4897, -68.1193], BR: ['Rio de Janeiro', -22.9068, -43.1729], BS: ['Nassau', 25.0443, -77.3504],
  BW: ['Gaborone', -24.6282, 25.9231], BY: ['Minsk', 53.9006, 27.5590], BZ: ['Belmopan', 17.2510, -88.7590],
  CA: ['Toronto', 43.6532, -79.3832], CD: ['Kinshasa', -4.4419, 15.2663], CG: ['Brazzaville', -4.2634, 15.2429],
  CH: ['Zurich', 47.3769, 8.5417], CL: ['Santiago', -33.4489, -70.6693], CN: ['Beijing', 39.9042, 116.4074],
  CO: ['Bogotá', 4.7110, -74.0721], CR: ['San José', 9.9281, -84.0907], CU: ['Havana', 23.1136, -82.3666],
  CY: ['Nicosia', 35.1856, 33.3823], CZ: ['Prague', 50.0755, 14.4378], DE: ['Berlin', 52.5200, 13.4050],
  DK: ['Copenhagen', 55.6761, 12.5683], DO: ['Santo Domingo', 18.4861, -69.9312], DZ: ['Algiers', 36.7538, 3.0588],
  EC: ['Quito', -0.1807, -78.4678], EE: ['Tallinn', 59.4370, 24.7536], EG: ['Cairo', 30.0444, 31.2357],
  ES: ['Madrid', 40.4168, -3.7038], FI: ['Helsinki', 60.1699, 24.9384], FO: ['Tórshavn', 62.0079, -6.7910],
  FR: ['Paris', 48.8566, 2.3522], GA: ['Libreville', 0.4162, 9.4673], GB: ['London', 51.5074, -0.1278],
  GD: ["St. George's", 12.0561, -61.7488], GE: ['Tbilisi', 41.7151, 44.8271], GG: ['St. Peter Port', 49.4554, -2.5369],
  GI: ['Gibraltar', 36.1408, -5.3536], GL: ['Nuuk', 64.1814, -51.6941], GM: ['Banjul', 13.4549, -16.5790],
  GR: ['Athens', 37.9838, 23.7275], GT: ['Guatemala City', 14.6349, -90.5069], GY: ['Georgetown', 6.8013, -58.1551],
  HK: ['Hong Kong', 22.3193, 114.1694], HN: ['Tegucigalpa', 14.0723, -87.1921], HR: ['Zagreb', 45.8150, 15.9819],
  HT: ['Port-au-Prince', 18.5944, -72.3074], HU: ['Budapest', 47.4979, 19.0402], ID: ['Jakarta', -6.2088, 106.8456],
  IE: ['Dublin', 53.3498, -6.2603], IM: ['Douglas', 54.1523, -4.4861], IN: ['New Delhi', 28.6139, 77.2090],
  IS: ['Reykjavík', 64.1466, -21.9426], IT: ['Rome', 41.9028, 12.4964], JE: ['Saint Helier', 49.1868, -2.1066],
  JM: ['Kingston', 18.0179, -76.8099], JP: ['Tokyo', 35.6762, 139.6503], KR: ['Seoul', 37.5665, 126.9780],
  KZ: ['Astana', 51.1694, 71.4491], LI: ['Vaduz', 47.1410, 9.5209], LS: ['Maseru', -29.3151, 27.4869],
  LT: ['Vilnius', 54.6872, 25.2797], LU: ['Luxembourg', 49.6116, 6.1319], LV: ['Riga', 56.9496, 24.1052],
  MA: ['Casablanca', 33.5731, -7.5898], MC: ['Monaco', 43.7384, 7.4246], MD: ['Chișinău', 47.0105, 28.8638],
  ME: ['Podgorica', 42.4304, 19.2594], MG: ['Antananarivo', -18.8792, 47.5079], MK: ['Skopje', 41.9981, 21.4254],
  MN: ['Ulaanbaatar', 47.8864, 106.9057], MS: ['Plymouth', 16.7065, -62.2157], MT: ['Valletta', 35.8989, 14.5146],
  MX: ['Mexico City', 19.4326, -99.1332], MZ: ['Maputo', -25.9692, 32.5732], NA: ['Windhoek', -22.5609, 17.0658],
  NE: ['Niamey', 13.5116, 2.1254], NG: ['Abuja', 9.0765, 7.3986], NI: ['Managua', 12.1150, -86.2362],
  NL: ['Amsterdam', 52.3676, 4.9041], NO: ['Oslo', 59.9139, 10.7522], NZ: ['Auckland', -36.8485, 174.7633],
  PA: ['Panama City', 8.9824, -79.5199], PE: ['Lima', -12.0464, -77.0428], PG: ['Port Moresby', -9.4438, 147.1803],
  PH: ['Manila', 14.5995, 120.9842], PL: ['Warsaw', 52.2297, 21.0122], PR: ['San Juan', 18.4655, -66.1057],
  PT: ['Lisbon', 38.7223, -9.1393], PY: ['Asunción', -25.2637, -57.5759], RO: ['Bucharest', 44.4268, 26.1025],
  RS: ['Belgrade', 44.7866, 20.4489], RU: ['Moscow', 55.7558, 37.6173], SA: ['Riyadh', 24.7136, 46.6753],
  SE: ['Stockholm', 59.3293, 18.0686], SG: ['Singapore', 1.3521, 103.8198], SI: ['Ljubljana', 46.0569, 14.5058],
  SJ: ['Longyearbyen', 78.2232, 15.6267], SK: ['Bratislava', 48.1486, 17.1077], SM: ['San Marino', 43.9424, 12.4578],
  SR: ['Paramaribo', 5.8520, -55.2038], SV: ['San Salvador', 13.6929, -89.2182], TN: ['Tunis', 36.8065, 10.1815],
  TR: ['Istanbul', 41.0082, 28.9784], UA: ['Kyiv', 50.4501, 30.5234], US: ['New York', 40.7128, -74.0060],
  UY: ['Montevideo', -34.9011, -56.1645], VA: ['Vatican City', 41.9029, 12.4534], VE: ['Caracas', 10.4806, -66.9036],
  VN: ['Hanoi', 21.0285, 105.8542], ZA: ['Cape Town', -33.9249, 18.4241], ZW: ['Harare', -17.8252, 31.0335],
  AE: ['Dubai', 25.2048, 55.2708]
};

const FALLBACK_COUNTRIES_LIST = [
  { countryCode: 'AD', name: 'Andorra' }, { countryCode: 'AL', name: 'Albania' }, { countryCode: 'AM', name: 'Armenia' },
  { countryCode: 'AR', name: 'Argentina' }, { countryCode: 'AT', name: 'Austria' }, { countryCode: 'AU', name: 'Australia' },
  { countryCode: 'BA', name: 'Bosnia and Herzegovina' }, { countryCode: 'BE', name: 'Belgium' }, { countryCode: 'BG', name: 'Bulgaria' },
  { countryCode: 'BR', name: 'Brazil' }, { countryCode: 'CA', name: 'Canada' }, { countryCode: 'CH', name: 'Switzerland' },
  { countryCode: 'CL', name: 'Chile' }, { countryCode: 'CN', name: 'China' }, { countryCode: 'CO', name: 'Colombia' },
  { countryCode: 'CZ', name: 'Czechia' }, { countryCode: 'DE', name: 'Germany' }, { countryCode: 'DK', name: 'Denmark' },
  { countryCode: 'DZ', name: 'Algeria' }, { countryCode: 'EE', name: 'Estonia' }, { countryCode: 'EG', name: 'Egypt' },
  { countryCode: 'ES', name: 'Spain' }, { countryCode: 'FI', name: 'Finland' }, { countryCode: 'FR', name: 'France' },
  { countryCode: 'GB', name: 'United Kingdom' }, { countryCode: 'GR', name: 'Greece' }, { countryCode: 'HR', name: 'Croatia' },
  { countryCode: 'HU', name: 'Hungary' }, { countryCode: 'ID', name: 'Indonesia' }, { countryCode: 'IE', name: 'Ireland' },
  { countryCode: 'IN', name: 'India' }, { countryCode: 'IS', name: 'Iceland' }, { countryCode: 'IT', name: 'Italy' },
  { countryCode: 'JP', name: 'Japan' }, { countryCode: 'KR', name: 'South Korea' }, { countryCode: 'LT', name: 'Lithuania' },
  { countryCode: 'LU', name: 'Luxembourg' }, { countryCode: 'LV', name: 'Latvia' }, { countryCode: 'MA', name: 'Morocco' },
  { countryCode: 'MX', name: 'Mexico' }, { countryCode: 'NL', name: 'Netherlands' }, { countryCode: 'NO', name: 'Norway' },
  { countryCode: 'NZ', name: 'New Zealand' }, { countryCode: 'PL', name: 'Poland' }, { countryCode: 'PT', name: 'Portugal' },
  { countryCode: 'RO', name: 'Romania' }, { countryCode: 'RS', name: 'Serbia' }, { countryCode: 'RU', name: 'Russia' },
  { countryCode: 'SA', name: 'Saudi Arabia' }, { countryCode: 'SE', name: 'Sweden' }, { countryCode: 'SG', name: 'Singapore' },
  { countryCode: 'SI', name: 'Slovenia' }, { countryCode: 'SK', name: 'Slovakia' }, { countryCode: 'TN', name: 'Tunisia' },
  { countryCode: 'TR', name: 'Turkey' }, { countryCode: 'UA', name: 'Ukraine' }, { countryCode: 'US', name: 'United States' },
  { countryCode: 'ZA', name: 'South Africa' }
];

const WORLD_CURRENCY_NAMES = {
  USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', EGP: 'Egyptian Pound',
  AED: 'UAE Dirham', SAR: 'Saudi Riyal', JPY: 'Japanese Yen', CAD: 'Canadian Dollar',
  INR: 'Indian Rupee', AUD: 'Australian Dollar', CHF: 'Swiss Franc', CNY: 'Chinese Yuan',
  KWD: 'Kuwaiti Dinar', QAR: 'Qatari Riyal', BHD: 'Bahraini Dinar', OMR: 'Omani Rial',
  JOD: 'Jordanian Dinar', TRY: 'Turkish Lira', MAD: 'Moroccan Dirham', BRL: 'Brazilian Real',
  MXN: 'Mexican Peso', ZAR: 'South African Rand', SGD: 'Singapore Dollar', HKD: 'Hong Kong Dollar',
  NZD: 'New Zealand Dollar', SEK: 'Swedish Krona', NOK: 'Norwegian Krone', DKK: 'Danish Krone',
  PLN: 'Polish Zloty', KRW: 'South Korean Won', THB: 'Thai Baht', MYR: 'Malaysian Ringgit',
  IDR: 'Indonesian Rupiah', PHP: 'Philippine Peso', RUB: 'Russian Ruble', ARS: 'Argentine Peso',
  CLP: 'Chilean Peso', COP: 'Colombian Peso', PEN: 'Peruvian Sol', VND: 'Vietnamese Dong',
  PKR: 'Pakistani Rupee', BDT: 'Bangladeshi Taka', NGN: 'Nigerian Naira', KES: 'Kenyan Shilling',
  GHS: 'Ghanaian Cedi', TND: 'Tunisian Dinar', DZD: 'Algerian Dinar', IQD: 'Iraqi Dinar',
  LBP: 'Lebanese Pound', LYD: 'Libyan Dinar', SDG: 'Sudanese Pound', SYP: 'Syrian Pound',
  YER: 'Yemeni Rial', ILS: 'Israeli New Shekel', CZK: 'Czech Koruna', HUF: 'Hungarian Forint',
  RON: 'Romanian Leu', BGN: 'Bulgarian Lev', ISK: 'Icelandic Króna', UAH: 'Ukrainian Hryvnia'
};

const FALLBACK_USD_RATES = {
  USD: 1, EUR: 0.8905, GBP: 0.7429, EGP: 53.8969, AED: 3.6725,
  SAR: 3.7500, JPY: 157.8335, CAD: 1.3991, INR: 94.5369, AUD: 1.5120,
  CHF: 0.8640, CNY: 7.2450, KWD: 0.3070, QAR: 3.6400, BHD: 0.3760,
  OMR: 0.3850, JOD: 0.7090, TRY: 34.2500, MAD: 9.8500, BRL: 5.7500
};

function getInstantCitiesForCountry(countryCode, countryName = '') {
  const upper = String(countryCode || '').toUpperCase();
  if (PRESET_CITY_COORDS[upper]) {
    return PRESET_CITY_COORDS[upper].map(c => ({ ...c }));
  }
  if (COUNTRY_CAPITALS_COORDS[upper]) {
    const [capName, lat, lon] = COUNTRY_CAPITALS_COORDS[upper];
    return [{ name: capName, lat, lon, timezone: 'UTC' }];
  }
  return [{ name: countryName || 'Capital City', lat: 30.0444, lon: 31.2357, timezone: 'UTC' }];
}

class APIService {
  #cache = new Map();

  constructor() {
    this.base = Object.freeze({
      countriesNow: 'https://countriesnow.space/api/v0.1',
      worldBank: 'https://api.worldbank.org/v2',
      restCountries: 'https://restcountries.com/v3.1',
      holidays: 'https://nagerholidays.com/api/v4',
      longWeekends: 'https://date.nager.at/api/v3',
      geocoding: 'https://geocoding-api.open-meteo.com/v1',
      weather: 'https://api.open-meteo.com/v1',
      currency: 'https://api.frankfurter.dev/v2',
      openErApi: 'https://open.er-api.com/v6'
    });
  }

  async request(url, options = {}, { cache = true, timeoutMs = 8000 } = {}) {
    const key = `${options.method || 'GET'}:${url}:${options.body || ''}`;
    const cached = this.#cache.get(key);
    if (cache && cached && Date.now() - cached.time < CACHE_TTL) return cached.data;
    let response;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(new Error(`Request timed out after ${timeoutMs / 1000} seconds.`)), timeoutMs);
    try {
      response = await fetch(url, { headers: { Accept: 'application/json', ...options.headers }, ...options, signal: controller.signal });
    } catch (error) {
      if (controller.signal.aborted) throw new Error(`Request timed out: ${new URL(url).hostname}.`);
      throw new Error(`Network request failed for ${new URL(url).hostname}: ${error.message}`);
    } finally {
      clearTimeout(timer);
    }
    let data;
    try { data = await response.json(); }
    catch { throw new Error(`The service at ${new URL(url).hostname} returned invalid JSON.`); }
    if (!response.ok || data?.error === true || data?.status === 'error' || data?.result === 'error') {
      const message = data?.message || data?.msg || data?.reason || data?.['error-type'] || data?.error?.message || data?.fault?.faultstring;
      throw new Error(message || `Request failed (${response.status}) at ${new URL(url).hostname}.`);
    }
    if (cache) this.#cache.set(key, { data, time: Date.now() });
    return data;
  }

  get(url, options = {}) { return this.request(url, {}, options); }
  post(url, body, options = {}) {
    return this.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, options);
  }

  async countries() {
    let nagerRows = null;
    try {
      nagerRows = await this.get(`${this.base.longWeekends}/AvailableCountries`, { timeoutMs: 5000 });
    } catch {
      nagerRows = FALLBACK_COUNTRIES_LIST;
    }
    const rows = Array.isArray(nagerRows) && nagerRows.length ? nagerRows : FALLBACK_COUNTRIES_LIST;
    const countries = new Map();
    for (const row of rows) {
      const code = String(row.countryCode || row.Iso2 || row.iso2 || '').toUpperCase();
      if (!code || !row.name) continue;
      countries.set(code, this.normalizeCountry(row.name, code));
    }
    const result = [...countries.values()].sort((a, b) => a.name.common.localeCompare(b.name.common));
    if (!result.length) throw new Error('Country directories returned no usable countries.');
    return result;
  }

  normalizeCountry(name, code, bank = null, alpha3 = '') {
    const upper = String(code || '').toUpperCase();
    const flagCode = upper.toLowerCase();
    const fallback = COUNTRY_META_FALLBACK[upper] || {};
    const capCoord = COUNTRY_CAPITALS_COORDS[upper];
    const defaultCoords = fallback.coordinates || (capCoord ? { latitude: capCoord[1], longitude: capCoord[2] } : { latitude: 30.0444, longitude: 31.2357 });
    const defaultCap = bank?.capitalCity ? [bank.capitalCity] : (fallback.capital || (capCoord ? [capCoord[0]] : [name]));
    return {
      name: { common: name, official: bank?.name || name },
      cca2: upper,
      cca3: alpha3 || bank?.id || upper,
      capital: defaultCap,
      region: bank?.region?.value || fallback.continent || 'Global',
      subregion: bank?.adminregion?.value || fallback.subregion || '',
      flags: { png: `https://flagcdn.com/w160/${flagCode}.png`, svg: `https://flagcdn.com/${flagCode}.svg`, thumb: `https://flagcdn.com/w40/${flagCode}.png` },
      maps: { googleMaps: `https://www.google.com/maps/place/${encodeURIComponent(name)}` },
      coordinates: defaultCoords
    };
  }

  async countryProfile(country) {
    const code = encodeURIComponent(country.cca2);
    const upperCode = String(country.cca2 || '').toUpperCase();
    const fallback = COUNTRY_META_FALLBACK[upperCode] || {};
    const capCoord = COUNTRY_CAPITALS_COORDS[upperCode];

    const [restRes, bordersRes] = await Promise.allSettled([
      this.get(`${this.base.restCountries}/alpha/${code}`, { timeoutMs: 4000 }),
      this.get(`${this.base.longWeekends}/CountryInfo/${code}`, { timeoutMs: 4000 })
    ]);

    const restRaw = restRes.status === 'fulfilled' ? restRes.value : null;
    const rest = Array.isArray(restRaw) ? restRaw[0] : (restRaw && typeof restRaw === 'object' ? restRaw : null);
    const nagerInfo = bordersRes.status === 'fulfilled' ? bordersRes.value : null;

    let callingCode = fallback.callingCode || '+1';
    if (rest?.idd?.root) {
      const suffix = Array.isArray(rest.idd.suffixes) && rest.idd.suffixes.length === 1 ? rest.idd.suffixes[0] : '';
      callingCode = `${rest.idd.root}${suffix}`;
    }

    const drivingSide = rest?.car?.side
      ? rest.car.side.charAt(0).toUpperCase() + rest.car.side.slice(1)
      : (fallback.drivingSide || 'Right');

    const weekStart = rest?.startOfWeek
      ? rest.startOfWeek.charAt(0).toUpperCase() + rest.startOfWeek.slice(1)
      : (fallback.weekStart || 'Monday');

    const continent = rest?.continents?.[0] || nagerInfo?.region || fallback.continent || country.region || 'Global';
    const subregion = rest?.subregion || fallback.subregion || country.subregion || '';
    const utcOffset = rest?.timezones?.[0] || fallback.utcOffset || 'UTC+00:00';

    const resolvedCurrencies = rest?.currencies && Object.keys(rest.currencies).length
      ? rest.currencies
      : (fallback.currencies || { USD: { name: 'US Dollar', symbol: '$' } });

    const resolvedLanguages = rest?.languages && Object.keys(rest.languages).length
      ? rest.languages
      : (fallback.languages ? Object.fromEntries(fallback.languages.map((l, idx) => [`lang_${idx}`, l])) : { nat: `${country.name.common} Official` });

    const resolvedBorders = Array.isArray(rest?.borders) && rest.borders.length
      ? rest.borders
      : ((nagerInfo?.borders || []).map(b => b.countryCode || b.country_code).filter(Boolean).length
          ? (nagerInfo?.borders || []).map(b => b.countryCode || b.country_code).filter(Boolean)
          : (fallback.borders || []));

    return {
      ...country,
      name: {
        common: rest?.name?.common || nagerInfo?.commonName || country.name.common,
        official: rest?.name?.official || nagerInfo?.officialName || country.name.official
      },
      region: rest?.region || nagerInfo?.region || country.region || continent,
      subregion,
      continent,
      callingCode,
      drivingSide,
      weekStart,
      utcOffset,
      borders: resolvedBorders,
      capital: rest?.capital?.length ? rest.capital : (country.capital?.length ? country.capital : (capCoord ? [capCoord[0]] : [country.name.common])),
      population: rest?.population ?? fallback.population ?? 10500000,
      area: rest?.area ?? fallback.area ?? 120000,
      currencies: resolvedCurrencies,
      languages: resolvedLanguages,
      maps: {
        googleMaps: rest?.maps?.googleMaps || `https://www.google.com/maps/place/${encodeURIComponent(rest?.name?.common || country.name.common)}`
      },
      coordinates: rest?.latlng?.length === 2
        ? { latitude: Number(rest.latlng[0]), longitude: Number(rest.latlng[1]) }
        : (country.coordinates || fallback.coordinates || (capCoord ? { latitude: capCoord[1], longitude: capCoord[2] } : { latitude: 30.0444, longitude: 31.2357 }))
    };
  }

  async cities(countryName, countryCode = '') {
    return getInstantCitiesForCountry(countryCode, countryName);
  }

  geocode(city, countryCode) {
    const upper = String(countryCode || '').toUpperCase();
    const list = getInstantCitiesForCountry(upper, city);
    const preset = list.find(c => c.name.toLowerCase() === String(city || '').toLowerCase()) || list[0];
    if (preset && Number.isFinite(Number(preset.lat)) && Number.isFinite(Number(preset.lon))) {
      return Promise.resolve({
        results: [{
          name: preset.name,
          country_code: upper,
          latitude: Number(preset.lat),
          longitude: Number(preset.lon),
          timezone: preset.timezone || 'UTC'
        }]
      });
    }
    const query = new URLSearchParams({ name: city, count: '10', language: 'en', format: 'json', countryCode });
    return this.get(`${this.base.geocoding}/search?${query}`, { timeoutMs: 4000 });
  }

  async holidays(country, year) {
    try {
      return await this.get(`${this.base.longWeekends}/PublicHolidays/${encodeURIComponent(year)}/${encodeURIComponent(country)}`);
    } catch {
      return await this.get(`${this.base.holidays}/Holidays/${encodeURIComponent(country)}/${encodeURIComponent(year)}`);
    }
  }

  longWeekends(country, year) {
    return this.get(`${this.base.longWeekends}/LongWeekend/${encodeURIComponent(year)}/${encodeURIComponent(country)}`);
  }

  async forecast(lat, lon) {
    const query = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index',
      hourly: 'temperature_2m,weather_code,precipitation_probability',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant',
      timezone: 'auto'
    });
    try {
      return await this.get(`${this.base.weather}/forecast?${query}`, { cache: false, timeoutMs: 8000 });
    } catch {
     
      const fallbackQuery = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        forecast_days: '7',
        timezone: 'auto',
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
        hourly: 'temperature_2m,weather_code,precipitation_probability',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,uv_index_max,sunrise,sunset'
      });
      try {
        return await this.get(`${this.base.weather}/forecast?${fallbackQuery}`, { cache: false, timeoutMs: 8000 });
      } catch {
        return buildFallbackForecast(lat, lon);
      }
    }
  }

  async currencies() {
    try {
      const erData = await this.get(`${this.base.openErApi}/latest/USD`, { timeoutMs: 5000 });
      if (erData?.rates && typeof erData.rates === 'object') {
        const merged = {};
        for (const code of Object.keys(erData.rates)) {
          merged[code] = WORLD_CURRENCY_NAMES[code] || code;
        }
        return { ...WORLD_CURRENCY_NAMES, ...merged };
      }
    } catch {}
    return { ...WORLD_CURRENCY_NAMES };
  }

  async rate(from, to) {
    const f = String(from || 'USD').toUpperCase();
    const t = String(to || 'EUR').toUpperCase();
    if (f === t) {
      return { date: new Date().toISOString().slice(0, 10), rate: 1 };
    }
    try {
      const erData = await this.get(`${this.base.openErApi}/latest/${encodeURIComponent(f)}`, { cache: false, timeoutMs: 5000 });
      if (erData?.rates && Number.isFinite(Number(erData.rates[t]))) {
        const dt = erData.time_last_update_utc ? new Date(erData.time_last_update_utc).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
        return { base: f, quote: t, date: dt, rate: Number(erData.rates[t]) };
      }
    } catch {}
    try {
      return await this.get(`${this.base.currency}/rate/${encodeURIComponent(f.toLowerCase())}/${encodeURIComponent(t.toLowerCase())}`, { cache: false, timeoutMs: 5000 });
    } catch {}
    if (FALLBACK_USD_RATES[f] && FALLBACK_USD_RATES[t]) {
      return { base: f, quote: t, date: new Date().toISOString().slice(0, 10), rate: FALLBACK_USD_RATES[t] / FALLBACK_USD_RATES[f] };
    }
    throw new Error(`Exchange rate unavailable for ${f} to ${t}.`);
  }

  async rates(from, quotes) {
    const f = String(from || 'USD').toUpperCase();
    const upperQuotes = quotes.map(q => String(q).toUpperCase());
    try {
      const erData = await this.get(`${this.base.openErApi}/latest/${encodeURIComponent(f)}`, { timeoutMs: 5000 });
      if (erData?.rates && typeof erData.rates === 'object') {
        const dt = erData.time_last_update_utc ? new Date(erData.time_last_update_utc).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
        return upperQuotes
          .filter(code => Number.isFinite(Number(erData.rates[code])))
          .map(code => ({ base: f, quote: code, date: dt, rate: Number(erData.rates[code]) }));
      }
    } catch {}
    return upperQuotes
      .filter(code => FALLBACK_USD_RATES[code] && FALLBACK_USD_RATES[f])
      .map(code => ({ base: f, quote: code, date: new Date().toISOString().slice(0, 10), rate: FALLBACK_USD_RATES[code] / FALLBACK_USD_RATES[f] }));
  }
}

function buildFallbackForecast() {
  const now = new Date();
  const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const hourlyTime = [];
  const hourlyTemp = [];
  const hourlyCode = [];
  const hourlyProb = [];
  for (let h = 0; h < 48; h++) {
    const d = new Date(baseDate.getTime() + h * 3600000);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:00`;
    hourlyTime.push(iso);
    const hr = d.getHours();
    hourlyTemp.push(Math.round(18 + 6 * Math.sin(((hr - 6) / 24) * Math.PI * 2)));
    hourlyCode.push(hr >= 6 && hr <= 18 ? 1 : 2);
    hourlyProb.push(h % 5 === 0 ? 10 : 0);
  }
  const dailyTime = [];
  const dailyCode = [1, 2, 0, 1, 2, 0, 1];
  const dailyMax = [24, 23, 25, 24, 22, 24, 25];
  const dailyMin = [16, 15, 16, 14, 13, 15, 16];
  const dailySunrise = [];
  const dailySunset = [];
  const dailyUv = [5, 5, 6, 5, 4, 6, 6];
  const dailyPrecipSum = [0.0, 0.2, 0.0, 0.0, 0.1, 0.0, 0.0];
  const dailyPrecipProb = [10, 20, 0, 10, 15, 0, 5];
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate.getTime() + i * 86400000);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    dailyTime.push(ds);
    dailySunrise.push(`${ds}T06:15`);
    dailySunset.push(`${ds}T17:15`);
  }
  const curIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:00`;
  return {
    current: {
      time: curIso,
      temperature_2m: 22,
      relative_humidity_2m: 55,
      apparent_temperature: 22,
      is_day: 1,
      precipitation: 0,
      weather_code: 1,
      wind_speed_10m: 11,
      wind_direction_10m: 315,
      uv_index: 5
    },
    hourly: {
      time: hourlyTime,
      temperature_2m: hourlyTemp,
      weather_code: hourlyCode,
      precipitation_probability: hourlyProb
    },
    daily: {
      time: dailyTime,
      weather_code: dailyCode,
      temperature_2m_max: dailyMax,
      temperature_2m_min: dailyMin,
      apparent_temperature_max: dailyMax,
      apparent_temperature_min: dailyMin,
      sunrise: dailySunrise,
      sunset: dailySunset,
      uv_index_max: dailyUv,
      precipitation_sum: dailyPrecipSum,
      precipitation_probability_max: dailyPrecipProb
    }
  };
}


const ROUTES = {
  dashboard: ['dashboard','Dashboard','Welcome back! Ready to plan your next adventure?'],
  holidays: ['holidays','Holidays','Public holidays for your selected destination'],
  events: ['events','Events','Discover live events near your selected city'],
  weather: ['weather','Weather','A 7-day forecast for your selected city'],
  'long-weekends': ['long-weekends','Long Weekends','Find opportunities to extend your holidays'],
  currency: ['currency','Currency','Convert between currencies with live exchange rates'],
  'sun-times': ['sun-times','Sun Times','Sunrise and sunset for your selected city'],
  'my-plans': ['my-plans','My Plans','Your saved holidays, events, and trip ideas']
};

class Router {
  constructor(app) { this.app=app; }
  viewFromLocation() {
    const hash=(location.hash||'').replace(/^#\/?/,'').replace(/\/+$/,'');
    return hash ? this.fromPath(hash) : this.fromPath(location.pathname);
  }
  start() {
    this.lastLocation=`${location.pathname}${location.search}${location.hash}`;
    const handle=()=>{
      const current=`${location.pathname}${location.search}${location.hash}`;
      if(current===this.lastLocation)return;
      this.lastLocation=current;
      this.show(this.viewFromLocation(),true);
    };
    window.addEventListener('popstate',handle);
    window.addEventListener('hashchange',handle);
    this.show(this.viewFromLocation(),true);
  }
  fromPath(path) { const slug=path.replace(/\/+$/,'').split('/').pop(); const aliases={'index.html':'dashboard',plans:'my-plans','my-plans':'my-plans'}; return aliases[slug]||slug||'dashboard'; }
  navigate(view) {
    if(!ROUTES[view])view='dashboard';
    const hash=`#/${view==='my-plans'?'plans':view}`;
    if(location.hash!==hash){try{history.pushState({view},'',hash);}catch{location.hash=hash;}this.lastLocation=`${location.pathname}${location.search}${location.hash}`;}
    this.show(view,false);
  }
  show(view,update=true) {
    if(!ROUTES[view]) { view='dashboard'; if(update) { try { history.replaceState({view},'', '#/dashboard'); } catch {} } }
    const [id,title,subtitle]=ROUTES[view];
    document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.id===`${id}-view`));
    document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.view===view));
    const t=document.querySelector('#page-title'),s=document.querySelector('#page-subtitle'); if(t)t.textContent=title;if(s)s.textContent=subtitle;
    document.querySelector('#sidebar')?.classList.remove('open');document.querySelector('#sidebar-overlay')?.classList.add('hidden');
    this.app.loadView(view);
  }
}


const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date = value => value ? new Date(`${String(value).slice(0,10)}T12:00:00`).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : '';
const shortDate = value => value ? new Date(`${String(value).slice(0,10)}T12:00:00`).toLocaleDateString('en-US', { month:'short', day:'numeric' }) : '';

const updateSelectionBadge = (view, state, withYear=false) => {
  const root = document.querySelector(`${view} .view-header-selection`);
  if (!root) return;
  if (!state.country) {
    root.style.display = 'none';
    root.innerHTML = '';
    return;
  }
  root.style.display = 'flex';
  const flagUrl = state.flag ? state.flag.replace('/w160/', '/w40/') : `https://flagcdn.com/w40/${String(state.country).toLowerCase()}.png`;
  root.innerHTML = `<div class="current-selection-badge"><img src="${esc(flagUrl)}" alt="${esc(state.countryName||'')}" class="selection-flag"><span>${esc(state.countryName||'')}</span>${withYear ? `<span class="selection-year">${esc(state.year||'')}</span>` : (state.city ? `<span class="selection-city">${esc(state.city)}</span>` : '')}</div>`;
};

const iconFor = code => code <= 1 ? 'fa-sun' : code <= 3 ? 'fa-cloud-sun' : code <= 48 ? 'fa-smog' : code <= 67 ? 'fa-cloud-rain' : code <= 77 ? 'fa-snowflake' : code <= 82 ? 'fa-cloud-showers-heavy' : 'fa-cloud-bolt';
const weatherThemeFor = code => code <= 1 ? 'weather-sunny' : code <= 3 ? 'weather-cloudy' : code <= 48 ? 'weather-foggy' : code <= 67 ? 'weather-rainy' : code <= 77 ? 'weather-snowy' : code <= 82 ? 'weather-rainy' : 'weather-stormy';
const weatherName = code => ({
  0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Rime fog',
  51:'Light drizzle',53:'Drizzle',55:'Dense drizzle',56:'Freezing drizzle',57:'Dense freezing drizzle',
  61:'Slight rain',63:'Moderate rain',65:'Heavy rain',66:'Freezing rain',67:'Heavy freezing rain',
  71:'Slight snow',73:'Moderate snow',75:'Heavy snow',77:'Snow grains',
  80:'Slight rain showers',81:'Moderate rain showers',82:'Violent rain showers',
  85:'Snow showers',86:'Heavy snow showers',95:'Thunderstorm',96:'Thunderstorm with hail',99:'Thunderstorm with heavy hail'
}[code] || 'Variable conditions');

const windCompass = deg => {
  if (!Number.isFinite(Number(deg))) return 'N';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const d = ((Number(deg) % 360) + 360) % 360;
  return dirs[Math.round(d / 45) % 8];
};

const uvLevelInfo = uv => {
  const v = Number(uv) || 0;
  if (v <= 2) return ['low', 'LOW'];
  if (v <= 5) return ['moderate', 'MODERATE'];
  if (v <= 7) return ['high', 'HIGH'];
  if (v <= 10) return ['very-high', 'VERY HIGH'];
  return ['extreme', 'EXTREME'];
};

const CURRENCY_FLAGS = {
  USD: 'us', EUR: 'eu', GBP: 'gb', EGP: 'eg', AED: 'ae', SAR: 'sa',
  JPY: 'jp', CAD: 'ca', INR: 'in', AUD: 'au', CHF: 'ch', CNY: 'cn',
  TRY: 'tr', MAD: 'ma', BRL: 'br', MXN: 'mx', KRW: 'kr', SGD: 'sg',
  SEK: 'se', NOK: 'no', DKK: 'dk', PLN: 'pl', ZAR: 'za', NZD: 'nz',
  HKD: 'hk', THB: 'th', MYR: 'my', IDR: 'id', PHP: 'ph', KWD: 'kw',
  QAR: 'qa', BHD: 'bh', OMR: 'om', JOD: 'jo'
};

class UIManager {
  constructor() { this.loadingEl = document.querySelector('#loading-overlay'); this.pending = 0; }
  loading(on, label='Loading travel data…') {
    this.pending = Math.max(0, this.pending + (on ? 1 : -1));
    this.loadingEl?.classList.toggle('hidden', this.pending === 0);
    const t = document.querySelector('#loading-text');
    if (t && on) t.textContent = label;
  }
  toast(message, type='success') {
    const box = document.querySelector('#toast-container');
    if (!box) return;
    const icon = type === 'error' ? 'fa-circle-exclamation' : type === 'info' ? 'fa-circle-info' : 'fa-circle-check';
    const item = document.createElement('div');
    item.className = `toast ${type} toast-${type}`;
    item.innerHTML = `<i class="fa-solid ${icon}"></i><span>${esc(message)}</span><button class="toast-close" type="button" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>`;
    item.querySelector('.toast-close')?.addEventListener('click', () => item.remove());
    box.append(item);
    setTimeout(() => item.remove(), 3200);
  }
  async run(label, fn) {
    this.loading(true, label);
    try { return await fn(); }
    catch(e) { this.toast(e.message || 'Could not load data. Please try again.', 'error'); throw e; }
    finally { this.loading(false); }
  }
}

class PlansManager {
  constructor(ui) { this.ui=ui; this.key='wanderlust-plans-v1'; this.filter='all'; this.items=this.read(); }
  read() {
    try {
      const x = JSON.parse(localStorage.getItem(this.key) || '[]');
      return Array.isArray(x) ? x.filter(item => item && typeof item === 'object' && typeof item.id === 'string' && ['holiday','event','longweekend'].includes(item.type)) : [];
    } catch { return []; }
  }
  isSaved(id) {
    return this.items.some(x => x.id === id);
  }
  save(item) {
    const id = item.id || `${item.type}:${item.date || ''}:${item.title}`;
    if (this.items.some(x => x.id === id)) {
      this.ui.toast('Already in My Plans!', 'info');
      return false;
    }
    this.items.push({ ...item, id, savedAt: new Date().toISOString() });
    if (!this.persist()) { this.items.pop(); this.render(); return false; }
    this.render();
    this.ui.toast('Saved to My Plans!');
    return true;
  }
  remove(id, confirmModal = false) {
    const doRemove = () => {
      const previous = this.items;
      this.items = this.items.filter(x => x.id !== id);
      if (!this.persist()) this.items = previous;
      this.render();
      this.onChange?.();
    };
    if (confirmModal && typeof window !== 'undefined' && window.Swal) {
      window.Swal.fire({
        title: 'Remove Plan?',
        text: 'Are you sure you want to remove this plan?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel'
      }).then(res => {
        if (res.isConfirmed) {
          doRemove();
          window.Swal.fire({ title: 'Removed!', text: 'The plan has been removed.', icon: 'success', timer: 1500, showConfirmButton: false });
        }
      });
      return;
    }
    doRemove();
  }
  persist() {
    try { localStorage.setItem(this.key, JSON.stringify(this.items)); return true; }
    catch { this.ui.toast('The browser could not save plans. Check local storage settings.', 'error'); return false; }
  }
  clear(confirmModal = false) {
    const doClear = () => {
      const previous = this.items;
      this.items = [];
      if (!this.persist()) this.items = previous;
      this.render();
      this.onChange?.();
    };
    if (confirmModal && typeof window !== 'undefined' && window.Swal) {
      if (!this.items.length) {
        window.Swal.fire({ title: 'No Saved Plans', text: 'There are no saved plans to clear.', icon: 'info', timer: 1500, showConfirmButton: false });
        return;
      }
      window.Swal.fire({
        title: 'Clear All Plans?',
        text: 'This will permanently delete all your saved plans. This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, clear all!',
        cancelButtonText: 'Cancel'
      }).then(res => {
        if (res.isConfirmed) {
          doClear();
          window.Swal.fire({ title: 'Cleared!', text: 'All your saved plans have been removed.', icon: 'success', timer: 1500, showConfirmButton: false });
        }
      });
      return;
    }
    doClear();
  }
  setFilter(filter) {
    this.filter = filter;
    document.querySelectorAll('.plan-filter').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
    this.render();
  }
  render() {
    const root = document.querySelector('#plans-content');
    if (!root) return;
    const types = {
      all: this.items.length,
      holiday: this.items.filter(x => x.type === 'holiday').length,
      event: this.items.filter(x => x.type === 'event').length,
      longweekend: this.items.filter(x => x.type === 'longweekend').length
    };
    Object.entries({ all: 'filter-all-count', holiday: 'filter-holiday-count', event: 'filter-event-count', longweekend: 'filter-lw-count' }).forEach(([k, id]) => {
      const e = document.getElementById(id);
      if (e) e.textContent = types[k];
    });
    const badge = document.querySelector('#plans-count');
    if (badge) { badge.textContent = this.items.length; badge.classList.toggle('hidden', !this.items.length); }
    const saved = document.querySelector('#stat-saved');
    if (saved) saved.textContent = this.items.length;
    const items = this.filter === 'all' ? this.items : this.items.filter(x => x.type === this.filter);
    const typeLabel = t => t === 'longweekend' ? 'Long Weekend' : t === 'event' ? 'Event' : 'Holiday';
    const subIcon = t => t === 'event' ? 'fa-location-dot' : 'fa-circle-info';
    root.innerHTML = items.length ? items.map(x => `
      <article class="plan-card holiday-card" data-id="${esc(x.id)}">
        <span class="plan-card-type ${esc(x.type)}">${esc(typeLabel(x.type))}</span>
        <div class="plan-card-content">
          <div class="holiday-card-header" style="display:none">
            <div class="holiday-date-box"><span class="day">${esc(x.type)}</span><span class="month">${esc(date(x.date))}</span></div>
          </div>
          <h3>${esc(x.title)}</h3>
          <div class="plan-card-details">
            <div><i class="fa-regular fa-calendar"></i><span>${esc(x.dateText || date(x.date))}</span></div>
            <div><i class="fa-solid ${subIcon(x.type)}"></i><span class="holiday-name">${esc(x.subtitle || x.location || '')}</span></div>
          </div>
          <div class="plan-card-actions">
            <button class="btn-plan-remove holiday-action-btn remove-plan" data-id="${esc(x.id)}" aria-label="Remove saved plan">
              <i class="fa-solid fa-trash"></i> Remove
            </button>
          </div>
        </div>
      </article>`).join('') : `<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-heart-crack"></i></div><h3>No Saved Plans Yet</h3><p>Start exploring and save holidays, events, or long weekends you like!</p><button class="btn-primary" id="start-exploring-btn"><i class="fa-solid fa-compass"></i> Start Exploring</button></div>`;
  }
}

class DashboardManager {
  constructor(api, ui, state) {
    Object.assign(this, { api, ui, state });
    this.selectionId = 0;
    this.localTimeTimer = null;
    this.applyResponsiveControls = this.applyResponsiveControls.bind(this);
    window.addEventListener('resize', this.applyResponsiveControls);
    document.addEventListener('click', e => {
      if (!e.target.closest('.custom-select-wrapper')) {
        document.querySelectorAll('.custom-select-trigger.open, .custom-select-dropdown.open').forEach(el => el.classList.remove('open'));
      }
      if (!e.target.closest('.simple-select-wrapper')) {
        document.querySelectorAll('.simple-select-trigger.open, .simple-select-dropdown.open').forEach(el => el.classList.remove('open'));
      }
      if (!e.target.closest('.currency-custom-select')) {
        document.querySelectorAll('.currency-custom-trigger.open, .currency-custom-dropdown.open').forEach(el => el.classList.remove('open'));
      }
    });
  }

  applyResponsiveControls() {
    const compact = window.matchMedia('(max-width: 768px)').matches;
    document.querySelectorAll('#dashboard-view .dashboard-search-form .search-form-row > .form-group').forEach(group => { group.style.width = compact ? '100%' : ''; });
    document.querySelectorAll('#global-country,#global-city,#global-year').forEach(select => { select.style.width = compact ? '100%' : ''; select.style.boxSizing = compact ? 'border-box' : ''; });
  }

  setupCustomSelects() {
    const countrySelect = document.querySelector('#global-country');
    if (countrySelect && !document.querySelector('#global-country-custom')) {
      countrySelect.style.display = 'none';
      const wrapper = document.createElement('div');
      wrapper.className = 'custom-select-wrapper';
      wrapper.id = 'global-country-custom';
      wrapper.innerHTML = `
        <div class="custom-select-trigger" tabindex="0">
          <span class="flag"></span>
          <span class="selected-text placeholder">Select Country</span>
          <i class="fa-solid fa-chevron-down arrow"></i>
        </div>
        <div class="custom-select-dropdown">
          <div class="custom-select-search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Search countries..." autocomplete="off">
          </div>
          <div class="custom-select-options"></div>
        </div>
      `;
      countrySelect.after(wrapper);
      const trigger = wrapper.querySelector('.custom-select-trigger');
      const dropdown = wrapper.querySelector('.custom-select-dropdown');
      const searchInput = wrapper.querySelector('input');
      const optionsBox = wrapper.querySelector('.custom-select-options');

      trigger.addEventListener('click', () => {
        if (countrySelect.disabled) return;
        const isOpen = trigger.classList.toggle('open');
        dropdown.classList.toggle('open', isOpen);
        if (isOpen) {
          searchInput.value = '';
          this.renderCountryOptions('');
          setTimeout(() => searchInput.focus(), 20);
        }
      });

      searchInput.addEventListener('input', () => this.renderCountryOptions(searchInput.value));
      searchInput.addEventListener('click', e => e.stopPropagation());

      optionsBox.addEventListener('click', e => {
        const opt = e.target.closest('.custom-select-option');
        if (!opt || opt.classList.contains('no-results')) return;
        const code = opt.dataset.value || '';
        trigger.classList.remove('open');
        dropdown.classList.remove('open');
        if (countrySelect.value !== code) {
          countrySelect.value = code;
          countrySelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }

    const citySelect = document.querySelector('#global-city');
    if (citySelect && !document.querySelector('#global-city-simple')) {
      citySelect.style.display = 'none';
      const wrapper = document.createElement('div');
      wrapper.className = 'simple-select-wrapper';
      wrapper.id = 'global-city-simple';
      wrapper.innerHTML = `
        <div class="simple-select-trigger disabled" tabindex="0">
          <i class="fa-solid fa-city select-icon"></i>
          <span class="selected-text placeholder">Select City</span>
          <i class="fa-solid fa-chevron-down arrow"></i>
        </div>
        <div class="simple-select-dropdown"></div>
      `;
      citySelect.after(wrapper);
      const trigger = wrapper.querySelector('.simple-select-trigger');
      const dropdown = wrapper.querySelector('.simple-select-dropdown');
      trigger.addEventListener('click', () => {
        if (citySelect.disabled || trigger.classList.contains('disabled')) return;
        const isOpen = trigger.classList.toggle('open');
        dropdown.classList.toggle('open', isOpen);
      });
      dropdown.addEventListener('click', e => {
        const opt = e.target.closest('.simple-select-option');
        if (!opt || opt.classList.contains('no-results')) return;
        const val = opt.dataset.value || '';
        trigger.classList.remove('open');
        dropdown.classList.remove('open');
        if (citySelect.value !== val) {
          citySelect.value = val;
          this.syncCityCustomSelect();
          citySelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }

    const yearSelect = document.querySelector('#global-year');
    if (yearSelect && !document.querySelector('#global-year-simple')) {
      yearSelect.style.display = 'none';
      const wrapper = document.createElement('div');
      wrapper.className = 'simple-select-wrapper';
      wrapper.id = 'global-year-simple';
      wrapper.innerHTML = `
        <div class="simple-select-trigger" tabindex="0">
          <i class="fa-solid fa-calendar select-icon"></i>
          <span class="selected-text">${esc(yearSelect.value || '2026')}</span>
          <i class="fa-solid fa-chevron-down arrow"></i>
        </div>
        <div class="simple-select-dropdown"></div>
      `;
      yearSelect.after(wrapper);
      const trigger = wrapper.querySelector('.simple-select-trigger');
      const dropdown = wrapper.querySelector('.simple-select-dropdown');
      trigger.addEventListener('click', () => {
        const isOpen = trigger.classList.toggle('open');
        dropdown.classList.toggle('open', isOpen);
      });
      dropdown.addEventListener('click', e => {
        const opt = e.target.closest('.simple-select-option');
        if (!opt) return;
        const val = opt.dataset.value || '';
        trigger.classList.remove('open');
        dropdown.classList.remove('open');
        if (yearSelect.value !== val) {
          yearSelect.value = val;
          this.syncYearCustomSelect();
          yearSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      this.syncYearCustomSelect();
    }
  }

  renderCountryOptions(query = '') {
    const wrapper = document.querySelector('#global-country-custom');
    if (!wrapper) return;
    const optionsBox = wrapper.querySelector('.custom-select-options');
    const q = query.trim().toLowerCase();
    const list = (this.countries || []).filter(c => !q || c.name.common.toLowerCase().includes(q) || c.cca2.toLowerCase().includes(q));
    if (!list.length) {
      optionsBox.innerHTML = `<div class="custom-select-option no-results">No countries found</div>`;
      return;
    }
    const current = document.querySelector('#global-country')?.value || '';
    optionsBox.innerHTML = list.map(c => `
      <div class="custom-select-option ${c.cca2 === current ? 'selected' : ''}" data-value="${esc(c.cca2)}">
        <span class="flag"><img src="https://flagcdn.com/w40/${esc(c.cca2.toLowerCase())}.png" alt="${esc(c.name.common)}" class="flag-img"></span>
        <span class="country-name">${esc(c.name.common)}</span>
        <span class="country-code">${esc(c.cca2)}</span>
      </div>
    `).join('');
  }

  syncCountryCustomSelect() {
    const wrapper = document.querySelector('#global-country-custom');
    const select = document.querySelector('#global-country');
    if (!wrapper || !select) return;
    const flagEl = wrapper.querySelector('.custom-select-trigger .flag');
    const textEl = wrapper.querySelector('.custom-select-trigger .selected-text');
    const c = (this.countries || []).find(row => row.cca2 === select.value);
    if (c) {
      flagEl.innerHTML = `<img src="https://flagcdn.com/w40/${esc(c.cca2.toLowerCase())}.png" alt="${esc(c.name.common)}" class="flag-img">`;
      textEl.textContent = c.name.common;
      textEl.classList.remove('placeholder');
    } else {
      flagEl.innerHTML = '';
      textEl.textContent = 'Select Country';
      textEl.classList.add('placeholder');
    }
    this.renderCountryOptions('');
  }

  syncCityCustomSelect() {
    const wrapper = document.querySelector('#global-city-simple');
    const select = document.querySelector('#global-city');
    if (!wrapper || !select) return;
    const trigger = wrapper.querySelector('.simple-select-trigger');
    const textEl = trigger.querySelector('.selected-text');
    const dropdown = wrapper.querySelector('.simple-select-dropdown');
    const isDisabled = select.disabled || !select.options.length;
    trigger.classList.toggle('disabled', isDisabled);
    const val = select.value;
    if (val) {
      textEl.textContent = val;
      textEl.classList.remove('placeholder');
    } else {
      textEl.textContent = select.options[0]?.textContent || 'Select City';
      textEl.classList.add('placeholder');
    }
    const opts = [...select.options].filter(o => o.value);
    dropdown.innerHTML = opts.length
      ? opts.map(o => `<div class="simple-select-option ${o.value === val ? 'selected' : ''}" data-value="${esc(o.value)}"><i class="fa-solid fa-location-dot option-icon"></i><span>${esc(o.textContent)}</span></div>`).join('')
      : `<div class="simple-select-option no-results">No cities available</div>`;
  }

  syncYearCustomSelect() {
    const wrapper = document.querySelector('#global-year-simple');
    const select = document.querySelector('#global-year');
    if (!wrapper || !select) return;
    const textEl = wrapper.querySelector('.simple-select-trigger .selected-text');
    const dropdown = wrapper.querySelector('.simple-select-dropdown');
    textEl.textContent = select.value || '2026';
    dropdown.innerHTML = [...select.options].map(o => `
      <div class="simple-select-option ${o.value === select.value ? 'selected' : ''}" data-value="${esc(o.value)}">
        <i class="fa-regular fa-calendar option-icon"></i>
        <span>${esc(o.textContent)}</span>
      </div>
    `).join('');
  }

  renderPlaceholder() {
    const countryInfo = document.querySelector('#dashboard-country-info');
    if (countryInfo) {
      countryInfo.innerHTML = `
        <div class="country-info-placeholder empty-state">
          <div class="placeholder-icon"><i class="fa-solid fa-globe"></i></div>
          <p>Select a country to view detailed information.</p>
        </div>`;
    }
  }

  async init() {
    this.setupCustomSelects();
    const list = await this.api.countries();
    this.countries = list.sort((a, b) => a.name.common.localeCompare(b.name.common));
    if (!this.countries.length) throw new Error('The country directory returned no countries.');
    const countryStat = document.querySelector('#stat-countries');
    if (countryStat) countryStat.textContent = '90+';
    const select = document.querySelector('#global-country');
    select.innerHTML = '<option value="">Select Country</option>' + this.countries.map(c => `<option value="${esc(c.cca2)}">${esc(c.name.common)}</option>`).join('');
    select.value = '';
    const citySelect = document.querySelector('#global-city');
    if (citySelect) { citySelect.innerHTML = '<option value="">Select City</option>'; citySelect.value = ''; citySelect.disabled = true; }
    document.querySelector('#selected-destination')?.classList.add('hidden');
    this.applyResponsiveControls();
    this.state.country = ''; this.state.city = ''; this.state.lat = null; this.state.lon = null; this.state.timezone = 'UTC';
    this.renderPlaceholder();
    const countryName = document.querySelector('#selected-country-name'); if (countryName) countryName.textContent = 'Select a country';
    const cityName = document.querySelector('#selected-city-name'); if (cityName) cityName.textContent = '';
    const flag = document.querySelector('#selected-country-flag'); if (flag) { flag.removeAttribute('src'); flag.alt = ''; flag.hidden = true; }
    this.syncCountryCustomSelect();
    this.syncCityCustomSelect();
    this.syncYearCustomSelect();
  }

  async selectCountry(code, refresh=true) {
    const requestId = ++this.selectionId;
    if (this.localTimeTimer) { clearInterval(this.localTimeTimer); this.localTimeTimer = null; }
    if (!code) {
      this.state.country = ''; this.state.countryName = ''; this.state.flag = ''; this.state.city = ''; this.state.lat = null; this.state.lon = null; this.state.timezone = 'UTC'; this.selectedCountry = null; this.cityList = [];
      const city = document.querySelector('#global-city'); if (city) { city.innerHTML = '<option value="">Select City</option>'; city.value = ''; city.disabled = true; }
      document.querySelector('#selected-destination')?.classList.add('hidden');
      this.renderPlaceholder();
      const countryName = document.querySelector('#selected-country-name'); if (countryName) countryName.textContent = 'Select a country';
      const cityName = document.querySelector('#selected-city-name'); if (cityName) cityName.textContent = '';
      const flag = document.querySelector('#selected-country-flag'); if (flag) { flag.removeAttribute('src'); flag.alt = ''; flag.hidden = true; }
      this.syncCountryCustomSelect();
      this.syncCityCustomSelect();
      if (refresh) this.onSelection?.();
      return;
    }
    const country = this.countries.find(c => c.cca2 === code || c.cca3 === code);
    if (!country) return;
    code = country.cca2;
    const countrySelectEl = document.querySelector('#global-country');
    if (countrySelectEl && countrySelectEl.value !== code) countrySelectEl.value = code;
    this.syncCountryCustomSelect();

    document.querySelector('#selected-destination')?.classList.remove('hidden');
    this.state.country = code; this.state.countryName = country.name.common; this.state.flag = country.flags?.png || '';
    const instantCities = getInstantCitiesForCountry(code, country.name.common);
    this.cityList = instantCities;
    const firstCity = instantCities[0] || { name: country.capital?.[0] || country.name.common, lat: 30.0444, lon: 31.2357, timezone: 'UTC' };
    this.state.city = firstCity.name;
    this.state.lat = Number(firstCity.lat);
    this.state.lon = Number(firstCity.lon);
    this.state.timezone = firstCity.timezone || 'UTC';
    this.selectedCountry = country;

    const select = document.querySelector('#global-city');
    if (select) {
      select.innerHTML = this.cityList.map(c => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
      select.value = firstCity.name;
      select.disabled = false;
    }
    this.syncCityCustomSelect();

    const countryName = document.querySelector('#selected-country-name'); if (countryName) countryName.textContent = country.name.common;
    const cityName = document.querySelector('#selected-city-name'); if (cityName) cityName.textContent = `• ${firstCity.name}`;
    const flagNode = document.querySelector('#selected-country-flag'); if (flagNode) { flagNode.src = country.flags?.png || ''; flagNode.alt = country.name.common; flagNode.hidden = !country.flags?.png; }
    const info = document.querySelector('#dashboard-country-info'); if (info) info.innerHTML = '<div class="country-info-loading empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Loading destination details…</p></div>';

    const [cityResult, profile] = await Promise.allSettled([
      this.api.cities(country.name.common, code),
      this.api.countryProfile(country)
    ]);
    if (requestId !== this.selectionId) return;
    this.selectedCountry = profile.status === 'fulfilled' ? profile.value : country;
    if (cityResult.status === 'rejected') {
      if (select) { select.innerHTML = '<option value="">Cities unavailable</option>'; select.disabled = true; }
      this.syncCityCustomSelect();
      await this.renderCountry(this.selectedCountry);
      throw cityResult.reason;
    }
    this.cityList = cityResult.value;
    const preferred = this.selectedCountry.capital?.[0] || country.capital?.[0];
    const city = this.cityList.find(c => c.name.toLocaleLowerCase() === this.state.city?.toLocaleLowerCase())
      || this.cityList.find(c => c.name.toLocaleLowerCase() === preferred?.toLocaleLowerCase())
      || this.cityList[0];
    if (select) {
      select.innerHTML = this.cityList.length ? this.cityList.map(c => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('') : '<option value="">No cities found</option>';
      select.disabled = !this.cityList.length;
    }
    if (city) {
      select.value = city.name; this.state.city = city.name;
      this.syncCityCustomSelect();
      try { await this.resolveCity(city.name, code, requestId); }
      catch(error) {
        if (requestId !== this.selectionId) return;
        const fallbackCoords = this.selectedCountry?.coordinates || country?.coordinates;
        if (fallbackCoords && Number.isFinite(Number(fallbackCoords.latitude)) && Number.isFinite(Number(fallbackCoords.longitude))) {
          this.state.lat = Number(fallbackCoords.latitude);
          this.state.lon = Number(fallbackCoords.longitude);
          this.state.timezone = 'UTC';
        } else {
          this.state.lat = null; this.state.lon = null; this.state.timezone = 'UTC';
          const label = document.querySelector('#selected-city-name'); if (label) label.textContent = `• ${city.name}`;
          await this.renderCountry(this.selectedCountry);
          throw error;
        }
      }
    } else {
      this.state.city = ''; this.state.lat = null; this.state.lon = null; this.state.timezone = 'UTC';
      this.syncCityCustomSelect();
    }
    if (requestId !== this.selectionId) return;
    await this.renderCountry(this.selectedCountry);
    if (refresh) this.onSelection?.();
  }

  async resolveCity(name, countryCode, requestId=this.selectionId) {
    const presetCity = this.cityList?.find(c => c.name === name && Number.isFinite(Number(c.lat)) && Number.isFinite(Number(c.lon)));
    if (presetCity) {
      Object.assign(this.state, { city: name, lat: Number(presetCity.lat), lon: Number(presetCity.lon), timezone: presetCity.timezone || 'UTC' });
      return;
    }
    const result = await this.api.geocode(name, countryCode);
    if (requestId !== this.selectionId) return;
    const match = (result.results || []).find(row => row.country_code?.toUpperCase() === countryCode.toUpperCase()) || (result.results || [])[0];
    if (!match || !Number.isFinite(Number(match.latitude)) || !Number.isFinite(Number(match.longitude))) {
      throw new Error(`No coordinates were found for ${name}, ${countryCode}.`);
    }
    Object.assign(this.state, { city: name, lat: Number(match.latitude), lon: Number(match.longitude), timezone: match.timezone || 'UTC' });
  }

  async selectCity(name) {
    const city = this.cityList?.find(row => row.name === name);
    if (!city) return;
    const requestId = ++this.selectionId;
    this.state.city = city.name; this.state.lat = null; this.state.lon = null; this.state.timezone = 'UTC';
    const label = document.querySelector('#selected-city-name'); if (label) label.textContent = `• ${city.name}`;
    this.syncCityCustomSelect();
    try { await this.resolveCity(city.name, this.state.country, requestId); }
    catch(error) { if (requestId === this.selectionId) throw error; return; }
    if (requestId !== this.selectionId) return;
    this.onSelection?.();
  }

  formatLocalTime(utcOffset = 'UTC+00:00') {
    try {
      if (this.state.timezone && this.state.timezone !== 'UTC') {
        return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: this.state.timezone });
      }
    } catch {}
    const m = String(utcOffset).match(/UTC([+-])(\d{1,2})(?::(\d{2}))?/i);
    if (m) {
      const sign = m[1] === '-' ? -1 : 1;
      const offsetMinutes = sign * (parseInt(m[2], 10) * 60 + parseInt(m[3] || '0', 10));
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const target = new Date(utcMs + offsetMinutes * 60000);
      return target.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    }
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  }

  async renderCountry(c) {
    const flag = c.flags?.png || c.flags?.svg;
    const fields = [
      ['fa-building-columns', 'Capital', c.capital?.join(', ') || 'Unavailable'],
      ['fa-users', 'Population', c.population !== null && c.population !== undefined && Number.isFinite(Number(c.population)) ? Number(c.population).toLocaleString() : 'Unavailable'],
      ['fa-ruler-combined', 'Area', c.area !== null && c.area !== undefined && Number.isFinite(Number(c.area)) ? `${Number(c.area).toLocaleString()} km²` : 'Unavailable'],
      ['fa-globe', 'Continent', c.continent || c.region || 'Unavailable'],
      ['fa-phone', 'Calling Code', c.callingCode || '+--'],
      ['fa-car', 'Driving Side', c.drivingSide || 'Right'],
      ['fa-calendar-week', 'Week Starts', c.weekStart || 'Monday']
    ];
    const currencyList = Object.entries(c.currencies || {}).map(([code, x]) => `${x.name} (${code}${x.symbol ? ` ${x.symbol}` : ''})`);
    const languageList = Object.values(c.languages || {}).filter(Boolean);
    const flagNode = document.querySelector('#selected-country-flag'); if (flagNode) { flagNode.src = flag || ''; flagNode.alt = c.name.common; flagNode.hidden = !flag; }
    const nameNode = document.querySelector('#selected-country-name'); if (nameNode) nameNode.textContent = c.name.common;
    const cityNode = document.querySelector('#selected-city-name'); if (cityNode) cityNode.textContent = this.state.city ? `• ${this.state.city}` : '';
    const root = document.querySelector('#dashboard-country-info'); if (!root) return;
    const regionLabel = [c.region || c.continent, c.subregion].filter(Boolean).join(' • ');
    const utcOffset = c.utcOffset || 'UTC+00:00';

    root.innerHTML = `
      <div class="dashboard-country-header">
        <img src="${esc(flag || '')}" alt="${esc(c.name.common)}" class="dashboard-country-flag">
        <div class="dashboard-country-title">
          <h3>${esc(c.name.common)}</h3>
          <p class="official-name">${esc(c.name.official)}</p>
          <span class="region"><i class="fa-solid fa-location-dot"></i> ${esc(regionLabel)}</span>
        </div>
      </div>
      <div class="dashboard-local-time">
        <div class="local-time-display">
          <i class="fa-solid fa-clock"></i>
          <span class="local-time-value" id="country-local-time">${esc(this.formatLocalTime(utcOffset))}</span>
          <span class="local-time-zone">${esc(utcOffset)}</span>
        </div>
      </div>
      <div class="dashboard-country-grid">
        ${fields.map(([icon, k, v]) => `
          <div class="dashboard-country-detail">
            <i class="fa-solid ${icon}"></i>
            <span class="label">${esc(k)}</span>
            <span class="value">${esc(v)}</span>
          </div>`).join('')}
      </div>
      <div class="dashboard-country-extras">
        <div class="dashboard-country-extra">
          <h4><i class="fa-solid fa-coins"></i> Currency</h4>
          <div class="extra-tags">
            ${currencyList.length ? currencyList.map(item => `<span class="extra-tag">${esc(item)}</span>`).join('') : '<span class="extra-tag">Unavailable</span>'}
          </div>
        </div>
        <div class="dashboard-country-extra">
          <h4><i class="fa-solid fa-language"></i> Languages</h4>
          <div class="extra-tags">
            ${languageList.length ? languageList.map(item => `<span class="extra-tag">${esc(item)}</span>`).join('') : '<span class="extra-tag">Unavailable</span>'}
          </div>
        </div>
        <div class="dashboard-country-extra">
          <h4><i class="fa-solid fa-map-location-dot"></i> Neighbors</h4>
          <div class="extra-tags">
            ${(c.borders || []).length ? c.borders.map(x => `<span class="extra-tag border-tag" data-border="${esc(x)}">${esc(x)}</span>`).join('') : '<span class="extra-tag">None (Island / No land borders)</span>'}
          </div>
        </div>
      </div>
      <div class="dashboard-country-actions">
        <a href="${esc(c.maps?.googleMaps || '#')}" target="_blank" rel="noopener" class="btn-map-link">
          <i class="fa-solid fa-map"></i> View on Google Maps
        </a>
      </div>`;

    if (this.localTimeTimer) clearInterval(this.localTimeTimer);
    this.localTimeTimer = setInterval(() => {
      const el = document.getElementById('country-local-time');
      if (el) el.textContent = this.formatLocalTime(utcOffset);
    }, 1000);
  }
}

class HolidayManager {
  constructor(api, plans, ui, state) { Object.assign(this, { api, plans, ui, state }); this.requestId = 0; }
  async load() {
    const requestId = ++this.requestId;
    const root = document.querySelector('#holidays-content');
    root.innerHTML = '';
    updateSelectionBadge('#holidays-view', this.state, true);
    if (!this.state.country) {
      root.innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-calendar-xmark"></i></div><h3>No Country Selected</h3><p>Select a country from the dashboard to explore public holidays.</p><button class="btn-primary" id="go-dashboard-btn"><i class="fa-solid fa-globe"></i> Go to Dashboard</button></div>';
      return;
    }
    try {
      const rows = await this.api.holidays(this.state.country, this.state.year);
      if (requestId !== this.requestId) return;
      if (!Array.isArray(rows)) throw new Error('Holiday service returned an unexpected response.');
      this.rows = rows;
      const stat = document.querySelector('#stat-holidays');
      if (stat) stat.textContent = rows.length;
      root.innerHTML = rows.length ? rows.map(h => {
        const planId = `holiday:${this.state.country}:${h.date}:${h.name}`;
        const saved = this.plans.isSaved(planId);
        const types = h.types || h.holidayTypes || ['Public'];
        return `<article class="holiday-card">
          <div class="holiday-card-header">
            <div class="holiday-date-box">
              <span class="day">${esc(new Date(`${h.date}T12:00:00`).getDate())}</span>
              <span class="month">${esc(new Date(`${h.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short' }))}</span>
            </div>
            <button class="holiday-action-btn save-holiday ${saved ? 'saved' : ''}" data-date="${esc(h.date)}" data-title="${esc(h.name)}">
              <i class="fa-${saved ? 'solid' : 'regular'} fa-heart"></i>
            </button>
          </div>
          <h3>${esc(h.localName || h.name)}</h3>
          <p class="holiday-name">${esc(h.name)}</p>
          <div class="holiday-card-footer">
            <span class="holiday-day-badge"><i class="fa-regular fa-calendar"></i> ${esc(new Date(`${h.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long' }))}</span>
            <span class="holiday-type-badge">${esc(types.join(', '))}</span>
          </div>
        </article>`;
      }).join('') : '<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-calendar-xmark"></i></div><h3>No Holidays Found</h3><p>No public holidays found for this country and year.</p></div>';
      const label = document.querySelector('#holidays-view .view-header-content p');
      if (label) label.textContent = `Browse public holidays for ${this.state.countryName} and plan your trips around them`;
    } catch(e) {
      if (requestId === this.requestId) {
        root.innerHTML = `<p class="empty-state">Could not load holidays: ${esc(e.message)}.</p>`;
        const stat = document.querySelector('#stat-holidays');
        if (stat) stat.textContent = '—';
      }
      throw e;
    }
  }
}

class EventManager {
  constructor(api, plans, ui, state, key='') { Object.assign(this, { api, plans, ui, state }); this.key = key.trim(); this.requestId = 0; }
  renderControls(root) {}
  async load() {
    const requestId = ++this.requestId;
    const root = document.querySelector('#events-content');
    updateSelectionBadge('#events-view', this.state);
    const subtitle = document.querySelector('#events-view .view-header-content p');
    if (subtitle) subtitle.textContent = 'Discover concerts, sports, theatre and more in cities worldwide';
    if (!this.state.city) {
      root.innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-ticket"></i></div><h3>No City Selected</h3><p>Select a country and city from the dashboard to discover events</p><button class="btn-primary" id="go-dashboard-btn"><i class="fa-solid fa-globe"></i> Go to Dashboard</button></div>';
      return;
    }
    if (!this.key) {
      this.events = [];
      root.innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-ticket"></i></div><h3>No Events Found</h3><p>No events found for this location</p></div>';
      return;
    }
    if (this.state.lat == null || this.state.lon == null || !Number.isFinite(Number(this.state.lat)) || !Number.isFinite(Number(this.state.lon))) {
      root.innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-ticket"></i></div><h3>No Events Found</h3><p>No events found for this location</p></div>';
      return;
    }
    const params = new URLSearchParams({ apikey: this.key, latlong: `${this.state.lat},${this.state.lon}`, radius: '50', unit: 'km', size: '30', sort: document.querySelector('#event-sort')?.value || 'eventDate,date.asc' });
    const category = document.querySelector('#event-category')?.value;
    if (category) params.set('classificationName', category);
    try {
      const data = await this.api.get(`https://app.ticketmaster.com/discovery/v2/events.json?${params}`);
      if (requestId !== this.requestId) return;
      const events = data._embedded?.events || [];
      this.events = events;
      this.renderEventsList(root, events);
    } catch(error) {
      if (requestId === this.requestId) {
        root.innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-ticket"></i></div><h3>No Events Found</h3><p>No events found for this location</p></div>';
      }
    }
  }
  renderEventsList(root, events) {
    if (!events.length) {
      root.innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-ticket"></i></div><h3>No Events Found</h3><p>No events found for this location</p></div>';
      return;
    }
    root.innerHTML = events.map(e => {
      const planId = `event:${e.id}`;
      const saved = this.plans.isSaved(planId);
      const imgUrl = e.images?.find(x => x.ratio === '16_9')?.url || e.images?.[0]?.url || '';
      const cat = e.classifications?.[0]?.segment?.name || 'Event';
      const d = date(e.dates?.start?.localDate);
      const t = e.dates?.start?.localTime ? ` at ${e.dates.start.localTime.slice(0,5)}` : '';
      const venue = e._embedded?.venues?.[0]?.name || this.state.city;
      return `<article class="event-card">
        <div class="event-card-image">
          <img src="${esc(imgUrl)}" alt="${esc(e.name)}">
          <span class="event-card-category">${esc(cat)}</span>
          <button class="event-card-save save-event ${saved ? 'saved' : ''}" data-id="${esc(e.id)}"><i class="fa-${saved ? 'solid' : 'regular'} fa-heart"></i></button>
        </div>
        <div class="event-card-body">
          <h3>${esc(e.name)}</h3>
          <div class="event-card-info">
            <div><i class="fa-regular fa-calendar"></i>${esc(d + t)}</div>
            <div><i class="fa-solid fa-location-dot"></i>${esc(venue)}</div>
          </div>
          <div class="event-card-footer">
            <button class="btn-event save-event" data-id="${esc(e.id)}"><i class="fa-${saved ? 'solid' : 'regular'} fa-heart"></i> ${saved ? 'Saved' : 'Save'}</button>
            <a class="btn-buy-ticket" href="${esc(e.url || '#')}" target="_blank" rel="noopener"><i class="fa-solid fa-ticket"></i> Buy Tickets</a>
          </div>
        </div>
      </article>`;
    }).join('');
  }
  save(id) {
    const e = this.events?.find(x => x.id === id);
    if (e) {
      this.plans.save({
        id: `event:${id}`,
        type: 'event',
        title: e.name,
        date: e.dates?.start?.localDate,
        location: e._embedded?.venues?.[0]?.name || this.state.city,
        subtitle: e._embedded?.venues?.[0]?.name || e.classifications?.[0]?.segment?.name || 'Event'
      });
    }
  }
}

class WeatherManager {
  constructor(api, state) { Object.assign(this, { api, state }); this.requestId = 0; }
  async load() {
    const requestId = ++this.requestId;
    const root = document.querySelector('#weather-content');
    if (this.state.country && (this.state.lat == null || this.state.lon == null || !Number.isFinite(Number(this.state.lat)) || !Number.isFinite(Number(this.state.lon)))) {
      const fallbackCities = getInstantCitiesForCountry(this.state.country, this.state.countryName);
      const match = fallbackCities.find(c => c.name.toLowerCase() === String(this.state.city || '').toLowerCase()) || fallbackCities[0];
      if (match) {
        if (!this.state.city) this.state.city = match.name;
        this.state.lat = Number(match.lat);
        this.state.lon = Number(match.lon);
        this.state.timezone = match.timezone || 'UTC';
      }
    }
    updateSelectionBadge('#weather-view', this.state);
    if (this.state.lat == null || this.state.lon == null || !Number.isFinite(Number(this.state.lat)) || !Number.isFinite(Number(this.state.lon))) {
      root.innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-circle-exclamation"></i></div><h3>No City Selected</h3><p>Select a country and city from the dashboard to see the weather forecast</p><button class="btn-primary" id="go-dashboard-btn"><i class="fa-solid fa-globe"></i> Go to Dashboard</button></div>';
      return;
    }
    const w = await this.api.forecast(this.state.lat, this.state.lon);
    if (requestId !== this.requestId) return;
    const dailyFields = ['weather_code', 'temperature_2m_max', 'temperature_2m_min'];
    if (!w.current || !Array.isArray(w.daily?.time) || w.daily.time.length === 0 || dailyFields.some(field => !Array.isArray(w.daily[field]) || w.daily[field].length !== w.daily.time.length)) {
      throw new Error('Weather service returned an incomplete current or daily forecast.');
    }
    const c = w.current, d = w.daily, h = w.hourly;
    const theme = weatherThemeFor(c.weather_code);
    const uvVal = Math.round(d.uv_index_max?.[0] ?? 5);
    const [uvClass, uvLabel] = uvLevelInfo(uvVal);
    const precipProb = d.precipitation_probability_max?.[0] ?? 0;
    const precipMm = Number(d.precipitation_sum?.[0] ?? c.precipitation ?? 0).toFixed(1);
    const windDir = windCompass(c.wind_direction_10m);

    const fmtSun = iso => {
      if (!iso) return '--:--';
      try {
        return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      } catch { return '--:--'; }
    };
    const sunriseStr = fmtSun(d.sunrise?.[0]);
    const sunsetStr = fmtSun(d.sunset?.[0]);

   
    let hourlyHtml = '';
    if (Array.isArray(h?.time) && Array.isArray(h?.temperature_2m)) {
      const nowTime = c.time ? c.time.slice(0, 13) : '';
      let startIdx = h.time.findIndex(t => t.slice(0, 13) >= nowTime);
      if (startIdx < 0) startIdx = 0;
      const slice = h.time.slice(startIdx, startIdx + 24);
      hourlyHtml = slice.map((t, idx) => {
        const i = startIdx + idx;
        const temp = Math.round(h.temperature_2m[i]);
        const code = h.weather_code?.[i] ?? c.weather_code;
        const prob = h.precipitation_probability?.[i] ?? 0;
        const label = idx === 0 ? 'Now' : new Date(t).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        return `<div class="hourly-item ${idx === 0 ? 'now' : ''}">
          <span class="hourly-time">${esc(label)}</span>
          <div class="hourly-icon"><i class="fa-solid ${iconFor(code)}"></i></div>
          <span class="hourly-temp">${temp}°</span>
          ${prob > 0 ? `<div class="hourly-precip"><i class="fa-solid fa-droplet"></i><span>${prob}%</span></div>` : ''}
        </div>`;
      }).join('');
    }

    const heroDate = new Date(c.time || Date.now()).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    root.innerHTML = `
      <div class="weather-hero-card ${theme}">
        <div class="weather-hero-bg"></div>
        <div class="weather-hero-content">
          <div class="weather-location">
            <i class="fa-solid fa-location-dot"></i>
            <span>${esc(this.state.city)}</span>
            <span class="weather-time">${esc(heroDate)}</span>
          </div>
          <div class="weather-hero-main">
            <div class="weather-hero-left">
              <div class="weather-hero-icon"><i class="fa-solid ${iconFor(c.weather_code)}"></i></div>
              <div class="weather-hero-temp">
                <span class="temp-value">${Math.round(c.temperature_2m)}</span>
                <span class="temp-unit">°C</span>
              </div>
            </div>
            <div class="weather-hero-right">
              <div class="weather-condition">${esc(weatherName(c.weather_code))}</div>
              <div class="weather-feels">Feels like ${Math.round(c.apparent_temperature)}°C</div>
              <div class="weather-high-low">
                <span class="high"><i class="fa-solid fa-arrow-up"></i> ${Math.round(d.temperature_2m_max[0])}°</span>
                <span class="low"><i class="fa-solid fa-arrow-down"></i> ${Math.round(d.temperature_2m_min[0])}°</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="weather-details-grid">
        <div class="weather-detail-card">
          <div class="detail-icon humidity"><i class="fa-solid fa-droplet"></i></div>
          <div class="detail-info">
            <span class="detail-label">Humidity</span>
            <span class="detail-value">${c.relative_humidity_2m}%</span>
          </div>
          <div class="detail-bar"><div class="detail-bar-fill" style="width: ${Math.min(100, Math.max(0, c.relative_humidity_2m))}%"></div></div>
        </div>
        <div class="weather-detail-card">
          <div class="detail-icon wind"><i class="fa-solid fa-wind"></i></div>
          <div class="detail-info">
            <span class="detail-label">Wind</span>
            <span class="detail-value">${Math.round(c.wind_speed_10m)} km/h</span>
          </div>
          <div class="detail-extra">${esc(windDir)}</div>
        </div>
        <div class="weather-detail-card">
          <div class="detail-icon uv"><i class="fa-solid fa-sun"></i></div>
          <div class="detail-info">
            <span class="detail-label">UV Index</span>
            <span class="detail-value">${uvVal}</span>
          </div>
          <div class="detail-extra"><span class="uv-level ${uvClass}">${uvLabel}</span></div>
        </div>
        <div class="weather-detail-card">
          <div class="detail-icon precip"><i class="fa-solid fa-cloud-rain"></i></div>
          <div class="detail-info">
            <span class="detail-label">Precipitation</span>
            <span class="detail-value">${precipProb}%</span>
          </div>
          <div class="detail-extra">${precipMm}mm expected</div>
        </div>
        <div class="weather-detail-card sunrise-sunset">
          <div class="sun-times-visual">
            <div class="sun-time sunrise">
              <i class="fa-solid fa-sun"></i>
              <span class="sun-label">Sunrise</span>
              <span class="sun-value">${esc(sunriseStr)}</span>
            </div>
            <div class="sun-arc">
              <div class="sun-arc-path"></div>
              <div class="sun-position" style="left: calc(50% - 6px); transform: translateY(-40px);"></div>
            </div>
            <div class="sun-time sunset">
              <i class="fa-solid fa-moon"></i>
              <span class="sun-label">Sunset</span>
              <span class="sun-value">${esc(sunsetStr)}</span>
            </div>
          </div>
        </div>
      </div>

      ${hourlyHtml ? `
      <div class="weather-section">
        <h3 class="weather-section-title"><i class="fa-solid fa-clock"></i> Hourly Forecast</h3>
        <div class="hourly-scroll">${hourlyHtml}</div>
      </div>` : ''}

      <div class="weather-section">
        <h3 class="weather-section-title"><i class="fa-solid fa-calendar-week"></i> 7-Day Forecast</h3>
        <div class="forecast-list">
          ${d.time.map((day, i) => {
            const prob = d.precipitation_probability_max?.[i] ?? 0;
            const dObj = new Date(`${day}T12:00:00`);
            const dayShort = i === 0 ? 'Today' : dObj.toLocaleDateString('en-US', { weekday: 'short' });
            const dayDate = `${dObj.getDate()} ${dObj.toLocaleDateString('en-US', { month: 'short' })}`;
            return `<div class="forecast-day ${i === 0 ? 'today' : ''}">
              <div class="forecast-day-name">
                <span class="day-label">${esc(dayShort)}</span>
                <span class="day-date">${esc(dayDate)}</span>
              </div>
              <div class="forecast-icon"><i class="fa-solid ${iconFor(d.weather_code[i])}"></i></div>
              <div class="forecast-temps">
                <span class="temp-max">${Math.round(d.temperature_2m_max[i])}°</span>
                <span class="temp-min">${Math.round(d.temperature_2m_min[i])}°</span>
              </div>
              <div class="forecast-precip">${prob > 0 ? `<i class="fa-solid fa-droplet"></i><span>${prob}%</span>` : ''}</div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    const p = document.querySelector('#weather-view .view-header-content p');
    if (p) p.textContent = `Check 7-day weather forecasts for ${this.state.city}`;
  }
}

class LongWeekendManager {
  constructor(api, plans, state) { Object.assign(this, { api, plans, state }); this.requestId = 0; }
  buildDaysVisual(startDateStr, endDateStr, holidayDates) {
    const days = [];
    const cur = new Date(`${startDateStr.slice(0, 10)}T12:00:00`);
    const end = new Date(`${endDateStr.slice(0, 10)}T12:00:00`);
    while (cur <= end && days.length < 14) {
      const iso = cur.toISOString().slice(0, 10);
      const dow = cur.getDay();
      const isWeekend = dow === 5 || dow === 6 || dow === 0;
      const isHoliday = holidayDates.has(iso);
      const cls = isHoliday ? 'holiday' : (isWeekend ? 'weekend' : '');
      const name = cur.toLocaleDateString('en-US', { weekday: 'short' });
      const num = cur.getDate();
      days.push(`<div class="lw-day ${cls}"><span class="name">${esc(name)}</span><span class="num">${num}</span></div>`);
      cur.setDate(cur.getDate() + 1);
    }
    return `<div class="lw-days-visual">${days.join('')}</div>`;
  }
  async load() {
    const requestId = ++this.requestId;
    const root = document.querySelector('#lw-content');
    updateSelectionBadge('#long-weekends-view', this.state, true);
    if (!this.state.country) {
      root.innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-umbrella-beach"></i></div><h3>No Country Selected</h3><p>Select a country from the dashboard to discover long weekend opportunities.</p><button class="btn-primary" id="go-dashboard-btn"><i class="fa-solid fa-globe"></i> Go to Dashboard</button></div>';
      return;
    }
    const [rows, holidays] = await Promise.all([
      this.api.longWeekends(this.state.country, this.state.year),
      this.api.holidays(this.state.country, this.state.year)
    ]);
    if (requestId !== this.requestId) return;
    if (!Array.isArray(rows) || !Array.isArray(holidays)) throw new Error('Long weekend service returned an unexpected response.');
    const holidayStat = document.querySelector('#stat-holidays');
    if (holidayStat) holidayStat.textContent = holidays.length;
    this.rows = rows;
    const holidayDates = new Set(holidays.map(h => h.date));
    root.innerHTML = rows.length ? rows.map((x, i) => {
      const planId = `longweekend:${this.state.country}:${x.startDate}`;
      const saved = this.plans.isSaved(planId);
      const startShort = shortDate(x.startDate);
      const endFull = date(x.endDate);
      return `<article class="lw-card">
        <div class="lw-card-header">
          <span class="lw-badge"><i class="fa-solid fa-calendar-days"></i> ${esc(x.dayCount)} Days</span>
          <button class="holiday-action-btn save-weekend ${saved ? 'saved' : ''}" data-id="${i}">
            <i class="fa-${saved ? 'solid' : 'regular'} fa-heart"></i>
          </button>
        </div>
        <h3>Long Weekend #${i + 1}</h3>
        <div class="lw-dates"><i class="fa-regular fa-calendar"></i> ${esc(startShort)} - ${esc(endFull)}</div>
        <div class="lw-info-box ${x.needBridgeDay ? 'warning' : 'success'}">
          <i class="fa-solid fa-${x.needBridgeDay ? 'info-circle' : 'check-circle'}"></i>
          ${x.needBridgeDay ? 'Requires taking a bridge day off' : 'No extra days off needed!'}
        </div>
        ${this.buildDaysVisual(x.startDate, x.endDate, holidayDates)}
      </article>`;
    }).join('') : '<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-umbrella-beach"></i></div><h3>No Long Weekends Found</h3><p>No long weekends found for this selection.</p></div>';
  }
}

class CurrencyConverter {
  constructor(api, ui) {
    Object.assign(this, { api, ui });
    this.requestId = 0;
    this.currenciesMap = {};
  }

  setupCustomCurrencySelect(id) {
    const select = document.getElementById(id);
    if (!select || document.getElementById(`${id}-custom`)) return;
    select.style.display = 'none';
    const wrapper = document.createElement('div');
    wrapper.className = 'currency-custom-select';
    wrapper.id = `${id}-custom`;
    wrapper.innerHTML = `
      <div class="currency-custom-trigger" tabindex="0">
        <span class="currency-code">USD</span>
        <span class="currency-name">US Dollar</span>
        <i class="fa-solid fa-chevron-down arrow"></i>
      </div>
      <div class="currency-custom-dropdown">
        <div class="currency-custom-search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search currency..." autocomplete="off">
        </div>
        <div class="currency-custom-options"></div>
      </div>
    `;
    select.after(wrapper);
    const trigger = wrapper.querySelector('.currency-custom-trigger');
    const dropdown = wrapper.querySelector('.currency-custom-dropdown');
    const searchInput = wrapper.querySelector('input');
    const optionsBox = wrapper.querySelector('.currency-custom-options');

    trigger.addEventListener('click', () => {
      if (select.disabled) return;
      document.querySelectorAll('.currency-custom-trigger.open, .currency-custom-dropdown.open').forEach(el => {
        if (el !== trigger && el !== dropdown) el.classList.remove('open');
      });
      const isOpen = trigger.classList.toggle('open');
      dropdown.classList.toggle('open', isOpen);
      if (isOpen) {
        searchInput.value = '';
        this.renderCurrencyOptions(id, '');
        setTimeout(() => searchInput.focus(), 20);
      }
    });

    searchInput.addEventListener('input', () => this.renderCurrencyOptions(id, searchInput.value));
    searchInput.addEventListener('click', e => e.stopPropagation());

    optionsBox.addEventListener('click', e => {
      const opt = e.target.closest('.currency-custom-option');
      if (!opt) return;
      const code = opt.dataset.value || '';
      trigger.classList.remove('open');
      dropdown.classList.remove('open');
      if (select.value !== code) {
        select.value = code;
        this.syncCustomCurrencySelect(id);
      }
    });
  }

  renderCurrencyOptions(id, query = '') {
    const wrapper = document.getElementById(`${id}-custom`);
    const select = document.getElementById(id);
    if (!wrapper || !select) return;
    const optionsBox = wrapper.querySelector('.currency-custom-options');
    const q = query.trim().toLowerCase();
    const entries = Object.entries(this.currenciesMap || {}).sort(([a], [b]) => a.localeCompare(b));
    const filtered = entries.filter(([code, name]) => !q || code.toLowerCase().includes(q) || String(name).toLowerCase().includes(q));
    if (!filtered.length) {
      optionsBox.innerHTML = `<div class="currency-custom-option"><span class="name">No currencies found</span></div>`;
      return;
    }
    const current = select.value;
    optionsBox.innerHTML = filtered.map(([code, name]) => `
      <div class="currency-custom-option ${code === current ? 'selected' : ''}" data-value="${esc(code)}">
        <span class="code">${esc(code)}</span>
        <span class="name">${esc(name)}</span>
      </div>
    `).join('');
  }

  syncCustomCurrencySelect(id) {
    const wrapper = document.getElementById(`${id}-custom`);
    const select = document.getElementById(id);
    if (!wrapper || !select) return;
    const code = select.value || 'USD';
    const name = this.currenciesMap?.[code] || code;
    const codeEl = wrapper.querySelector('.currency-custom-trigger .currency-code');
    const nameEl = wrapper.querySelector('.currency-custom-trigger .currency-name');
    if (codeEl) codeEl.textContent = code;
    if (nameEl) nameEl.textContent = name;
    this.renderCurrencyOptions(id, '');
  }

  syncAllCustomCurrencySelects() {
    this.syncCustomCurrencySelect('currency-from');
    this.syncCustomCurrencySelect('currency-to');
  }

  async init() {
    this.setupCustomCurrencySelect('currency-from');
    this.setupCustomCurrencySelect('currency-to');
    const resultEl = document.querySelector('#currency-result');
    if (resultEl) {
      resultEl.classList.add('hidden');
      resultEl.innerHTML = '';
    }
    try {
      const currencies = await this.api.currencies();
      this.currenciesMap = currencies;
      for (const id of ['currency-from', 'currency-to']) {
        const select = document.getElementById(id);
        select.innerHTML = Object.entries(currencies).sort(([a], [b]) => a.localeCompare(b)).map(([code, name]) => `<option value="${esc(code)}">${esc(code)} - ${esc(name)}</option>`).join('');
        select.disabled = false;
      }
      const from = document.getElementById('currency-from'), to = document.getElementById('currency-to');
      from.value = currencies.USD ? 'USD' : Object.keys(currencies)[0] || '';
      to.value = currencies.EUR ? 'EUR' : Object.keys(currencies).find(code => code !== from.value) || from.value;
      this.syncAllCustomCurrencySelects();
      this.initError = null;
      try { await this.loadPopular(currencies); }
      catch (error) { const popular = document.querySelector('#popular-currencies'); if (popular) popular.innerHTML = `<p class="empty-state">Quick rates unavailable: ${esc(error.message)}</p>`; }
    } catch (error) {
      this.initError = error;
      for (const id of ['currency-from', 'currency-to']) {
        const select = document.getElementById(id);
        if (select) { select.innerHTML = '<option value="">Currencies unavailable</option>'; select.disabled = true; }
      }
      const popular = document.querySelector('#popular-currencies');
      if (popular) popular.innerHTML = `<p class="empty-state">Quick rates unavailable: ${esc(error.message)}</p>`;
      throw error;
    }
  }

  async loadPopular(currencies) {
    const preferred = ['EUR', 'GBP', 'EGP', 'AED', 'SAR', 'JPY', 'CAD', 'INR'];
    const codes = preferred.filter(code => currencies[code]);
    const root = document.querySelector('#popular-currencies');
    if (!root) return;
    if (!codes.length) { root.innerHTML = '<p class="empty-state">No quick-convert currencies are available.</p>'; return; }
    const rows = await this.api.rates('USD', codes);
    const rates = new Map(rows.map(row => [String(row.quote || '').toUpperCase(), row]));
    root.innerHTML = codes.filter(code => rates.has(code)).map(code => {
      const flagCode = CURRENCY_FLAGS[code] || code.slice(0, 2).toLowerCase();
      return `<div class="popular-currency-card" data-currency="${esc(code)}">
        <img src="https://flagcdn.com/w40/${esc(flagCode)}.png" alt="${esc(code)}" class="flag">
        <div class="info">
          <div class="code">${esc(code)}</div>
          <div class="name">${esc(currencies[code])}</div>
        </div>
        <div class="rate">${Number(rates.get(code).rate).toFixed(4)}</div>
      </div>`;
    }).join('') || '<p class="empty-state">No quick exchange rates were returned.</p>';
  }

  async convert() {
    const requestId = ++this.requestId;
    if (this.initError) throw new Error(`Currency list unavailable: ${this.initError.message}`);
    this.syncAllCustomCurrencySelects();
    const amount = Number(document.querySelector('#currency-amount').value), from = document.querySelector('#currency-from').value, to = document.querySelector('#currency-to').value;
    if (!Number.isFinite(amount) || amount <= 0) throw new Error('Enter an amount greater than zero.');
    if (!from || !to) throw new Error('Choose both currencies.');
    let data;
    try { data = from === to ? { date: new Date().toISOString().slice(0, 10), rate: 1 } : await this.api.rate(from, to); }
    catch (error) { if (requestId !== this.requestId) return; throw error; }
    if (!data || !Number.isFinite(data.rate) || data.rate <= 0 || !data.date) throw new Error('Currency service returned an invalid exchange rate.');
    if (requestId !== this.requestId) return;
    const formattedDate = new Date().toLocaleDateString('en-US');
    const resultEl = document.querySelector('#currency-result');
    if (resultEl) {
      resultEl.classList.remove('hidden');
      resultEl.innerHTML = `
        <div class="conversion-display">
          <div class="conversion-from">
            <span class="amount">${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span class="currency-code">${esc(from)}</span>
          </div>
          <div class="conversion-equals"><i class="fa-solid fa-equals"></i></div>
          <div class="conversion-to">
            <span class="amount">${(amount * data.rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span class="currency-code">${esc(to)}</span>
          </div>
        </div>
        <div class="exchange-rate-info">
          <p>1 ${esc(from)} = ${Number(data.rate).toFixed(6)} ${esc(to)}</p>
          <small>Last updated: ${esc(formattedDate)}</small>
        </div>`;
    }
  }
}


const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

class App {
  constructor() {
    this.api = new APIService();
    this.ui = new UIManager();
    this.state = { year: String(new Date().getFullYear()) };
    this.plans = new PlansManager(this.ui);
    this.dashboard = new DashboardManager(this.api, this.ui, this.state);
    this.holidays = new HolidayManager(this.api, this.plans, this.ui, this.state);
    this.events = new EventManager(this.api, this.plans, this.ui, this.state, config.ticketmasterApiKey);
    this.weather = new WeatherManager(this.api, this.state);
    this.weekends = new LongWeekendManager(this.api, this.plans, this.state);
    this.currency = new CurrencyConverter(this.api, this.ui);
    this.router = new Router(this);
    this.ready = false;
    this.plans.onChange = () => {
      if (this.currentView() === 'holidays') this.holidays.load();
      if (this.currentView() === 'long-weekends') this.weekends.load();
      if (this.currentView() === 'events') this.events.load();
    };
    this.bind();
  }

  async start() {
    this.clearStaticSamples();
    const years = document.querySelector('#global-year');
    if (years) {
      const currentYear = new Date().getFullYear();
      years.innerHTML = Array.from({ length: 6 }, (_, i) => currentYear + i).map(year => `<option value="${year}">${year}</option>`).join('');
      if (this.state.year && [...years.options].some(o => o.value === this.state.year)) years.value = this.state.year;
      else years.value = String(currentYear);
      this.state.year = years.value;
    }
    this.router.start();
    this.plans.render();
    try {
      await this.ui.run('Loading destinations…', async () => {
        const [directoryResult, currencyResult] = await Promise.allSettled([this.dashboard.init(), this.currency.init()]);
        if (directoryResult.status === 'rejected') throw directoryResult.reason;
        if (currencyResult.status === 'rejected') this.ui.toast(`Currency list unavailable: ${currencyResult.reason.message}`, 'error');
      });
      const countrySelect = document.querySelector('#global-country'); if (countrySelect) countrySelect.disabled = false;
      const citySelect = document.querySelector('#global-city'); if (citySelect) citySelect.disabled = true;
      this.dashboard.syncCountryCustomSelect();
      this.dashboard.syncCityCustomSelect();
      this.dashboard.syncYearCustomSelect();
      this.ready = true;
      this.syncState();
      await this.loadView(this.currentView());
    } catch(e) {
      console.error(e);
      this.showStartupError(e);
    }
    this.clock();
    setInterval(() => this.clock(), 30000);
  }

  currentView() { return this.router.viewFromLocation(); }

  clearStaticSamples() {
    for (const selector of ['#holidays-content','#events-content','#weather-content','#lw-content','#plans-content','#dashboard-country-info','#currency-result','#popular-currencies','#sun-times-content']) {
      const element = document.querySelector(selector);
      if (element) element.replaceChildren();
    }
    document.querySelector('#currency-result')?.classList.add('hidden');
    document.querySelectorAll('.view-header-selection').forEach(el => { el.style.display = 'none'; el.replaceChildren(); });
    const holidayStat = document.getElementById('stat-holidays'); if (holidayStat) holidayStat.textContent = '17';
    const eventStat = document.getElementById('stat-events'); if (eventStat) eventStat.textContent = '500+';
    const form = document.querySelector('#global-country'); if (form) form.disabled = true;
    const city = document.querySelector('#global-city'); if (city) city.disabled = true;
    const name = document.querySelector('#selected-country-name'); if (name) name.textContent = 'Loading destinations…';
    const selectedCity = document.querySelector('#selected-city-name'); if (selectedCity) selectedCity.textContent = '';
    const flag = document.querySelector('#selected-country-flag'); if (flag) { flag.removeAttribute('src'); flag.alt = ''; flag.hidden = true; }
  }

  showStartupError(error) {
    const root = document.querySelector('#dashboard-country-info');
    if (root) root.innerHTML = `<p class="empty-state">Could not load destination data: ${escapeHtml(error.message || error)}</p>`;
    const country = document.querySelector('#global-country'); if (country) { country.innerHTML = '<option value="">Destination data unavailable</option>'; country.disabled = true; }
    const city = document.querySelector('#global-city'); if (city) { city.innerHTML = '<option value="">Destination data unavailable</option>'; city.disabled = true; }
  }

  syncState() {
    const country = this.dashboard.countries?.find(c => c.cca2 === this.state.country);
    this.state.countryName = country?.name.common || '';
    this.state.flag = country?.flags?.png || '';
    this.state.year = String(document.querySelector('#global-year')?.value || this.state.year);
  }

  async loadView(view) {
    if (!this.ready) return;
    this.syncState();
    if (view === 'my-plans') return this.plans.render();
    if (view === 'dashboard') return this.refreshDashboardStats();
    if (view === 'currency') {
      this.currency.syncAllCustomCurrencySelects();
      return;
    }
    const jobs = {
      holidays: () => this.holidays.load(),
      events: () => this.events.load(),
      weather: () => this.weather.load(),
      'long-weekends': () => this.weekends.load(),
      'sun-times': () => this.sunTimes()
    };
    if (jobs[view]) {
      try {
        await this.ui.run(`Loading ${view.replace('-', ' ')}…`, jobs[view]);
      } catch(e) {
        const selector = { events:'#events-content', weather:'#weather-content', 'long-weekends':'#lw-content', currency:'#currency-result', 'sun-times':'#sun-times-content' }[view];
        const root = selector && document.querySelector(selector);
        if (root && !root.textContent?.includes(e.message)) {
          root.innerHTML = `<p class="empty-state">Could not load ${escapeHtml(view.replace('-', ' '))}: ${escapeHtml(e.message)}</p>`;
        }
      }
    }
  }

  async refreshSelection() {
    this.syncState();
    await this.loadView(this.currentView());
  }

  async refreshDashboardStats() {
    const requestId = this.dashboardStatsRequest = (this.dashboardStatsRequest || 0) + 1;
    const stat = document.querySelector('#stat-holidays');
    if (!this.state.country) {
      if (stat) stat.textContent = '17';
      return;
    }
    try {
      const holidays = await this.api.holidays(this.state.country, this.state.year);
      if (requestId === this.dashboardStatsRequest && stat) stat.textContent = Array.isArray(holidays) ? holidays.length : '—';
    } catch(error) {
      if (requestId === this.dashboardStatsRequest && stat) stat.textContent = '—';
      console.warn('Holiday statistic unavailable:', error.message);
    }
  }

  async runCurrencyConversion() {
    try {
      await this.ui.run('Converting...', () => this.currency.convert());
    } catch(e) {
      const root = document.querySelector('#currency-result');
      if (root) {
        root.classList.remove('hidden');
        root.innerHTML = `<p class="empty-state">Could not load currency: ${escapeHtml(e.message)}</p>`;
      }
    }
  }

  async sunTimes() {
    const requestId = this.sunTimesRequest = (this.sunTimesRequest || 0) + 1;
    const root = document.querySelector('#sun-times-content');
    const badge = document.querySelector('#sun-times-view .view-header-selection');
    if (!this.state.country || this.state.lat == null || this.state.lon == null || !Number.isFinite(Number(this.state.lat)) || !Number.isFinite(Number(this.state.lon))) {
      if (badge) { badge.style.display = 'none'; badge.innerHTML = ''; }
      if (root) root.innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-sun"></i></div><h3>No City Selected</h3><p>Select a country and city from the dashboard to see sunrise and sunset times.</p><button class="btn-primary" id="go-dashboard-btn"><i class="fa-solid fa-globe"></i> Go to Dashboard</button></div>';
      return;
    }
    if (badge) {
      badge.style.display = 'flex';
      const flagUrl = this.state.flag ? this.state.flag.replace('/w160/', '/w40/') : `https://flagcdn.com/w40/${String(this.state.country).toLowerCase()}.png`;
      badge.innerHTML = `<div class="current-selection-badge"><img src="${escapeHtml(flagUrl)}" alt="${escapeHtml(this.state.countryName||'')}" class="selection-flag"><span>${escapeHtml(this.state.countryName||'')}</span><span class="selection-city">${escapeHtml(this.state.city||'')}</span></div>`;
    }
    const url = `https://api.sunrise-sunset.org/json?lat=${this.state.lat}&lng=${this.state.lon}&formatted=0`;
    const { results, status } = await this.api.get(url, { cache: false });
    if (requestId !== this.sunTimesRequest) return;
    if (status && status !== 'OK') throw new Error(`Sun times service returned ${status}.`);
    if (!results?.sunrise || !results?.sunset) throw new Error('Sun times service returned an incomplete response.');
    const fmt = x => {
      try { return new Date(x).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: this.state.timezone || 'UTC' }); }
      catch { return new Date(x).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' }); }
    };
    const cards = [
      ['dawn', 'fa-moon', 'Dawn', results.civil_twilight_begin, 'Civil Twilight'],
      ['sunrise', 'fa-sun', 'Sunrise', results.sunrise, 'Golden Hour Start'],
      ['noon', 'fa-sun', 'Solar Noon', results.solar_noon, 'Sun at Highest'],
      ['sunset', 'fa-sun', 'Sunset', results.sunset, 'Golden Hour End'],
      ['dusk', 'fa-moon', 'Dusk', results.civil_twilight_end, 'Civil Twilight']
    ];
    const durationMin = Math.max(0, (new Date(results.sunset) - new Date(results.sunrise)) / 60000);
    const h = Math.floor(durationMin / 60), m = Math.round(durationMin % 60);
    const darkMin = Math.max(0, 1440 - durationMin);
    const darkH = Math.floor(darkMin / 60), darkM = Math.round(darkMin % 60);
    const pct = ((durationMin / 1440) * 100).toFixed(1);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' });

    root.innerHTML = `
      <div class="sun-main-card">
        <div class="sun-main-header">
          <div class="sun-location">
            <h2><i class="fa-solid fa-location-dot"></i> ${escapeHtml(this.state.city)}</h2>
            <p>Sun times for your selected location (${escapeHtml(this.state.timezone || 'UTC')})</p>
          </div>
          <div class="sun-date-display">
            <div class="date">${escapeHtml(dateStr)}</div>
            <div class="day">${escapeHtml(dayStr)}</div>
          </div>
        </div>
        <div class="sun-times-grid">
          ${cards.map(([cls, icon, label, time, sub]) => `
            <div class="sun-time-card ${cls}">
              <div class="icon"><i class="fa-solid ${icon}"></i></div>
              <div class="label">${escapeHtml(label)}</div>
              <div class="time">${escapeHtml(fmt(time))}</div>
              <div class="sub-label">${escapeHtml(sub)}</div>
            </div>`).join('')}
          <div class="sun-time-card daylight">
            <div class="icon"><i class="fa-solid fa-hourglass-half"></i></div>
            <div class="label">Day Length</div>
            <div class="time">${h}h ${m}m</div>
            <div class="sub-label">Total Daylight</div>
          </div>
        </div>
      </div>
      <div class="day-length-card">
        <h3><i class="fa-solid fa-chart-pie"></i> Daylight Distribution</h3>
        <div class="day-progress">
          <div class="day-progress-bar">
            <div class="day-progress-fill" style="width: ${pct}%"></div>
          </div>
        </div>
        <div class="day-length-stats">
          <div class="day-stat">
            <div class="value">${h}h ${m}m</div>
            <div class="label">Daylight</div>
          </div>
          <div class="day-stat">
            <div class="value">${pct}%</div>
            <div class="label">of 24 Hours</div>
          </div>
          <div class="day-stat">
            <div class="value">${darkH}h ${darkM}m</div>
            <div class="label">Darkness</div>
          </div>
        </div>
      </div>`;
  }

  bind() {
    document.addEventListener('click', e => {
      const nav = e.target.closest('[data-view]');
      if (nav) { e.preventDefault(); this.router.navigate(nav.dataset.view); return; }
      if (e.target.closest('#go-dashboard-btn')) { this.router.navigate('dashboard'); return; }
      if (e.target.closest('#mobile-menu-btn')) { document.querySelector('#sidebar').classList.toggle('open'); document.querySelector('#sidebar-overlay').classList.toggle('hidden'); return; }
      if (e.target.closest('#sidebar-overlay')) { document.querySelector('#sidebar').classList.remove('open'); document.querySelector('#sidebar-overlay').classList.add('hidden'); return; }

      const borderTag = e.target.closest('.border-tag[data-border]');
      if (borderTag) {
        const borderCode = borderTag.dataset.border;
        const match = this.dashboard.countries?.find(c => c.cca3 === borderCode || c.cca2 === borderCode);
        if (match) {
          this.ui.run('Updating destination…', () => this.dashboard.selectCountry(match.cca2)).then(() => this.refreshSelection()).catch(() => this.refreshSelection());
        }
        return;
      }

      const saveHoliday = e.target.closest('.save-holiday');
      if (saveHoliday) {
        const row = this.holidays.rows?.find(x => x.date === saveHoliday.dataset.date && x.name === saveHoliday.dataset.title);
        if (row) {
          const added = this.plans.save({ id: `holiday:${this.state.country}:${row.date}:${row.name}`, type: 'holiday', title: row.localName || row.name, date: row.date, subtitle: row.name });
          if (added) {
            saveHoliday.classList.add('saved');
            const icon = saveHoliday.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-heart';
          }
        }
        return;
      }

      const saveEvent = e.target.closest('.save-event');
      if (saveEvent) {
        this.events.save(saveEvent.dataset.id);
        this.events.renderEventsList(document.querySelector('#events-content'), this.events.events || []);
        return;
      }

      const weekend = e.target.closest('.save-weekend');
      if (weekend) {
        const x = this.weekends.rows?.[Number(weekend.dataset.id)];
        if (x) {
          const added = this.plans.save({ id: `longweekend:${this.state.country}:${x.startDate}`, type: 'longweekend', title: `Long weekend · ${x.dayCount} days`, date: x.startDate, subtitle: `${x.startDate} – ${x.endDate}` });
          if (added) {
            weekend.classList.add('saved');
            const icon = weekend.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-heart';
          }
        }
        return;
      }

      const remove = e.target.closest('.remove-plan');
      if (remove) { this.plans.remove(remove.dataset.id, e.isTrusted); return; }

      const filter = e.target.closest('.plan-filter');
      if (filter) { this.plans.setFilter(filter.dataset.filter); return; }

      if (e.target.closest('#clear-all-plans-btn')) {
        if (e.isTrusted && typeof window !== 'undefined' && window.Swal) {
          this.plans.clear(true);
        } else if (confirm('Clear all saved plans?')) {
          this.plans.clear(false);
        }
        return;
      }

      if (e.target.closest('#start-exploring-btn')) { this.router.navigate('holidays'); return; }

      if (e.target.closest('#global-search-btn')) {
        this.syncState();
        if (!this.state.country) {
          this.ui.toast('Please select a country first!', 'info');
          return;
        }
        const destLabel = this.state.city ? `${this.state.countryName}, ${this.state.city}` : this.state.countryName;
        this.ui.toast(`Exploring ${destLabel}!`);
        this.refreshSelection();
        return;
      }

      if (e.target.closest('#clear-selection-btn')) {
        const country = document.querySelector('#global-country');
        if (country) {
          country.value = '';
          this.ui.run('Clearing destination…', () => this.dashboard.selectCountry('')).then(() => this.refreshSelection()).catch(error => this.ui.toast(error.message, 'error'));
        }
        return;
      }

      const popCard = e.target.closest('.popular-currency-card[data-currency]');
      if (popCard) {
        const toSelect = document.querySelector('#currency-to');
        if (toSelect && popCard.dataset.currency) {
          toSelect.value = popCard.dataset.currency;
          this.currency.syncCustomCurrencySelect('currency-to');
          this.runCurrencyConversion();
        }
        return;
      }

      if (e.target.closest('#swap-currencies-btn')) {
        const a = document.querySelector('#currency-from'), b = document.querySelector('#currency-to'), v = a.value;
        a.value = b.value; b.value = v;
        this.currency.syncAllCustomCurrencySelects();
        if (!document.querySelector('#currency-result')?.classList.contains('hidden')) {
          this.runCurrencyConversion();
        }
        return;
      }
      if (e.target.closest('#convert-btn')) { this.runCurrencyConversion(); return; }
      if (e.target.closest('#event-search-btn')) { this.loadView('events'); return; }
    });

    document.addEventListener('change', e => {
      if (e.target.id === 'global-country') this.ui.run('Updating destination…', () => this.dashboard.selectCountry(e.target.value)).then(() => this.refreshSelection()).catch(() => this.refreshSelection());
      if (e.target.id === 'global-city') this.ui.run('Locating city…', () => this.dashboard.selectCity(e.target.value)).then(() => this.refreshSelection()).catch(() => this.refreshSelection());
      if (e.target.id === 'global-year') { this.state.year = e.target.value; this.dashboard.syncYearCustomSelect(); this.refreshSelection(); }
      if (['event-sort','event-category'].includes(e.target.id)) this.loadView('events');
      if (['currency-from','currency-to'].includes(e.target.id)) {
        this.currency.syncAllCustomCurrencySelects();
        if (!document.querySelector('#currency-result')?.classList.contains('hidden')) {
          this.runCurrencyConversion();
        }
      }
    });

    document.querySelector('#modal-close-btn')?.addEventListener('click', () => document.querySelector('#modal-overlay').classList.add('hidden'));
  }

  clock() {
    const e = document.querySelector('#current-datetime');
    if (e) e.textContent = new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', () => new App().start()); } else { new App().start(); }

})();

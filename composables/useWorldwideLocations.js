/**
 * Comprehensive Worldwide Locations & Hotels Directory Service
 * Bouazize Travel Enterprise
 * 
 * - Tier 1: Extensive in-memory database covering all 58 Algerian Wilayas + major Daïras & communes,
 *           top Algerian hotels, major global cities across all continents, and iconic international hotel chains.
 * - Tier 2: Real-time global geocoding fallback (Photon / OpenStreetMap) giving instant access to over
 *           1,000,000+ villages, towns, communes, landmarks, and hotels worldwide.
 */

// Helper to normalize strings (remove accents & lowercase)
export function normalizeLocationText(text) {
  return (text || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export const staticWorldwideLocations = [
  // =========================================================================
  // 1. ALGERIAN HOTELS (Top Luxury, Business, & Beach Resorts)
  // =========================================================================
  { name: 'Hôtel El Aurassi', code: 'ALG', country: 'Alger (Algérie)', type: 'hotel', stars: '5', keywords: ['alger', 'algerie', 'aurassi', 'tagarins', 'centre'] },
  { name: 'Sofitel Algiers Hamma Garden', code: 'ALG', country: 'Alger (Algérie)', type: 'hotel', stars: '5', keywords: ['alger', 'algerie', 'sofitel', 'hamma', 'garden', 'jardin dessai'] },
  { name: 'Sheraton Club des Pins Resort', code: 'ALG', country: 'Alger (Algérie)', type: 'hotel', stars: '5', keywords: ['alger', 'algerie', 'sheraton', 'club des pins', 'staoueli', 'plage', 'resort'] },
  { name: 'Hyatt Regency Algiers Airport', code: 'ALG', country: 'Alger (Algérie)', type: 'hotel', stars: '5', keywords: ['alger', 'algerie', 'hyatt', 'regency', 'aeroport', 'bab ezzouar'] },
  { name: 'Holiday Inn Algiers - Cheraga Tower', code: 'ALG', country: 'Alger (Algérie)', type: 'hotel', stars: '4', keywords: ['alger', 'algerie', 'holiday inn', 'cheraga', 'dounia parc'] },
  { name: 'Legacy Luxury Hotel Alger', code: 'ALG', country: 'Alger (Algérie)', type: 'hotel', stars: '5', keywords: ['alger', 'algerie', 'legacy', 'luxury', 'bir mourad rais'] },
  { name: 'AZ Hôtel Kouba', code: 'ALG', country: 'Alger (Algérie)', type: 'hotel', stars: '4', keywords: ['alger', 'algerie', 'az', 'kouba'] },
  { name: 'AZ Hôtel Zéralda', code: 'ALG', country: 'Alger (Algérie)', type: 'hotel', stars: '4', keywords: ['alger', 'algerie', 'az', 'zeralda'] },
  { name: 'Lamaraz Arts Hôtel', code: 'ALG', country: 'Alger (Algérie)', type: 'hotel', stars: '4', keywords: ['alger', 'algerie', 'lamaraz', 'arts', 'kouba'] },
  { name: 'Mercure Alger Aéroport', code: 'ALG', country: 'Alger (Algérie)', type: 'hotel', stars: '4', keywords: ['alger', 'algerie', 'mercure', 'aeroport', 'bab ezzouar'] },
  { name: 'Hôtel Saint Eugène', code: 'ALG', country: 'Alger (Algérie)', type: 'hotel', stars: '3', keywords: ['alger', 'algerie', 'bologhine', 'saint eugene'] },
  { name: 'Hôtel Albert 1er Alger', code: 'ALG', country: 'Alger (Algérie)', type: 'hotel', stars: '3', keywords: ['alger', 'algerie', 'albert', 'centre ville', 'pasteur'] },
  { name: 'Le Méridien Oran Hotel & Convention Centre', code: 'ORN', country: 'Oran (Algérie)', type: 'hotel', stars: '5', keywords: ['oran', 'algerie', 'meridien', 'centre des conventions', 'falaises'] },
  { name: 'Four Points by Sheraton Oran', code: 'ORN', country: 'Oran (Algérie)', type: 'hotel', stars: '4', keywords: ['oran', 'algerie', 'four points', 'sheraton', 'falaises'] },
  { name: 'Royal Hotel Oran - MGallery', code: 'ORN', country: 'Oran (Algérie)', type: 'hotel', stars: '5', keywords: ['oran', 'algerie', 'royal', 'mgallery', 'soummam'] },
  { name: 'Best Western Plus Colombe Hotel', code: 'ORN', country: 'Oran (Algérie)', type: 'hotel', stars: '4', keywords: ['oran', 'algerie', 'best western', 'colombe', 'millenium'] },
  { name: 'AZ Hôtel Grand Oran', code: 'ORN', country: 'Oran (Algérie)', type: 'hotel', stars: '4', keywords: ['oran', 'algerie', 'az', 'grand oran', 'bir el djir'] },
  { name: 'Hôtel Liberté Oran', code: 'ORN', country: 'Oran (Algérie)', type: 'hotel', stars: '4', keywords: ['oran', 'algerie', 'liberte', 'ypres'] },
  { name: 'Constantine Marriott Hotel', code: 'CZL', country: 'Constantine (Algérie)', type: 'hotel', stars: '5', keywords: ['constantine', 'algerie', 'marriott', 'belle vue', 'arc de triomphe'] },
  { name: 'Protea Hotel by Marriott Constantine', code: 'CZL', country: 'Constantine (Algérie)', type: 'hotel', stars: '4', keywords: ['constantine', 'algerie', 'protea', 'marriott'] },
  { name: 'Hôtel Novotel Constantine', code: 'CZL', country: 'Constantine (Algérie)', type: 'hotel', stars: '4', keywords: ['constantine', 'algerie', 'novotel', 'place des martyrs'] },
  { name: 'Hôtel Ibis Constantine', code: 'CZL', country: 'Constantine (Algérie)', type: 'hotel', stars: '3', keywords: ['constantine', 'algerie', 'ibis', 'centre ville'] },
  { name: 'Sheraton Annaba Hotel', code: 'AAE', country: 'Annaba (Algérie)', type: 'hotel', stars: '5', keywords: ['annaba', 'algerie', 'sheraton', 'victor hugo'] },
  { name: 'Sabri Hotel Annaba', code: 'AAE', country: 'Annaba (Algérie)', type: 'hotel', stars: '4', keywords: ['annaba', 'algerie', 'sabri', 'corniche', 'plage rafai'] },
  { name: 'Hôtel Rym El Djamil Annaba', code: 'AAE', country: 'Annaba (Algérie)', type: 'hotel', stars: '4', keywords: ['annaba', 'algerie', 'rym el djamil', 'cap de garde'] },
  { name: 'Renaissance Tlemcen Hotel', code: 'TLE', country: 'Tlemcen (Algérie)', type: 'hotel', stars: '5', keywords: ['tlemcen', 'algerie', 'renaissance', 'marriott', 'lalla setti'] },
  { name: 'Hôtel Les Zianides', code: 'TLE', country: 'Tlemcen (Algérie)', type: 'hotel', stars: '4', keywords: ['tlemcen', 'algerie', 'zianides', 'centre'] },
  { name: 'Park Mall Hôtel Sétif', code: 'QSF', country: 'Sétif (Algérie)', type: 'hotel', stars: '4', keywords: ['setif', 'algerie', 'park mall', 'four points', 'centre'] },
  { name: 'Hôtel El-Djazair (Ex Saint George)', code: 'ALG', country: 'Alger (Algérie)', type: 'hotel', stars: '5', keywords: ['alger', 'algerie', 'el djazair', 'saint george', 'el biar'] },

  // =========================================================================
  // 2. ALL 58 ALGERIAN WILAYAS & MAJOR COMMUNES/DAÏRAS
  // =========================================================================
  { name: 'Alger (Wilaya 16)', code: 'ALG', country: 'Algérie', type: 'city', keywords: ['alger', 'algiers', 'el djazair', '16', 'centre', 'hamma', 'algerie'] },
  { name: 'Oran (Wilaya 31)', code: 'ORN', country: 'Algérie', type: 'city', keywords: ['oran', 'wahran', '31', 'algerie', 'bir el djir', 'es senia'] },
  { name: 'Constantine (Wilaya 25)', code: 'CZL', country: 'Algérie', type: 'city', keywords: ['constantine', 'qsentina', '25', 'algerie', 'ponts suspendus'] },
  { name: 'Annaba (Wilaya 23)', code: 'AAE', country: 'Algérie', type: 'city', keywords: ['annaba', 'bone', '23', 'algerie', 'seraidi'] },
  { name: 'Sétif (Wilaya 19)', code: 'QSF', country: 'Algérie', type: 'city', keywords: ['setif', '19', 'algerie', 'ain fouara', 'el eulma'] },
  { name: 'Tlemcen (Wilaya 13)', code: 'TLE', country: 'Algérie', type: 'city', keywords: ['tlemcen', '13', 'algerie', 'mansourah', 'nedroma'] },
  { name: 'Béjaïa (Wilaya 06)', code: 'BJA', country: 'Algérie', type: 'city', keywords: ['bejaia', 'bougie', '06', 'algerie', 'cap carbon', 'tichy', 'akbou'] },
  { name: 'Batna (Wilaya 05)', code: 'BLJ', country: 'Algérie', type: 'city', keywords: ['batna', '05', 'algerie', 'timgad', 'aurès', 'barika'] },
  { name: 'Biskra (Wilaya 07)', code: 'BSK', country: 'Algérie', type: 'city', keywords: ['biskra', '07', 'algerie', 'reine des zibans', 'tolga', 'sidi okba'] },
  { name: 'Blida (Wilaya 09)', code: 'ALG', country: 'Algérie', type: 'city', keywords: ['blida', '09', 'algerie', 'chréa', 'boufarik', 'ouled yaich'] },
  { name: 'Chlef (Wilaya 02)', code: 'CFK', country: 'Algérie', type: 'city', keywords: ['chlef', 'ech cheliff', 'el asnam', '02', 'algerie', 'tenes'] },
  { name: 'Laghouat (Wilaya 03)', code: 'LOO', country: 'Algérie', type: 'city', keywords: ['laghouat', '03', 'algerie', 'aflou'] },
  { name: 'Oum El Bouaghi (Wilaya 04)', code: 'OGX', country: 'Algérie', type: 'city', keywords: ['oum el bouaghi', '04', 'algerie', 'ain beida', 'ain mlila'] },
  { name: 'Béchar (Wilaya 08)', code: 'CBH', country: 'Algérie', type: 'city', keywords: ['bechar', '08', 'algerie', 'saoura', 'kenadsa'] },
  { name: 'Bouira (Wilaya 10)', code: 'ALG', country: 'Algérie', type: 'city', keywords: ['bouira', '10', 'algerie', 'tikjda', 'lakhdaria', 'sour el ghozlane'] },
  { name: 'Tamanrasset (Wilaya 11)', code: 'TMR', country: 'Algérie', type: 'city', keywords: ['tamanrasset', '11', 'algerie', 'hoggar', 'assekrem'] },
  { name: 'Tébessa (Wilaya 12)', code: 'TEE', country: 'Algérie', type: 'city', keywords: ['tebessa', '12', 'algerie', 'theveste', 'cherea'] },
  { name: 'Tiaret (Wilaya 14)', code: 'TID', country: 'Algérie', type: 'city', keywords: ['tiaret', '14', 'algerie', 'tahert', 'frenda'] },
  { name: 'Tizi Ouzou (Wilaya 15)', code: 'ALG', country: 'Algérie', type: 'city', keywords: ['tizi ouzou', '15', 'algerie', 'kabylie', 'azazga', 'tigzirt', 'azeffoun'] },
  { name: 'Djelfa (Wilaya 17)', code: 'ALG', country: 'Algérie', type: 'city', keywords: ['djelfa', '17', 'algerie', 'ain oussera', 'messaad'] },
  { name: 'Jijel (Wilaya 18)', code: 'GJL', country: 'Algérie', type: 'city', keywords: ['jijel', '18', 'algerie', 'kotama', 'ziama mansouriah', 'el aouana'] },
  { name: 'Saïda (Wilaya 20)', code: 'ORN', country: 'Algérie', type: 'city', keywords: ['saida', '20', 'algerie', 'eaux minerales'] },
  { name: 'Skikda (Wilaya 21)', code: 'SKI', country: 'Algérie', type: 'city', keywords: ['skikda', 'philippeville', '21', 'algerie', 'collo', 'stora'] },
  { name: 'Sidi Bel Abbès (Wilaya 22)', code: 'ORN', country: 'Algérie', type: 'city', keywords: ['sidi bel abbes', '22', 'algerie', 'tessala'] },
  { name: 'Guelma (Wilaya 24)', code: 'AAE', country: 'Algérie', type: 'city', keywords: ['guelma', '24', 'algerie', 'hammam debagh', 'calama'] },
  { name: 'Médéa (Wilaya 26)', code: 'ALG', country: 'Algérie', type: 'city', keywords: ['medea', '26', 'algerie', 'titri', 'berrouaghia', 'chiffa'] },
  { name: 'Mostaganem (Wilaya 27)', code: 'MQV', country: 'Algérie', type: 'city', keywords: ['mostaganem', '27', 'algerie', 'salamandre', 'les sablettes'] },
  { name: 'M\'Sila (Wilaya 28)', code: 'ALG', country: 'Algérie', type: 'city', keywords: ['msila', 'm\'sila', '28', 'algerie', 'bou saada', 'hodna'] },
  { name: 'Mascara (Wilaya 29)', code: 'ORN', country: 'Algérie', type: 'city', keywords: ['mascara', '29', 'algerie', 'emir abdelkader', 'sig', 'tighennif'] },
  { name: 'Ouargla (Wilaya 30)', code: 'OGX', country: 'Algérie', type: 'city', keywords: ['ouargla', '30', 'algerie', 'hassi messaoud'] },
  { name: 'El Bayadh (Wilaya 32)', code: 'EBH', country: 'Algérie', type: 'city', keywords: ['el bayadh', '32', 'algerie', 'brezina'] },
  { name: 'Illizi (Wilaya 33)', code: 'VVZ', country: 'Algérie', type: 'city', keywords: ['illizi', '33', 'algerie', 'tassili n\'ajjer'] },
  { name: 'Bordj Bou Arreridj (Wilaya 34)', code: 'QSF', country: 'Algérie', type: 'city', keywords: ['bordj bou arreridj', 'bba', '34', 'algerie', 'bibans'] },
  { name: 'Boumerdès (Wilaya 35)', code: 'ALG', country: 'Algérie', type: 'city', keywords: ['boumerdes', 'rocher noir', '35', 'algerie', 'dellys', 'zemmouri'] },
  { name: 'El Tarf (Wilaya 36)', code: 'AAE', country: 'Algérie', type: 'city', keywords: ['el tarf', '36', 'algerie', 'el kala', 'lac tonga'] },
  { name: 'Tindouf (Wilaya 37)', code: 'TIN', country: 'Algérie', type: 'city', keywords: ['tindouf', '37', 'algerie'] },
  { name: 'Tissemsilt (Wilaya 38)', code: 'ALG', country: 'Algérie', type: 'city', keywords: ['tissemsilt', '38', 'algerie', 'theiet el had'] },
  { name: 'El Oued (Wilaya 39)', code: 'ELU', country: 'Algérie', type: 'city', keywords: ['el oued', 'oued souf', '39', 'algerie', 'mille coupoles'] },
  { name: 'Khenchela (Wilaya 40)', code: 'CZL', country: 'Algérie', type: 'city', keywords: ['khenchela', '40', 'algerie', 'hammam essalihine'] },
  { name: 'Souk Ahras (Wilaya 41)', code: 'AAE', country: 'Algérie', type: 'city', keywords: ['souk ahras', 'thagaste', '41', 'algerie', 'saint augustin'] },
  { name: 'Tipaza (Wilaya 42)', code: 'ALG', country: 'Algérie', type: 'city', keywords: ['tipaza', 'tipasa', '42', 'algerie', 'tombeau de la chretienne', 'cherchell'] },
  { name: 'Mila (Wilaya 43)', code: 'CZL', country: 'Algérie', type: 'city', keywords: ['mila', '43', 'algerie', 'chelghoum laid'] },
  { name: 'Aïn Defla (Wilaya 44)', code: 'ALG', country: 'Algérie', type: 'city', keywords: ['ain defla', '44', 'algerie', 'khemis miliana', 'miliana'] },
  { name: 'Naâma (Wilaya 45)', code: 'ORN', country: 'Algérie', type: 'city', keywords: ['naama', '45', 'algerie', 'mecheria', 'ain sefra'] },
  { name: 'Aïn Témouchent (Wilaya 46)', code: 'ORN', country: 'Algérie', type: 'city', keywords: ['ain temouchent', '46', 'algerie', 'beni saf'] },
  { name: 'Ghardaïa (Wilaya 47)', code: 'GHA', country: 'Algérie', type: 'city', keywords: ['ghardaia', '47', 'algerie', 'm\'zab', 'beni isguen'] },
  { name: 'Relizane (Wilaya 48)', code: 'ORN', country: 'Algérie', type: 'city', keywords: ['relizane', '48', 'algerie', 'zemmora'] },
  { name: 'Timimoun (Wilaya 49)', code: 'TMX', country: 'Algérie', type: 'city', keywords: ['timimoun', '49', 'algerie', 'oasis rouge', 'gourara'] },
  { name: 'Bordj Badji Mokhtar (Wilaya 50)', code: 'BBM', country: 'Algérie', type: 'city', keywords: ['bordj badji mokhtar', '50', 'algerie'] },
  { name: 'Ouled Djellal (Wilaya 51)', code: 'BSK', country: 'Algérie', type: 'city', keywords: ['ouled djellal', '51', 'algerie', 'sidi khaled'] },
  { name: 'Béni Abbès (Wilaya 52)', code: 'CBH', country: 'Algérie', type: 'city', keywords: ['beni abbes', '52', 'algerie', 'perle de la saoura'] },
  { name: 'In Salah (Wilaya 53)', code: 'INZ', country: 'Algérie', type: 'city', keywords: ['in salah', '53', 'algerie'] },
  { name: 'In Guezzam (Wilaya 54)', code: 'INF', country: 'Algérie', type: 'city', keywords: ['in guezzam', '54', 'algerie'] },
  { name: 'Touggourt (Wilaya 55)', code: 'TGR', country: 'Algérie', type: 'city', keywords: ['touggourt', '55', 'algerie', 'oued righ'] },
  { name: 'Djanet (Wilaya 56)', code: 'DJG', country: 'Algérie', type: 'city', keywords: ['djanet', '56', 'algerie', 'tadrart', 'essendilene'] },
  { name: 'El M\'Ghair (Wilaya 57)', code: 'ELU', country: 'Algérie', type: 'city', keywords: ['el m\'ghair', 'el meghier', '57', 'algerie'] },
  { name: 'El Meniaa (Wilaya 58)', code: 'ELG', country: 'Algérie', type: 'city', keywords: ['el meniaa', 'el golea', '58', 'algerie'] },
  { name: 'Kouba (Alger)', code: 'ALG', country: 'Alger (Algérie)', type: 'place', keywords: ['kouba', 'alger', 'algerie', 'ben omar', 'croix'] },
  { name: 'Chéraga (Alger)', code: 'ALG', country: 'Alger (Algérie)', type: 'place', keywords: ['cheraga', 'alger', 'algerie', 'bouchaoui', 'dounia'] },
  { name: 'Bab Ezzouar (Alger)', code: 'ALG', country: 'Alger (Algérie)', type: 'place', keywords: ['bab ezzouar', 'alger', 'algerie', 'centre commercial', 'usthb'] },
  { name: 'Hydra (Alger)', code: 'ALG', country: 'Alger (Algérie)', type: 'place', keywords: ['hydra', 'alger', 'algerie', 'paradou', 'ambassades'] },
  { name: 'Staouéli (Alger)', code: 'ALG', country: 'Alger (Algérie)', type: 'place', keywords: ['staoueli', 'alger', 'algerie', 'palm beach', 'moretti'] },
  { name: 'Zéralda (Alger)', code: 'ALG', country: 'Alger (Algérie)', type: 'place', keywords: ['zeralda', 'alger', 'algerie', 'sables d\'or'] },
  { name: 'Bir El Djir (Oran)', code: 'ORN', country: 'Oran (Algérie)', type: 'place', keywords: ['bir el djir', 'oran', 'algerie', 'millenium', 'akid lotfi'] },
  { name: 'Bou Saâda (M\'Sila)', code: 'ALG', country: 'M\'Sila (Algérie)', type: 'city', keywords: ['bou saada', 'bousaada', 'algerie', 'cite du bonheur', 'dinet'] },
  { name: 'Taghit (Béchar)', code: 'CBH', country: 'Béchar (Algérie)', type: 'city', keywords: ['taghit', 'algerie', 'dunes de sable', 'saoura'] },

  // =========================================================================
  // 3. FAMOUS GLOBAL HOTEL BRANDS & ICONIC PROPERTIES
  // =========================================================================
  { name: 'Atlantis The Palm', code: 'DXB', country: 'Dubaï (EAU)', type: 'hotel', stars: '5', keywords: ['dubai', 'uae', 'palm', 'atlantis'] },
  { name: 'Burj Al Arab Jumeirah', code: 'DXB', country: 'Dubaï (EAU)', type: 'hotel', stars: '5', keywords: ['dubai', 'uae', 'burj', 'arab', 'jumeirah', '7 etoiles'] },
  { name: 'Donatello Hotel Dubai', code: 'DXB', country: 'Dubaï (EAU)', type: 'hotel', stars: '4', keywords: ['dubai', 'uae', 'donatello', 'barsha'] },
  { name: 'Ghaya Grand Hotel Dubai', code: 'DXB', country: 'Dubaï (EAU)', type: 'hotel', stars: '5', keywords: ['dubai', 'uae', 'ghaya', 'grand'] },
  { name: 'London Crown Hotel Dubai', code: 'DXB', country: 'Dubaï (EAU)', type: 'hotel', stars: '4', keywords: ['dubai', 'uae', 'london', 'crown'] },
  { name: 'FIVE Palm Jumeirah Dubai', code: 'DXB', country: 'Dubaï (EAU)', type: 'hotel', stars: '5', keywords: ['dubai', 'uae', 'five', 'palm', 'resort'] },
  { name: 'Palazzo Versace Dubai', code: 'DXB', country: 'Dubaï (EAU)', type: 'hotel', stars: '5', keywords: ['dubai', 'uae', 'palazzo', 'versace', 'jaddaf'] },
  { name: 'Address Downtown Dubai', code: 'DXB', country: 'Dubaï (EAU)', type: 'hotel', stars: '5', keywords: ['dubai', 'uae', 'address', 'downtown', 'burj khalifa'] },
  { name: 'JW Marriott Marquis Dubai', code: 'DXB', country: 'Dubaï (EAU)', type: 'hotel', stars: '5', keywords: ['dubai', 'uae', 'jw marriott', 'business bay'] },
  { name: 'Pullman Paris Tour Eiffel', code: 'PAR', country: 'Paris (France)', type: 'hotel', stars: '4', keywords: ['paris', 'france', 'pullman', 'eiffel', 'trocadero'] },
  { name: 'Hôtel Plaza Athénée', code: 'PAR', country: 'Paris (France)', type: 'hotel', stars: '5', keywords: ['paris', 'france', 'plaza', 'athenee', 'montaigne'] },
  { name: 'Hôtel Le Bristol Paris', code: 'PAR', country: 'Paris (France)', type: 'hotel', stars: '5', keywords: ['paris', 'france', 'bristol', 'faubourg saint honore'] },
  { name: 'Hôtel de Crillon', code: 'PAR', country: 'Paris (France)', type: 'hotel', stars: '5', keywords: ['paris', 'france', 'crillon', 'concorde', 'rosewood'] },
  { name: 'The Ritz Paris', code: 'PAR', country: 'Paris (France)', type: 'hotel', stars: '5', keywords: ['paris', 'france', 'ritz', 'vendome'] },
  { name: 'Hilton Istanbul Bosphorus', code: 'IST', country: 'Istanbul (Turquie)', type: 'hotel', stars: '5', keywords: ['istanbul', 'turquie', 'turkey', 'hilton', 'bosphore', 'harbiye'] },
  { name: 'Swissôtel The Bosphorus', code: 'IST', country: 'Istanbul (Turquie)', type: 'hotel', stars: '5', keywords: ['istanbul', 'turquie', 'swissotel', 'besiktas'] },
  { name: 'The Ritz-Carlton Istanbul', code: 'IST', country: 'Istanbul (Turquie)', type: 'hotel', stars: '5', keywords: ['istanbul', 'turquie', 'ritz-carlton', 'suzer plaza'] },
  { name: 'Raffles Istanbul', code: 'IST', country: 'Istanbul (Turquie)', type: 'hotel', stars: '5', keywords: ['istanbul', 'turquie', 'raffles', 'zorlu center'] },
  { name: 'CVK Park Bosphorus Istanbul', code: 'IST', country: 'Istanbul (Turquie)', type: 'hotel', stars: '5', keywords: ['istanbul', 'turquie', 'cvk', 'taksim'] },
  { name: 'Rixos Downtown Antalya', code: 'AYT', country: 'Antalya (Turquie)', type: 'hotel', stars: '5', keywords: ['antalya', 'turquie', 'rixos', 'konyaalti'] },
  { name: 'Mandarin Oriental Bodrum', code: 'BJV', country: 'Bodrum (Turquie)', type: 'hotel', stars: '5', keywords: ['bodrum', 'turquie', 'mandarin oriental', 'cennet koyu'] },
  { name: 'The Savoy London', code: 'LON', country: 'Londres (Royaume-Uni)', type: 'hotel', stars: '5', keywords: ['londres', 'london', 'savoy', 'strand'] },
  { name: 'The Ritz London', code: 'LON', country: 'Londres (Royaume-Uni)', type: 'hotel', stars: '5', keywords: ['londres', 'london', 'ritz', 'piccadilly'] },
  { name: 'The Plaza Hotel New York', code: 'NYC', country: 'New York (USA)', type: 'hotel', stars: '5', keywords: ['new york', 'nyc', 'plaza', '5th ave', 'central park'] },
  { name: 'Makkah Clock Royal Tower, A Fairmont Hotel', code: 'MEC', country: 'La Mecque (Arabie Saoudite)', type: 'hotel', stars: '5', keywords: ['mecque', 'makkah', 'fairmont', 'clock tower', 'abraj al bait'] },
  { name: 'Swissôtel Makkah', code: 'MEC', country: 'La Mecque (Arabie Saoudite)', type: 'hotel', stars: '5', keywords: ['mecque', 'makkah', 'swissotel', 'abraj al bait'] },
  { name: 'The Oberoi Madina', code: 'MED', country: 'Médine (Arabie Saoudite)', type: 'hotel', stars: '5', keywords: ['medine', 'medina', 'oberoi', 'haram'] },
  { name: 'La Mamounia Marrakech', code: 'RAK', country: 'Marrakech (Maroc)', type: 'hotel', stars: '5', keywords: ['marrakech', 'maroc', 'mamounia', 'palace'] },
  { name: 'Royal Mansour Marrakech', code: 'RAK', country: 'Marrakech (Maroc)', type: 'hotel', stars: '5', keywords: ['marrakech', 'maroc', 'royal mansour'] },
  { name: 'The Residence Tunis', code: 'TUN', country: 'Tunis (Tunisie)', type: 'hotel', stars: '5', keywords: ['tunis', 'tunisie', 'residence', 'gammarth'] },
  { name: 'Mövenpick Resort & Marine Spa Sousse', code: 'SUS', country: 'Sousse (Tunisie)', type: 'hotel', stars: '5', keywords: ['sousse', 'tunisie', 'movenpick', 'kantaoui'] },
  { name: 'Hasdrubal Prestige Thalassa Djerba', code: 'DJE', country: 'Djerba (Tunisie)', type: 'hotel', stars: '5', keywords: ['djerba', 'tunisie', 'hasdrubal', 'prestige'] },

  // =========================================================================
  // 4. MAJOR WORLDWIDE CITIES & TOURIST CAPITALS
  // =========================================================================
  { name: 'Istanbul', code: 'IST', country: 'Turquie', type: 'city', keywords: ['istanbul', 'turquie', 'turkey', 'turkiye', 'taksim', 'bosphore', 'sultanahmet', 'galata'] },
  { name: 'Antalya', code: 'AYT', country: 'Turquie', type: 'city', keywords: ['antalya', 'turquie', 'ayt', 'lara', 'kemer', 'belek', 'alanya'] },
  { name: 'Bodrum', code: 'BJV', country: 'Turquie', type: 'city', keywords: ['bodrum', 'turquie', 'bjv', 'yalikavak', 'turkbuku'] },
  { name: 'Trabzon', code: 'TZX', country: 'Turquie', type: 'city', keywords: ['trabzon', 'turquie', 'tzx', 'uzungol'] },
  { name: 'Ankara', code: 'ANK', country: 'Turquie', type: 'city', keywords: ['ankara', 'turquie', 'capitale turquie'] },
  { name: 'Izmir', code: 'ADB', country: 'Turquie', type: 'city', keywords: ['izmir', 'turquie', 'cesme', 'alacati'] },
  { name: 'Dubaï', code: 'DXB', country: 'Émirats Arabes Unis', type: 'city', keywords: ['dubai', 'doubai', 'uae', 'eau', 'dxb', 'burj khalifa', 'marina', 'deira'] },
  { name: 'Abu Dhabi', code: 'AUH', country: 'Émirats Arabes Unis', type: 'city', keywords: ['abu dhabi', 'aboudabi', 'auh', 'yas island', 'corniche'] },
  { name: 'Sharjah', code: 'DXB', country: 'Émirats Arabes Unis', type: 'city', keywords: ['sharjah', 'uae', 'shj'] },
  { name: 'Doha', code: 'DOH', country: 'Qatar', type: 'city', keywords: ['doha', 'qatar', 'doh', 'corniche doha', 'lusail'] },
  { name: 'Riyad', code: 'RUH', country: 'Arabie Saoudite', type: 'city', keywords: ['riyad', 'riyadh', 'ruh', 'arabie saoudite', 'saudi'] },
  { name: 'Djeddah', code: 'JED', country: 'Arabie Saoudite', type: 'city', keywords: ['djeddah', 'jeddah', 'jed', 'mer rouge', 'saudi'] },
  { name: 'La Mecque', code: 'MEC', country: 'Arabie Saoudite', type: 'city', keywords: ['la mecque', 'makkah', 'mecca', 'omra', 'hajj', 'mec', 'haram'] },
  { name: 'Médine', code: 'MED', country: 'Arabie Saoudite', type: 'city', keywords: ['medine', 'medina', 'madinah', 'med', 'nabawi'] },
  { name: 'Paris', code: 'PAR', country: 'France', type: 'city', keywords: ['paris', 'france', 'par', 'eiffel', 'champs elysees', 'louvre', 'montmartre'] },
  { name: 'Nice', code: 'NCE', country: 'France', type: 'city', keywords: ['nice', 'france', 'nce', 'cote dazur', 'cannes', 'monaco'] },
  { name: 'Lyon', code: 'LYS', country: 'France', type: 'city', keywords: ['lyon', 'france', 'lys'] },
  { name: 'Marseille', code: 'MRS', country: 'France', type: 'city', keywords: ['marseille', 'france', 'mrs', 'vieux port'] },
  { name: 'Rome', code: 'ROM', country: 'Italie', type: 'city', keywords: ['rome', 'roma', 'rom', 'italie', 'colisee', 'vatican'] },
  { name: 'Milan', code: 'MIL', country: 'Italie', type: 'city', keywords: ['milan', 'milano', 'mil', 'italie', 'duomo'] },
  { name: 'Venise', code: 'VCE', country: 'Italie', type: 'city', keywords: ['venise', 'venice', 'vce', 'italie', 'gondoles'] },
  { name: 'Florence', code: 'FLR', country: 'Italie', type: 'city', keywords: ['florence', 'firenze', 'flr', 'toscane'] },
  { name: 'Naples', code: 'NAP', country: 'Italie', type: 'city', keywords: ['naples', 'napoli', 'amalfi', 'capri'] },
  { name: 'Barcelone', code: 'BCN', country: 'Espagne', type: 'city', keywords: ['barcelone', 'barcelona', 'bcn', 'espagne', 'ramblas', 'sagrada'] },
  { name: 'Madrid', code: 'MAD', country: 'Espagne', type: 'city', keywords: ['madrid', 'mad', 'espagne', 'gran via'] },
  { name: 'Séville', code: 'SVQ', country: 'Espagne', type: 'city', keywords: ['seville', 'sevilla', 'svq', 'andalousie'] },
  { name: 'Malaga', code: 'AGP', country: 'Espagne', type: 'city', keywords: ['malaga', 'agp', 'marbella', 'costa del sol'] },
  { name: 'Palma de Majorque', code: 'PMI', country: 'Espagne', type: 'city', keywords: ['majorque', 'mallorca', 'palma', 'baleares'] },
  { name: 'Ibiza', code: 'IBZ', country: 'Espagne', type: 'city', keywords: ['ibiza', 'ibz', 'baleares'] },
  { name: 'Londres', code: 'LON', country: 'Royaume-Uni', type: 'city', keywords: ['londres', 'london', 'lon', 'uk', 'england', 'big ben'] },
  { name: 'Amsterdam', code: 'AMS', country: 'Pays-Bas', type: 'city', keywords: ['amsterdam', 'ams', 'pays-bas', 'hollande'] },
  { name: 'Bruxelles', code: 'BRU', country: 'Belgique', type: 'city', keywords: ['bruxelles', 'brussels', 'bru', 'belgique'] },
  { name: 'Berlin', code: 'BER', country: 'Allemagne', type: 'city', keywords: ['berlin', 'ber', 'allemagne'] },
  { name: 'Munich', code: 'MUC', country: 'Allemagne', type: 'city', keywords: ['munich', 'muc', 'baviere'] },
  { name: 'Francfort', code: 'FRA', country: 'Allemagne', type: 'city', keywords: ['francfort', 'frankfurt', 'fra'] },
  { name: 'Vienne', code: 'VIE', country: 'Autriche', type: 'city', keywords: ['vienne', 'vienna', 'vie'] },
  { name: 'Genève', code: 'GVA', country: 'Suisse', type: 'city', keywords: ['geneve', 'geneva', 'gva', 'suisse'] },
  { name: 'Zurich', code: 'ZRH', country: 'Suisse', type: 'city', keywords: ['zurich', 'zrh', 'suisse'] },
  { name: 'Prague', code: 'PRG', country: 'République Tchèque', type: 'city', keywords: ['prague', 'prg', 'pont charles'] },
  { name: 'Budapest', code: 'BUD', country: 'Hongrie', type: 'city', keywords: ['budapest', 'bud', 'danube'] },
  { name: 'Athènes', code: 'ATH', country: 'Grèce', type: 'city', keywords: ['athenes', 'ath', 'grece', 'acropole'] },
  { name: 'Santorin', code: 'JTR', country: 'Grèce', type: 'city', keywords: ['santorin', 'santorini', 'jtr', 'oia'] },
  { name: 'Mykonos', code: 'JMK', country: 'Grèce', type: 'city', keywords: ['mykonos', 'jmk', 'grece'] },
  { name: 'Lisbonne', code: 'LIS', country: 'Portugal', type: 'city', keywords: ['lisbonne', 'lisbon', 'lis', 'portugal'] },
  { name: 'Porto', code: 'OPO', country: 'Portugal', type: 'city', keywords: ['porto', 'opo', 'portugal'] },
  { name: 'Tunis', code: 'TUN', country: 'Tunisie', type: 'city', keywords: ['tunis', 'tunisie', 'tun', 'gammarth', 'carthage'] },
  { name: 'Sousse', code: 'SUS', country: 'Tunisie', type: 'city', keywords: ['sousse', 'tunisie', 'sus', 'kantaoui'] },
  { name: 'Hammamet', code: 'HAM', country: 'Tunisie', keywords: ['hammamet', 'tunisie', 'ham', 'yasmine'] },
  { name: 'Djerba', code: 'DJE', country: 'Tunisie', type: 'city', keywords: ['djerba', 'tunisie', 'dje', 'midoun'] },
  { name: 'Monastir', code: 'MIR', country: 'Tunisie', type: 'city', keywords: ['monastir', 'tunisie', 'mir'] },
  { name: 'Casablanca', code: 'CAS', country: 'Maroc', type: 'city', keywords: ['casablanca', 'casa', 'cas', 'maroc'] },
  { name: 'Marrakech', code: 'RAK', country: 'Maroc', type: 'city', keywords: ['marrakech', 'rak', 'maroc', 'jamaa el fna'] },
  { name: 'Tanger', code: 'TNG', country: 'Maroc', type: 'city', keywords: ['tanger', 'tng', 'maroc'] },
  { name: 'Agadir', code: 'AGA', country: 'Maroc', type: 'city', keywords: ['agadir', 'aga', 'maroc'] },
  { name: 'Le Caire', code: 'CAI', country: 'Égypte', type: 'city', keywords: ['le caire', 'cairo', 'cai', 'egypte', 'pyramides'] },
  { name: 'Charm el-Cheikh', code: 'SSH', country: 'Égypte', type: 'city', keywords: ['charm el-cheikh', 'sharm', 'ssh', 'mer rouge'] },
  { name: 'Hurghada', code: 'HRG', country: 'Égypte', type: 'city', keywords: ['hurghada', 'hrg', 'mer rouge'] },
  { name: 'Louxor', code: 'LXR', country: 'Égypte', type: 'city', keywords: ['louxor', 'luxor', 'lxr', 'egypte'] },
  { name: 'Kuala Lumpur', code: 'KUL', country: 'Malaisie', type: 'city', keywords: ['kuala lumpur', 'kul', 'malaisie', 'petronas'] },
  { name: 'Bangkok', code: 'BKK', country: 'Thaïlande', type: 'city', keywords: ['bangkok', 'bkk', 'thailande'] },
  { name: 'Phuket', code: 'HKT', country: 'Thaïlande', type: 'city', keywords: ['phuket', 'hkt', 'thailande', 'patong'] },
  { name: 'Singapour', code: 'SIN', country: 'Singapour', type: 'city', keywords: ['singapour', 'singapore', 'sin'] },
  { name: 'Bali', code: 'DPS', country: 'Indonésie', type: 'city', keywords: ['bali', 'dps', 'indonesie', 'ubud', 'kuta'] },
  { name: 'Maldives', code: 'MLE', country: 'Maldives', type: 'city', keywords: ['maldives', 'mle', 'male', 'atoll'] },
  { name: 'Zanzibar', code: 'ZNZ', country: 'Tanzanie', type: 'city', keywords: ['zanzibar', 'znz', 'tanzanie'] },
  { name: 'Tokyo', code: 'TYO', country: 'Japon', type: 'city', keywords: ['tokyo', 'tyo', 'japon', 'shinjuku', 'ginza'] },
  { name: 'Kyoto', code: 'UKY', country: 'Japon', type: 'city', keywords: ['kyoto', 'uky', 'japon'] },
  { name: 'Séoul', code: 'SEL', country: 'Corée du Sud', type: 'city', keywords: ['seoul', 'sel', 'coree du sud'] },
  { name: 'Pékin', code: 'BJS', country: 'Chine', type: 'city', keywords: ['pekin', 'beijing', 'bjs', 'chine'] },
  { name: 'Shanghai', code: 'SHA', country: 'Chine', type: 'city', keywords: ['shanghai', 'sha', 'chine'] },
  { name: 'New York', code: 'NYC', country: 'États-Unis', type: 'city', keywords: ['new york', 'nyc', 'manhattan', 'times square', 'usa'] },
  { name: 'Miami', code: 'MIA', country: 'États-Unis', type: 'city', keywords: ['miami', 'mia', 'floride', 'south beach'] },
  { name: 'Orlando', code: 'MCO', country: 'États-Unis', type: 'city', keywords: ['orlando', 'mco', 'disney', 'floride'] },
  { name: 'Los Angeles', code: 'LAX', country: 'États-Unis', type: 'city', keywords: ['los angeles', 'lax', 'hollywood', 'californie'] },
  { name: 'Las Vegas', code: 'LAS', country: 'États-Unis', type: 'city', keywords: ['las vegas', 'las', 'strip', 'nevada'] },
  { name: 'San Francisco', code: 'SFO', country: 'États-Unis', type: 'city', keywords: ['san francisco', 'sfo', 'golden gate'] },
  { name: 'Toronto', code: 'YTO', country: 'Canada', type: 'city', keywords: ['toronto', 'yto', 'canada'] },
  { name: 'Montréal', code: 'YUL', country: 'Canada', type: 'city', keywords: ['montreal', 'yul', 'canada', 'quebec'] },
  { name: 'Cancun', code: 'CUN', country: 'Mexique', type: 'city', keywords: ['cancun', 'cun', 'mexique', 'riviera maya'] },
  { name: 'Rio de Janeiro', code: 'RIO', country: 'Brésil', type: 'city', keywords: ['rio', 'rio de janeiro', 'bresil', 'copacabana'] },
  { name: 'Sydney', code: 'SYD', country: 'Australie', type: 'city', keywords: ['sydney', 'syd', 'australie', 'opera'] },
  { name: 'Melbourne', code: 'MEL', country: 'Australie', type: 'city', keywords: ['melbourne', 'mel', 'australie'] },

  // =========================================================================
  // EXTRA: COUNTRY-LEVEL ENTRIES — typing "Oman" shows Muscat, not random results
  // =========================================================================
  { name: 'Oman', code: 'MCT', country: 'Oman', type: 'country', keywords: ['oman', 'sultanat', 'mascate', 'muscat', 'mct', 'salalah', 'golf'] },
  { name: 'Mascate — Oman', code: 'MCT', country: 'Oman', type: 'city', keywords: ['mascate', 'muscat', 'mct', 'oman', 'sultanat'] },
  { name: 'Salalah — Oman', code: 'SLL', country: 'Oman', type: 'city', keywords: ['salalah', 'sll', 'oman', 'dhofar'] },
  { name: 'Émirats Arabes Unis', code: 'DXB', country: 'Émirats Arabes Unis', type: 'country', keywords: ['emirats', 'eau', 'uae', 'dubai', 'abu dhabi', 'sharjah'] },
  { name: 'Qatar', code: 'DOH', country: 'Qatar', type: 'country', keywords: ['qatar', 'doha', 'doh', 'lusail', 'golf'] },
  { name: 'Arabie Saoudite', code: 'JED', country: 'Arabie Saoudite', type: 'country', keywords: ['arabie', 'saoudite', 'saudi', 'riyadh', 'jeddah', 'mecca', 'medine', 'neom'] },
  { name: 'Koweït', code: 'KWI', country: 'Koweït', type: 'country', keywords: ['koweit', 'kuwait', 'kwi', 'golf'] },
  { name: 'Bahreïn', code: 'BAH', country: 'Bahreïn', type: 'country', keywords: ['bahrein', 'bahrain', 'bah', 'manama', 'golf'] },
  { name: 'Maroc', code: 'CAS', country: 'Maroc', type: 'country', keywords: ['maroc', 'morocco', 'casablanca', 'rabat', 'marrakech', 'fes', 'tanger'] },
  { name: 'Tunisie', code: 'TUN', country: 'Tunisie', type: 'country', keywords: ['tunisie', 'tunisia', 'tunis', 'sousse', 'monastir', 'hammamet', 'djerba'] },
  { name: 'Égypte', code: 'CAI', country: 'Égypte', type: 'country', keywords: ['egypte', 'egypt', 'le caire', 'cairo', 'hurghada', 'charm el cheikh', 'louxor', 'alexandrie'] },
  { name: 'Turquie', code: 'IST', country: 'Turquie', type: 'country', keywords: ['turquie', 'turkey', 'istanbul', 'ankara', 'antalya', 'bodrum', 'cappadoce'] },
  { name: 'France', code: 'PAR', country: 'France', type: 'country', keywords: ['france', 'paris', 'nice', 'marseille', 'lyon', 'bordeaux', 'strasbourg'] },
  { name: 'Espagne', code: 'MAD', country: 'Espagne', type: 'country', keywords: ['espagne', 'spain', 'madrid', 'barcelone', 'seville', 'valence', 'malaga'] },
  { name: 'Italie', code: 'ROM', country: 'Italie', type: 'country', keywords: ['italie', 'italy', 'rome', 'milan', 'venise', 'florence', 'naples'] },
  { name: 'Grèce', code: 'ATH', country: 'Grèce', type: 'country', keywords: ['grece', 'greece', 'athenes', 'santorin', 'mykonos', 'crete', 'rhodes'] },
  { name: 'Portugal', code: 'LIS', country: 'Portugal', type: 'country', keywords: ['portugal', 'lisbonne', 'porto', 'algarve', 'madere'] },
  { name: 'Royaume-Uni', code: 'LON', country: 'Royaume-Uni', type: 'country', keywords: ['royaume uni', 'angleterre', 'london', 'londres', 'uk', 'manchester', 'edinburgh'] },
  { name: 'Algérie', code: 'ALG', country: 'Algérie', type: 'country', keywords: ['algerie', 'algeria', 'alger', 'oran', 'constantine', 'annaba'] },
  { name: 'Thaïlande', code: 'BKK', country: 'Thaïlande', type: 'country', keywords: ['thailande', 'thailand', 'bangkok', 'phuket', 'pattaya', 'chiang mai', 'koh samui'] },
  { name: 'Indonésie — Bali', code: 'DPS', country: 'Indonésie', type: 'country', keywords: ['indonesie', 'bali', 'dps', 'ubud', 'seminyak', 'kuta'] },
  { name: 'Maldives', code: 'MLE', country: 'Maldives', type: 'country', keywords: ['maldives', 'male', 'mle', 'atoll', 'resort', 'bungalow'] },
  { name: 'Jordanie', code: 'AMM', country: 'Jordanie', type: 'country', keywords: ['jordanie', 'jordan', 'amman', 'petra', 'aqaba', 'wadi rum'] },
  { name: 'Amman — Jordanie', code: 'AMM', country: 'Jordanie', type: 'city', keywords: ['amman', 'amm', 'jordanie', 'petra'] },
  { name: 'Aqaba — Jordanie', code: 'AQJ', country: 'Jordanie', type: 'city', keywords: ['aqaba', 'aqj', 'jordanie', 'mer rouge'] },
  { name: 'Allemagne', code: 'BER', country: 'Allemagne', type: 'country', keywords: ['allemagne', 'germany', 'berlin', 'munich', 'francfort', 'hambourg', 'cologne'] },
  { name: 'Pays-Bas', code: 'AMS', country: 'Pays-Bas', type: 'country', keywords: ['pays bas', 'netherlands', 'amsterdam', 'rotterdam', 'la haye'] },
  { name: 'Suisse', code: 'ZRH', country: 'Suisse', type: 'country', keywords: ['suisse', 'switzerland', 'zurich', 'geneve', 'berne', 'lausanne', 'interlaken'] },
  { name: 'Autriche', code: 'VIE', country: 'Autriche', type: 'country', keywords: ['autriche', 'austria', 'vienne', 'innsbruck', 'salzburg'] },
  { name: 'Chypre', code: 'LCA', country: 'Chypre', type: 'country', keywords: ['chypre', 'cyprus', 'larnaca', 'limassol', 'nicosie', 'paphos'] },
  { name: 'Larnaca — Chypre', code: 'LCA', country: 'Chypre', type: 'city', keywords: ['larnaca', 'lca', 'chypre', 'limassol'] },
  { name: 'Géorgie', code: 'TBS', country: 'Géorgie', type: 'country', keywords: ['georgie', 'georgia', 'tbilissi', 'tbilisi', 'batumi', 'kazbegi'] },
  { name: 'Azerbaïdjan', code: 'GYD', country: 'Azerbaïdjan', type: 'country', keywords: ['azerbaidjan', 'azerbaijan', 'bakou', 'baku', 'gyd'] },
  { name: 'Inde', code: 'DEL', country: 'Inde', type: 'country', keywords: ['inde', 'india', 'delhi', 'mumbai', 'goa', 'agra', 'taj mahal', 'kerala'] },
  { name: 'Japon', code: 'TYO', country: 'Japon', type: 'country', keywords: ['japon', 'japan', 'tokyo', 'osaka', 'kyoto', 'hiroshima'] }
];

// In-memory cache for worldwide remote geocoding results
const remotePlacesCache = new Map();

/**
 * Fast synchronous search in the local curated dataset (0ms response)
 * Scoring: exact name match (100) > name starts with (80) > country match (60) > name contains (40) > keyword match (20)
 */
export function searchLocalLocations(query, limit = 20) {
  if (!query || !query.trim()) {
    return staticWorldwideLocations.slice(0, limit);
  }

  const normalizedQuery = normalizeLocationText(query);
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return staticWorldwideLocations.slice(0, limit);
  }

  const scored = [];

  for (const item of staticWorldwideLocations) {
    const normName = normalizeLocationText(item.name);
    const normCountry = normalizeLocationText(item.country);
    const normCode = normalizeLocationText(item.code);
    const normKeywords = (item.keywords || []).map(normalizeLocationText).join(' ');

    let score = 0;

    // Exact name match
    if (normName === normalizedQuery) { score = 100; }
    // Name starts with query
    else if (normName.startsWith(normalizedQuery)) { score = 80; }
    // Country is the query (e.g. typing "Oman" → shows Muscat/Oman cities)
    else if (normCountry === normalizedQuery) { score = 75; }
    // Country starts with query
    else if (normCountry.startsWith(normalizedQuery)) { score = 70; }
    // Name contains all tokens
    else if (tokens.every(t => normName.includes(t))) { score = 60; }
    // Country contains query
    else if (normCountry.includes(normalizedQuery)) { score = 50; }
    // Code matches
    else if (normCode === normalizedQuery || normCode.startsWith(normalizedQuery)) { score = 45; }
    // Any keyword matches all tokens
    else if (tokens.every(t => normKeywords.includes(t))) { score = 20; }

    if (score > 0) {
      // Boost cities over hotels for country-level searches
      if (item.type === 'city' && normCountry.includes(normalizedQuery)) score += 10;
      scored.push({ item, score });
    }
  }

  // Sort by score descending, then alphabetically by name
  scored.sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));

  return scored.slice(0, limit).map(s => s.item);
}

/**
 * Universal Worldwide Location & Hotel Resolver (Over 1,000,000+ places)
 * - Combines instant local database with real-time global geocoding (OpenStreetMap / Photon API)
 * - Works seamlessly for ANY village, commune, hotel, landmark worldwide!
 */
export async function searchWorldwidePlaces(query, options = {}) {
  const q = (query || '').trim();
  if (!q) {
    return staticWorldwideLocations.slice(0, 15);
  }

  // 1. Get instant matches from our rich static directory
  const localMatches = searchLocalLocations(q, 15);

  // If query is short (< 3 chars) or has strong exact local matches, return immediately
  if (q.length < 3 || localMatches.length >= 8) {
    return localMatches;
  }

  // 2. Check remote cache
  const cacheKey = normalizeLocationText(q);
  if (remotePlacesCache.has(cacheKey)) {
    const cached = remotePlacesCache.get(cacheKey);
    return deduplicateLocations([...localMatches, ...cached]);
  }

  // 3. Query OpenStreetMap Photon API for global worldwide autocomplete (1,000,000+ places/hotels)
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=10&lang=fr`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const remoteItems = [];

      if (Array.isArray(data.features)) {
        data.features.forEach(feat => {
          const props = feat.properties || {};
          const name = props.name;
          if (!name) return;

          const country = props.country || '';
          const city = props.city || props.county || props.state || '';
          const fullCountry = city && city !== name ? `${city}, ${country}` : country;

          // Determine approximate hub code based on country or city
          let code = 'INT';
          const lowerCountry = (country || '').toLowerCase();
          const lowerCity = (city || name || '').toLowerCase();

          if (lowerCountry.includes('algér') || lowerCountry.includes('alger')) code = 'ALG';
          else if (lowerCountry.includes('turq') || lowerCountry.includes('turk')) code = 'IST';
          else if (lowerCountry.includes('émirat') || lowerCountry.includes('emirate')) code = 'DXB';
          else if (lowerCountry.includes('franc')) code = 'PAR';
          else if (lowerCountry.includes('ital')) code = 'ROM';
          else if (lowerCountry.includes('espagn') || lowerCountry.includes('spain')) code = 'MAD';
          else if (lowerCountry.includes('tunis')) code = 'TUN';
          else if (lowerCountry.includes('maroc') || lowerCountry.includes('morocco')) code = 'CAS';
          else if (lowerCountry.includes('arabie') || lowerCountry.includes('saudi')) code = 'JED';
          else if (lowerCountry.includes('egypte') || lowerCountry.includes('egypt')) code = 'CAI';
          else if (lowerCountry.includes('royaume') || lowerCountry.includes('unit')) code = 'LON';
          else if (lowerCountry.includes('états') || lowerCountry.includes('state')) code = 'NYC';

          const isHotel = props.osm_value === 'hotel' || props.type === 'hotel' || name.toLowerCase().includes('hotel') || name.toLowerCase().includes('resort');

          remoteItems.push({
            name: name,
            code: code,
            country: fullCountry || 'International',
            type: isHotel ? 'hotel' : 'place',
            is_global: true,
            keywords: [normalizeLocationText(name), normalizeLocationText(city), normalizeLocationText(country)]
          });
        });
      }

      remotePlacesCache.set(cacheKey, remoteItems);
      return deduplicateLocations([...localMatches, ...remoteItems]);
    }
  } catch (err) {
    // Graceful offline fallback to local matches
  }

  return localMatches;
}

function deduplicateLocations(list) {
  const seen = new Set();
  const result = [];
  for (const item of list) {
    const key = normalizeLocationText(`${item.name}|${item.country}`);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

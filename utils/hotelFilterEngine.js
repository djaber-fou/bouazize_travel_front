// Shared hotel filtering, sorting, facet counting, and URL synchronization engine (T3 & T4)

export const RO_CODES = ['RO', 'S', 'DYU'];
export const BB_CODES = ['RB', 'BB', 'BKCO', 'AMB', 'ALG', 'BKVP', 'PB', 'SON'];
export const HB_CODES = ['RD', 'RL', 'D', 'HB', 'GC', 'HBD', 'HBLD', 'HBLDS', 'HBLSM', 'HBH', 'HBS', 'HBPR', 'HBP', 'HBB', 'HBSP', 'HC', 'HV', 'HFF', 'GGG', 'BEN', 'BBG', 'LLL', 'TTTT', 'ABC', 'MZS', 'LD', 'LDSD', 'IFT', 'SAH', 'STD', 'DXD', 'DNN', 'LNC', 'SLC', 'DLL'];
export const FB_CODES = ['FB', 'RRR', 'FBB', 'FBH', 'FBS', 'FBPR', 'FBP', 'NDR', 'DD'];
export const AI_CODES = ['AI', 'ALL', 'SAI', 'AIS', 'UAI', 'UAIS', 'AIPL', 'GAI', 'UAL', 'PLLL', 'SAIV', 'DALL', 'GA', 'PA', 'CG', 'XL', 'GB', 'IP'];

export const KAABA_REGEX = /(kaaba|kabaa|kaba|الكعبة)/i;
export const HARAM_REGEX = /(haram|al[\s-]?haram|el[\s-]?haram|الحرم)/i;

export function createDefaultFilters() {
  return {
    minPrice: null,
    maxPrice: null,
    minStars: null,
    selectedStars: [],
    mealBasis: '',
    searchName: '',
    locationCode: '',
    cancellationPolicy: 'all', // 'all' | 'refundable' | 'non_refundable'
    refundableOnly: false,
    viewType: '',              // '' | 'kaaba_haram' | 'kaaba' | 'haram'
    availabilityType: 'all',   // 'all' | 'immediate' | 'on_request'
  };
}

export function hotelPrice(h) {
  return Number(h?.lowest_price_dzd ?? h?.final_price_dzd ?? 0);
}

export function hotelStars(h) {
  return Number(h?.stars || parseInt(h?.hotel_category, 10) || 0);
}

export function matchesMealItem(item, target) {
  if (!item || !target) return false;
  const t = String(target).toUpperCase();
  const rb = (item.room_basis_code || item.room_basis || '').toUpperCase();
  const mb = (item.meal_basis_code || item.meal_basis || '').toUpperCase();
  const mn = (item.meal_basis_name || '').toLowerCase();
  const rbn = (item.room_basis_name || '').toLowerCase();
  const rt = (item.room_type || item.title || '').toLowerCase();

  if (t === 'RO') {
    if (RO_CODES.includes(rb)) return true;
    if (!rb && (mb === 'X' || mn.includes('seule') || mn.includes('sans petit') || rt.includes('room only') || rt.includes('logement seul'))) return true;
    return rbn.includes('chambre seule') || mn.includes('chambre seule') || rt.includes('room only');
  }
  if (t === 'RB') {
    if (BB_CODES.includes(rb)) return true;
    if (rb && (HB_CODES.includes(rb) || FB_CODES.includes(rb) || AI_CODES.includes(rb) || RO_CODES.includes(rb))) return false;
    if (!rb && ['H', 'C', 'B', 'A', 'E', 'J', 'R', 'I', 'O', 'S', 'T', 'V', 'F', 'Q', 'L', 'G', 'P', 'W', 'Z'].includes(mb)) return true;
    return rbn.includes('petit-déjeuner') || rbn.includes('petit dejeuner') || rbn.includes('breakfast') || rt.includes('breakfast');
  }
  if (t === 'RD') {
    if (HB_CODES.includes(rb)) return true;
    return rbn.includes('demi-pension') || rbn.includes('demi pension') || rbn.includes('half board') || mn.includes('demi-pension') || mn.includes('half board') || rt.includes('half board') || rt.includes('demi-pension');
  }
  if (t === 'FB') {
    if (FB_CODES.includes(rb)) return true;
    return rbn.includes('pension complète') || rbn.includes('pension complete') || rbn.includes('full board') || mn.includes('pension complète') || mn.includes('full board') || rt.includes('full board') || rt.includes('pension complète');
  }
  if (t === 'AI') {
    if (AI_CODES.includes(rb)) return true;
    return rbn.includes('tout compris') || rbn.includes('all inclusive') || rbn.includes('all-inclusive') || mn.includes('tout compris') || mn.includes('all inclusive') || rt.includes('all inclusive') || rt.includes('tout compris');
  }
  return rb === t || mb === t;
}

export function hotelMatchesMeal(h, target) {
  if (!target) return true;
  return matchesMealItem(h, target)
    || (Array.isArray(h?.agreements) && h.agreements.some((a) => matchesMealItem(a, target)))
    || (Array.isArray(h?.rooms) && h.rooms.some((r) => matchesMealItem(r, target)));
}

export function isOfferRefundable(item, nowMs = Date.now()) {
  if (!item) return false;
  if (item.has_refundable_offer === true || item.is_fully_refundable === true) return true;
  if (item.is_fully_refundable === false && item.has_refundable_offer !== true) return false;
  const dl = item.best_refundable_deadline || item.cancellation_deadline || item.deadline;
  if (dl) {
    const d = new Date(dl);
    return !isNaN(d.getTime()) && d.getTime() > nowMs;
  }
  return false;
}

export function hotelHasRefundableOffer(h, nowMs = Date.now()) {
  if (!h) return false;
  if (h.has_refundable_offer === true) return true;
  if (Array.isArray(h.agreements) && h.agreements.length > 0) {
    return h.agreements.some((a) => isOfferRefundable(a, nowMs));
  }
  if (Array.isArray(h.rooms) && h.rooms.length > 0) {
    return h.rooms.some((r) => isOfferRefundable(r, nowMs));
  }
  return isOfferRefundable(h, nowMs);
}

export function hotelHasNonRefundableOffer(h, nowMs = Date.now()) {
  if (!h) return true;
  if (Array.isArray(h.agreements) && h.agreements.length > 0) {
    return h.agreements.some((a) => !isOfferRefundable(a, nowMs));
  }
  if (Array.isArray(h.rooms) && h.rooms.length > 0) {
    return h.rooms.some((r) => !isOfferRefundable(r, nowMs));
  }
  return !isOfferRefundable(h, nowMs);
}

export function hotelMatchesView(h, viewType) {
  if (!viewType) return true;
  const vTarget = String(viewType).toLowerCase();
  const matchText = (text) => {
    if (vTarget === 'kaaba_haram') return KAABA_REGEX.test(text) || HARAM_REGEX.test(text);
    if (vTarget === 'kaaba') return KAABA_REGEX.test(text);
    if (vTarget === 'haram') return HARAM_REGEX.test(text);
    return false;
  };
  const hotelText = `${h?.name || ''} ${h?.hotel_name || ''} ${h?.description || ''}`;
  if (matchText(hotelText)) return true;
  if (Array.isArray(h?.agreements) && h.agreements.some((a) => matchText(`${a.room_type || ''} ${a.room_name || ''} ${a.room_basis_name || ''} ${a.title || ''}`))) {
    return true;
  }
  if (Array.isArray(h?.rooms) && h.rooms.some((r) => matchText(`${r.room_type || ''} ${r.room_name || ''} ${r.room_basis_name || ''} ${r.title || ''}`))) {
    return true;
  }
  return false;
}

export function hotelMatchesAvailability(h, availabilityType) {
  if (!availabilityType || availabilityType === 'all') return true;
  const checkAg = (ag) => {
    if (!ag) return false;
    const isOnReq = Boolean(ag.is_on_request || ag.available === false || ag.availability_type === 'on_request');
    return availabilityType === 'on_request' ? isOnReq : !isOnReq;
  };
  if (Array.isArray(h?.agreements) && h.agreements.length > 0) {
    return h.agreements.some(checkAg);
  }
  if (availabilityType === 'on_request') {
    return Boolean(h?.is_on_request || h?.has_on_request || h?.availability_type === 'on_request');
  }
  return Boolean(h?.has_immediate || (!h?.is_on_request && h?.is_available !== false));
}

export function resolveEffectiveCancellationPolicy(filters) {
  if (filters?.cancellationPolicy && filters.cancellationPolicy !== 'all') {
    return filters.cancellationPolicy;
  }
  if (filters?.refundableOnly) {
    return 'refundable';
  }
  return 'all';
}

export function applyHotelFilters(hotels, filters = {}, sortBy = 'price_asc', nowMs = Date.now()) {
  let list = Array.isArray(hotels) ? [...hotels] : [];

  if (filters.searchName && String(filters.searchName).trim()) {
    const term = String(filters.searchName).trim().toLowerCase();
    list = list.filter((h) => {
      const name = (h.name || h.hotel_name || '').toLowerCase();
      const city = (h.city || h.hotel_city || '').toLowerCase();
      const addr = (h.address || '').toLowerCase();
      return name.includes(term) || city.includes(term) || addr.includes(term);
    });
  }

  if (filters.minPrice !== null && filters.minPrice !== '' && !isNaN(Number(filters.minPrice)) && Number(filters.minPrice) > 0) {
    const minP = Number(filters.minPrice);
    list = list.filter((h) => hotelPrice(h) >= minP);
  }

  if (filters.maxPrice !== null && filters.maxPrice !== '' && !isNaN(Number(filters.maxPrice)) && Number(filters.maxPrice) > 0) {
    const maxP = Number(filters.maxPrice);
    list = list.filter((h) => hotelPrice(h) <= maxP);
  }

  if (Array.isArray(filters.selectedStars) && filters.selectedStars.length > 0) {
    const allowed = filters.selectedStars.map(Number).filter((n) => !isNaN(n) && n > 0);
    if (allowed.length > 0) {
      list = list.filter((h) => allowed.includes(hotelStars(h)));
    }
  } else if (filters.minStars) {
    const minS = Number(filters.minStars);
    list = list.filter((h) => hotelStars(h) >= minS);
  }

  if (filters.mealBasis) {
    list = list.filter((h) => hotelMatchesMeal(h, filters.mealBasis));
  }

  if (filters.locationCode) {
    const targetLoc = String(filters.locationCode).trim();
    list = list.filter((h) => String(h.location_code || '').trim() === targetLoc);
  }

  if (filters.viewType) {
    list = list.filter((h) => hotelMatchesView(h, filters.viewType));
  }

  if (filters.availabilityType && filters.availabilityType !== 'all') {
    list = list.filter((h) => hotelMatchesAvailability(h, filters.availabilityType));
  }

  const policy = resolveEffectiveCancellationPolicy(filters);
  if (policy === 'refundable') {
    list = list.filter((h) => hotelHasRefundableOffer(h, nowMs));
  } else if (policy === 'non_refundable') {
    list = list.filter((h) => hotelHasNonRefundableOffer(h, nowMs));
  }

  switch (sortBy) {
    case 'price_asc':
      list.sort((a, b) => hotelPrice(a) - hotelPrice(b));
      break;
    case 'price_desc':
      list.sort((a, b) => hotelPrice(b) - hotelPrice(a));
      break;
    case 'stars_desc':
      list.sort((a, b) => hotelStars(b) - hotelStars(a) || hotelPrice(a) - hotelPrice(b));
      break;
    case 'name_asc':
      list.sort((a, b) => (a.hotel_name || a.name || '').localeCompare(b.hotel_name || b.name || ''));
      break;
  }

  return list;
}

export function computePriceBounds(hotels) {
  if (!Array.isArray(hotels) || hotels.length === 0) return { min: 0, max: 0 };
  let min = Infinity;
  let max = 0;
  for (const h of hotels) {
    const p = hotelPrice(h);
    if (p > 0) {
      if (p < min) min = p;
      if (p > max) max = p;
    }
  }
  return { min: min === Infinity ? 0 : Math.floor(min), max: Math.ceil(max) };
}

export function computeAvailableLocations(hotels) {
  const map = new Map();
  for (const h of hotels || []) {
    const code = String(h?.location_code || '').trim();
    const label = String(h?.location_name || '').trim();
    if (!code || !label) continue;
    const prev = map.get(code) || { code, label, count: 0 };
    prev.count += 1;
    map.set(code, prev);
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function computeHotelFilterCounts(hotels, nowMs = Date.now()) {
  const list = Array.isArray(hotels) ? hotels : [];
  const stars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const meals = { RO: 0, RB: 0, RD: 0, FB: 0, AI: 0 };
  let refundable = 0;
  let nonRefundable = 0;
  let immediate = 0;
  let onRequest = 0;

  for (const h of list) {
    const s = hotelStars(h);
    if (stars[s] !== undefined) stars[s]++;
    for (const m of ['RO', 'RB', 'RD', 'FB', 'AI']) {
      if (hotelMatchesMeal(h, m)) meals[m]++;
    }
    if (hotelHasRefundableOffer(h, nowMs)) refundable++;
    if (hotelHasNonRefundableOffer(h, nowMs)) nonRefundable++;
    if (hotelMatchesAvailability(h, 'immediate')) immediate++;
    if (hotelMatchesAvailability(h, 'on_request')) onRequest++;
  }

  return { total: list.length, stars, meals, refundable, nonRefundable, immediate, onRequest };
}

export function parseFiltersFromQuery(q = {}) {
  const f = createDefaultFilters();
  if (q.f_name) f.searchName = String(q.f_name);
  if (q.f_min_price && !isNaN(Number(q.f_min_price)) && Number(q.f_min_price) > 0) f.minPrice = Number(q.f_min_price);
  if (q.f_max_price && !isNaN(Number(q.f_max_price)) && Number(q.f_max_price) > 0) f.maxPrice = Number(q.f_max_price);
  if (q.f_stars) {
    f.selectedStars = String(q.f_stars).split(',').map(Number).filter((n) => n >= 1 && n <= 5);
  } else if (q.stars && !isNaN(Number(q.stars)) && Number(q.stars) >= 1) {
    f.selectedStars = [Number(q.stars)];
  }
  if (q.f_meal) f.mealBasis = String(q.f_meal).toUpperCase();
  if (q.f_loc) f.locationCode = String(q.f_loc);
  if (q.f_view) f.viewType = String(q.f_view);
  if (q.f_avail && ['immediate', 'on_request'].includes(String(q.f_avail))) f.availabilityType = String(q.f_avail);
  if (q.f_cxl && ['refundable', 'non_refundable'].includes(String(q.f_cxl))) {
    f.cancellationPolicy = String(q.f_cxl);
    f.refundableOnly = f.cancellationPolicy === 'refundable';
  } else if (q.refundable_only === '1' || q.refundable_only === 'true' || q.refundable_only === true) {
    f.cancellationPolicy = 'refundable';
    f.refundableOnly = true;
  }
  const sortBy = ['price_asc', 'price_desc', 'stars_desc', 'name_asc'].includes(String(q.sort || ''))
    ? String(q.sort)
    : 'price_asc';
  const page = Math.max(1, parseInt(String(q.page || '1'), 10) || 1);
  return { filters: f, sortBy, page };
}

export function serializeFiltersToQuery(baseQuery = {}, filters = {}, sortBy = 'price_asc', page = 1) {
  const next = { ...baseQuery };
  const filterKeys = ['f_name', 'f_min_price', 'f_max_price', 'f_stars', 'f_meal', 'f_loc', 'f_view', 'f_avail', 'f_cxl', 'refundable_only', 'sort', 'page'];
  for (const k of filterKeys) delete next[k];

  if (filters.searchName && String(filters.searchName).trim()) next.f_name = String(filters.searchName).trim();
  if (filters.minPrice && Number(filters.minPrice) > 0) next.f_min_price = String(Number(filters.minPrice));
  if (filters.maxPrice && Number(filters.maxPrice) > 0) next.f_max_price = String(Number(filters.maxPrice));
  if (Array.isArray(filters.selectedStars) && filters.selectedStars.length > 0) {
    next.f_stars = filters.selectedStars.join(',');
  }
  if (filters.mealBasis) next.f_meal = String(filters.mealBasis);
  if (filters.locationCode) next.f_loc = String(filters.locationCode);
  if (filters.viewType) next.f_view = String(filters.viewType);
  if (filters.availabilityType && filters.availabilityType !== 'all') next.f_avail = String(filters.availabilityType);
  const effPolicy = resolveEffectiveCancellationPolicy(filters);
  if (effPolicy !== 'all') next.f_cxl = effPolicy;
  if (sortBy && sortBy !== 'price_asc') next.sort = sortBy;
  if (page && page > 1) next.page = String(page);

  return next;
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createDefaultFilters,
  applyHotelFilters,
  computeHotelFilterCounts,
  computePriceBounds,
  computeAvailableLocations,
  parseFiltersFromQuery,
  serializeFiltersToQuery,
} from '../utils/hotelFilterEngine.js';

const NOW = new Date('2026-11-22T12:00:00Z').getTime();

const SAMPLE_HOTELS = [
  {
    hotel_code: 'H1',
    hotel_name: 'Makkah Clock Tower',
    hotel_city: 'MAK',
    stars: 5,
    location_code: '01',
    location_name: 'Centre-ville',
    lowest_price_dzd: 85000,
    room_basis_code: 'RB',
    is_fully_refundable: true,
    has_refundable_offer: true,
    cancellation_deadline: '2026-12-01T18:00:00Z',
    is_on_request: false,
    agreements: [
      { agreement_id: 'a1', room_type: 'Kaaba View Suite', room_basis_code: 'RB', is_fully_refundable: true, deadline: '2026-12-01T18:00:00Z', is_on_request: false },
      { agreement_id: 'a2', room_type: 'Standard Room', room_basis_code: 'AI', is_fully_refundable: false, deadline: null, is_on_request: false },
    ],
  },
  {
    hotel_code: 'H2',
    hotel_name: 'Beach Resort Sousse',
    hotel_city: 'QSO',
    stars: 4,
    location_code: '05',
    location_name: 'Bord de mer / Plage',
    lowest_price_dzd: 32000,
    room_basis_code: 'SAI',
    is_fully_refundable: false,
    has_refundable_offer: false,
    cancellation_deadline: null,
    is_on_request: false,
    agreements: [
      { agreement_id: 'b1', room_type: 'Double Garden View', room_basis_code: 'SAI', meal_basis_code: 'C', is_fully_refundable: false, deadline: null, is_on_request: false },
    ],
  },
  {
    hotel_code: 'H3',
    hotel_name: 'Algiers Budget Inn',
    hotel_city: 'AXAL',
    stars: 3,
    location_code: '03',
    location_name: 'Aéroport',
    lowest_price_dzd: 14000,
    room_basis_code: 'RO',
    is_fully_refundable: false,
    has_refundable_offer: true,
    cancellation_deadline: null,
    is_on_request: true,
    agreements: [
      { agreement_id: 'c1', room_type: 'Economy Room', room_basis_code: 'RO', is_fully_refundable: false, deadline: null, is_on_request: true },
      { agreement_id: 'c2', room_type: 'Flex Room', room_basis_code: 'RD', is_fully_refundable: true, deadline: '2026-12-05T12:00:00Z', is_on_request: false },
    ],
  },
];

test('individual filters work accurately', () => {
  // Name search
  assert.deepEqual(
    applyHotelFilters(SAMPLE_HOTELS, { ...createDefaultFilters(), searchName: 'sousse' }, 'price_asc', NOW).map(h => h.hotel_code),
    ['H2']
  );

  // Price min/max
  assert.deepEqual(
    applyHotelFilters(SAMPLE_HOTELS, { ...createDefaultFilters(), minPrice: 20000, maxPrice: 60000 }, 'price_asc', NOW).map(h => h.hotel_code),
    ['H2']
  );

  // Multi-select exact stars
  assert.deepEqual(
    applyHotelFilters(SAMPLE_HOTELS, { ...createDefaultFilters(), selectedStars: [3, 5] }, 'price_asc', NOW).map(h => h.hotel_code),
    ['H3', 'H1']
  );

  // Meal basis: RB must NOT falsely match SAI with meal_basis=C (H2)
  assert.deepEqual(
    applyHotelFilters(SAMPLE_HOTELS, { ...createDefaultFilters(), mealBasis: 'RB' }, 'price_asc', NOW).map(h => h.hotel_code),
    ['H1']
  );
  // Meal basis: AI matches both AI (H1) and SAI (H2)
  assert.deepEqual(
    applyHotelFilters(SAMPLE_HOTELS, { ...createDefaultFilters(), mealBasis: 'AI' }, 'price_asc', NOW).map(h => h.hotel_code),
    ['H2', 'H1']
  );

  // Area / location filter
  assert.deepEqual(
    applyHotelFilters(SAMPLE_HOTELS, { ...createDefaultFilters(), locationCode: '05' }, 'price_asc', NOW).map(h => h.hotel_code),
    ['H2']
  );

  // Kaaba / Haram view filter
  assert.deepEqual(
    applyHotelFilters(SAMPLE_HOTELS, { ...createDefaultFilters(), viewType: 'kaaba' }, 'price_asc', NOW).map(h => h.hotel_code),
    ['H1']
  );

  // Availability filter
  assert.deepEqual(
    applyHotelFilters(SAMPLE_HOTELS, { ...createDefaultFilters(), availabilityType: 'on_request' }, 'price_asc', NOW).map(h => h.hotel_code),
    ['H3']
  );

  // RefundableOnly backward-compat flag works even when cancellationPolicy === 'all' (regression fix!)
  assert.deepEqual(
    applyHotelFilters(SAMPLE_HOTELS, { ...createDefaultFilters(), cancellationPolicy: 'all', refundableOnly: true }, 'price_asc', NOW).map(h => h.hotel_code),
    ['H3', 'H1']
  );
});

test('combined filters and all sort orders work together', () => {
  const combined = applyHotelFilters(
    SAMPLE_HOTELS,
    { ...createDefaultFilters(), minPrice: 10000, maxPrice: 90000, cancellationPolicy: 'refundable', availabilityType: 'immediate' },
    'stars_desc',
    NOW
  );
  assert.deepEqual(combined.map(h => h.hotel_code), ['H1', 'H3']);

  assert.deepEqual(
    applyHotelFilters(SAMPLE_HOTELS, createDefaultFilters(), 'price_desc', NOW).map(h => h.hotel_code),
    ['H1', 'H2', 'H3']
  );
  assert.deepEqual(
    applyHotelFilters(SAMPLE_HOTELS, createDefaultFilters(), 'name_asc', NOW).map(h => h.hotel_code),
    ['H3', 'H2', 'H1']
  );
});

test('counts, bounds, locations, and URL query sync round-trip cleanly', () => {
  const counts = computeHotelFilterCounts(SAMPLE_HOTELS, NOW);
  assert.equal(counts.total, 3);
  assert.equal(counts.refundable, 2);
  assert.equal(counts.meals.AI, 2);
  assert.equal(counts.meals.RB, 1);

  const bounds = computePriceBounds(SAMPLE_HOTELS);
  assert.deepEqual(bounds, { min: 14000, max: 85000 });

  const locs = computeAvailableLocations(SAMPLE_HOTELS);
  assert.equal(locs.length, 3);

  const f = { ...createDefaultFilters(), selectedStars: [4, 5], mealBasis: 'AI', locationCode: '05', cancellationPolicy: 'refundable', maxPrice: 50000 };
  const query = serializeFiltersToQuery({ destination_code: 'QSO' }, f, 'stars_desc', 2);
  assert.equal(query.destination_code, 'QSO');
  assert.equal(query.f_stars, '4,5');
  assert.equal(query.f_cxl, 'refundable');
  assert.equal(query.sort, 'stars_desc');
  assert.equal(query.page, '2');

  const parsed = parseFiltersFromQuery(query);
  assert.deepEqual(parsed.filters.selectedStars, [4, 5]);
  assert.equal(parsed.filters.mealBasis, 'AI');
  assert.equal(parsed.filters.cancellationPolicy, 'refundable');
  assert.equal(parsed.sortBy, 'stars_desc');
  assert.equal(parsed.page, 2);
});

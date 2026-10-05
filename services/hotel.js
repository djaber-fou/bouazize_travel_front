/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║           NETSTORMING HOTEL — Frontend API Service               ║
 * ║  Communicates with Laravel backend /api/hotels/* endpoints.     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// ── Destination Search ────────────────────────────────────────────────────────

/**
 * Search hotel destinations (cities) by keyword.
 * @param {string} q - Search query (min 2 chars)
 * @param {string} type - 'city' | 'zone' | 'country'
 * @returns {Promise<Array>}
 */
export const searchDestinations = async (q, type = 'city') => {
  const response = await sendApi(`/hotels/destinations?q=${encodeURIComponent(q)}&type=${type}`, null, 'GET');
  return response;
};

/**
 * Unified autocomplete — returns both city destinations AND hotel names.
 * @param {string} q - Search query (min 2 chars)
 * @returns {Promise<Array>} - Array of {type, label, code, name, country_name, hotel_id?, stars?}
 */
export const searchHotelsAutocomplete = async (q) => {
  const response = await sendApi(`/hotels/autocomplete?q=${encodeURIComponent(q)}`, null, 'GET');
  return response;
};

/**
 * Live inventory stats (real destinations / cities / countries counts).
 * @returns {Promise<{data: {destinations_count: number, cities_count: number, countries_count: number, formatted_total: string}}>}
 */
export const getHotelStats = async () => {
  const response = await sendApi('/hotels/stats', null, 'GET');
  return response;
};

// ── Availability Search ───────────────────────────────────────────────────────

/**
 * Search hotel availability.
 * @param {Object} criteria
 * @param {string} criteria.destination_code
 * @param {string} criteria.check_in     - YYYY-MM-DD
 * @param {string} criteria.check_out    - YYYY-MM-DD
 * @param {number} criteria.adults
 * @param {number} [criteria.children]
 * @param {number[]} [criteria.children_ages]
 * @returns {Promise<{session_id: string, hotels: Array, total: number}>}
 */
export const searchHotelAvailability = async (criteria) => {
  const response = await sendApi('/hotels/search', criteria, 'POST');
  return response;
};

/**
 * Pre-warm Netstorming cache for a destination (fire-and-forget).
 *
 * Uses raw fetch with keepalive:true + AbortSignal.timeout(1200ms):
 *  - keepalive: request survives page navigation
 *  - Short timeout: browser drops the connection after the backend sends its 200 response,
 *    triggering the PHP ignore_user_abort pattern — PHP continues the Netstorming query
 *    in the background even after the HTTP connection is closed.
 *
 * @param {string} destinationCode - Netstorming city code (e.g. "SYD", "TYO")
 * @param {string} [checkIn]       - YYYY-MM-DD (optional hint)
 * @param {string} [checkOut]      - YYYY-MM-DD (optional hint)
 * @param {number} [adults]        - default 2
 */
export const warmupDestination = (destinationCode, checkIn, checkOut, adults = 2) => {
  if (!destinationCode || typeof window === 'undefined') return;

  const baseUrl = import.meta.env.VITE_BASE_URL || '';
  const url = baseUrl + '/hotels/warmup';

  const body = JSON.stringify({
    destination_code: destinationCode,
    check_in:  checkIn  || null,
    check_out: checkOut || null,
    adults,
  });

  // Fire and forget — we don't await this. keepalive ensures it sends even on navigation.
  fetch(url, {
    method:    'POST',
    headers:   { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body,
    keepalive: true,
    signal:    AbortSignal.timeout(1200), // drop connection 1.2s after response arrives
  }).catch(() => {
    // Warmup is best-effort — timeout aborts or network errors are silently ignored
  });
};





/**
 * Load a paginated chunk of hotel results from server cache (instant 0ms retrieval).
 * @param {string} sessionId
 * @param {number} [page=1]
 * @param {number} [perPage=50]
 * @returns {Promise<{session_id: string, hotels: Array, total: number, page: number, has_more: boolean}>}
 */
export const getHotelSearchPage = async (sessionId, page = 1, perPage = 50) => {
  const response = await sendApi(`/hotels/search/page?session_id=${encodeURIComponent(sessionId)}&page=${page}&per_page=${perPage}`, null, 'GET');
  return response;
};

/**
 * Fetch ALL cached hotels for a session (for full-dataset client-side filtering).
 * Zero upstream latency — reads directly from server cache.
 * @param {string} sessionId
 * @returns {Promise<{session_id: string, hotels: Array, total: number}>}
 */
export const getAllHotelSearchResults = async (sessionId) => {
  const response = await sendApi(`/hotels/search/all?session_id=${encodeURIComponent(sessionId)}`, null, 'GET');
  return response;
};

// ── Evaluate Room ─────────────────────────────────────────────────────────────

/**
 * Confirm price and cancellation policy for a specific room.
 * @param {string} sessionId
 * @param {string} hotelCode
 * @param {string} roomCode
 * @returns {Promise<Object>}
 */
export const evaluateHotelRoom = async (sessionId, hotelCode, roomCode, extra = {}) => {
  const payload = {
    session_id: sessionId || '',
    hotel_code: hotelCode,
    room_code: roomCode,
    check_in: extra.check_in,
    check_out: extra.check_out,
    adults: extra.adults,
    price: extra.price,
  };
  const response = await sendApi('/hotels/evaluate', payload, 'POST');
  return response;
};

// ── Create Booking ────────────────────────────────────────────────────────────

/**
 * Create a hotel booking.
 * @param {Object} bookingData
 * @returns {Promise<{order_id: number, reference: string, status: string, price_dzd: number}>}
 */
export const createHotelBooking = async (bookingData) => {
  const response = await sendApi('/hotels/book', bookingData, 'POST');
  return response;
};

// ── My Orders ─────────────────────────────────────────────────────────────────

/**
 * Get authenticated user's hotel orders.
 * @param {number} [perPage=10]
 * @returns {Promise<Object>} - Paginated response
 */
export const getMyHotelOrders = async (perPage = 10) => {
  const response = await sendApi(`/hotels/orders?per_page=${perPage}`, null, 'GET');
  return response;
};

/**
 * Get a specific hotel order by ID.
 * @param {number} orderId
 * @returns {Promise<Object>}
 */
export const getHotelOrder = async (orderId) => {
  const response = await sendApi(`/hotels/orders/${orderId}`, null, 'GET');
  return response;
};

// ── Track Order ───────────────────────────────────────────────────────────────

/**
 * Track booking status from Netstorming.
 * @param {number} orderId
 * @returns {Promise<Object>}
 */
export const trackHotelOrder = async (orderId) => {
  const response = await sendApi(`/hotels/orders/${orderId}/track`, null, 'GET');
  return response;
};

// ── Cancel Order ──────────────────────────────────────────────────────────────

/**
 * Cancel a hotel booking.
 * @param {number} orderId
 * @returns {Promise<{status: string, penalty: number, cancelled_at: string}>}
 */
export const cancelHotelOrder = async (orderId) => {
  const response = await sendApi(`/hotels/orders/${orderId}/cancel`, null, 'POST');
  return response;
};

/**
 * Fetch hotel details, amenities, description, photos, and live room offers by hotel ID.
 * @param {string} hotelId
 * @param {Object} [params={}] Search criteria (check_in, check_out, adults, session_id, etc.)
 * @returns {Promise<Object>}
 */
export const fetchHotelDetails = async (hotelId, params = {}) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  }
  const queryStr = searchParams.toString();
  const url = queryStr ? `/hotels/${hotelId}?${queryStr}` : `/hotels/${hotelId}`;
  const response = await sendApi(url, null, 'GET');
  return response;
};


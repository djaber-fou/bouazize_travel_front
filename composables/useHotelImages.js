/**
 * ══════════════════════════════════════════════════════════════════════
 *  BOUAZIZE TRAVEL — HOTEL IMAGE ENGINE
 * ══════════════════════════════════════════════════════════════════════
 *
 * Resolves hotel photography through the first-party backend media proxy
 * (/api/media/hotels/{hotelId}/{index}.jpg) with local fallback when
 * an image is unavailable.
 */

const LOCAL_FALLBACK_PHOTO = '/images/services/hotels.jpg';

function getMediaApiBase() {
  const envBase = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BASE_URL)
    ? String(import.meta.env.VITE_BASE_URL).trim()
    : '';
  return envBase ? envBase.replace(/\/+$/, '') : '/api';
}

/**
 * Rewrites any legacy upstream hotel picture URL to our first-party media proxy.
 * @param {string} url
 * @returns {string}
 */
export function sanitizeHotelImageUrl(url) {
  if (!url || typeof url !== 'string') return LOCAL_FALLBACK_PHOTO;
  const trimmed = url.trim();
  if (!trimmed) return LOCAL_FALLBACK_PHOTO;

  const upstreamMatch = trimmed.match(/\/common\/hotels\/(\d+)\/[^/]+\/(\d+)\.(?:jpe?g|png|webp)(?:\?.*)?$/i);
  if (upstreamMatch) {
    return getHotelPictureUrl(upstreamMatch[1], upstreamMatch[2]);
  }

  return trimmed;
}

/**
 * Builds the first-party hotel picture proxy URL from a numeric hotel ID.
 * @param {string|number} hotelId
 * @param {number|string} [index=0]
 * @returns {string}
 */
export function getHotelPictureUrl(hotelId, index = 0) {
  if (hotelId === null || hotelId === undefined) return LOCAL_FALLBACK_PHOTO;
  const cleanId = String(hotelId).trim();
  if (!/^\d+$/.test(cleanId)) return LOCAL_FALLBACK_PHOTO;
  const cleanIndex = /^\d+$/.test(String(index)) ? String(index) : '0';
  return `${getMediaApiBase()}/media/hotels/${cleanId}/${cleanIndex}.jpg`;
}

/**
 * Resolves the primary image for a hotel card or thumbnail.
 * @param {Object|string|number} hotel
 * @returns {string}
 */
export function resolveHotelImage(hotel) {
  if (!hotel) return LOCAL_FALLBACK_PHOTO;

  if (typeof hotel === 'string') {
    if (hotel.startsWith('http') || hotel.startsWith('/')) return sanitizeHotelImageUrl(hotel);
    return getHotelPictureUrl(hotel, 0);
  }

  if (typeof hotel === 'number') {
    return getHotelPictureUrl(hotel, 0);
  }

  if (hotel.main_image && typeof hotel.main_image === 'string' && (hotel.main_image.startsWith('http') || hotel.main_image.startsWith('/'))) {
    return sanitizeHotelImageUrl(hotel.main_image);
  }

  if (Array.isArray(hotel.pictures) && hotel.pictures.length > 0) {
    const first = hotel.pictures[0];
    const src = typeof first === 'string' ? first : (first?.src || first?.url);
    if (src && (src.startsWith('http') || src.startsWith('/'))) return sanitizeHotelImageUrl(src);
  }

  if (Array.isArray(hotel.images) && hotel.images.length > 0) {
    const first = hotel.images[0];
    const src = typeof first === 'string' ? first : (first?.src || first?.url);
    if (src && (src.startsWith('http') || src.startsWith('/'))) return sanitizeHotelImageUrl(src);
  }

  const code = hotel.hotel_code || hotel.code || hotel.hotel_id || hotel.id;
  if (code) {
    return getHotelPictureUrl(code, 0);
  }

  return LOCAL_FALLBACK_PHOTO;
}

/**
 * Resolves the complete photo gallery for a hotel details / offers page.
 * @param {Object} hotel
 * @returns {string[]}
 */
export function resolveHotelGallery(hotel) {
  if (!hotel) return [LOCAL_FALLBACK_PHOTO];

  const code = hotel.hotel_code || hotel.code || hotel.hotel_id || hotel.id || '';
  const list = [];

  if (Array.isArray(hotel.pictures) && hotel.pictures.length > 0) {
    for (const item of hotel.pictures) {
      const rawSrc = typeof item === 'string' ? item : (item?.src || item?.url);
      if (rawSrc && typeof rawSrc === 'string' && (rawSrc.startsWith('http') || rawSrc.startsWith('/'))) {
        const src = sanitizeHotelImageUrl(rawSrc);
        if (!list.includes(src)) list.push(src);
      }
    }
  }

  if (Array.isArray(hotel.images) && hotel.images.length > 0) {
    for (const item of hotel.images) {
      const rawSrc = typeof item === 'string' ? item : (item?.src || item?.url);
      if (rawSrc && typeof rawSrc === 'string' && (rawSrc.startsWith('http') || rawSrc.startsWith('/'))) {
        const src = sanitizeHotelImageUrl(rawSrc);
        if (!list.includes(src)) list.push(src);
      }
    }
  }

  if (!list.length && code) {
    list.push(getHotelPictureUrl(code, 0));
  }

  return list.length ? list : [LOCAL_FALLBACK_PHOTO];
}

/**
 * Graceful error handler when an image fails to load.
 * @param {Event} event
 */
export function onHotelImageError(event) {
  if (!event || !event.target) return;
  const target = event.target;
  target.onerror = null;
  target.src = LOCAL_FALLBACK_PHOTO;
}

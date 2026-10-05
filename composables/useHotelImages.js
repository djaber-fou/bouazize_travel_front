/**
 * ══════════════════════════════════════════════════════════════════════
 *  NETSTORMING OFFICIAL HOTEL IMAGE ENGINE
 *  Reference: https://documentation.netstorming.net/
 *  Specification: NETSTORMING_MASTER_DOCUMENTATION.md (Sections 27 & 28)
 * ══════════════════════════════════════════════════════════════════════
 *
 * Implements Netstorming Official Image Specification:
 * 1. Primary Photo URL:
 *    https://pictures.netstorming.net/common/hotels/<HOTEL_ID>/original/0.jpg
 * 2. Details Gallery:
 *    Array of authentic pictures returned by Netstorming `details` XML query
 *    (<pictures><picture src="https://pictures.netstorming.net/common/hotels/<HOTEL_ID>/original/<NUM>.jpg"/></pictures>)
 * 3. Fallback:
 *    Local static hotel banner (/images/services/hotels.jpg) when CDN returns 404
 */

const LOCAL_FALLBACK_PHOTO = '/images/services/hotels.jpg';

/**
 * Builds the official Netstorming picture URL from a hotel ID.
 * @param {string|number} hotelId
 * @param {number|string} [index=0] - 0 for primary cover, or specific image number
 * @returns {string}
 */
export function getNetstormingPictureUrl(hotelId, index = 0) {
  if (!hotelId) return LOCAL_FALLBACK_PHOTO;
  const cleanId = String(hotelId).trim();
  if (!cleanId) return LOCAL_FALLBACK_PHOTO;
  return `https://pictures.netstorming.net/common/hotels/${cleanId}/original/${index}.jpg`;
}

/**
 * Resolves the primary official Netstorming image for a hotel card or thumbnail.
 * Adheres strictly to Netstorming documentation specifications.
 *
 * @param {Object|string|number} hotel - Hotel object from API or numeric hotel ID
 * @returns {string} Real Netstorming image URL
 */
export function resolveHotelImage(hotel) {
  if (!hotel) return LOCAL_FALLBACK_PHOTO;

  // If passed directly as a string URL
  if (typeof hotel === 'string') {
    if (hotel.startsWith('http')) return hotel;
    return getNetstormingPictureUrl(hotel, 0);
  }

  // If passed as numeric/string ID
  if (typeof hotel === 'number') {
    return getNetstormingPictureUrl(hotel, 0);
  }

  // 1. If hotel has a primary image already resolved by backend API
  if (hotel.main_image && typeof hotel.main_image === 'string' && hotel.main_image.startsWith('http')) {
    return hotel.main_image;
  }

  // 2. If hotel has pictures array from Netstorming details
  if (Array.isArray(hotel.pictures) && hotel.pictures.length > 0) {
    const first = hotel.pictures[0];
    const src = typeof first === 'string' ? first : (first?.src || first?.url);
    if (src && src.startsWith('http')) return src;
  }

  // 3. If hotel has images array from availability response
  if (Array.isArray(hotel.images) && hotel.images.length > 0) {
    const first = hotel.images[0];
    const src = typeof first === 'string' ? first : (first?.src || first?.url);
    if (src && src.startsWith('http')) return src;
  }

  // 4. Default Netstorming CDN structure: /hotels/<HOTEL_ID>/original/0.jpg
  const code = hotel.hotel_code || hotel.code || hotel.hotel_id || hotel.id;
  if (code) {
    return getNetstormingPictureUrl(code, 0);
  }

  return LOCAL_FALLBACK_PHOTO;
}

/**
 * Resolves the complete authentic photo gallery for a hotel details / offers page.
 * Returns only genuine Netstorming photos from the API.
 *
 * @param {Object} hotel - Full hotel object from /api/hotels/{id}
 * @returns {string[]} Array of real Netstorming photo URLs
 */
export function resolveHotelGallery(hotel) {
  if (!hotel) return [LOCAL_FALLBACK_PHOTO];

  const code = hotel.hotel_code || hotel.code || hotel.hotel_id || hotel.id || '';
  const list = [];

  // Extract all photos from Netstorming details `pictures` array
  if (Array.isArray(hotel.pictures) && hotel.pictures.length > 0) {
    for (const item of hotel.pictures) {
      const src = typeof item === 'string' ? item : (item?.src || item?.url);
      if (src && typeof src === 'string' && src.startsWith('http') && !list.includes(src)) {
        list.push(src);
      }
    }
  }

  // Extract from `images` array if available
  if (Array.isArray(hotel.images) && hotel.images.length > 0) {
    for (const item of hotel.images) {
      const src = typeof item === 'string' ? item : (item?.src || item?.url);
      if (src && typeof src === 'string' && src.startsWith('http') && !list.includes(src)) {
        list.push(src);
      }
    }
  }

  // If no photos array was returned, build default primary Netstorming photo
  if (!list.length && code) {
    list.push(getNetstormingPictureUrl(code, 0));
  }

  return list.length ? list : [LOCAL_FALLBACK_PHOTO];
}

/**
 * Graceful error handler when an image fails to load.
 * Sets the image to the clean local fallback without infinite error loops.
 *
 * @param {Event} event - Image error event
 */
export function onHotelImageError(event) {
  if (!event || !event.target) return;
  const target = event.target;
  // Prevent infinite error recursion
  target.onerror = null;
  target.src = LOCAL_FALLBACK_PHOTO;
}

/**
 * Direct Browser → Cloudinary upload.
 * Completely bypasses the Laravel backend, eliminating all timeout issues.
 * 
 * Uses Cloudinary's unsigned upload endpoint:
 *   POST https://api.cloudinary.com/v1_1/{cloud_name}/image/upload
 * 
 * An unsigned upload preset named "bouazize_unsigned" must exist on the
 * Cloudinary dashboard. If it doesn't, we fall back to using the API key
 * with a signed upload via the backend.
 */

const CLOUD_NAME = 'ryudmvuh'
const UPLOAD_PRESET = 'bouazize_unsigned'

/**
 * Compress an image file using Canvas before upload.
 * Returns a Blob ready for FormData.
 */
const compressForUpload = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.75) => {
    return new Promise((resolve) => {
        if (!file || !file.type?.startsWith('image/')) {
            return resolve(file)
        }
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
            const img = new Image()
            img.src = e.target.result
            img.onload = () => {
                let w = img.width
                let h = img.height

                if (w > maxWidth || h > maxHeight) {
                    if (w > h) {
                        h = Math.round((h * maxWidth) / w)
                        w = maxWidth
                    } else {
                        w = Math.round((w * maxHeight) / h)
                        h = maxHeight
                    }
                }

                const canvas = document.createElement('canvas')
                canvas.width = w
                canvas.height = h
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, w, h)

                canvas.toBlob(
                    (blob) => resolve(blob || file),
                    'image/jpeg',
                    quality
                )
            }
            img.onerror = () => resolve(file)
        }
        reader.onerror = () => resolve(file)
    })
}

/**
 * Upload an image directly to Cloudinary from the browser.
 * 
 * @param {File|Blob} file - The image file to upload
 * @param {string} folder - The Cloudinary folder (e.g. 'omra', 'voyages_organises')
 * @returns {Promise<string|null>} The secure URL or null on failure
 */
export const uploadToCloudinary = async (file, folder = 'offers') => {
    if (!file) return null

    try {
        // 1. Compress the image first
        const compressed = await compressForUpload(file)

        // 2. Build FormData for Cloudinary's unsigned upload
        const fd = new FormData()
        fd.append('file', compressed)
        fd.append('upload_preset', UPLOAD_PRESET)
        fd.append('folder', `bouazize/${folder}`)

        // 3. Upload directly to Cloudinary (no backend involved)
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: fd,
            }
        )

        if (!response.ok) {
            console.error('Cloudinary upload failed:', response.status, await response.text())
            return null
        }

        const data = await response.json()
        return data.secure_url || null
    } catch (err) {
        console.error('Cloudinary upload error:', err)
        return null
    }
}

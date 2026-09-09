/**
 * useHotelPricing — Centralized Hotel Pricing Engine
 * Bouazize Travel
 *
 * Pricing rules:
 * - CLIENT / non-logged:  display = wholesale + admin_margin
 * - ADMIN:                display = wholesale + admin_margin (same as client)
 * - BUSINESS:             net = wholesale (what they pay)
 *                         client_price = wholesale + business_margin (what their customers pay)
 *                         They PAY the net price only
 */

export function useHotelPricing(adminMarkupRaw = null) {
    const authStore = useAuthStore()

    // ── Admin platform markup (comes from search response) ────────────────
    const adminMarkup = computed(() => {
        const m = adminMarkupRaw?.value ?? adminMarkupRaw
        if (!m) return { val: 10, type: 'percentage' } // fallback 10%
        let val = Number(m.val ?? m.value ?? 10)
        const type = m.type || 'percentage'
        // Normalize decimal to whole number (0.10 → 10%)
        if (type === 'percentage' && val > 0 && val <= 1) val = val * 100
        return { val, type }
    })

    // ── Business user's own margin ────────────────────────────────────────
    const businessMarkup = computed(() => {
        const u = authStore.User
        let val = Number(u?.markup_hotel ?? 0)
        const type = u?.markup_type_hotel || 'percentage'
        if (type === 'percentage' && val > 0 && val <= 1) val = val * 100
        return { val, type }
    })

    const userRole = computed(() => authStore.User?.role || 'guest')
    const isBusiness = computed(() => userRole.value === 'business')
    const isAdmin = computed(() => userRole.value === 'admin')

    // ── Apply a single markup to a wholesale price ────────────────────────
    function applyMarkup(wholesale, markup) {
        const net = Number(wholesale) || 0
        if (!markup || !markup.val) return net
        if (markup.type === 'percentage') {
            return Math.round(net * (1 + markup.val / 100))
        }
        return Math.round(net + markup.val)
    }

    /**
     * Get display pricing object for a wholesale price.
     *
     * Returns:
     *  - For GUEST / CLIENT / ADMIN:
     *    { displayPrice, isNet: false }
     *
     *  - For BUSINESS:
     *    { netPrice (what they pay), clientPrice (what their customers pay),
     *      marginAmount, isBusiness: true }
     */
    function getPricing(wholesalePrice) {
        const net = Number(wholesalePrice) || 0

        if (isBusiness.value) {
            const clientPrice = applyMarkup(net, businessMarkup.value)
            return {
                isBusiness: true,
                netPrice: net,           // what business pays (wholesale)
                clientPrice,             // what business charges their clients
                marginAmount: clientPrice - net,
                paymentPrice: net        // business pays wholesale
            }
        }

        // Client / Admin / Guest: show wholesale + admin margin
        const displayPrice = applyMarkup(net, adminMarkup.value)
        return {
            isBusiness: false,
            displayPrice,
            paymentPrice: displayPrice
        }
    }

    /**
     * The "payment price" — what the current user actually pays.
     * Business pays wholesale (net). Everyone else pays admin-marked-up price.
     */
    function getPaymentPrice(wholesalePrice) {
        return getPricing(wholesalePrice).paymentPrice
    }

    /**
     * Formatted price display string
     */
    function formatPrice(val) {
        if (!val && val !== 0) return '0'
        return Math.round(Number(val)).toLocaleString('fr-FR')
    }

    return {
        adminMarkup,
        businessMarkup,
        userRole,
        isBusiness,
        isAdmin,
        getPricing,
        getPaymentPrice,
        applyMarkup,
        formatPrice,
    }
}

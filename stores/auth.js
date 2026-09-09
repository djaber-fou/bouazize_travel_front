import { defineStore } from "pinia";
export const useAuthStore = defineStore('auth',{
    state:()=>({
        User:{},
        Authorization:{},
        hydrated:false
    }),
    persist: true,
    getters: {
        isAdmin: (state) => state.User?.role === 'admin',
        isBusiness: (state) => state.User?.role === 'business',
        isLoggedIn: (state) => !!state.Authorization?.token,
    },
    actions:{
        async login(data){
            try {
                const response = await sendApi('/auth/login', data, 'POST')
                this.User = response.user
                this.Authorization = response.authorization 
                
                if (this.User.role === 'admin') {
                    navigateTo('/x8dj29msk')
                } else {
                    navigateTo('/')
                }
                return { success: true }
            } catch (err) {
                // Handle 403 = email not verified
                const responseData = err?.data || err?.response?.data || err
                if (responseData?.requires_verification || responseData?.status === 'unverified') {
                    return { 
                        requiresVerification: true, 
                        email: responseData.email || data.email,
                        message: responseData.message 
                    }
                }
                throw err
            }
        },

        async register(data){
            try {
                const response = await sendApi('/auth/register', data, 'POST')
                
                // Check if registration requires email verification
                if (response.requires_verification) {
                    return { 
                        requiresVerification: true, 
                        email: response.email,
                        message: response.message 
                    }
                }
                
                // If no verification needed (shouldn't happen but handle gracefully)
                this.User = response.user
                this.Authorization = response.authorization 
                navigateTo('/')
                return { success: true }
            } catch (err) {
                throw err
            }
        },

        async verifyEmail(email, code) {
            const response = await sendApi('/auth/verify-email', { email, code }, 'POST')
            this.User = response.user
            this.Authorization = response.authorization
            
            if (this.User.role === 'admin') {
                navigateTo('/x8dj29msk')
            } else {
                navigateTo('/')
            }
            return response
        },

        async resendVerification(email) {
            const response = await sendApi('/auth/resend-verification', { email }, 'POST')
            return response
        },

        async forgotPassword(data){
            const response = await sendApi('/auth/forget-password', data, 'POST')
            return response
        },

        async verifyResetCode(email, code) {
            const response = await sendApi('/auth/verify-reset-code', { email, code }, 'POST'
            )
            return response
        },

        async resetPassword(email, code, password, password_confirmation) {
            const response = await sendApi('/auth/reset-password', { 
                email, code, password, password_confirmation 
            }, 'POST')
            return response
        },

        /**
         * Refresh authStore.User from server — call after updating profile/margins
         * so that computed values like businessMarkup reflect the latest DB values.
         */
        async refreshUser() {
            try {
                const role = this.User?.role
                // Choose correct profile endpoint based on role
                const endpoint = role === 'admin' 
                    ? '/admin/profile' 
                    : '/profile'
                const response = await sendApi(endpoint, null, 'GET', { silent: true })
                // Profile endpoints return { data: UserResource }
                const freshUser = response?.data || response
                if (freshUser && freshUser.id) {
                    // Merge fresh data into User, preserving any fields not in profile response
                    this.User = { ...this.User, ...freshUser }
                }
            } catch (err) {
                console.error('refreshUser failed:', err)
            }
        },

        async logout(){
            const response = await sendApi('/auth/logout',null,'POST')
            this.User = {};
            this.Authorization = {};
            localStorage.clear('auth');
            navigateTo('/auth/login')
        }
    }
})
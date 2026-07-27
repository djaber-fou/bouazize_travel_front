import { defineStore } from "pinia";
export const useAuthStore = defineStore('auth',{
    state:()=>({
        User:{},
        Authorization:{},
        hydrated:false
    }),
    persist: true,
    actions:{
        async login(data){
            const response = await sendApi('/auth/login',data,'POST')
            this.User = response.user
            this.Authorization = response.authorization 
            
            if (this.User.role === 'admin') {
                navigateTo('/x8dj29msk')
            } else {
                navigateTo('/')
            }
        },

        async register(data){
            const response = await sendApi('/auth/register', data, 'POST')
            this.User = response.user
            this.Authorization = response.authorization 
            navigateTo('/')
        },

        async forgotPassword(data){
            const response = await sendApi('/auth/forget-password', data, 'POST')
            return response
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
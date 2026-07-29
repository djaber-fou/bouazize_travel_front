import { useAuthStore } from "#imports";
import axios from 'axios'

// const Axios = axios.create({
//     baseURL: 'http://localhost:8000/api',
//     timeout: 1000,
//     headers: {Accept: 'application/json'}
// })
// // Axios.defaults.withCredentials = false
// // Axios.defaults.withXSRFToken = false 

// Axios.interceptors.request.use(config=>{
//     const authStore = useAuthStore();
//     const token = authStore.Authorization?.token;
//     if(token){
//         config.headers.Authorization = 'Bearer' + token
//     }
//     return config
// })

// export default Axios

export const sendApi = async (path, Data, Method, configOpts = {}) => {
    const authStore = useAuthStore();
    const token = authStore.Authorization.token;
    
    const url = import.meta.env.VITE_BASE_URL + path;
    const Headers = {
        Accept:'Application/json',
    }
    if(token){
        Headers.Authorization = 'Bearer '+token 
    }
    axios.defaults.headers = Headers

    const response = await axios({
        method: Method,
        url: url,
        data: Data,
        ...configOpts
    }).then(response=>{
        // const blob = response?.config?.env?.Blob() 
        console.log(response)
        if(response.data?.message){
            const toast = useToast()
            const success = response.data.success
            toast.add({title:response.data.message, 
                color:'',
                progress:false,
                close:false,
                ui:{root:success?'bg-success':'bg-error',title:'text-white', close:'neutral'}
            })
        }
        else if(response.status === 401){
            localStorage.clear()
            if (process.client) {
                const router = useRouter()
                if (router) router.push('/auth/login')
            }
        }
        
        return response.data
    }).catch(error=>{
        console.error('API Error:', error)
        const toast = useToast()
        
        let errorMsg = "Une erreur est survenue."
        
        if (error.response) {
            // Server responded with an error (e.g. 422, 500)
            if (error.response.data && error.response.data.message) {
                errorMsg = error.response.data.message
            } else {
                errorMsg = `Erreur serveur: ${error.response.status}`
            }
            
            if(error.response.status === 401){
                localStorage.clear()
                if (process.client) {
                    const router = useRouter()
                    if (router) router.push('/auth/login')
                }
            }
        } else if (error.request) {
            // No response received (Network error, timeout, or PHP aborted due to post_max_size)
            errorMsg = "Erreur réseau ou fichier trop volumineux."
        } else {
            errorMsg = error.message
        }
        
        toast.add({
            title: errorMsg, 
            color: '',
            progress: false,
            close: false,
            ui: {root:'bg-error',title:'text-white', close:'neutral'}
        })
        
        return undefined
    })
    return response
    // const {data:responseData,status,error} = await useFetch(url,{
    //     method:Method,
    //     body:Data,
    //     headers:Headers,
    //     onRequest({request,options}){
    //         // options.headers.set('Accept','Application/json')
    //     },
    //     onResponse({request, response,options}){
    //         if(response._data?.message && (response.status !== 422 || response.status !== 401)){
    //             const toast = useToast()
    //             const success = response._data.success
    //             toast.add({title:response._data.message, 
    //                 color:'',
    //                 progress:false,
    //                 close:false,
    //                 ui:{root:success?'bg-success':'bg-error',title:'text-white', close:'neutral'}
    //             })
    //             console.log(response)
    //         }
    //         if(response.status === 401){
    //             localStorage.clear()
    //         }
    //     }
    // })
    // return responseData.value
}
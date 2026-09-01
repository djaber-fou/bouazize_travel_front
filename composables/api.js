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
    const token = authStore?.Authorization?.token;
    
    const url = import.meta.env.VITE_BASE_URL + path;
    const reqHeaders = {
        'Accept': 'application/json',
        ...(configOpts.headers || {})
    };
    if (token) {
        reqHeaders['Authorization'] = 'Bearer ' + token;
    }

    const { headers: _, ...restConfigOpts } = configOpts;

    const response = await axios({
        method: Method,
        url: url,
        data: Data,
        headers: reqHeaders,
        timeout: 90000, // Increased timeout to 90 seconds for large Netstorming queries
        ...restConfigOpts
    }).then(response=>{
        console.log(response)
        if(response.data?.message){
            const toast = useToast()
            const isSuccess = response.data.success === true || response.data.status === 'success' || response.status === 200 || response.status === 201;
            toast.add({
                title: response.data.message, 
                color: isSuccess ? 'green' : 'red',
                progress: false,
                close: true,
                ui: {
                    root: isSuccess ? '!bg-emerald-600 !text-white' : '!bg-rose-600 !text-white',
                    title: 'text-white font-medium',
                    close: 'text-white'
                }
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
            if (error.response.data) {
                if (error.response.data.errors && typeof error.response.data.errors === 'object') {
                    const firstKey = Object.keys(error.response.data.errors)[0]
                    const firstVal = error.response.data.errors[firstKey]
                    errorMsg = Array.isArray(firstVal) ? firstVal[0] : String(firstVal)
                } else if (error.response.data.message) {
                    errorMsg = error.response.data.message
                } else {
                    errorMsg = `Erreur serveur: ${error.response.status}`
                }
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
            errorMsg = "Erreur de connexion ou délai d'attente dépassé."
        } else {
            errorMsg = error.message
        }
        
        toast.add({
            title: errorMsg, 
            color: 'red',
            progress: false,
            close: true,
            ui: {
                root: '!bg-rose-600 !text-white',
                title: 'text-white font-medium',
                close: 'text-white'
            }
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


<template>
  <div>
    <ClientOnly>
      <UApp>
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
      </UApp>
    </ClientOnly>
  </div>
  
</template>
<script setup>
import echoInit from './plugins/echo';
import { useAuthStore } from '#imports';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import SideBar from '../components/SideBar.vue';
// import Axios from './composables/api';

onMounted(()=>{
  const authStore = useAuthStore()

  
    
//   if(user && token){
//     // echoInit(user,token)
//     // console.log("hello")
//     if(process.client){
//         console.log(token)
//       window.Pusher = Pusher;
//       window.Echo = new Echo({
//         broadcaster:'reverb',
//         key:'uustbr1tek0ohr8a1tof',
//         wsHost:'localhost',
//         wsPort:8080,
//         forceTLS:false,
//         encrypted:false,
//         enabledTransports:['ws','wss'],
//         authEndpoint:'http://localhost:8000/broadcasting/auth',
//         auth:{
//           // Authorization:"Bearer "+token
//           headers:{
//             Authorization:"Bearer "+token
//           }
//         }
//       })
      
//       window.Echo.private(`agency-channel.user.${user.id}`)
//         .listen('UserRegistration', (e)=>{
//           console.log(e)
//           const toast = useToast()
//           toast.add({title:e.data, 
//               color:'',
//               progress:false,
//               close:false,
//               ui:{root:'bg-success',title:'text-white', close:'neutral'}
//           })
//         })
//     }else{
//         console.log("server")
//     }
//   }
})

</script>
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

export  function echoInit(user,token){
    if(process.client){
        console.log("client")
      window.Pusher = Pusher;
      window.Echo = new Echo({
        broadcaster:'reverb',
        key:'uustbr1tek0ohr8a1tof',
        wsHost:'localhost',
        wsPort:8080,
        forceTLS:false,
        encrypted:false,
        enabledTransports:['ws','wss'],
        authEndpoint:'http://localhost:8000/broadcasting/auth',
        auth:{
          headers:{
            Authorization:"Bearer "+token
          }
        }
      })
      
      window.Echo.private(`agency-channel.user.${user.id}`)
        .listen('UserRegistration', (e)=>{
          console.log(e,'event')
        })
    }else{
        console.log("server")
    }

}

export default defineNuxtPlugin(() => {
  // Plugin is loaded but echoInit is called manually where needed
})
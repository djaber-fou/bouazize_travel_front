<template>
    <div class="py-5 px-5 h-screen grid md:gap-x-5 gap-y-5 md:grid-cols-3 grid-cols-1 ">
        <div class="flex flex-col gap-5 items-center">
            <div class="relative">
                <img :src="userImage.url??'/images/blank-profile.png'"  class="w-50 h-50 object-cover rounded-full" @click="console.log('hello')"/>
                <label for="images" class="absolute inset-0 opacity-0 hover:opacity-100 hover:bg-black/80 duration-500 rounded-full flex flex-col justify-center items-center cursor-pointer">
                    <UIcon :name="userImage.url ?'i-material-symbols-edit-sharp':'i-material-symbols-add-photo-alternate'" size="35" class="text-primary"/>
                    <div class="text-white font-bold">{{userImage.url ? "Modifier":"Ajouter"}}</div>
                    <UInput @change="onFileChange" class="hidden" type="file" id="images"/>
                </label>
                
            </div>
            <div class="flex flex-col gap-1 text-center">
                <p class="text-xl font-light text-secondary">{{ user.name }}</p>
                <p class="text-sm font-[10px] text-primary">{{ capitalize(user.role==="business"?"Entreprise":"Individuel") }}</p>    
            </div>
            <div v-if="user?.role === 'business'" class="flex flex-col gap-2">
                <div class="flex gap-1">
                    <UIcon name="i-hugeicons-money-bag-02" class="text-green-600" size="25"/>
                    <div class="flex gap-2">
                        <div class="text-secondary font-bold">Solde:</div>
                        <p><span class="text-green-600">{{ user?.balance?.balance }} DZD</span></p>
                    </div>
                </div>
                <div class="flex gap-1">
                    <UIcon name="i-material-symbols-trending-down" class="text-error" size="25"/>
                    <div class="flex gap-2">
                        <div class="text-secondary font-bold">Dettes:</div>
                        <p><span class="text-error">{{ user?.balance?.debts }} DZD</span></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-2 flex flex-col gap-10">
            <swiper-container class="swiper" ref="containerRef">
                <swiper-slide
                    v-for="(item, idx) in items"
                    :key="idx"
                    
                >
                    <div class="h-full md:w-fit w-full flex md:justify-start justify-center items-center cursor-pointer text-secondary font-bold w-25 text-center"
                    :class="showComponent === item.value?'activeComponent border-b-1 border-primary':''" 
                    @click="showComponent = item.value"
                    >
                        {{ item.text }}
                    </div>
                </swiper-slide>
            </swiper-container>
            <!-- <ul v-for="(item,index) in items" :key="index">
                <li class="cursor-pointer text-secondary font-bold w-25 text-center"
                :class="showComponent === item.value?'activeComponent border-b-1 border-primary':''" 
                @click="showComponent = item.value"
                >
                    {{ item.text }}
                </li> -->
            <!-- </ul> -->
            
            <div class="flex md:justify-start justify-center pb-5">
                <General :user="user" :token="token" v-if="showComponent === 'general'"/>
                <Address v-if="showComponent === 'address'"/>
                <Banks v-if="showComponent === 'banks'"/>
                <Margin v-if="showComponent === 'margin'"/>
                <Security v-if="showComponent === 'security'"/>
            </div>
            
        </div>
    </div>
</template>

<script setup>
import { capitalize } from 'vue';
import Address from '~/components/profile/Address.vue';
import Banks from '~/components/profile/Banks.vue';
import General from '~/components/profile/General.vue';
import Margin from '~/components/profile/Margin.vue';
import Security from '~/components/profile/Security.vue';
import { getProfile } from '~/services/profile';

const containerRef = ref(null)
const swiper = useSwiper(containerRef, {
  effect: 'creative',
  loop: false,
  breakpoints:{
    300:{
        slidesPerView: 2.5,
        spaceBetween:2,
    },
    566: {
        slidesPerView: 2,
        spaceBetween:2,
    },
    768: {
        slidesPerView: 5,
        spaceBetween:2,
    },
  }
  
})

const authStore = useAuthStore()
const token = computed(() => authStore.Authorization.token)
const user = ref(null)
const userImage = ref({})
const profile = ref({})
const response = await getProfile();
console.log(response)
console.log(response)
user.value = response.data
userImage.value.url = user.value?.image

const showComponent = ref('general')
definePageMeta({
    
});

onMounted(()=>{
    // console.log(user.value)
})
const items = ref([
    {text:"Général",value:"general"},
    {text:"Adresse",value:"address"},
    user.value.role === 'business'?{text:"Marges",value:"margin"}:null,
    user.value.role === 'admin'?{text:"Banques",value:"banks"}:null,
    {text:"Sécurité",value:"security"},
].filter(Boolean))

const onFileChange = (event)=> {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        userImage.value.url = URL.createObjectURL(file);
        userImage.value.file = file
        updateImage()
      } else {
        countryFlag.value = null;
      }
}

const updateImage = async()=>{
    const formData = new FormData()
    formData.append('image',userImage.value.file)
    formData.append('_method','PUT')
    sendApi('/auth/change-picture',formData,'POST').then(response=>{
        console.log(response)
    })
}

</script>

<style scoped>
.activeComponent{
    padding: 8px 10px;
}
.swiper{
    display: flex;
    justify-items: center;
}
</style>

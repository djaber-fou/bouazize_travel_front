<template>
    <div class="min-h-[calc(100vh-80px)] px-6 md:px-15 flex flex-col gap-10 items-center justify-items-center py-12">
        <div class="py-5 flex flex-col gap-3 items-center">
            <div class="text-secondary text-3xl font-bold">Nos Services</div>
            <div class="text-primary font-bold border-1 w-full"></div>
            <!-- <div class="text-primary font-bold">Description</div> -->
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div class="relative group cursor-pointer" v-for="(service, index) in services" :key="index">
                <nuxt-link :to="service.link">
                    <img :src="service.image" width="400" class="aspect-5/3 object-cover brightness-30 rounded-md transition duration-300 group-hover:brightness-90"/>
                    <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/30 group-hover:bg-black/80 rounded-md transition duration-300 text-white text-xl font-semibold">
                        <div>
                            {{ service.name }}
                        </div>
                        <div v-if="service?.note">
                            ({{ service?.note }})
                        </div>
                    </div>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script setup>

const services = ref([
    {name:"VISA", image:"/images/services/visa.jpg", link:"/services/visa"},
    {name:"OMRA", image:"/images/services/omra.webp", link:"/services/omra"},
    {name:"VOYAGE ORGANISÉ", image:"/images/services/voyage_organise.jpg", link:"/services/voyage_organise"},
    {name:"HÔTELLERIE", image:"/images/services/hotels.jpg", link:"/hotels"},
])

onMounted(()=>{
    localStorage.removeItem('current_page')
})

</script>

<style scoped>



</style>

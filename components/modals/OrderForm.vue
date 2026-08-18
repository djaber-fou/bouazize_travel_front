<template>
    <UModal fullscreen>
        <template #header>
            <div class="w-full flex justify-between items-center">
                <div class="flex gap-4 items-center">
                    <UButton color="gray" variant="ghost" icon="i-lucide-arrow-left" @click="emit('close',true)" class="rounded-none w-10 h-10 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"/>
                    <div>
                        <div class="font-bold text-2xl text-secondary">{{ offer?.name }}</div>
                        <div v-if="offer?.departure_date" class="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                            <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5 text-primary"/>
                            <span>Départ: {{ offer?.departure_date }}</span>
                            <span v-if="offer?.return_date">• Retour: {{ offer?.return_date }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #body>
            <div v-if="!openCashModal" class="grid lg:grid-cols-12 grid-cols-1 gap-8 lg:gap-12 px-4 sm:px-6 md:px-12 lg:px-16 py-8 max-w-7xl mx-auto items-start">
                <!-- Left: Sticky Offer Details & Live Price Summary -->
                <div class="lg:col-span-5 lg:sticky lg:top-4 self-start flex flex-col gap-6 items-center md:items-start bg-gray-50/70 dark:bg-slate-900 p-6 md:p-8 rounded-none border border-gray-100 dark:border-slate-800 shadow-sm">
                    <img :src="offer?.image || offer?.country_flag" class="w-full aspect-[4/3] object-cover rounded-none shadow-lg hover:shadow-xl transition-shadow duration-500"/>
                    
                    <div class="flex flex-col gap-4 w-full">
                        <div class="flex flex-wrap gap-2">
                            <UBadge size="lg" class="font-bold shadow-sm" variant="subtle" :color="guaranteeColor(offer?.guarantee)">
                                <UIcon name="i-heroicons-shield-check" class="w-4 h-4 mr-1" v-if="offer?.guarantee !== 'without'" />
                                {{ guaranteeValue(offer?.guarantee) }}
                            </UBadge>
                            <UBadge size="lg" color="gray" variant="solid" class="font-medium shadow-sm">
                                <UIcon name="i-heroicons-clock" class="w-4 h-4 mr-1" />
                                {{ offer?.duration || 'Séjour complet' }}
                            </UBadge>
                        </div>

                        <!-- Real-time Dynamic Pricing Breakdown Box -->
                        <div class="flex flex-col gap-3 mt-2 border-t border-gray-200 dark:border-slate-700 pt-6 w-full">
                            <div class="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                                <span>Détails de la tarification</span>
                                <span class="text-primary font-semibold text-xs flex items-center gap-1">
                                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Temps réel
                                </span>
                            </div>

                            <!-- Breakdown Lines -->
                            <div class="space-y-2 text-sm bg-white dark:bg-slate-800 p-4 border border-gray-100 dark:border-slate-700 rounded-none shadow-sm">
                                <div class="flex justify-between items-center text-gray-700 dark:text-gray-300">
                                    <span>Adultes ({{ clientOrder.members }} × {{ formatPrice(unitAdultPrice) }} DZD)</span>
                                    <span class="font-bold text-secondary dark:text-white">{{ formatPrice(totalAdultsPrice) }} DZD</span>
                                </div>
                                <div v-if="hasRooms && clientOrder.children_count > 0" class="flex justify-between items-center text-gray-700 dark:text-gray-300">
                                    <span>Enfants ({{ clientOrder.children_count }} × {{ formatPrice(unitChildPrice) }} DZD)</span>
                                    <span class="font-bold text-secondary dark:text-white">{{ formatPrice(totalChildrenPrice) }} DZD</span>
                                </div>
                                <div v-if="hasRooms && clientOrder.babies_count > 0" class="flex justify-between items-center text-gray-700 dark:text-gray-300">
                                    <span>Bébés ({{ clientOrder.babies_count }} × {{ formatPrice(unitBabyPrice) }} DZD)</span>
                                    <span class="font-bold text-secondary dark:text-white">{{ formatPrice(totalBabiesPrice) }} DZD</span>
                                </div>
                                
                                <div class="border-t border-gray-200 dark:border-slate-700 pt-3 mt-3 flex justify-between items-baseline">
                                    <span class="font-extrabold text-base text-secondary dark:text-white">Montant Total</span>
                                    <div class="text-primary text-3xl font-black">
                                        {{ formatPrice(grandTotalPrice) }} <span class="text-sm text-gray-500 font-bold">DZD</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Right: Booking Form -->
                <div class="lg:col-span-7 w-full pb-10 flex flex-col gap-8">
                    <div class="flex flex-col gap-2">
                        <h2 class="text-3xl font-bold text-secondary">Réserver cette offre</h2>
                        <p class="text-gray-500">Configurez votre séjour et sélectionnez le type de chambre souhaité.</p>
                    </div>

                    <div v-if="!authorization?.token" class="p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-none w-full font-medium text-sm flex items-center gap-3 shadow-sm">
                        <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-orange-500 flex-shrink-0" />
                        Vous devez vous connecter pour uploader vos documents et réserver.
                    </div>

                    <!-- Room Selector as UL / LI List (Omra and Voyage Organise) -->
                    <div v-if="hasRooms" class="flex flex-col gap-4 bg-white dark:bg-slate-900 p-6 rounded-none border border-gray-100 dark:border-slate-800 shadow-sm">
                        <div class="font-bold text-secondary text-lg flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                            <div class="flex items-center gap-2">
                                <UIcon name="i-heroicons-home-modern" class="text-primary w-5 h-5"/>
                                <span>1. Choisissez votre type de chambre</span>
                            </div>
                            <UBadge color="primary" variant="subtle" size="xs" class="font-bold">
                                {{ availableRooms.length }} option{{ availableRooms.length > 1 ? 's' : '' }} disponible{{ availableRooms.length > 1 ? 's' : '' }}
                            </UBadge>
                        </div>

                        <!-- Semantic UL / LI Room Selection List -->
                        <ul class="space-y-3">
                            <li v-for="(room, index) in availableRooms" :key="room.id || index"
                                @click="selectRoom(index)"
                                :class="[
                                    'p-4 border-2 cursor-pointer transition-all duration-200 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-4',
                                    selectedRoomIndex === index 
                                        ? 'border-primary bg-primary/[0.04] dark:bg-primary/[0.08] shadow-md ring-1 ring-primary/20' 
                                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/60'
                                ]">
                                
                                <div class="flex items-start gap-3">
                                    <!-- Custom Radio Indicator -->
                                    <div class="mt-0.5 flex-shrink-0">
                                        <div :class="[
                                            'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                                            selectedRoomIndex === index ? 'border-primary bg-primary' : 'border-gray-300 dark:border-slate-600'
                                        ]">
                                            <div v-if="selectedRoomIndex === index" class="w-2 h-2 rounded-full bg-white"></div>
                                        </div>
                                    </div>

                                    <!-- Room Info -->
                                    <div class="space-y-1">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="font-bold text-secondary dark:text-white text-base">{{ room.name }}</span>
                                            
                                            <UBadge size="xs" :color="selectedRoomIndex === index ? 'primary' : 'gray'" variant="soft" class="font-bold">
                                                {{ room.capacity || room.type }} Place{{ (room.capacity > 1 || room.type > 1) ? 's' : '' }}
                                            </UBadge>

                                            <!-- Capacity Mode Badge -->
                                            <UBadge v-if="Number(room.capacity || room.type) <= 3" size="xs" color="gray" variant="outline" class="text-[10px] font-semibold">
                                                {{ room.capacity || room.type }} Adulte{{ (room.capacity > 1 || room.type > 1) ? 's' : '' }} fixe
                                            </UBadge>
                                            <UBadge v-else-if="room.allow_custom_adults" size="xs" color="info" variant="subtle" class="text-[10px] font-semibold">
                                                Réservation par place (1 à {{ room.capacity || room.type }} pers.)
                                            </UBadge>
                                            <UBadge v-else size="xs" color="gray" variant="outline" class="text-[10px] font-semibold">
                                                Chambre complète ({{ room.capacity || room.type }} pers.)
                                            </UBadge>
                                        </div>

                                        <p v-if="room.notes" class="text-xs text-gray-500 italic">{{ room.notes }}</p>

                                        <!-- Sub options (Children / Babies availability) -->
                                        <div class="flex items-center gap-3 text-xs text-gray-500 pt-0.5 flex-wrap">
                                            <span v-if="room.max_children > 0" class="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                                <UIcon name="i-heroicons-check" class="w-3.5 h-3.5"/> Max {{ room.max_children }} enfant(s) ({{ formatPrice(room.child_price) }} DZD)
                                            </span>
                                            <span v-if="room.max_babies > 0" class="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-medium">
                                                <UIcon name="i-heroicons-check" class="w-3.5 h-3.5"/> Max {{ room.max_babies }} bébé(s) ({{ formatPrice(room.baby_price) }} DZD)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Room Price -->
                                <div class="text-right flex md:flex-col items-baseline md:items-end justify-between border-t md:border-t-0 pt-2 md:pt-0 border-gray-100 dark:border-slate-800 flex-shrink-0">
                                    <span class="text-xs text-gray-500">Prix par adulte</span>
                                    <span class="font-black text-primary text-lg md:text-xl">{{ formatPrice(getRoomAdultPrice(room)) }} <span class="text-xs font-semibold">DZD</span></span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!-- Passenger Configuration Card (Styled as clean UL / LI List) -->
                    <div class="flex flex-col gap-4 bg-white dark:bg-slate-900 p-6 rounded-none border border-gray-100 dark:border-slate-800 shadow-sm">
                        <div class="font-bold text-secondary text-lg flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                            <div class="flex items-center gap-2">
                                <UIcon name="i-heroicons-users" class="text-primary w-5 h-5"/>
                                <span>2. Nombre de Voyageurs</span>
                            </div>
                            <UBadge color="gray" variant="soft" size="xs" class="font-bold">
                                Total : {{ totalPassengers }} voyageur{{ totalPassengers > 1 ? 's' : '' }}
                            </UBadge>
                        </div>

                        <!-- Semantic UL / LI Passenger List -->
                        <ul class="space-y-3">
                            <!-- 1. Adultes -->
                            <li class="p-4 border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div class="flex items-start gap-3">
                                    <div class="w-10 h-10 rounded-none bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <UIcon name="i-heroicons-user" class="w-5 h-5"/>
                                    </div>
                                    <div class="space-y-1">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="font-bold text-secondary dark:text-white text-base">Adultes</span>
                                            <UBadge size="xs" color="primary" variant="subtle" class="font-bold">Places principales</UBadge>
                                            <UBadge v-if="!isAdultsCustomizable && hasRooms" size="xs" color="gray" variant="outline" class="text-[10px] font-semibold">
                                                Capacité fixe ({{ clientOrder.members }})
                                            </UBadge>
                                        </div>
                                        <div class="text-xs text-gray-500 font-medium">
                                            {{ formatPrice(unitAdultPrice) }} DZD <span class="text-[11px] text-gray-400">/ personne</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Stepper / Locked Controls -->
                                <div class="flex items-center justify-end sm:justify-center gap-2 flex-shrink-0">
                                    <!-- If Customizable -->
                                    <div v-if="isAdultsCustomizable" class="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-none shadow-sm">
                                        <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-minus" @click="decrementAdults" :disabled="clientOrder.members <= 1" class="rounded-none"/>
                                        <span class="font-black text-base text-secondary dark:text-white w-8 text-center">{{ clientOrder.members }}</span>
                                        <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-plus" @click="incrementAdults" :disabled="hasRooms && clientOrder.members >= currentMaxAdults" class="rounded-none"/>
                                        <span v-if="hasRooms" class="text-xs text-gray-400 font-medium pl-1">/ {{ currentMaxAdults }} max</span>
                                    </div>

                                    <!-- If Locked (1, 2, 3 places) -->
                                    <div v-else class="flex items-center gap-2 bg-gray-100 dark:bg-slate-700/60 px-3 py-1.5 border border-gray-200 dark:border-slate-600 rounded-none text-xs font-bold text-secondary dark:text-gray-200">
                                        <UIcon name="i-heroicons-lock-closed" class="w-3.5 h-3.5 text-primary"/>
                                        <span>{{ clientOrder.members }} Place{{ clientOrder.members > 1 ? 's' : '' }} (Verrouillé)</span>
                                    </div>
                                </div>
                            </li>

                            <!-- 2. Enfants (2-12 ans) -->
                            <li v-if="hasRooms" class="p-4 border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div class="flex items-start gap-3">
                                    <div class="w-10 h-10 rounded-none bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <UIcon name="i-heroicons-user-group" class="w-5 h-5"/>
                                    </div>
                                    <div class="space-y-1">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="font-bold text-secondary dark:text-white text-base">Enfants</span>
                                            <UBadge size="xs" color="emerald" variant="subtle" class="font-bold">2 à 12 ans</UBadge>
                                            <span v-if="currentMaxChildren <= 0" class="text-[11px] text-gray-400 italic">Non autorisé dans cette chambre</span>
                                        </div>
                                        <div class="text-xs text-gray-500 font-medium">
                                            {{ unitChildPrice > 0 ? `${formatPrice(unitChildPrice)} DZD / enfant` : 'Tarif non défini' }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Stepper -->
                                <div class="flex items-center justify-end sm:justify-center gap-2 flex-shrink-0">
                                    <div class="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-none shadow-sm" :class="{ 'opacity-50 pointer-events-none': currentMaxChildren <= 0 }">
                                        <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-minus" @click="decrementChildren" :disabled="clientOrder.children_count <= 0 || currentMaxChildren <= 0" class="rounded-none"/>
                                        <span class="font-black text-base text-secondary dark:text-white w-8 text-center">{{ clientOrder.children_count }}</span>
                                        <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-plus" @click="incrementChildren" :disabled="clientOrder.children_count >= currentMaxChildren || currentMaxChildren <= 0" class="rounded-none"/>
                                        <span class="text-xs text-gray-400 font-medium pl-1">/ {{ currentMaxChildren }} max</span>
                                    </div>
                                </div>
                            </li>

                            <!-- 3. Bébés (0-2 ans) -->
                            <li v-if="hasRooms" class="p-4 border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div class="flex items-start gap-3">
                                    <div class="w-10 h-10 rounded-none bg-sky-500/10 text-sky-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <UIcon name="i-heroicons-heart" class="w-5 h-5"/>
                                    </div>
                                    <div class="space-y-1">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="font-bold text-secondary dark:text-white text-base">Bébés</span>
                                            <UBadge size="xs" color="info" variant="subtle" class="font-bold">0 à 2 ans</UBadge>
                                            <span v-if="currentMaxBabies <= 0" class="text-[11px] text-gray-400 italic">Non autorisé dans cette chambre</span>
                                        </div>
                                        <div class="text-xs text-gray-500 font-medium">
                                            {{ unitBabyPrice > 0 ? `${formatPrice(unitBabyPrice)} DZD / bébé` : 'Tarif non défini' }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Stepper -->
                                <div class="flex items-center justify-end sm:justify-center gap-2 flex-shrink-0">
                                    <div class="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-none shadow-sm" :class="{ 'opacity-50 pointer-events-none': currentMaxBabies <= 0 }">
                                        <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-minus" @click="decrementBabies" :disabled="clientOrder.babies_count <= 0 || currentMaxBabies <= 0" class="rounded-none"/>
                                        <span class="font-black text-base text-secondary dark:text-white w-8 text-center">{{ clientOrder.babies_count }}</span>
                                        <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-plus" @click="incrementBabies" :disabled="clientOrder.babies_count >= currentMaxBabies || currentMaxBabies <= 0" class="rounded-none"/>
                                        <span class="text-xs text-gray-400 font-medium pl-1">/ {{ currentMaxBabies }} max</span>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <!-- Documents Required Info -->
                        <div class="flex flex-col gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                            <div class="font-bold text-secondary text-sm flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <UIcon name="i-heroicons-document-text" class="text-primary w-4 h-4"/>
                                    <span>Documents requis par passager ({{ totalTravelersWithDocs }} voyageur{{ totalTravelersWithDocs > 1 ? 's' : '' }})</span>
                                </div>
                                <UBadge size="xs" color="primary" variant="subtle" class="font-bold">
                                    {{ maxFiles }} fichier{{ maxFiles > 1 ? 's' : '' }} au total
                                </UBadge>
                            </div>

                            <div v-if="offer?.documents && offer.documents.length > 0" class="bg-gray-50 dark:bg-slate-800 rounded-none p-4 border border-gray-100 dark:border-slate-700">
                                <ul class="flex flex-col gap-2 list-inside">
                                    <li class="flex gap-3 items-center text-secondary font-medium text-sm" v-for="(document, index) in offer?.documents" :key="index">
                                        <UIcon name="i-heroicons-check-circle" class="text-green-500 w-4 h-4"/>
                                        {{ document?.name || document }}
                                    </li>
                                </ul>
                            </div>
                            <div v-else class="text-xs text-gray-400 italic p-3 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                                Aucun document particulier n'est requis pour cette offre.
                            </div>
                        </div>

                        <!-- File Upload Box -->
                        <div v-if="maxFiles > 0" class="flex flex-col gap-2">
                            <div @click.prevent="handleUploadClick" class="relative flex flex-col gap-4 items-center justify-center cursor-pointer w-full h-40 bg-gray-50 dark:bg-slate-800 hover:bg-primary/5 dark:hover:bg-primary/10 border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-primary dark:hover:border-primary rounded-none transition-all duration-300 group">
                                <div class="w-14 h-14 rounded-none bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <UIcon name="i-mynaui-upload-solid" size="28" class="text-primary"/>
                                </div>
                                <div v-if="!clientOrder.file.length" class="text-secondary font-semibold text-center px-4 text-sm">
                                    Cliquez pour ajouter les <span class="text-primary">fichiers requis</span> ({{ maxFiles }} au total)
                                </div>
                                <div v-else class="flex flex-col items-center gap-1">
                                    <div class="text-xl font-extrabold text-primary">
                                        {{ clientOrder.file.length }} <span class="text-gray-400 text-sm">/ {{ maxFiles }}</span>
                                    </div>
                                    <div class="text-xs font-medium text-gray-500">Fichiers sélectionnés (Cliquez pour en ajouter d'autres)</div>
                                </div>
                            </div>
                            <input type="file" ref="fileInput" @change="onFileChange" class="hidden" :multiple="maxFiles > 1" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.zip,.rar"/>

                            <!-- Removable Files List Chips -->
                            <div v-if="clientOrder.file.length > 0" class="flex flex-wrap gap-2 pt-2">
                                <div v-for="(file, fIdx) in clientOrder.file" :key="fIdx" class="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-secondary dark:text-gray-200 flex items-center gap-2 rounded-none">
                                    <UIcon name="i-heroicons-document" class="w-4 h-4 text-primary flex-shrink-0"/>
                                    <span class="truncate max-w-[180px]">{{ file.name }}</span>
                                    <button type="button" @click.stop="removeFile(fIdx)" class="text-gray-400 hover:text-red-500 transition-colors p-0.5" title="Supprimer ce fichier">
                                        <UIcon name="i-heroicons-x-mark" class="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Payment Method Selector -->
                    <div class="bg-white dark:bg-slate-900 p-6 rounded-none border border-gray-100 dark:border-slate-800 shadow-sm">
                        <PaymentMethodSelector v-model="clientOrder.payment_method" :disableCredit="disableCredit" :showCredit="isBusiness" />
                    </div>

                    <!-- Submission Button -->
                    <div class="flex flex-col gap-2 w-full pt-4 border-t border-gray-100 dark:border-slate-800">
                        <div v-if="loading" class="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mb-2">
                            <div class="bg-primary h-1.5 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
                        </div>
                        <div class="flex flex-col sm:flex-row justify-start gap-4">
                            <UButton :loading="loading" loading-icon="i-lucide-loader-circle" @click="submitOrder" class="font-bold text-lg px-8 py-3 rounded-none shadow-md hover:shadow-lg transition-all" color="primary" :label="loadingText">
                                <template #trailing>
                                    <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5 ml-2" v-if="!loading" />
                                </template>
                            </UButton>
                            <UButton @click="reset" variant="soft" color="gray" class="font-bold px-6 py-3 rounded-none" label="Réinitialiser" :disabled="loading"/>
                        </div>
                    </div>
                </div>
            </div>
            
            <div v-else class="flex flex-col items-center justify-center h-[70vh] gap-6 text-center">
                <UIcon name="i-heroicons-check-circle" class="w-24 h-24 text-green-500" />
                <h2 class="text-3xl font-bold text-primary">Commande Confirmée</h2>
                <p class="text-xl text-gray-700 dark:text-gray-300 max-w-2xl">
                    Votre commande a été créée avec succès. Veuillez vous rendre à notre agence pour effectuer le paiement en espèces et valider votre réservation.
                </p>
                <div class="bg-gray-50 dark:bg-slate-800 p-8 rounded-xl border border-gray-200 dark:border-slate-700 flex flex-col items-center gap-4 mt-4">
                    <UIcon name="i-heroicons-map-pin" class="w-12 h-12 text-primary" />
                    <span class="font-bold text-2xl">Bouazize Travel</span>
                    <span class="text-lg text-gray-600 dark:text-gray-400">
                        123 Rue de l'Agence, Alger, Algérie
                    </span>
                </div>
                <UButton @click="closeCashModal" color="primary" class="font-bold px-12 py-4 text-lg mt-8 rounded-none shadow-lg" label="Compris, fermer" />
            </div>
        </template>
    </UModal>
</template>

<script setup>
import { useAuthStore } from '#imports'
import PaymentMethodSelector from '~/components/payment/PaymentMethodSelector.vue'
import { useRouter } from 'vue-router'
import { computed, ref, watch, onMounted } from 'vue'

const router = useRouter()
const props = defineProps({
    id: {
        type: [String, Number],
        required: true
    },
    service: {
        type: String,
        default: 'visa'
    },
    selectedDate: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['close'])
const toast = useToast()
const loading = ref(false)
const loadingText = ref('Confirmer la réservation')
const uploadProgress = ref(0)
const offer = ref({})
const selectedRoomIndex = ref(0)

const clientOrder = ref({
    members: 1,
    babies_count: 0,
    children_count: 0,
    file: [],
    payment_method: 'ccp'
})

const openCashModal = ref(false)
const authStore = useAuthStore()
const role = computed(() => authStore.User?.role)
const isBusiness = computed(() => ['business', 'Business', 'Entreprise', 'entreprise'].includes(role.value))
const authorization = authStore.Authorization

const formatPrice = (val) => {
    const num = Number(val) || 0
    return num.toLocaleString('fr-FR')
}

const availableRooms = computed(() => {
    if (offer.value?.rooms && Array.isArray(offer.value.rooms) && offer.value.rooms.length > 0) {
        return offer.value.rooms
    }
    return []
})

const hasRooms = computed(() => {
    return (props.service === 'omra' || props.service === 'voyage_organise') && availableRooms.value.length > 0
})

const selectedRoom = computed(() => {
    if (hasRooms.value && availableRooms.value[selectedRoomIndex.value]) {
        return availableRooms.value[selectedRoomIndex.value]
    }
    return null
})

const getRoomAdultPrice = (room) => {
    if (!room) return offer.value?.price || 0
    if (isBusiness.value && room.b2b_price) {
        return Number(room.b2b_price)
    }
    return Number(room.b2c_price || room.purchase_price || offer.value?.price || 0)
}

const unitAdultPrice = computed(() => {
    if (selectedRoom.value) {
        return getRoomAdultPrice(selectedRoom.value)
    }
    return Number(offer.value?.price || 0)
})

const unitChildPrice = computed(() => {
    if (selectedRoom.value && selectedRoom.value.child_price) {
        return Number(selectedRoom.value.child_price)
    }
    return 0
})

const unitBabyPrice = computed(() => {
    if (selectedRoom.value && selectedRoom.value.baby_price) {
        return Number(selectedRoom.value.baby_price)
    }
    return 0
})

const currentMaxAdults = computed(() => {
    if (selectedRoom.value) {
        return Number(selectedRoom.value.capacity || selectedRoom.value.type || 10)
    }
    return 50
})

const currentMaxChildren = computed(() => {
    if (selectedRoom.value && selectedRoom.value.max_children !== undefined) {
        return Number(selectedRoom.value.max_children)
    }
    return 4
})

const currentMaxBabies = computed(() => {
    if (selectedRoom.value && selectedRoom.value.max_babies !== undefined) {
        return Number(selectedRoom.value.max_babies)
    }
    return 2
})

const isAdultsCustomizable = computed(() => {
    if (!hasRooms.value || !selectedRoom.value) return true; // for visa or generic services
    const cap = Number(selectedRoom.value.capacity || selectedRoom.value.type || 1);
    // 1, 2, 3 places rooms have strictly FIXED adult count (1, 2 or 3)
    if (cap <= 3) return false;
    // 4 and 5 places rooms: check allow_custom_adults
    return Boolean(selectedRoom.value.allow_custom_adults !== false);
})

const totalPassengers = computed(() => {
    return (Number(clientOrder.value.members) || 0) + (Number(clientOrder.value.children_count) || 0) + (Number(clientOrder.value.babies_count) || 0);
})

const selectRoom = (index) => {
    selectedRoomIndex.value = index
    const room = availableRooms.value[index]
    if (room) {
        const cap = Number(room.capacity || room.type || 1)
        if (cap <= 3) {
            clientOrder.value.members = cap
        } else {
            if (room.allow_custom_adults !== false) {
                clientOrder.value.members = Math.min(Math.max(clientOrder.value.members, 1), cap)
            } else {
                clientOrder.value.members = cap
            }
        }
        if (clientOrder.value.children_count > currentMaxChildren.value) {
            clientOrder.value.children_count = currentMaxChildren.value
        }
        if (clientOrder.value.babies_count > currentMaxBabies.value) {
            clientOrder.value.babies_count = currentMaxBabies.value
        }
    }
}

const incrementAdults = () => {
    if (clientOrder.value.members < currentMaxAdults.value) {
        clientOrder.value.members++
    }
}

const decrementAdults = () => {
    if (clientOrder.value.members > 1) {
        clientOrder.value.members--
    }
}

const incrementChildren = () => {
    if (clientOrder.value.children_count < currentMaxChildren.value) {
        clientOrder.value.children_count++
    }
}

const decrementChildren = () => {
    if (clientOrder.value.children_count > 0) {
        clientOrder.value.children_count--
    }
}

const incrementBabies = () => {
    if (clientOrder.value.babies_count < currentMaxBabies.value) {
        clientOrder.value.babies_count++
    }
}

const decrementBabies = () => {
    if (clientOrder.value.babies_count > 0) {
        clientOrder.value.babies_count--
    }
}

const totalAdultsPrice = computed(() => {
    return unitAdultPrice.value * (clientOrder.value.members || 1)
})

const totalChildrenPrice = computed(() => {
    return unitChildPrice.value * (clientOrder.value.children_count || 0)
})

const totalBabiesPrice = computed(() => {
    return unitBabyPrice.value * (clientOrder.value.babies_count || 0)
})

const grandTotalPrice = computed(() => {
    return totalAdultsPrice.value + totalChildrenPrice.value + totalBabiesPrice.value
})

const totalTravelersWithDocs = computed(() => {
    return (clientOrder.value.members || 1) + (clientOrder.value.children_count || 0)
})

const maxFiles = computed(() => {
    const docsCount = offer.value?.documents?.length || 0
    return docsCount * totalTravelersWithDocs.value
})

const disableCredit = computed(() => {
    if (!isBusiness.value) return false;
    const balanceInfo = authStore.User?.balance;
    if (!balanceInfo) return true;
    
    const available = (balanceInfo.balance || 0) - (balanceInfo.debts || 0);
    return available < grandTotalPrice.value;
});

watch(disableCredit, (newVal) => {
    if (newVal && clientOrder.value.payment_method === 'credit') {
        clientOrder.value.payment_method = 'ccp';
    }
});

const closeCashModal = () => {
    openCashModal.value = false
    router.push('/client/orders')
}

const guaranteeValue = (value)=>{
    const guarantee = {
        with:"Avec garantie de retour",
        without:"Sans garantie de retour",
        half:"Demi garantie"
    }[value]
    return guarantee || "Standard"
}

const guaranteeColor = (value)=>{
    const color = {
        with:"success",
        without:"error",
        half:"primary"
    }[value]
    return color || "primary"
}

onMounted(()=>{
    getOffer()
})

const fileInput = ref(null)

const removeFile = (idx) => {
    clientOrder.value.file.splice(idx, 1)
}

const handleUploadClick = () => {
    if (!authorization?.token) {
        toast.add({ title: "Vous devez vous connecter pour réserver", color: 'red' })
        emit('close')
        navigateTo('/auth/login')
        return
    }
    if (fileInput.value) {
        fileInput.value.click()
    }
}

const onFileChange = (event)=> {
    const files = event.target.files;
    if (files && files.length > 0) {
        let remaining = maxFiles.value - clientOrder.value.file.length
        
        for(let i=0; i < files.length; i++){
            if (files[i].size > 10 * 1024 * 1024) {
                toast.add({
                    title: `Le fichier ${files[i].name} est trop volumineux (Max 10MB).`,
                    color: 'orange'
                })
                continue
            }

            if (remaining > 0) {
                clientOrder.value.file.push(files[i])
                remaining--
            } else {
                toast.add({
                    title: `Limite atteinte: ${maxFiles.value} fichier(s) requis maximum.`,
                    color: 'orange'
                })
                break
            }
        }
    }
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const reset = ()=>{
    clientOrder.value.members = selectedRoom.value ? Number(selectedRoom.value.capacity || 1) : 1
    clientOrder.value.children_count = 0
    clientOrder.value.babies_count = 0
    clientOrder.value.file = []
}

const getOffer = async()=>{
    const endpoint = authorization?.token ? `/client/${props.service}` : `/${props.service}`
    sendApi(`${endpoint}/offers/${props.id}`, null, 'GET').then(response=>{
        offer.value = response.data
        if (hasRooms.value) {
            selectRoom(0)
        }
    })
}

const submitOrder = async ()=>{
    if (!authorization?.token) {
        toast.add({
            title: "Vous devez vous connecter pour réserver", 
            color: 'red',
        })
        emit('close')
        return navigateTo('/auth/login')
    }

    if(clientOrder.value.file.length === maxFiles.value){
        loading.value = true
        uploadProgress.value = 0
        loadingText.value = 'Envoi des fichiers (0%)...'
        const formData = new FormData()
        formData.append('members', clientOrder.value.members)
        formData.append('payment_method', clientOrder.value.payment_method)
        
        if (hasRooms.value && selectedRoom.value) {
            formData.append('room_id', selectedRoom.value.id || selectedRoomIndex.value)
            formData.append('room_type', selectedRoom.value.name || selectedRoom.value.type)
            formData.append('babies_count', clientOrder.value.babies_count || 0)
            formData.append('children_count', clientOrder.value.children_count || 0)
        }

        clientOrder.value.file.forEach(file=>{
            formData.append('file[]', file)
        })
        
        const configOpts = {
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                uploadProgress.value = percentCompleted;
                if (percentCompleted < 100) {
                    loadingText.value = `Envoi des fichiers (${percentCompleted}%)...`;
                } else {
                    loadingText.value = 'Traitement en cours (Veuillez patienter)...';
                }
            }
        }
        
        const url = isBusiness.value ? 'business/order': 'individual/order'
        sendApi(`/client/${props.service}/offers/${props.id}/${url}`, formData, 'POST', configOpts).then((response)=>{
            if (response) {
                const orderId = response.data?.order_id
                const amount = grandTotalPrice.value
                
                if (orderId) {
                    sendApi(`/client/${props.service}/orders/${orderId}/sync`, null, 'POST').catch(()=>{});
                }
                
                reset()
                emit('close')
                
                if (clientOrder.value.payment_method === 'ccp') {
                    router.push(`/payment/confirm?order_id=${orderId}&type=${props.service}&amount=${amount}`)
                } else if (clientOrder.value.payment_method === 'cash') {
                    openCashModal.value = true
                } else {
                    toast.add({ title: "Commande créée avec succès (Crédit/Facture)", color: 'green' })
                    router.push('/client/orders')
                }
            }
            loading.value = false
            loadingText.value = 'Confirmer la réservation'
        }).catch(() => {
            loading.value = false
            loadingText.value = 'Confirmer la réservation'
        })
    }else{
        toast.add({
            title:"Veuillez télécharger tous les fichiers requis", 
            color:'',
            progress:false,
            close:false,
            ui:{root:'bg-error',title:'text-white', close:'neutral'}
        })
    }
}
</script>  
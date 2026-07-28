<template>
    <UModal fullscreen class="flex items-center" title="Facture">
        <template class="w-full" #header>
            <div class="flex gap-2">
                <UButton label="Télécharger" @click="showValue"/>
                <UButton color="error" variant="outline" label="Annuler" @click="emit('close', false)"/>
            </div>
        </template>
        <template #body>
            <div ref="pdfContent" class="pdf-content w-3xl flex flex-col gap-10 bg-white text-slate-900 p-8 shadow-md rounded-none mx-auto" id="pdf">
                <div class="flex flex-col gap-5">
                    <div class="flex flex-col gap-1 items-start">
                        <div class="w-full flex justify-between items-center">
                            <img src="/images/logo/logo-new.png" width="120"/>
                            <div class="text-slate-900">relever de compte</div>
                        </div>
                        <p class="text-slate-900">Bouazize Travel</p>
                        <div class="text-slate-800">
                            cité 35 lodts dradra el hidab bt n°1 local n° 1
                            19000 Setif
                        </div>
                        <div class="font-bold text-slate-900">Tél : <span class="font-normal text-slate-800">0770202084</span></div>
                        <div class="font-bold text-slate-900">Email : <span class="font-normal text-slate-800">bouazizetravel@gmail.com</span></div>
                        <div class="font-bold text-slate-900">Site Web : <span class="font-normal text-slate-800">bouazize-travel.com</span></div>
                    </div>
                    <div class="flex flex-col items-end text-slate-900">
                        <p class="text-slate-900 font-bold">{{ user?.name }}</p>
                        <div>
                            {{ user?.address?.wilaya?.name }}
                        </div>
                        <div>{{ user?.address?.postal_code }} {{ user?.address?.daira?.name }}</div>
                        <div class="font-bold">Tél : <span class="font-normal">{{ user?.phone }}</span></div>
                        <div class="font-bold">Email : <span class="font-normal">{{ user?.email }}</span></div>
                    </div>
                    <div class="flex justify-start gap-5 w-sm h-10 border-1 invoice-date">
                        <div class="flex justify-center w-1/2 invoice-date-label">date de facture</div>
                        <div class="flex justify-center w-1/2 items-center text-slate-900 font-semibold">
                            <NuxtTime :datetime="transactions?.date" locale="fr-FR" year="numeric" month="numeric" day="numeric"/>
                        </div>
                    </div>
                </div>
                <div class="relative overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="text-xs uppercase invoice-table-header">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Description
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Prix Unitaire
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Prix Total
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Montant Payé
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Dettes
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(transaction, index) in transactions" :key="index" class="border-b invoice-table-body">
                                <th scope="row" class="px-6 py-4 text-left font-medium whitespace-nowrap text-slate-900">
                                    {{ transaction?.description }}
                                </th>
                                <td class="px-6 py-4 text-slate-900">
                                    {{ transaction?.unit_price }}
                                </td>
                                <td class="px-6 py-4 text-slate-900">
                                    {{ transaction?.total_price }}
                                </td>
                                <td class="px-6 py-4 text-slate-900">
                                    {{ transaction?.amount_paid }}
                                </td>
                                <td class="px-6 py-4 text-slate-900">
                                    {{ transaction?.debts.toFixed(2) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex justify-between items-end gap-3 text-slate-900">
                    <div>
                        <div class="font-bold">{{ bank?.name }}</div>
                        <div>{{ bank?.type?.toUpperCase() }}</div>
                        <div>ADRESSE {{ bank?.address }}</div>
                        <div>{{ bank?.type?.toUpperCase() }} {{ bank?.account_number }} {{ bank?.key }}</div>
                        <div class="font-bold">RIB</div>
                        <div>{{ bank?.rib }}</div>
                    </div>
                    <div class="w-1/4 flex justify-start gap-5 w-sm h-10 border-1 invoice-total">
                        <div class="flex justify-center w-1/2 invoice-total-label">Total HT</div>
                        <div class="flex justify-end w-full px-2 items-center text-slate-900 font-bold">{{ totalHT.toFixed(2) }} DZD</div>
                    </div>
                </div>
                <div class="flex justify-center invoice-delay text-slate-600">
                    En cas de retard, une pénalité au taux annuel de 5 % sera appliquée, à laquelle s’ajoutera une indemnité forfaitaire pour frais de recouvrement de 40 €
                    TVA non applicable, art. 293B du CGI
                </div>
            </div>
        </template>
    </UModal>
</template>

<script setup>
import { UButton } from '#components';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const {id, transactions: initialTransactions} = defineProps(['id', 'transactions'])
const bank = ref({})
const user = ref({})
const transactions = ref(initialTransactions || [])
const totalHT = ref(0)
const pdfContent = ref(null)
const emit = defineEmits(['close'])

const showValue = async ()=>{
    if (pdfContent.value) {
        const canvas = await html2canvas(pdfContent.value, {
            scale: 2,
            useCORS: true,
        });
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'a4',
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const marginX = 20;
        const marginY = 20;

        const imgWidth = pdfWidth - marginX * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', marginX, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - marginY * 2);

        while (heightLeft > 0) {
            pdf.addPage();
            position -= pdfHeight;
            pdf.addImage(imgData, 'JPEG', marginX, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - marginY * 2);
        }

        pdf.save("facture.pdf");
        emit('close', true);
    }
}

onMounted(()=>{
    getBank()
    getUser()
    if (transactions.value.length) {
        transactions.value.forEach(transaction => {
            totalHT.value += transaction.debts
        });
    }
})

const getBank = async()=>{
    sendApi('/banks/active',null,'GET').then(response=>{
        console.log(response)
        bank.value = response.data
    }).catch(e => {
        bank.value = {}
    })
}

const getUser = async()=>{
    sendApi(`/admin/users/${id}`,null,'GET').then(response=>{
        console.log(response)
        user.value = response.data
    })
}
</script>

<style scoped>
.pdf-content {
  color: #333333 !important;
  background-color: #ffffff !important;
  padding: 50px 20px;
}
.invoice-date {
  border-color: rgb(155, 153, 153) !important;
}
.invoice-date-label {
  color: #ffffff !important;
  background-color: #333333 !important;
  border-color: rgb(155, 153, 153) !important;
}
.invoice-table-header {
  color: #ffffff !important;
  background-color: #333333 !important;
}
.invoice-table-body {
  background-color: #ffffff !important;
  border-color: rgb(155, 153, 153) !important;
}
.invoice-total {
  border-color: rgb(155, 153, 153) !important;
}
.invoice-total-label {
  color: #ffffff !important;
  background-color: #333333 !important;
}
.invoice-delay {
  color: #333333 !important;
  opacity: 0.7;
}
</style>
<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto space-y-8">

      <!-- Breadcrumb & Back -->
      <div class="flex items-center justify-between">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
        >
          <Icon name="heroicons:arrow-left" class="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </NuxtLink>
        <span class="text-xs text-slate-400">Dernière mise à jour : Octobre 2026</span>
      </div>

      <!-- Official Document Header -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-2">
              Document Officiel Certifié
            </span>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Conditions Générales de Vente et de Paiement Électronique
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Régissant les réservations en ligne et les paiements par Cartes CIB / EDAHABIA via la plateforme SATIM
            </p>
          </div>
          <!-- Stamp / Legal Entity Info Box -->
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1 sm:min-w-[260px]">
            <p class="font-black text-slate-900 dark:text-white uppercase tracking-wider">SARL BOUAZIZE TRAVEL</p>
            <p class="text-slate-500 dark:text-slate-300">Agrément Tourisme N° : <strong>4484</strong></p>
            <p class="text-slate-500 dark:text-slate-300">RC N° : <strong>19/00-5345775 A 23</strong></p>
            <p class="text-slate-500 dark:text-slate-300">Gérant : <strong>M. Bouazize Youcef</strong></p>
            <p class="text-slate-500 dark:text-slate-300 text-[11px]">Sétif, Algérie</p>
          </div>
        </div>

        <!-- Document Content -->
        <div class="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-6">

          <!-- Section 1 -->
          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <span class="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
              <span>Identification de l'Agence et Cadre Légal</span>
            </h2>
            <p>
              Le présent document définit les conditions générales applicables aux prestations de services touristiques et de voyages commercialisées sur le site web officiel de l'agence <strong>BOUAZIZE TRAVEL</strong>, Société à Responsabilité Limitée (SARL), titulaire de l'Agrément d'Agence de Tourisme et de Voyages N° <strong>4484</strong> délivré par le Ministère du Tourisme et de l'Artisanat, immatriculée au Registre du Commerce sous le N° <strong>19/00-5345775 A 23</strong>, dont le siège social est situé à <em>Cité Elhidhab 35 Logements Draâ, Bâtiment 1, Local 9, Sétif, Algérie</em>, représentée par son Gérant, <strong>M. Bouazize Youcef</strong>.
            </p>
            <p>
              Les opérations de vente en ligne et de paiement électronique sont régies par la <strong>Loi n° 18-05 du 10 mai 2018 relative au commerce électronique</strong> en République Algérienne Démocratique et Populaire ainsi que par les règlements du <strong>GIE Monétique</strong> et de la <strong>SATIM</strong>.
            </p>
          </div>

          <!-- Section 2 -->
          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <span class="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
              <span>Services Proposés et Réservations</span>
            </h2>
            <p>
              L'agence Bouazize Travel propose aux particuliers et aux professionnels la réservation en ligne de prestations touristiques, notamment :
            </p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Séjours et réservations hôtelières en Algérie et à l'international (agrégateurs certifiés et confirmation instantanée).</li>
              <li>Formules et programmes Omra (Hébergement, transferts, visas et encadrement).</li>
              <li>Circuits et voyages organisés (Vols, hôtels, excursions).</li>
              <li>Assistance et traitement des demandes de visas touristiques et d'affaires.</li>
            </ul>
            <p>
              La commande n'est définitivement confirmée qu'après validation effective du règlement par le système bancaire ou réception du justificatif de virement.
            </p>
          </div>

          <!-- Section 3 -->
          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <span class="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
              <span>Paiement Électronique Sécurisé (SATIM / CIB / EDAHABIA)</span>
            </h2>
            <p>
              Le paiement par carte bancaire s'effectue via la passerelle monétique nationale <strong>SATIM-EPG (Société d'Automatisation des Télécompensations et de Monétique)</strong> sous la tutelle du <strong>GIE Monétique</strong>.
            </p>
            <ul class="list-disc pl-5 space-y-1">
              <li><strong>Cartes acceptées :</strong> Toutes les cartes interbancaires algériennes <strong>CIB</strong> dotées de la fonction de paiement en ligne, ainsi que la carte <strong>EDAHABIA</strong> d'Algérie Poste.</li>
              <li><strong>Sécurité 3D-Secure :</strong> Toute transaction en ligne est obligatoirement soumise au protocole de double authentification 3D-Secure 2.0, requérant la saisie d'un code confidentiel à usage unique (OTP) transmis par SMS par la banque de l'acheteur.</li>
              <li><strong>Protection stricte des données bancaires :</strong> En conformité absolue avec la législation algérienne et les normes PCI-DSS, <strong>l'agence Bouazize Travel ne collecte, ne visualise, ne traite et ne conserve aucune information relative à votre carte bancaire</strong> (numéro à 16 chiffres, date de validité, cryptogramme CVV2 ou code OTP). La saisie est intégralement déportée sur le serveur bancaire crypté et sécurisé de la SATIM (test2.satim.dz / satim.dz).</li>
            </ul>
          </div>

          <!-- Section 4 -->
          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <span class="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">4</span>
              <span>Tarification, Devise et Reçu Officiel</span>
            </h2>
            <p>
              Tous les tarifs affichés sur le site web sont libellés en <strong>Dinar Algérien (DZD)</strong> et s'entendent toutes taxes comprises (TTC). Aucun frais de dossier supplémentaire ni commission occulte n'est facturé au client lors du paiement électronique.
            </p>
            <p>
              Dès validation de la transaction par le centre d'autorisation monétique SATIM, un <strong>reçu électronique officiel</strong> conforme aux spécifications de la SATIM est affiché immédiatement sur l'écran du client comportant :
            </p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Le numéro d'autorisation bancaire (Approval Code).</li>
              <li>L'identifiant unique de transaction SATIM (OrderId) et la référence commande (OrderNumber).</li>
              <li>La date et l'heure précises de l'opération.</li>
              <li>Le montant débité en DZD.</li>
              <li>La mention du type de carte (carte CIB/EDAHABIA).</li>
            </ul>
            <p>
              Le client a la possibilité d'imprimer immédiatement ce reçu, de le télécharger sous format PDF ou de le recevoir sur son adresse électronique.
            </p>
          </div>

          <!-- Section 5 -->
          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <span class="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">5</span>
              <span>Politique d'Annulation et Remboursement</span>
            </h2>
            <p>
              Toute demande d'annulation ou de modification de réservation est soumise aux conditions tarifaires propres à chaque prestation réservée (politique d'annulation de l'hôtel, conditions des compagnies aériennes ou barème Omra).
            </p>
            <p>
              Lorsque l'annulation ouvre droit à un remboursement total ou partiel conformément aux conditions applicables, le remboursement est ordonné par Bouazize Travel auprès de la SATIM et exécuté par <strong>re-crédit direct sur le compte bancaire de la carte CIB / EDAHABIA</strong> ayant servi au paiement initial.
            </p>
          </div>

          <!-- Section 6 -->
          <div>
            <h2 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <span class="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">6</span>
              <span>Service Clientèle et Réclamations Monétiques</span>
            </h2>
            <p>
              Pour toute question relative à votre réservation ou à l'exécution de nos prestations :
            </p>
            <ul class="list-disc pl-5 space-y-1">
              <li><strong>Agence Bouazize Travel :</strong> Cité Elhidhab 35 Logts Draâ Bt 1 Loc 9, Sétif. Téléphone : +213 (0) 36 00 00 00 • Email : contact@bouazizetravel.com</li>
              <li><strong>Assistance Technique Monétique SATIM :</strong> En cas de rejet de transaction, de litige monétique ou de dysfonctionnement de carte bancaire, les porteurs de cartes peuvent joindre gratuitement le centre d'assistance de la SATIM via le <strong>Numéro Vert : 3020</strong>.</li>
            </ul>
          </div>

        </div>

        <!-- Bottom Action -->
        <div class="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            @click="printDocument"
            class="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-2"
          >
            <Icon name="heroicons:printer" class="w-4 h-4" />
            <span>Imprimer ce document</span>
          </button>

          <NuxtLink
            to="/"
            class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-wider transition-colors"
          >
            Retour au site
          </NuxtLink>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Conditions Générales de Vente et de Paiement - Bouazize Travel',
  meta: [
    {
      name: 'description',
      content: "Conditions générales de vente et de paiement électronique sécurisé CIB / EDAHABIA - SATIM de l'agence Bouazize Travel (Sétif, Algérie).",
    },
  ],
});

const printDocument = () => {
  if (process.client) {
    window.print();
  }
};
</script>

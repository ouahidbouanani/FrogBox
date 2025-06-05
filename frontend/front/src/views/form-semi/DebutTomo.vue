<template>
    <Layout>
        <div class="container bg-white p-4 rounded shadow mt-4">
            <!--button retour-->
            <div class="d-flex justify-content-start mb-3">
                <button class="btn btn-outline-success" @click="goBack">
                    ← Retour
                </button>
            </div>
            <h4 class="text-primary mb-4">Formulaire - Début Tomographie</h4>

            <form @submit.prevent="submitForm">
                <!-- Numéro de lot (select dynamique) -->
                <div class="mb-3">
                    <label class="form-label">Numéro de lot</label>
                    <select class="form-select" v-model="form.numero_lot" required>
                        <option disabled value=""> Sélectionner </option>
                        <option v-for="lot in lots" :key="lot.id_lot" :value="lot.id_lot">{{ lot.id_lot }}</option>
                    </select>
                </div>

                <!-- Nombre de pièces -->
                <div class="mb-3">
                    <label class="form-label">Nombre de pièces</label>
                    <input type="number" class="form-control" v-model="form.nb_pieces" required min="1" />
                </div>

                <!-- Étage -->
                <div class="mb-3">
                    <label class="form-label">Étage</label>
                    <select class="form-select" v-model="form.etage" required>
                        <option disabled value=""> Sélectionner</option>
                        <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                    </select>
                </div>

                <!-- Date -->
                <div class="mb-3">
                    <label class="form-label">Date</label>
                    <input type="date" class="form-control" v-model="form.date" required />
                </div>

                <!-- Heure début -->
                <div class="mb-3">
                    <label class="form-label">Heure début</label>
                    <input type="time" class="form-control" v-model="form.heure_debut" required />
                </div>

                <!-- Opérateur -->
                <div class="mb-3">
                      <label class="form-label">Opérateur</label>
                      <input type="text" class="form-control" v-model="form.operateur" readonly>
                </div>

                <!-- Numéro de machine (readonly) -->
                <div class="mb-3">
                    <label class="form-label">Numéro de machine</label>
                    <input type="text" class="form-control" v-model="form.num_machine" readonly />
                </div>

                <!-- Version -->
                <div class="mb-3">
                    <label class="form-label">Version</label>
                    <select class="form-select" v-model="form.version" required>
                        <option disabled value="">-- Sélectionner --</option>
                        <option value="V2023">V2023</option>
                        <option value="V2025">V2025</option>
                    </select>
                </div>

                <!-- Séparation -->
                <div class="mb-3">
                    <label class="form-label">Séparation</label>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" id="manuel" value="Manuel"
                            v-model="form.separation" />
                        <label class="form-check-label" for="manuel">Manuel</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" id="script" value="Script"
                            v-model="form.separation" />
                        <label class="form-check-label" for="script">Script</label>
                    </div>
                </div>

                <!-- Commentaire -->
                <div class="mb-3">
                    <label class="form-label">Commentaire</label>
                    <textarea class="form-control" rows="2" v-model="form.commentaire"
                        placeholder="Ajouter un commentaire..."></textarea>
                </div>

                <!-- Boutons -->
                <div class="text-center">
                    <button class="btn btn-success me-2" type="submit">Enregistrer</button>
                    <button class="btn btn-secondary" type="button" @click="resetForm">Réinitialiser</button>
                </div>
            </form>
        </div>
    </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import Layout from "@/components/layouts/layout.vue";
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Utilisation du store
const authStore = useAuthStore()

const router = useRouter()

function goBack() {
    router.back()
}

// Liste des opérateurs dispo
const operateurs = ['TLA', 'MPE', 'MGA', 'VGR', 'EPE', 'CME']

// Pour stocker la liste des lots 
const lots = ref([])

// Formulaire réactif
const form = reactive({
    numero_lot: '',          
    nb_pieces: null,
    etage: '',
    date: new Date().toISOString().split('T')[0],
    heure_debut: new Date().toTimeString().split(':').slice(0, 2).join(':'),
    operateur: authStore.user ? `${authStore.user.prenom.charAt(0).toUpperCase()}${authStore.user.nom.slice(0, 2).toUpperCase()}` : '',
    num_machine: '21-000099',
    version: '',
    separation: '',
    commentaire: ''
})

// Charger les lots dynamiquement (si tu as une route sinon tu peux supprimer cette fonction)
const fetchLots = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/debut-tomo/lots')
        lots.value = response.data
    } catch (error) {
        console.error('Erreur lors du chargement des lots :', error)
    }
}

// Soumission du formulaire vers ton backend
const submitForm = async () => {
    try {
        const payload = {
            id_lot: form.numero_lot,
            nb_pieces: form.nb_pieces,
            etage: form.etage,
            date: form.date,
            heure_debut: form.heure_debut,
            operateur: form.operateur,
            num_machine: form.num_machine,
            version: form.version,
            separation: form.separation,
            commentaire: form.commentaire
        }

        await axios.post('http://localhost:3000/api/debut-tomo', payload)
        alert('✅ Données enregistrées avec succès !')
        resetForm()
    } catch (error) {
        console.error('Erreur lors de l\'envoi :', error)
        alert('❌ Une erreur est survenue.')
    }
}

// Remise à zéro du formulaire
const resetForm = () => {
    form.numero_lot = ''
    form.nb_pieces = null
    form.etage = ''
    form.date = ''
    form.heure_debut = ''
    form.operateur = ''
    form.version = ''
    form.separation = ''
    form.commentaire = ''
}

// Chargement des lots si besoin
onMounted(() => {
    fetchLots()
})
</script>

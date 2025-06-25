<template>
    <Layout>
        <div class="container bg-white p-4 rounded shadow mt-4">
            <!--button retour-->
            <div class="d-flex justify-content-start mb-3">
                <button class="btn btn-outline-success" @click="goBack">
                    ← Retour
                </button>
            </div>
            <h4 class="text-primary mb-4">Formulaire Déclaration Fin Etching</h4>

            <form @submit.prevent="submitForm">

                <!-- Numéro de lot avec recherche -->
                <div class="mb-3">
                    <label class="form-label">Numéro de lot</label>
                    <select class="form-select" v-model="form.numeroLot" @change="handleLotChange" required>
                        <option disabled value="">Sélectionner un numéro de lot</option>
                        <option v-for="lot in lots" :key="lot.id_lot" :value="lot.id_lot">
                            {{ lot.id_lot }}
                        </option>
                    </select>
                </div>

                <!-- Numéro de wafer (readonly) -->
                <div class="mb-3">
                    <label class="form-label">Numéro de wafer</label>
                    <input type="text" class="form-control" v-model="form.num_lot_wafer" readonly />
                </div>

                <!-- Nombre de passage (readonly) -->
                <div class="mb-3">
                    <label class="form-label">Nombre de passage</label>
                    <input type="number" class="form-control" v-model="form.nb_passage" readonly />
                </div>

                <!-- Date automatique -->
                <div class="mb-3">
                    <label class="form-label">Date</label>
                    <input type="date" class="form-control" v-model="form.date" required />
                </div>

                <!-- Heure automatique -->
                <div class="mb-3">
                    <label class="form-label">Heure</label>
                    <input type="time" class="form-control" v-model="form.heure" required />
                </div>

                <!-- Nombre de pièces conformes -->
                <div class="mb-3">
                    <label class="form-label">Nombre de pièces conformes</label>
                    <input type="number" class="form-control" v-model="form.nb_conforme" required min="0" />
                </div>

                <!-- Opérateur -->
                <div class="mb-3">
                      <label class="form-label">Opérateur</label>
                      <input type="text" class="form-control" v-model="form.operateur" readonly>
                </div>

                <!-- Commentaire (facultatif) -->
                <div class="mb-3">
                    <label class="form-label">Commentaire</label>
                    <textarea class="form-control" rows="2" v-model="form.commentaire"
                        placeholder="Commentaire facultatif..." />
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
import Layout from '@/components/layouts/layout.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Utilisation du store
const authStore = useAuthStore()
const router = useRouter()

function goBack() {
    router.back()
}
const operateurs = ['TLA', 'MPE', 'MGA', 'VGR', 'EPE', 'CME']
const lots = ref([])

const form = reactive({
    numeroLot: '',
    num_lot_wafer: '',
    nb_passage: null,
    date: new Date().toISOString().split('T')[0],
    heure: new Date().toTimeString().split(':').slice(0, 2).join(':'),
    nb_conforme: null,
    operateur: authStore.user ? `${authStore.user.prenom.charAt(0).toUpperCase()}${authStore.user.nom.slice(0, 2).toUpperCase()}` : '',
    commentaire: ''
})

// Récupère les lots disponibles depuis la table debut_etching
const fetchLots = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/fin-etching/lots')
        lots.value = response.data
    } catch (error) {
        console.error('Erreur chargement lots:', error)
    }
}

// Gère le changement de lot sélectionné
const handleLotChange = async () => {
    const selectedLot = lots.value.find(lot => lot.id_lot === form.numeroLot)

    form.num_lot_wafer = selectedLot.num_lot_wafer

    try {
        const response = await axios.get(`http://localhost:3000/api/fin-etching/lot-info/${form.numeroLot}`)
        form.nb_passage = response.data.nb_passage || 1
        form.num_lot_wafer = response.data.num_lot_wafer
    } catch (error) {
        console.error('Erreur récupération nb_passage:', error)
        form.nb_passage = 1
    }
}

// Initialise la date et l'heure à maintenant
const setCurrentDateTime = () => {
    const now = new Date()
    form.date = now.toISOString().slice(0, 10)
    form.heure = now.toTimeString().slice(0, 5)
}

// Méthode pour soumettre le formulaire
const submitForm = async () => {
    // Création des données à envoyer
    const formData = {
        id_lot: form.numeroLot,
        num_lot_wafer: form.num_lot_wafer,
        nb_passage: form.nb_passage,
        date_fin: form.date,
        heure_fin: form.heure, 
        nb_piece_conforme: form.nb_conforme,
        operateur: form.operateur,
        commentaire: form.commentaire,
    }

    try {
        // Envoie des données à l'API
        await axios.post('http://localhost:3000/api/fin-etching/add', formData)
        alert('✅ Données enregistrées avec succès.')
        resetForm()
    } catch (error) {
        console.error('Erreur soumission:', error)
        alert('❌ Erreur lors de la soumission.')
    }
}

// Réinitialise le formulaire
const resetForm = () => {
    Object.keys(form).forEach(key => form[key] = '')
    setCurrentDateTime()
}

onMounted(() => {
    fetchLots()
    setCurrentDateTime()
})
</script>
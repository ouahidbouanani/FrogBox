<template>
    <Layout>
        <div class="container bg-white p-4 rounded shadow mt-4">
            <!--button retour-->
            <div class="d-flex justify-content-start mb-3">
                <button class="btn btn-outline-success" @click="goBack">
                    ← Retour
                </button>
            </div>
            <h4 class="text-primary mb-4">Formulaire déclaration début et suivi etching</h4>

            <!-- Numéro de lot -->
            <div class="mb-3">
                <label class="form-label">Numéro de lot</label>
                <select class="form-select" v-model="form.numeroLot" @change="fetchLotWafer" required>
                    <option disabled value=""> Sélectionner </option>
                    <option v-for="lot in lots" :key="lot.id_lot" :value="lot.id_lot">
                        {{ lot.id_lot }}
                    </option>
                </select>
            </div>

            <!-- Numéro de lot du wafer -->
            <div class="mb-3">
                <label class="form-label">Numéro de lot du wafer</label>
                <input type="text" class="form-control" v-model="form.num_lot_wafer" readonly />
            </div>

            <!-- Numéro de lot du wafer -->
            <div class="mb-3">
                <label class="form-label">Nombre de pièces</label>
                <input type="text" class="form-control" v-model="form.nb_pieces" readonly />
            </div>

            <form @submit.prevent="submitForm">
                <!-- Opérateur -->

                <div class="mb-3">
                    <label class="form-label">Opérateur</label>
                    <input type="text" class="form-control" v-model="form.operateur" readonly>
                </div>


                <!-- Nombre de passage -->
                <div class="mb-3">
                    <label class="form-label">Nb passage</label>
                    <input type="number" class="form-control" v-model="form.nb_passage" required min="1" readonly />

                </div>

                <!-- Date début -->
                <div class="mb-3">
                    <label class="form-label">Date début</label>
                    <input type="date" class="form-control" v-model="form.date_debut" required />
                </div>

                <!-- Heure début -->
                <div class="mb-3">
                    <label class="form-label">Heure début</label>
                    <input type="time" class="form-control" v-model="form.heure_debut" required />
                </div>

                <!-- Temps réel -->
                <div class="mb-3">
                    <label class="form-label">Temps réel (heurs)</label>
                    <input type="number" class="form-control" v-model="form.temps_reel" required />
                </div>

                <!-- KOH -->
                <div class="mb-3">
                    <label class="form-label">KOH</label>
                    <select class="form-select" v-model="form.koh" required>
                        <option disabled value="">Sélectionner </option>
                        <option value="4M">4M</option>
                        <option value="8M">8M</option>
                    </select>
                </div>

                <!-- Bain -->
                <div class="mb-3">
                    <label class="form-label">Bain</label>
                    <select class="form-select" v-model="form.bain" required>
                        <option disabled value="">Sélectionner </option>
                        <option value="US1">US1</option>
                        <option value="US2">US2</option>
                        <option value="US3">US3</option>
                        <option value="US4">US4</option>
                        <option value="US5">US5</option>
                    </select>
                </div>

                <!-- Position -->
                <div class="mb-3">
                    <label class="form-label">Position</label>
                    <select class="form-select" v-model="form.position" required>
                        <option disabled value=""> Sélectionner </option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>

                <!-- Commentaire -->
                <div class="mb-3 row">
                    <label class="col-sm-4 col-form-label">Commentaires</label>

                    <textarea class="form-control" rows="2" v-model="form.commentaire"
                        placeholder="Ajouter un commentaire...">
                    </textarea>

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


const lots = ref([])

const form = reactive({
    numeroLot: '',
    nb_pieces: '',
    num_lot_wafer: '',
    operateur: authStore.user ? `${authStore.user.prenom.charAt(0).toUpperCase()}${authStore.user.nom.slice(0, 2).toUpperCase()}` : '',
    nb_passage: null,
    date_debut: new Date().toISOString().split('T')[0],
    heure_debut: new Date().toTimeString().split(':').slice(0, 2).join(':')
    ,
    temps_reel: null,
    koh: '',
    bain: '',
    position: '',
    commentaire: ''
})

// Charger les lots depuis l'API
const fetchLots = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/debut-etching/lots')
        lots.value = response.data
    } catch (error) {
        console.error('Erreur chargement lots:', error)
    }
}

// Récupérer automatiquement le numéro de lot wafer
const fetchLotWafer = async () => {
    const selected = lots.value.find(l => l.id_lot === form.numeroLot)
    form.num_lot_wafer = selected ? selected.num_lot_wafer : '',
    form.nb_pieces = selected ? selected.nb_imprimees : ''

    // Nouveau : récupère le nombre de passages déjà effectués pour ce lot
    try {
        const response = await axios.get(`http://localhost:3000/api/debut-etching/count/${form.numeroLot}`)
        const count = response.data.count || 0
        form.nb_passage = count + 1
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre de passages:', error)
        form.nb_passage = 1 // Valeur par défaut si erreur
    }
}

// Soumettre le formulaire
const submitForm = async () => {
    try {
        await axios.post('http://localhost:3000/api/debut-etching/add', form)
        alert('✅ Données enregistrées avec succès')
        resetForm()
    } catch (error) {
        console.error('Erreur lors de la soumission:', error)
        alert('❌ Une erreur est survenue')
    }
}

// Réinitialiser le formulaire
const resetForm = () => {
    Object.keys(form).forEach(key => form[key] = '')
}

onMounted(() => {
    fetchLots()
})
</script>

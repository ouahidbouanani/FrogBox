<template>
    <Layout>
        <div class="container bg-white p-4 rounded shadow mt-4">
            <!--button retour-->
            <div class="d-flex justify-content-start mb-3">
                <button class="btn btn-outline-success" @click="goBack">
                    ← Retour
                </button>
            </div>
            <h4 class="text-primary mb-4">Formulaire - Fin de Tomographie</h4>

            <form @submit.prevent="submitForm">
                <!-- Numéro de lot -->
                <div class="mb-3">
                    <label class="form-label">Numéro de lot</label>
                    <select class="form-select" v-model="form.numeroLot" required>
                        <option disabled value=""> Sélectionner </option>
                        <option v-for="lot in lots" :key="lot.id_lot" :value="lot.id_lot">
                            {{ lot.id_lot }}
                        </option>
                    </select>
                </div>

                <!-- Quantité -->
                <div class="mb-3">
                    <label class="form-label">Quantité</label>
                    <input type="number" class="form-control" v-model="form.quantite" required min="1" />
                </div>

                <!-- Date -->
                <div class="mb-3">
                    <label class="form-label">Date</label>
                    <input type="date" class="form-control" v-model="form.date" required />
                </div>

                <!-- Heure -->
                <div class="mb-3">
                    <label class="form-label">Heure</label>
                    <input type="time" class="form-control" v-model="form.heure" required />
                </div>

                <!-- Opérateur -->
                <div class="mb-3">
                      <label class="form-label">Opérateur</label>
                      <input type="text" class="form-control" v-model="form.operateur" readonly>
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
const operateurs = ['TLA', 'MPE', 'MGA', 'VGR', 'EPE', 'CME']
const lots = ref([])

const form = reactive({
    numeroLot: '',
    quantite: null,
    date: new Date().toISOString().split('T')[0],
    heure: new Date().toTimeString().split(':').slice(0, 2).join(':'),
    operateur: authStore.user ? `${authStore.user.prenom.charAt(0).toUpperCase()}${authStore.user.nom.slice(0, 2).toUpperCase()}` : '',
})

const fetchLots = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/fin-tomo/lots')
        lots.value = res.data
    } catch (err) {
        console.error('Erreur chargement lots :', err)
    }
}

const submitForm = async () => {
    try {
        await axios.post('http://localhost:3000/api/fin-tomo/add', {
            id_lot: form.numeroLot,
            quantite: form.quantite,
            date: form.date,
            heure: form.heure,
            operateur: form.operateur
        })
        alert('✅ Données enregistrées avec succès')
        resetForm()
    } catch (err) {
        console.error('Erreur soumission :', err)
        alert('❌ Erreur lors de l\'enregistrement')
    }
}

const resetForm = () => {
    form.numeroLot = ''
    form.quantite = null
    form.date = ''
    form.heure = ''
    form.operateur = ''
}

onMounted(() => {
    fetchLots()
})
</script>

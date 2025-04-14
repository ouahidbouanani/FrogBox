<template>
    <div class="container mt-4">
        <h4 class="text-primary mb-4">Formulaire - Données Opérationnelles</h4>

        <!-- Numéro de lot -->
        <div class="mb-3">
            <label class="form-label">Numéro de lot</label>
            <select class="form-select" v-model="form.numeroLot" @change="fetchLotWafer" required>
                <option disabled value="">-- Sélectionner --</option>
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

        <form @submit.prevent="submitForm">
            <!-- Opérateur -->
            <div class="mb-3">
                <label class="form-label">Opérateur</label>
                <select class="form-select" v-model="form.operateur" required>
                    <option disabled value="">-- Sélectionner --</option>
                    <option v-for="op in operateurs" :key="op" :value="op">{{ op }}</option>
                </select>
            </div>

            <!-- Nombre de passage -->
            <div class="mb-3">
                <label class="form-label">Nb passage</label>
                <input type="number" class="form-control" v-model="form.nb_passage" required min="1" />
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
                <label class="form-label">Temps réel (min)</label>
                <input type="number" class="form-control" v-model="form.temps_reel" required />
            </div>

            <!-- KOH -->
            <div class="mb-3">
                <label class="form-label">KOH</label>
                <select class="form-select" v-model="form.koh" required>
                    <option disabled value="">-- Sélectionner --</option>
                    <option value="4M">4M</option>
                    <option value="8M">8M</option>
                </select>
            </div>

            <!-- Bain -->
            <div class="mb-3">
                <label class="form-label">Bain</label>
                <select class="form-select" v-model="form.bain" required>
                    <option disabled value="">-- Sélectionner --</option>
                    <option value="US1">US1</option>
                    <option value="US2">US2</option>
                    <option value="US3">US3</option>
                </select>
            </div>

            <!-- Position -->
            <div class="mb-3">
                <label class="form-label">Position</label>
                <select class="form-select" v-model="form.position" required>
                    <option disabled value="">-- Sélectionner --</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </div>

            <!-- Commentaire -->
            <div class="mb-3 row">
                <label class="col-sm-4 col-form-label">Commentaires</label>
                <div class="col-sm-8">
                    <textarea class="form-control" rows="2" v-model="form.commentaire"
                        placeholder="Ajouter un commentaire..."></textarea>
                </div>
            </div>

            <!-- Boutons -->
            <div class="text-center">
                <button class="btn btn-success me-2" type="submit">Enregistrer</button>
                <button class="btn btn-secondary" type="button" @click="resetForm">Réinitialiser</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const operateurs = ['TLA', 'MPE', 'MGA', 'VGR', 'EPE', 'CME']
const lots = ref([])

const form = reactive({
    numeroLot: '',
    num_lot_wafer: '',
    operateur: '',
    nb_passage: null,
    date_debut: '',
    heure_debut: '',
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
const fetchLotWafer = () => {
    const selected = lots.value.find(l => l.id_lot === form.numeroLot)
    form.num_lot_wafer = selected ? selected.num_lot_wafer : ''
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

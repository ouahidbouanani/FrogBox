<template>
  <layout>
    <div class="container bg-white p-4 rounded shadow mt-4">
      <!--button retour-->
            <div class="d-flex justify-content-start mb-3">
                <button class="btn btn-outline-success" @click="goBack">
                    ← Retour
                </button>
            </div>
      <h4 class="mb-4 text-primary">Formulaire déclaration fin impression</h4>

      <form>
        <!-- Numéro de lot -->
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label">Numéro de lot</label>
          <div class="col-sm-8">
            <select class="form-select" v-model="form.numeroLot" @change="fetchPiecesLancees">
              <option disabled value=""> Sélectionner </option>
              <option v-for="lot in lots" :key="lot.id" :value="lot.id">
                {{ lot.id }}
              </option>
            </select>
          </div>
        </div>

        <!-- Numéro de lot du wafer -->
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label">Numéro de lot du wafer</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" v-model="form.num_lot_wafer" readonly />
          </div>
        </div>

        <!-- Pièces lancées -->
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label">Pièces lancées en impression</label>
          <div class="col-sm-8">
            <input type="number" class="form-control" v-model="form.piecesLancees" readonly />
          </div>
        </div>

        <!-- Pièces imprimées -->
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label">Pièces imprimées</label>
          <div class="col-sm-8">
            <input type="number" class="form-control" v-model="form.piecesImprimees" min="0" required />
          </div>
        </div>

        <!-- Opérateur -->
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label">Opérateur</label>
          <div class="col-sm-8">
              <input type="text" class="form-control" v-model="form.operateur" readonly>
          </div>
        </div>

        <!-- Date de fin -->
        <div class="mb-3 row">
          <label class="col-sm-4 col-form-label">Date de fin d'impression</label>
          <div class="col-sm-8">
            <input type="date" class="form-control" v-model="form.dateFin" required />
          </div>
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
          <button class="btn btn-primary me-2" @click.prevent="submitForm">FIN DE DECLARATION</button>
          <button class="btn btn-secondary" @click.prevent="resetForm">ANNULER</button>
        </div>
      </form>
    </div>
  </layout>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
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
const form = reactive({
  numeroLot: '',
  num_lot_wafer: null,
  piecesLancees: null,
  piecesImprimees: null,
  operateur: authStore.user ? `${authStore.user.prenom.charAt(0).toUpperCase()}${authStore.user.nom.slice(0, 2).toUpperCase()}` : '',
  dateFin: new Date().toISOString().split('T')[0],
  commentaire: ''
})

const lots = ref([])
const operateurs = ['TLA','CME', 'MPE', 'MGA', 'VGR', 'EPE']

// Charger les numéros de lot disponibles
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/fin-impression/lots')
    lots.value = res.data
  } catch (error) {
    console.error('Erreur chargement des lots:', error)
  }
})

// Récupérer les pièces lancées du lot sélectionné
async function fetchPiecesLancees() {
  if (!form.numeroLot) return
  try {
    const res = await axios.get(`http://localhost:3000/api/fin-impression/lot/${form.numeroLot}`)
    form.piecesLancees = res.data.nb_pieces
    form.num_lot_wafer = res.data.num_lot_wafer
  } catch (error) {
    console.error('Erreur chargement nb pièces:', error)
    form.piecesLancees = null
  }
}

function submitForm() {
  if (!form.numeroLot || form.piecesImprimees === null || !form.dateFin) {
    alert("Tous les champs obligatoires doivent être remplis.")
    return
  }

  const payload = {
    id_lot: form.numeroLot,
    num_lot_wafer: form.num_lot_wafer,
    nb_lancees: form.piecesLancees,
    nb_imprimees: form.piecesImprimees,
    operateur: form.operateur,
    date_fin: form.dateFin,
    commentaires: form.commentaire
  }

  axios.post('http://localhost:3000/api/fin-impression', payload)
    .then(() => {
      alert('Données envoyées avec succès !')
      resetForm()
    })
    .catch((err) => {
      console.error(err)
      alert("Erreur lors de l'envoi")
    })
}

function resetForm() {
  form.numeroLot = ''
  form.num_lot_wafer = ''
  form.piecesLancees = null
  form.piecesImprimees = null
  form.operateur = ''
  form.dateFin = ''
  form.commentaire = ''
}
</script>

<style scoped>
h4 {
  font-weight: bold;
}
</style>

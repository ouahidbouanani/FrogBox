<template>
  <Layout>
    <div class="container bg-white w-50 p-4 rounded shadow mt-4">
      <div class="d-flex justify-content-start mb-3">
        <button class="btn btn-outline-success" @click="goBack">← Retour</button>
      </div>

      <h4 class="text-primary mb-4">Déclaration des pièces</h4>

      <!-- Sélection du lot -->
      <div class="mb-3">
        <label class="form-label">Numéro de lot</label>
        <select class="form-select" v-model="lotId" @change="chargerInfosDuLot">
          <option disabled value="">Sélectionner un lot</option>
          <option v-for="lot in lots" :key="lot.id_lot" :value="lot.id_lot">{{ lot.id_lot }}</option>
        </select>
      </div>

      <!-- Passage -->
      <div class="mb-3" v-if="passagesDisponibles.length">
        <label class="form-label">Passage</label>
        <select class="form-select" v-model="passageSelectionne">
          <option disabled value="">Sélectionner un passage</option>
          <option v-for="passage in passagesDisponibles" :key="passage" :value="passage">{{ passage }}</option>
        </select>
      </div>

      <!-- Type de pièce (affiché automatiquement) -->
      <div class="mb-3">
        <label class="form-label">Type de pièce</label>
        <input type="text" class="form-control" v-model="typePieceSelectionne" readonly />
      </div>

      <!-- Date -->
      <div class="mb-3">
        <label class="form-label">Date</label>
        <input type="date" class="form-control" v-model="date" />
      </div>

      <!-- Nombre de pièces -->
      <div class="mb-3">
        <label class="form-label">Nombre de pièces</label>
        <input type="number" class="form-control" v-model.number="nbPieces" readonly />
      </div>

      <!-- Liste des pièces -->
      <div v-if="pieces.length" class="mt-4">
        <h5 class="mb-3">Saisie des dimensions</h5>
        <div v-for="(piece, index) in pieces" :key="piece.id" class="border p-3 rounded mb-3">
          <strong>{{ piece.id }}</strong>
          <div class="row mt-2" v-for="cote in cotes" :key="cote.id">
            <div class="col">
              <input
                type="text"
                class="form-control"
                v-model="piece[`cote_${cote.nom_cote}`]"
                :class="getDynamicValidationClass(piece, cote)"
                :placeholder="`Côte ${cote.nom_cote} [${cote.tolerance_min} - ${cote.tolerance_max}]`"
                @input="checkPieceValid(piece)"
              />
            </div>
          </div>
          <div class="mt-2 d-flex align-items-center">
            <input type="checkbox" v-model="piece.valide" disabled />
            <label class="ms-2">Validé</label>
          </div>
        </div>
      </div>

      <!-- Boutons -->
      <div class="text-center mt-4">
        <button class="btn btn-primary me-2" :disabled="!toutesPiecesValidees || !passageSelectionne" @click="soumettre">
          SOUMETTRE
        </button>
        <button class="btn btn-secondary" @click="resetForm">ANNULER</button>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import Layout from '@/components/layouts/layout.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
function goBack() {
  router.back()
}

const lotId = ref('')
const lots = ref([])
const passagesDisponibles = ref([])
const passageSelectionne = ref('')
const date = ref(new Date().toISOString().split('T')[0])
const nbPieces = ref(0)
const pieces = reactive([])

const typePieceSelectionne = ref('')
const cotes = ref([])

const toutesPiecesValidees = computed(() =>
  pieces.length > 0 && pieces.every(p => p.valide)
)

function chargerInfosDuLot() {
  if (!lotId.value) return

  axios.get(`http://localhost:3000/api/lots/piece/${lotId.value}`)
    .then(res => {
      const data = res.data
      typePieceSelectionne.value = data.nom_piece
      cotes.value = data.cotes

      const selectedLot = lots.value.find(l => l.id_lot === lotId.value)
      nbPieces.value = selectedLot?.nb_imprimees || 0
      passagesDisponibles.value = selectedLot?.nb_passages
        ? selectedLot.nb_passages.split(',').map(p => parseInt(p))
        : []
      passageSelectionne.value = ''

      genererPieces()
    })
    .catch(err => {
      console.error(err)
      alert('Erreur lors du chargement des informations du lot.')
    })
}

function genererPieces() {
  pieces.splice(0)
  for (let i = 1; i <= nbPieces.value; i++) {
    const suffix = i.toString().padStart(2, '0')
    const piece = {
      id: `${lotId.value}-${suffix}`,
      valide: false
    }
    cotes.value.forEach(cote => {
      piece[`cote_${cote.nom_cote}`] = ''
    })
    pieces.push(piece)
  }
}

function checkPieceValid(piece) {
  let isValid = true
  for (const cote of cotes.value) {
    const val = parseFloat(piece[`cote_${cote.nom_cote}`])
    if (isNaN(val) || val < cote.tolerance_min || val > cote.tolerance_max) {
      isValid = false
      break
    }
  }
  piece.valide = isValid
}

function getDynamicValidationClass(piece, cote) {
  const val = parseFloat(piece[`cote_${cote.nom_cote}`])
  if (isNaN(val)) return ''
  return val >= cote.tolerance_min && val <= cote.tolerance_max ? 'valide' : 'invalide'
}

function soumettre() {
  const data = {
    id_lot: lotId.value,
    nb_passage: passageSelectionne.value,
    date: date.value,
    type_piece: typePieceSelectionne.value,
    nombre_pieces: nbPieces.value,
    pieces: pieces.map(p => {
      const mesures = {}
      for (const cote of cotes.value) {
        mesures[cote.nom_cote] = p[`cote_${cote.nom_cote}`]
      }
      return {
        id_piece: p.id,
        id_lot: lotId.value,
        passage: passageSelectionne.value,
        ...mesures
      }
    })
  }

  axios.post('http://localhost:3000/api/pieces/ajouter', data)
    .then(() => {
      alert('Données enregistrées avec succès.')
      resetForm()
    })
    .catch(err => {
      console.error(err)
      alert("Erreur lors de l'envoi.")
    })
}

function resetForm() {
  lotId.value = ''
  typePieceSelectionne.value = ''
  date.value = new Date().toISOString().split('T')[0]
  nbPieces.value = 0
  passageSelectionne.value = ''
  passagesDisponibles.value = []
  cotes.value = []
  pieces.splice(0)
}

onMounted(() => {
  axios.get('http://localhost:3000/api/lots')
    .then(res => {
      lots.value = res.data
    })
})
</script>

<style scoped>
input[type="checkbox"] {
  transform: scale(1.2);
}

.valide {
  border: 2px solid #28a745 !important;
  background-color: #e6f9ec;
}

.invalide {
  border: 2px solid #dc3545 !important;
  background-color: #fbeaea;
}
</style>

<!-- -->
<template>
  <Layout>
    <div class="container bg-white w-50 p-4 rounded shadow mt-4">
      <!--button retour-->
            <div class="d-flex justify-content-start mb-3">
                <button class="btn btn-outline-success" @click="goBack">
                    ← Retour
                </button>
            </div>
      <h4 class="text-primary mb-4">Déclaration des pièces</h4>

      <!-- Sélection du lot -->
      <div class="mb-3">
        <label class="form-label">Numéro de lot</label>
        <select class="form-select" v-model="lotId" @change="mettreAJourNombrePieces">
          <option disabled value=""> Sélectionner un lot </option>
          <option v-for="lot in lots" :key="lot.id_lot" :value="lot.id_lot">{{ lot.id_lot }}</option>
        </select>
      </div>

      <!-- Sélection du passage -->
      <div class="mb-3" v-if="passagesDisponibles.length">
        <label class="form-label">Passage</label>
        <select class="form-select" v-model="passageSelectionne">
          <option disabled value=""> Sélectionner un passage </option>
          <option v-for="passage in passagesDisponibles" :key="passage" :value="passage">{{ passage }}</option>
        </select>
      </div>

      <!-- Type de pièce -->
      <div class="mb-3">
        <label class="form-label">Type de pièce</label>
        <select class="form-select" v-model="typePiece">
          <option disabled value=""> Sélectionner un type </option>
          <option value="corps">Corps</option>
          <option value="N100">N100</option>
          <option value="N215">N215</option>
        </select>
      </div>

      <!-- Date -->
      <div class="mb-3">
        <label class="form-label">Date</label>
        <input type="date" class="form-control" v-model="date" />
      </div>

      <!-- Nombre de pièces (readonly) -->
      <div class="mb-3">
        <label class="form-label">Nombre de pièces</label>
        <input type="number" class="form-control" v-model.number="nbPieces" readonly />
      </div>

      <!-- Liste des pièces -->
      <div v-if="pieces.length" class="mt-4">
        <h5 class="mb-3">Saisie des dimensions</h5>
        <div v-for="(piece, index) in pieces" :key="piece.id" class="border p-3 rounded mb-3">
          <strong>{{ piece.id }}</strong>
          <div class="row mt-2">
            <div class="col">
              <input type="text" class="form-control" v-model="piece.coteA" :class="getValidationClass(piece, 'A')"
                placeholder="Côté A" @input="checkPieceValid(piece)" />
            </div>
            <div class="col">
              <input type="text" class="form-control" v-model="piece.coteB" :class="getValidationClass(piece, 'B')"
                placeholder="Côté B" @input="checkPieceValid(piece)" />
            </div>
            <div class="col">
              <input type="text" class="form-control" v-model="piece.coteC" :class="getValidationClass(piece, 'C')"
                placeholder="Côté C" @input="checkPieceValid(piece)" />
            </div>
            <div class="col-auto d-flex align-items-center">
              <input type="checkbox" v-model="piece.valide" :disabled="!tousCotesRenseignes(piece)" />
              <label class="ms-2">Validé</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Boutons -->
      <div class="text-center mt-4">
        <button class="btn btn-primary me-2" :disabled="!toutesPiecesValidees || !passageSelectionne"
          @click="soumettre">
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
import Layout from "@/components/layouts/layout.vue"
import { useRouter } from 'vue-router'
const router = useRouter()

function goBack() {
    router.back()
}

const lotId = ref('')
const typePiece = ref('')
const date = ref(new Date().toISOString().split('T')[0]);
const nbPieces = ref(0)
const pieces = reactive([])
const lots = ref([])

const passagesDisponibles = ref([])
const passageSelectionne = ref('')

const tolerances = {
  corps: { A: [595, 605], B: [1090, 1110], C: [7780, 7800] },
  N100: { A: [595, 605], B: [95, 105], C: [7760, 7780] },
  N215: { A: [595, 605], B: [210, 220], C: [7760, 7780] }
}

const mettreAJourNombrePieces = () => {
  if (!lotId.value) return
  const selected = lots.value.find(l => l.id_lot === lotId.value)

  if (selected) {
    nbPieces.value = selected.nb_imprimees
    passagesDisponibles.value = selected.nb_passages
      ? selected.nb_passages.split(',').map(p => parseInt(p))
      : []
    passageSelectionne.value = ''
  }

  genererPieces()
}

function genererPieces() {
  pieces.splice(0)
  for (let i = 1; i <= nbPieces.value; i++) {
    const suffix = i.toString().padStart(2, '0')
    pieces.push({
      id: `${lotId.value}-${suffix}`,
      coteA: '',
      coteB: '',
      coteC: '',
      valide: false
    })
  }
}

function tousCotesRenseignes(piece) {
  return piece.coteA && piece.coteB && piece.coteC
}

function checkPieceValid(piece) {
  if (!tousCotesRenseignes(piece) || !typePiece.value) {
    piece.valide = false
    return
  }

  const tol = tolerances[typePiece.value]
  const a = parseFloat(piece.coteA)
  const b = parseFloat(piece.coteB)
  const c = parseFloat(piece.coteC)

  piece.valide =
    a >= tol.A[0] && a <= tol.A[1] &&
    b >= tol.B[0] && b <= tol.B[1] &&
    c >= tol.C[0] && c <= tol.C[1]
}

function getValidationClass(piece, cote) {
  if (!typePiece.value) return ''
  const value = parseFloat(piece[`cote${cote}`])
  if (isNaN(value)) return ''
  const range = tolerances[typePiece.value][cote]
  return value >= range[0] && value <= range[1] ? 'valide' : 'invalide'
}

const toutesPiecesValidees = computed(() => {
  return pieces.length > 0 && pieces.every(p => p.valide)
})

function soumettre() {
  const data = {
    id_lot: lotId.value,
    passage: passageSelectionne.value,
    date: date.value,
    nombre_pieces: nbPieces.value,
    pieces: pieces.map(p => ({
      id_piece: p.id,
      id_lot: lotId.value,
      passage: passageSelectionne.value,
      coteA: p.coteA,
      coteB: p.coteB,
      coteC: p.coteC
    }))
  }
  console.log(typeof passageSelectionne.value)  // doit afficher 'number'

  axios.post('http://localhost:3000/api/pieces/submit', data)
    .then(() => {
      alert('Données enregistrées avec succès.')
      resetForm()
    })
    .catch(err => {
      console.error(err)
      alert('Erreur lors de l\'envoi.')
    })
}

function resetForm() {
  lotId.value = ''
  typePiece.value = ''
  date.value = new Date().toISOString().split('T')[0];
  nbPieces.value = 0
  passageSelectionne.value = ''
  passagesDisponibles.value = []
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

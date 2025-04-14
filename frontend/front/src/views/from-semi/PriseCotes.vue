<template>
    <div class="container mt-4">
      <h4 class="text-primary mb-4">Déclaration des pièces</h4>
  
      <!-- Sélection du lot -->
      <div class="mb-3">
        <label class="form-label">Numéro de lot</label>
        <select class="form-select" v-model="lotId" @change="mettreAJourNombrePieces">
          <option disabled value="">-- Sélectionner un lot --</option>
          <option v-for="lot in lots" :key="lot.id_lot" :value="lot.id_lot">{{ lot.id_lot }}</option>
        </select>
      </div>
  
      <!-- Date -->
      <div class="mb-3">
        <label class="form-label">Date</label>
        <input type="date" class="form-control" v-model="date" />
      </div>
  
      <!-- Nombre de pièces (affiché, mais non modifiable) -->
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
              <input type="text" class="form-control" v-model="piece.coteA" placeholder="Côté A" @input="checkPieceValid(piece)" />
            </div>
            <div class="col">
              <input type="text" class="form-control" v-model="piece.coteB" placeholder="Côté B" @input="checkPieceValid(piece)" />
            </div>
            <div class="col">
              <input type="text" class="form-control" v-model="piece.coteC" placeholder="Côté C" @input="checkPieceValid(piece)" />
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
        <button class="btn btn-primary me-2" :disabled="!toutesPiecesValidees" @click="soumettre">SOUMETTRE</button>
        <button class="btn btn-secondary" @click="resetForm">ANNULER</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import axios from 'axios'
  
  const lotId = ref('')
  const date = ref('')
  const nbPieces = ref(0)
  const pieces = reactive([])
  const lots = ref([])
  
  const mettreAJourNombrePieces = async () => {
    if (!lotId.value) return
    const selected = lots.value.find(l => l.id_lot === lotId.value)
    nbPieces.value = selected ? selected.nb_imprimees : 0
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
    if (!tousCotesRenseignes(piece)) piece.valide = false
  }
  
  const toutesPiecesValidees = computed(() => {
    return pieces.length > 0 && pieces.every(p => p.valide)
  })
  
  function soumettre() {
    const data = {
      id_lot: lotId.value,
      date: date.value,
      nombre_pieces: nbPieces.value,
      pieces: pieces.map(p => ({
        id_piece: p.id,
        id_lot: lotId.value,
        coteA: p.coteA,
        coteB: p.coteB,
        coteC: p.coteC
      }))
    }
  
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
    date.value = ''
    nbPieces.value = 0
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
  </style>
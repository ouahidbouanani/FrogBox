<template>
  <Layout>
    <div class="container bg-white p-4 rounded shadow mt-4">
      <div class="d-flex justify-content-start mb-3">
        <button class="btn btn-outline-success" @click="goBack">← Retour</button>
      </div>

      <h4 class="text-primary mb-4">Déclaration de pièces non conformes</h4>

      <form @submit.prevent="submitForm">
        <!-- Numéro de lot -->
        <div class="mb-3">
          <label class="form-label">Numéro de lot</label>
          <select class="form-select" v-model="form.numeroLot" @change="handleLotChange" required>
            <option disabled value="">Sélectionner un numéro de lot</option>
            <option v-for="lot in lots" :key="lot.id" :value="lot.id">{{ lot.id }}</option>
          </select>
        </div>

        <!-- Nombre de pièces imprimées -->
        <div class="mb-3">
          <label class="form-label">Nombre de pièces imprimées</label>
          <input type="number" class="form-control" :value="form.piecesImprimees" readonly />
        </div>

        <!-- Étape -->
        <div class="mb-3">
          <label class="form-label">Étape</label>
          <select class="form-select" v-model="form.etape" required>
            <option disabled value="">Sélectionner une étape</option>
            <option>Fin impression</option>
            <option>Début suivi Etching</option>
            <option>Prise de cote</option>
            <option>Fin Etching</option>
            <option>Début Tomo</option>
            <option>Fin Tomo</option>
          </select>
        </div>

        <!-- Nombre de pièces NC -->
        <div class="mb-3">
          <label class="form-label">Nombre de pièces non conformes</label>
          <input type="number" class="form-control" v-model.number="form.nbNC" :max="form.piecesImprimees" min="0" required @input="generateNCPieces" />
        </div>

        <!-- Boucle des pièces non conformes -->
        <div v-for="(piece, index) in form.piecesNonConformes" :key="index" class="mb-4 border rounded p-3">
          <h6 class="text-secondary">Pièce non conforme {{ index + 1 }}</h6>

          <div class="mb-2">
            <label class="form-label">ID de la pièce</label>
            <select class="form-select" v-model="piece.id_piece" required>
              <option disabled value="">Sélectionner</option>
              <option
                v-for="i in form.piecesImprimees"
                :key="i"
                :value="`${type_piece}-${String(form.numeroLot).padStart(4, '0')}-${String(i).padStart(2, '0')}`"
              >
                {{ type_piece }}-{{ String(form.numeroLot).padStart(4, '0') }}-{{ String(i).padStart(2, '0') }}
              </option>
            </select>
          </div>

          <div class="mb-2">
            <label class="form-label">Dénomination</label>
            <select class="form-select" v-model="piece.denomination" required>
              <option disabled value="">Sélectionner</option>
              <option>Absence de protection</option>
              <option>Angle cône</option>
              <option>Angle corps nozzle</option>
            </select>
          </div>

          <div class="mb-2">
            <label class="form-label">Produit</label>
            <select class="form-select" v-model="piece.produit" required>
              <option disabled value="">Sélectionner</option>
              <option>Corps CN</option>
              <option>Corps SK</option>
            </select>
          </div>

          <div class="mb-2">
            <label class="form-label">Description</label>
            <textarea class="form-control" v-model="piece.description" rows="2" required placeholder="Décrire la pièce ici..."></textarea>
          </div>

          <div class="mb-2">
            <label class="form-label">Proud</label>
            <select class="form-select" v-model="piece.proud" required>
              <option disabled value="">Sélectionner</option>
              <option>Routine</option>
              <option>MckRun1</option>
              <option>GMP</option>
            </select>
          </div>

          <div class="mb-2">
            <label class="form-label">Type</label>
            <select class="form-select" v-model="piece.type" required>
              <option disabled value="">Sélectionner</option>
              <option>Hors-spec</option>
              <option>Infra</option>
              <option>NP</option>
            </select>
          </div>
        </div>

        <!-- Opérateur & Date -->
        <div class="mb-3">
          <label class="form-label">Opérateur</label>
          <input type="text" class="form-control" v-model="form.operateur" readonly />
        </div>

        <div class="mb-3">
          <label class="form-label">Date</label>
          <input type="date" class="form-control" v-model="form.date" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Commentaire</label>
          <textarea class="form-control" v-model="form.commentaire" rows="2" placeholder="Commentaire facultatif..."></textarea>
        </div>

        <!-- Boutons -->
        <div class="text-center">
          <button type="submit" class="btn btn-success me-2">Enregistrer</button>
          <button type="button" class="btn btn-secondary" @click="resetForm">Réinitialiser</button>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Layout from '@/components/layouts/layout.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const type_piece = ref('')
const lots = ref([])

const form = reactive({
  numeroLot: '',
  piecesImprimees: 0,
  etape: '',
  nbNC: 0,
  piecesNonConformes: [],
  operateur: authStore.user
    ? `${authStore.user.prenom.charAt(0).toUpperCase()}${authStore.user.nom.slice(0, 2).toUpperCase()}`
    : '',
  date: new Date().toISOString().split('T')[0],
  commentaire: ''
})

function goBack() {
  router.back()
}

async function fetchLots() {
  try {
    const res = await axios.get('http://localhost:3000/api/fin-impression/lots')
    lots.value = res.data
  } catch (err) {
    console.error('Erreur récupération des lots :', err)
  }
}

async function handleLotChange() {
  if (!form.numeroLot) return
  try {
    const res = await axios.get(`http://localhost:3000/api/fin-impression/lot/${form.numeroLot}`)
    if (res.data && typeof res.data.nb_pieces !== 'undefined') {
      form.piecesImprimees = res.data.nb_pieces
      type_piece.value = res.data.type_pieces
    }
  } catch (err) {
    console.error('Erreur récupération du lot sélectionné :', err)
  }
}

function generateNCPieces() {
  form.piecesNonConformes = []
  for (let i = 0; i < form.nbNC; i++) {
    form.piecesNonConformes.push({
      id_piece: '',
      denomination: '',
      produit: '',
      description: '',
      proud: '',
      type: ''
    })
  }
}

async function submitForm() {
  const payload = {
    id_lot: form.numeroLot,
    operateur: form.operateur,
    date: form.date,
    pieces: JSON.parse(JSON.stringify(form.piecesNonConformes))
  }
  console.log(payload)

  try {
    
    await axios.post('http://localhost:3000/api/nc/add', payload)
    alert('✅ Déclaration enregistrée avec succès.')
    resetForm()
  } catch (err) {
    console.error('Erreur lors de la soumission :', err)
    alert('❌ Erreur lors de l’enregistrement.')
  }
}

function resetForm() {
  form.numeroLot = ''
  form.piecesImprimees = 0
  form.etape = ''
  form.nbNC = 0
  form.piecesNonConformes = []
  form.date = new Date().toISOString().split('T')[0]
  form.commentaire = ''
}
onMounted(fetchLots)
</script>

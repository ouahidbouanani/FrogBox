<template>
  <Layout>
    <div id="app">
      <div class="container">
        <h1 class="app-title">Gestion Qualité</h1>

        <!-- Stepper Header -->
        <div class="stepper-header">
          <div v-for="(step, index) in steps" :key="index" class="step-item" :class="{
            'active': currentStep === index,
            'completed': currentStep > index,
            'clickable': canNavigateToStep(index)
          }" @click="navigateToStep(index)">
            <div class="step-number">
              <CheckIcon v-if="currentStep > index" :size="16" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="step-title">{{ step.title }}</span>
          </div>
        </div>

        <!-- Step Content -->
        <div class="step-content">
          <!-- Étape 1: Informations Pièce -->
          <div v-if="currentStep === 0" class="step-panel">
            <h2>Informations de la Pièce</h2>
            <form @submit.prevent="nextStep">
              <div class="form-group">
                <label class="form-label">Dénomination *</label>
                <select class="form-select" v-model="formData.piece.denomination" required>
                  <option disabled value="">Sélectionner</option>
                  <option v-for="option in denominationOptions" :key="option.name" :value="option.name">
                    {{ option.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Produit *</label>
                <select class="form-select" v-model="formData.piece.produit" required>
                  <option disabled value="">Sélectionner</option>
                  <option v-for="option in produitOptions" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Description *</label>
                <textarea class="form-control" v-model="formData.piece.description" rows="3" required
                  placeholder="Décrire la pièce ici..."></textarea>
              </div>

              <div class="step-actions">
                <button type="submit" class="btn btn-primary">
                  Suivant
                  <ArrowRightIcon :size="16" />
                </button>
              </div>
            </form>
          </div>

          <!-- Étape 2: Sélection Lots et Pièces -->
          <div v-if="currentStep === 1" class="step-panel">
            <h2>Sélection des Lots et Pièces</h2>

            <!-- Liste des lots sélectionnés -->
            <div v-for="(lotSelection, index) in formData.selectedLots" :key="index" class="lot-selection-card">
              <div class="lot-card-header">
                <h3>Lot {{ index + 1 }}</h3>
                <button type="button" class="btn btn-danger btn-sm" @click="removeLot(index)"
                  v-if="formData.selectedLots.length > 1">
                  <XIcon :size="16" /> Supprimer
                </button>
              </div>

              <!-- Sélection du lot -->
              <div class="form-group">
                <label class="form-label">Numéro de lot *</label>
                <select class="form-select" v-model="lotSelection.lot" @change="handleLotChange(index)" required>
                  <option disabled :value="null">Sélectionner un numéro de lot</option>
                  <option v-for="lot in availableLotsForSelection(index)" :key="lot.id" :value="lot">
                    {{ lot.id }}
                  </option>
                </select>
              </div>

              <!-- Affichage du nombre de pièces imprimées -->
              <div v-if="lotSelection.lot" class="form-group">
                <label class="form-label">Nombre de pièces imprimées</label>
                <input type="number" class="form-control" :value="lotSelection.lot.nb_pieces" readonly />
              </div>

              <!-- Sélection des pièces générées automatiquement -->
              <div v-if="lotSelection.availablePieces.length > 0" class="selection-section">
                <h4>Pièces Disponibles ({{ lotSelection.availablePieces.length }} pièces)</h4>
                <div class="checkbox-grid">
                  <label v-for="piece in lotSelection.availablePieces" :key="piece" class="checkbox-item">
                    <input type="checkbox" :value="piece" v-model="lotSelection.selectedPieces" />
                    <span>{{ piece }}</span>
                  </label>
                </div>
                <div class="selected-count" v-if="lotSelection.selectedPieces.length > 0">
                  {{ lotSelection.selectedPieces.length }} pièce(s) sélectionnée(s)
                </div>
              </div>
            </div>

            <!-- Bouton pour ajouter un nouveau lot -->
            <div class="add-lot-section">
              <button type="button" class="btn btn-outline-primary" @click="addNewLot" :disabled="!canAddNewLot">
                <PlusIcon :size="16" /> Ajouter un lot
              </button>
              <p class="text-muted" v-if="!canAddNewLot">
                Veuillez sélectionner un lot et des pièces avant d'ajouter un nouveau lot.
              </p>
            </div>

            <div class="step-actions">
              <button type="button" class="btn btn-secondary" @click="prevStep">
                <ArrowLeftIcon :size="16" /> Précédent
              </button>
              <button type="button" class="btn btn-primary" @click="nextStep" :disabled="!isStep2Valid()">
                Suivant
                <ArrowRightIcon :size="16" />
              </button>
            </div>
          </div>

          <!-- Étape 3: Opérateur & Date -->
          <div v-if="currentStep === 2" class="step-panel">
            <h2>Informations Complémentaires</h2>
            <form @submit.prevent="nextStep">
              <div class="form-group">
                <label class="form-label">Opérateur</label>
                <input type="text" class="form-control" v-model="formData.operateur" readonly />
              </div>

              <div class="form-group">
                <label class="form-label">Date *</label>
                <input type="date" class="form-control" v-model="formData.date" required />
              </div>

              <div class="form-group">
                <label class="form-label">Commentaire</label>
                <textarea class="form-control" v-model="formData.commentaire" rows="3"
                  placeholder="Commentaire facultatif..."></textarea>
              </div>

              <div class="step-actions">
                <button type="button" class="btn btn-secondary" @click="prevStep">
                  <ArrowLeftIcon :size="16" /> Précédent
                </button>
                <button type="submit" class="btn btn-primary">
                  Suivant
                  <ArrowRightIcon :size="16" />
                </button>
              </div>
            </form>
          </div>

          <!-- Étape 4: Récapitulatif -->
          <div v-if="currentStep === 3" class="step-panel">
            <h2>Récapitulatif</h2>

            <div class="summary-section">
              <h3>Informations de la Pièce</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <strong>Dénomination:</strong> {{ formData.piece.denomination }}
                </div>
                <div class="summary-item">
                  <strong>Produit:</strong> {{ formData.piece.produit }}
                </div>
                <div class="summary-item">
                  <strong>Description:</strong> {{ formData.piece.description }}
                </div>

              </div>
            </div>

            <div class="summary-section">
              <h3>Lots et Pièces Sélectionnés</h3>
              <div v-for="(lotSelection, index) in formData.selectedLots" :key="index" class="lot-summary">
                <h4>Lot {{ index + 1 }}: {{ lotSelection.lot?.id }}</h4>
                <div class="summary-grid">
                  <div class="summary-item">
                    <strong>Type de pièce:</strong> {{ lotSelection.lot?.type_pieces }}
                  </div>
                  <div class="summary-item">
                    <strong>Nombre total de pièces:</strong> {{ lotSelection.lot?.nb_pieces }}
                  </div>
                  <div class="summary-item">
                    <strong>Pièces sélectionnées ({{ lotSelection.selectedPieces.length }}):</strong>
                    <div class="badge-list">
                      <span v-for="piece in lotSelection.selectedPieces" :key="piece" class="badge">
                        {{ piece }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="summary-section">
              <h3>Informations Complémentaires</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <strong>Opérateur:</strong> {{ formData.operateur }}
                </div>
                <div class="summary-item">
                  <strong>Date:</strong> {{ formatDate(formData.date) }}
                </div>
                <div class="summary-item" v-if="formData.commentaire">
                  <strong>Commentaire:</strong> {{ formData.commentaire }}
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button type="button" class="btn btn-secondary" @click="prevStep">
                <ArrowLeftIcon :size="16" /> Précédent
              </button>
              <button type="button" class="btn btn-success" @click="submitForm">
                <CheckIcon :size="16" /> Valider
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
        <div style="background: white;
              border-radius: 12px;
              padding: 2rem;
              max-width: 400px;
              width: 90%;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);" @click.stop>
          <div class="modal-header">
            <CheckIcon :size="24" color="#22c55e" />
            <h3>Succès</h3>
          </div>
          <div class="modal-body">
            <p>Le formulaire a été soumis avec succès !</p>
          </div>
          <div class="modal-actions">
            <button class="btn btn-primary" @click="resetForm">
              Nouveau Formulaire
            </button>
            <button class="btn btn-secondary" @click="closeSuccessModal">
              Fermer
            </button>
          </div>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Chargement des données...</p>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/layouts/layout.vue'
import { ref, reactive, onMounted, computed } from 'vue'
import { CheckIcon, ArrowRightIcon, ArrowLeftIcon, PlusIcon, XIcon } from 'lucide-vue-next'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

interface PieceData {
  denomination: string
  produit: string
  description: string

}

interface LotData {
  id: string
  nb_pieces: number
  type_pieces: string
}

interface LotSelection {
  lot: LotData | null
  availablePieces: string[]
  selectedPieces: string[]
}

interface FormData {
  piece: PieceData
  selectedLots: LotSelection[]
  operateur: string
  date: string
  commentaire: string
}

const currentStep = ref(0)
const showSuccessModal = ref(false)
const loading = ref(false)
const lots = ref<LotData[]>([])
// Utilisation du store
const authStore = useAuthStore()

const steps = [
  { title: 'Informations Pièce' },
  { title: 'Lots & Pièces' },
  { title: 'Opérateur & Date' },
  { title: 'Récapitulatif' }
]

const formData = reactive<FormData>({
  piece: {
    denomination: '',
    produit: '',
    description: '',

  },
  selectedLots: [
    {
      lot: null,
      availablePieces: [],
      selectedPieces: []
    }
  ],
  operateur: authStore.user ? `${authStore.user.prenom.charAt(0).toUpperCase()}${authStore.user.nom.slice(0, 2).toUpperCase()}` : '',
  date: '',
  commentaire: ''
})

const denominationOptions = ref<{ name: string }[]>([])

async function fetchDenominations() {
  try {
    const response = await axios.get('http://localhost:3000/api/denominations')
    if (Array.isArray(response.data)) {
      denominationOptions.value = response.data
    } else {
      console.warn('Format inattendu des données de dénominations:', response.data)
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des dénominations:', error)
  }
}



const produitOptions = [
  'Corps CN',
  'Corps SK',
  'Nozzle N100',
  'Nozzle N25',
  'Puce CN',
  'Puce SK',
  'Tube Holder SK'
]

// Génération automatique des pièces basée sur le lot sélectionné
const generatePiecesForLot = (lot: LotData): string[] => {
  const pieces = []
  for (let i = 1; i <= lot.nb_pieces; i++) {
    const pieceId = `${lot.type_pieces}-${String(lot.id).padStart(4, '0')}-${String(i).padStart(2, '0')}`
    pieces.push(pieceId)
  }
  return pieces
}

// Lots disponibles pour une sélection donnée (exclut les lots déjà sélectionnés)
const availableLotsForSelection = (currentIndex: number) => {
  const selectedLotIds = formData.selectedLots
    .map((selection, index) => index !== currentIndex ? selection.lot?.id : null)
    .filter(id => id !== null)

  return lots.value.filter(lot => !selectedLotIds.includes(lot.id))
}

// Vérifier si on peut ajouter un nouveau lot
const canAddNewLot = computed(() => {
  const lastLot = formData.selectedLots[formData.selectedLots.length - 1]
  return lastLot.lot !== null && lastLot.selectedPieces.length > 0
})

// Fonctions API
async function fetchLots() {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:3000/api/fin-impression/lots')
    lots.value = response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des lots:', error)
    // Fallback avec des données de test si l'API n'est pas disponible
    lots.value = [
      { id: '2024001', nb_pieces: 25, type_pieces: 'CN' },
      { id: '2024002', nb_pieces: 30, type_pieces: 'SK' },
      { id: '2024003', nb_pieces: 20, type_pieces: 'N100' },
      { id: '2024004', nb_pieces: 15, type_pieces: 'N25' },
      { id: '2024005', nb_pieces: 35, type_pieces: 'CN' }
    ]
  } finally {
    loading.value = false
  }
}

async function handleLotChange(index: number) {
  const lotSelection = formData.selectedLots[index]
  if (!lotSelection.lot) return

  loading.value = true
  try {
    const response = await axios.get(`http://localhost:3000/api/fin-impression/lot/${lotSelection.lot.id}`)
    if (response.data && typeof response.data.nb_pieces !== 'undefined') {

      lotSelection.lot.nb_pieces = response.data.nb_pieces;
      lotSelection.lot.type_pieces = response.data.type_pieces;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du lot sélectionné:', error)
    // Les données du lot sélectionné sont déjà disponibles depuis la liste
  } finally {
    loading.value = false
  }

  // Générer les pièces automatiquement
  lotSelection.availablePieces = generatePiecesForLot(lotSelection.lot)
  // Réinitialiser les pièces sélectionnées quand on change de lot
  lotSelection.selectedPieces = []
}

// Ajouter un nouveau lot
function addNewLot() {
  if (canAddNewLot.value) {
    formData.selectedLots.push({
      lot: null,
      availablePieces: [],
      selectedPieces: []
    })
  }
}

// Supprimer un lot
function removeLot(index: number) {
  if (formData.selectedLots.length > 1) {
    formData.selectedLots.splice(index, 1)
  }
}

onMounted(() => {
  // Set today's date as default
  const today = new Date().toISOString().split('T')[0]
  formData.date = today

  // Fetch lots from API
  fetchLots()
  fetchDenominations()
})

const canNavigateToStep = (stepIndex: number): boolean => {
  if (stepIndex === 0) return true
  if (stepIndex === 1) return isStep1Valid()
  if (stepIndex === 2) return isStep1Valid() && isStep2Valid()
  if (stepIndex === 3) return isStep1Valid() && isStep2Valid() && isStep3Valid()
  return false
}

const navigateToStep = (stepIndex: number) => {
  if (canNavigateToStep(stepIndex)) {
    currentStep.value = stepIndex
  }
}

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const isStep1Valid = (): boolean => {
  return !!(
    formData.piece.denomination &&
    formData.piece.produit &&
    formData.piece.description
  )
}

const isStep2Valid = (): boolean => {
  return formData.selectedLots.every(lotSelection =>
    lotSelection.lot !== null && lotSelection.selectedPieces.length > 0
  )
}

const isStep3Valid = (): boolean => {
  return !!(formData.operateur && formData.date)
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}

const submitForm = async () => {
  const payload = {
    piece_info: formData.piece,
    lots_selections: formData.selectedLots.map(selection => ({
      id_lot: selection.lot?.id,
      type_pieces: selection.lot?.type_pieces,
      pieces_selectionnees: selection.selectedPieces
    })),
    operateur: formData.operateur,
    date: formData.date,
    commentaire: formData.commentaire
  }
  console.log(payload)

  loading.value = true
  try {
    const response = await axios.post('http://localhost:3000/api/nc/adds', payload)
    console.log('Formulaire soumis:', response.data)
    showSuccessModal.value = true
    console.log(showSuccessModal.value)
  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
    alert('❌ Erreur lors de l\'enregistrement.')
  } finally {
    loading.value = false
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false;
}

const resetForm = () => {
  // Reset form data
  Object.assign(formData.piece, {
    denomination: '',
    produit: '',
    description: ''
  })
  formData.selectedLots = [
    {
      lot: null,
      availablePieces: [],
      selectedPieces: []
    }
  ]
  formData.date = new Date().toISOString().split('T')[0]
  formData.commentaire = ''

  currentStep.value = 0
  showSuccessModal.value = false
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.app-title {
  text-align: center;
  color: #1f2937;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: bold;
}

/* Stepper Styles */
.stepper-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  position: relative;
}

.stepper-header::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e5e7eb;
  z-index: 1;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  z-index: 2;
}

.step-item.clickable {
  cursor: pointer;
}

.step-item.clickable:hover .step-number {
  transform: scale(1.1);
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.step-item.active .step-number {
  background: #3b82f6;
  color: white;
}

.step-item.completed .step-number {
  background: #22c55e;
  color: white;
}

.step-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
}

.step-item.active .step-title {
  color: #3b82f6;
  font-weight: 600;
}

.step-item.completed .step-title {
  color: #22c55e;
  font-weight: 600;
}

/* Form Styles */
.step-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.step-panel h2 {
  color: #1f2937;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-control,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-control::placeholder {
  color: #9ca3af;
}

/* Lot Selection Styles */
.lot-selection-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.lot-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.lot-card-header h3 {
  margin: 0;
  color: #374151;
  font-size: 1.25rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Selection Styles */
.selection-section {
  margin-bottom: 1.5rem;
}

.selection-section h4 {
  color: #374151;
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
}

.checkbox-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.checkbox-item:hover {
  background: #f3f4f6;
  border-color: #3b82f6;
}

.checkbox-item input[type="checkbox"] {
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
}

.selected-count {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #dbeafe;
  border-radius: 6px;
  color: #1e40af;
  font-weight: 500;
  text-align: center;
}

/* Add Lot Section */
.add-lot-section {
  text-align: center;
  padding: 2rem;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.text-muted {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* Summary Styles */
.summary-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.summary-section h3 {
  color: #374151;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.lot-summary {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.lot-summary h4 {
  color: #374151;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 600;
}

.summary-grid {
  display: grid;
  gap: 1rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-item strong {
  color: #374151;
  font-weight: 600;
}

.badge-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.badge {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Button Styles */
.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-outline-primary {
  background: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.btn-outline-primary:hover:not(:disabled) {
  background: #3b82f6;
  color: white;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn-success {
  background: #22c55e;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #16a34a;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
}

.modal-body {
  margin-bottom: 1.5rem;
  color: #6b7280;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Loading Styles */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .stepper-header {
    flex-direction: column;
    gap: 1rem;
  }

  .stepper-header::before {
    display: none;
  }

  .step-item {
    flex-direction: row;
    justify-content: flex-start;
    gap: 1rem;
  }

  .step-number {
    margin-bottom: 0;
  }

  .checkbox-grid {
    grid-template-columns: 1fr;
  }

  .step-actions {
    flex-direction: column-reverse;
    gap: 1rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .lot-card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
<template>
  <layout>
    <div class="container py-5">
      <div class="card shadow-sm">
        <div class="card-body">
          <h2 class="card-title h4 mb-4 text-success">
            <i class="bi bi-list-ul me-2"></i>Dashboard Admin – Dénominations
          </h2>

          <!-- ✅ Messages d’alerte -->
          <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
            {{ errorMessage }}
          </div>

          <!-- Formulaire d'ajout -->
          <form @submit.prevent="addDenomination" class="mb-4 row g-2 align-items-center">
            <div class="col-sm-9">
              <input
                v-model="newDenomination"
                type="text"
                placeholder="Nouvelle dénomination"
                class="form-control"
                required
              />
            </div>
            <div class="col-sm-3 d-grid">
              <button type="submit" class="btn btn-success">
                <i class="bi bi-plus-circle me-1"></i> Ajouter
              </button>
            </div>
          </form>

          <!-- Liste des dénominations -->
          <div v-if="denominations.length > 0">
            <h5 class="text-muted mb-3">Dénominations disponibles :</h5>
            <ul class="list-group">
              <li
                v-for="(item, index) in denominations"
                :key="index"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
          <div v-else class="alert alert-warning mt-3">Aucune dénomination trouvée.</div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Layout from "@/components/layouts/layout.vue";

interface Denomination {
  name: string
}

const denominations = ref<Denomination[]>([])
const newDenomination = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const fetchDenominations = async () => {
  try {
    const res = await axios.get<Denomination[]>('http://localhost:3000/api/denominations')
    denominations.value = res.data
  } catch (error) {
    console.error('Erreur lors du chargement des dénominations :', error)
  }
}

const showMessage = (type: 'success' | 'error', message: string) => {
  if (type === 'success') {
    successMessage.value = message
    errorMessage.value = ''
  } else {
    errorMessage.value = message
    successMessage.value = ''
  }

  setTimeout(() => {
    successMessage.value = ''
    errorMessage.value = ''
  }, 3000) // cache le message après 3 secondes
}

const addDenomination = async () => {
  const trimmed = newDenomination.value.trim()
  if (!trimmed) return

  try {
    await axios.post('http://localhost:3000/api/denominations', { name: trimmed })
    newDenomination.value = ''
    await fetchDenominations()
    showMessage('success', 'Dénomination ajoutée avec succès.')
  } catch (error) {
    console.error('Erreur lors de l’ajout :', error)
    showMessage('error', 'Erreur lors de l’ajout de la dénomination.')
  }
}

onMounted(fetchDenominations)
</script>
<style scoped>
.card {
  max-width: 720px;
  margin: 0 auto;
}
</style>
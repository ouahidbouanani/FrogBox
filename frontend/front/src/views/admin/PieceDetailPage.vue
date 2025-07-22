<template>
  <Layout>

    <div class="container bg-white p-4 rounded shadow  mt-4">
      <div class="d-flex justify-content-start mt-0 mb-1">
        <button class="btn btn-outline-success" @click="goBack">
          ← Retour
        </button>
      </div>
      <!-- Titre et bouton Ajouter -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="mb-0">Liste des pièces</h3>
        <button class="btn btn-primary" @click="router.push('/add-piece')">Ajouter une pièce</button>

      </div>

      <!-- Barre de recherche -->
      <div class="mb-3 d-flex justify-content-end">
        <input type="text" class="form-control w-25" v-model="search" placeholder="Rechercher une pièce..." />
      </div>

      <!-- Tableau -->
      <table class="table table-bordered text-center">
        <thead>
          <tr>
            <th @click="sortBy('nom')" style="cursor: pointer">
              Nom Pièce
              <span v-if="sortKey === 'nom'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th>Version</th>
            <th @click="sortBy('nb_cotes')" style="cursor: pointer">
              Nb Côtés
              <span v-if="sortKey === 'nb_cotes'">{{ sortAsc ? '▲' : '▼' }}</span>
            </th>
            <th>Nom Côte</th>
            <th>Tol. Min</th>
            <th>Tol. Max</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="piece in sortedFilteredPieces" :key="piece.id">
            <tr v-for="(cote, i) in piece.cotes" :key="i">
              <template v-if="i === 0">
                <td :rowspan="piece.cotes.length" class="align-middle">{{ piece.nom }}</td>
                <td :rowspan="piece.cotes.length" class="align-middle">{{ piece.version }}</td> 
                <td :rowspan="piece.cotes.length" class="align-middle">{{ piece.nb_cotes }}</td>
              </template>
              <td>{{ cote.nom_cote }}</td>
              <td>{{ cote.tolerance_min }}</td>
              <td>{{ cote.tolerance_max }}</td>
              <template v-if="i === 0">
                <td :rowspan="piece.cotes.length" class="align-middle">
                  <div class="d-flex justify-content-center gap-2 flex-wrap">
                    <button class="btn btn-warning btn-sm" @click="modifier(piece.id)">Modifier</button>
                    <button class="btn btn-danger btn-sm" @click="supprimer(piece.id)">Supprimer</button>
                  </div>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Layout from "@/components/layouts/layout.vue";

const pieces = ref([])
const search = ref('')
const sortKey = ref('')
const sortAsc = ref(true)
const router = useRouter()

onMounted(async () => {
  const res = await axios.get('http://localhost:3000/api/pieces')
  pieces.value = res.data
})

const modifier = (id) => router.push(`/modifier-piece/${id}`)
const supprimer = async (id) => {
  if (confirm('Confirmer la suppression ?')) {
    await axios.delete(`http://localhost:3000/api/pieces/${id}`)
    pieces.value = pieces.value.filter(p => p.id !== id)
  }
}

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

const sortedFilteredPieces = computed(() => {
  const searchTerm = search.value.toLowerCase()

  let filtered = pieces.value.filter(piece => {
    const nomMatch = piece.nom.toLowerCase().includes(searchTerm)
    const nbCotesMatch = piece.nb_cotes.toString().includes(searchTerm)

    const coteMatch = piece.cotes.some(cote => {
      return (
        cote.nom_cote.toLowerCase().includes(searchTerm) ||
        cote.tolerance_min.toString().includes(searchTerm) ||
        cote.tolerance_max.toString().includes(searchTerm)
      )
    })

    return nomMatch || nbCotesMatch || coteMatch
  })

  if (sortKey.value) {
    filtered = [...filtered].sort((a, b) => {
      const valA = a[sortKey.value]
      const valB = b[sortKey.value]
      return sortAsc.value
        ? valA > valB ? 1 : -1
        : valA < valB ? 1 : -1
    })
  }

  return filtered
})

function goBack(){
  router.back()
}
</script>
<style scoped>
tbody tr:nth-child(odd) {
  background-color: #ffffff;
  
}

tbody tr:nth-child(even) {
  background-color: #f0f1f3;
  
}
</style>
